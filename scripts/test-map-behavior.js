'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const MAP_SCRIPT = fs.readFileSync(path.join(ROOT, 'map-script.js'), 'utf8');

function createButton() {
  const attributes = new Map();
  return {
    className: '',
    dataset: {},
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    getAttribute(name) {
      return attributes.get(name);
    }
  };
}

function loadMapScript({ imageError = null, mapboxAvailable = true, reducedMotion = false } = {}) {
  const warning = { hidden: true, textContent: '' };
  const menu = { hidden: true, children: [], appendChild(child) { this.children.push(child); } };
  const intervals = [];
  const maps = [];

  class MapStub {
    constructor(options) {
      this.options = options;
      this.layers = new Map();
      this.layout = new Map();
      this.paintChanges = [];
      maps.push(this);
    }

    addControl() {}
    addImage() {}
    addLayer(layer) {
      this.layers.set(layer.id, layer);
      this.layout.set(layer.id, layer.layout?.visibility || 'visible');
    }
    getLayer(id) { return this.layers.get(id); }
    getLayoutProperty(id) { return this.layout.get(id) || 'visible'; }
    loadImage(_url, callback) { callback(imageError, {}); }
    on(event, callback) { if (event === 'load') callback(); }
    setLayoutProperty(id, _property, value) { this.layout.set(id, value); }
    setPaintProperty(id, property, value) { this.paintChanges.push({ id, property, value }); }
  }

  const sandbox = {
    console,
    document: {
      createElement: createButton,
      getElementById(id) {
        if (id === 'map-token-warning') return warning;
        if (id === 'menu') return menu;
        return null;
      }
    },
    setInterval(callback, delay) {
      intervals.push({ callback, delay });
      return intervals.length;
    },
    window: {
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: reducedMotion };
      }
    }
  };

  if (mapboxAvailable) {
    sandbox.mapboxgl = { Map: MapStub, NavigationControl: class NavigationControl {} };
  }

  vm.runInNewContext(MAP_SCRIPT, sandbox, { filename: 'map-script.js' });
  return { intervals, maps, menu, sandbox, warning };
}

function click(button) {
  button.onclick.call(button, { preventDefault() {}, stopPropagation() {} });
}

function main() {
  const missingLibrary = loadMapScript({ mapboxAvailable: false });
  assert.equal(missingLibrary.warning.hidden, false);
  assert.match(missingLibrary.warning.textContent, /Mapbox GL JS did not load/);

  const missingToken = loadMapScript();
  assert.equal(missingToken.maps.length, 0);
  assert.equal(missingToken.warning.hidden, false);
  assert.match(missingToken.warning.textContent, /Add a local Mapbox access token/);

  missingToken.sandbox.setupLayerToggles({
    getLayer() { return true; },
    getLayoutProperty() { return 'visible'; },
    setLayoutProperty(_id, _property, value) { this.visibility = value; }
  });
  assert.equal(missingToken.menu.hidden, false);
  assert.equal(missingToken.menu.children.length, 3);
  assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'true');

  const initiallyHiddenMap = {
    visibility: 'none',
    getLayer() { return true; },
    getLayoutProperty() { return this.visibility; },
    setLayoutProperty(_id, _property, value) { this.visibility = value; }
  };
  missingToken.menu.children.length = 0;
  missingToken.sandbox.setupLayerToggles(initiallyHiddenMap);
  assert.equal(missingToken.menu.children[0].disabled, false);
  assert.equal(missingToken.menu.children[0].className, '');
  assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'false');
  click(missingToken.menu.children[0]);
  assert.equal(initiallyHiddenMap.visibility, 'visible');
  assert.equal(missingToken.menu.children[0].className, 'active');
  assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'true');

  const toggleMap = {
    visibility: 'visible',
    getLayer() { return true; },
    getLayoutProperty() { return this.visibility; },
    setLayoutProperty(_id, _property, value) { this.visibility = value; }
  };
  missingToken.menu.children.length = 0;
  missingToken.sandbox.setupLayerToggles(toggleMap);
  click(missingToken.menu.children[0]);
  assert.equal(toggleMap.visibility, 'none');
  assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'false');
  click(missingToken.menu.children[0]);
  assert.equal(toggleMap.visibility, 'visible');
  assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'true');

  const reduced = loadMapScript({ reducedMotion: true });
  reduced.sandbox.mapboxAccessToken = 'test-token';
  reduced.sandbox.initializeMap();
  assert.equal(reduced.maps.length, 1);
  assert.equal(reduced.intervals.length, 0);

  const animated = loadMapScript({ reducedMotion: false });
  animated.sandbox.mapboxAccessToken = 'test-token';
  animated.sandbox.initializeMap();
  assert.equal(animated.maps.length, 1);
  assert.equal(animated.intervals.length, 1);
  assert.equal(animated.intervals[0].delay, 30);

  const missingImage = loadMapScript({ imageError: new Error('/private/map-assets/power-stations.png') });
  missingImage.sandbox.mapboxAccessToken = 'test-token';
  assert.doesNotThrow(() => missingImage.sandbox.initializeMap());
  assert.equal(missingImage.warning.hidden, false);
  assert.match(missingImage.warning.textContent, /map marker image could not be loaded/);
  assert.doesNotMatch(missingImage.warning.textContent, /\/private\/map-assets/);
  assert.equal(missingImage.menu.children[0].disabled, false);
  assert.equal(missingImage.menu.children[0].getAttribute('aria-pressed'), 'true');
  assert.equal(missingImage.menu.children[1].disabled, true);
  assert.equal(missingImage.menu.children[1].getAttribute('aria-pressed'), 'false');
  assert.equal(missingImage.menu.children[2].disabled, true);
  assert.equal(missingImage.menu.children[2].getAttribute('aria-pressed'), 'false');

  console.log('Map behavior tests passed.');
}

main();
