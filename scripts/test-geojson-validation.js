'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKER = path.join('scripts', 'check-map-assets.js');
const DATASET = path.join('geojson', 'power_lines.geojson');
const TEMP_ROOT = fs.mkdtempSync(path.join(path.dirname(ROOT), 'power-line-geojson-tests-'));

function cleanup() {
  fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
}

process.on('exit', cleanup);

function hardLinkTree(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') {
      continue;
    }
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      hardLinkTree(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.linkSync(sourcePath, destinationPath);
    }
  }
}

function runChecker(root) {
  return spawnSync(process.execPath, [path.join(root, CHECKER)], {
    cwd: os.tmpdir(),
    encoding: 'utf8'
  });
}

function writeFixture(root, value) {
  const datasetPath = path.join(root, DATASET);
  fs.unlinkSync(datasetPath);
  const content = typeof value === 'string' ? value : JSON.stringify(value);
  fs.writeFileSync(datasetPath, `${content}\n`);
}

function assertAccepted(label, value) {
  const caseRoot = path.join(TEMP_ROOT, label);
  hardLinkTree(ROOT, caseRoot);
  writeFixture(caseRoot, value);
  const result = runChecker(caseRoot);
  assert.equal(result.status, 0, `${label} should pass:\n${result.stderr}`);
}

function assertRejected(label, value, expected) {
  const caseRoot = path.join(TEMP_ROOT, label);
  hardLinkTree(ROOT, caseRoot);
  writeFixture(caseRoot, value);
  const result = runChecker(caseRoot);
  assert.notEqual(result.status, 0, `${label} should fail`);
  assert.match(result.stderr, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

const baseline = runChecker(ROOT);
assert.equal(baseline.status, 0, `clean baseline should pass:\n${baseline.stderr}`);

assertAccepted('valid-geometries', {
  type: 'FeatureCollection',
  metadata: { foreignMember: true },
  features: [
    { type: 'Feature', id: 'point', properties: {}, geometry: { type: 'Point', coordinates: [-122, 38] } },
    { type: 'Feature', id: 2, properties: null, geometry: { type: 'MultiPoint', coordinates: [[-122, 38], [-121, 39, 10]] } },
    { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[-122, 38], [-121, 39]] } },
    { type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: [[[-122, 38], [-121, 39]]] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-122, 38], [-121, 38], [-121, 39], [-122, 38]]] } },
    { type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: [[[[-122, 38], [-121, 38], [-121, 39], [-122, 38]]]] } },
    { type: 'Feature', properties: {}, geometry: { type: 'GeometryCollection', geometries: [{ type: 'Point', coordinates: [-122, 38] }] } },
    { type: 'Feature', properties: {}, geometry: null, note: 'foreign member' }
  ]
});

assertRejected('wrong-root', { type: 'Feature', properties: {}, geometry: null }, 'must be a GeoJSON FeatureCollection');
assertRejected('missing-features', { type: 'FeatureCollection' }, '.features must be an array');
assertRejected('invalid-feature', { type: 'FeatureCollection', features: [null] }, '.features[0] must be a GeoJSON Feature object');
assertRejected('invalid-id', { type: 'FeatureCollection', features: [{ type: 'Feature', id: true, properties: {}, geometry: null }] }, '.features[0].id must be a string or number');
assertRejected('non-finite-id', '{"type":"FeatureCollection","features":[{"type":"Feature","id":1e400,"properties":{},"geometry":null}]}', '.features[0].id must be a string or number');
assertRejected('invalid-properties', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: [], geometry: null }] }, '.features[0].properties must be an object or null');
assertRejected('missing-geometry', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {} }] }, '.features[0].geometry must be a GeoJSON geometry object or null');
assertRejected('unsupported-geometry', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Circle', coordinates: [-122, 38] } }] }, '.geometry.type is unsupported: Circle');
assertRejected('missing-geometries', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'GeometryCollection' } }] }, '.geometry.geometries must be an array of geometry objects');
assertRejected('short-position', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122] } }] }, '.geometry.coordinates must be a position with at least two numbers');
assertRejected('non-finite-position', '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[1e400,38]}}]}', '.geometry.coordinates[0] must be a finite number');
assertRejected('short-line', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[-122, 38]] } }] }, '.geometry.coordinates must contain at least 2 positions');
assertRejected('short-ring', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-122, 38], [-121, 38], [-122, 38]]] } }] }, '.geometry.coordinates[0] must contain at least 4 positions');
assertRejected('open-ring', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-122, 38], [-121, 38], [-121, 39], [-122, 39]]] } }] }, '.geometry.coordinates[0] must be closed');
assertRejected('nested-collection', { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'GeometryCollection', geometries: [{ type: 'GeometryCollection', geometries: [{ type: 'Point', coordinates: ['west', 38] }] }] } }] }, '.geometry.geometries[0].geometries[0].coordinates[0] must be a finite number');

cleanup();
console.log('Hydrated GeoJSON validation tests passed.');
