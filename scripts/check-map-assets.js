'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const errors = [];

function fail(message) {
  errors.push(message);
}

function exists(relativePath, context) {
  if (!fs.existsSync(relativePath)) {
    fail(`${context} references missing file: ${relativePath}`);
  }
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('map-script.js', 'utf8');

for (const match of indexHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=['"]([^'"]+)['"]/g)) {
  const reference = match[1];
  if (!reference.startsWith('http://') && !reference.startsWith('https://')) {
    exists(reference, 'index.html');
  }
}

if (/mapboxgl\.accessToken\s*=\s*['"][^'"]+['"]/.test(script)) {
  fail('map-script.js must not commit a non-empty Mapbox access token');
}

for (const match of script.matchAll(/['"]((?:geojson|images)\/[^'"]+)['"]/g)) {
  exists(match[1], 'map-script.js');
}

for (const file of fs.readdirSync('geojson').filter(name => name.endsWith('.geojson')).sort()) {
  const relativePath = path.join('geojson', file);
  const content = fs.readFileSync(relativePath, 'utf8');

  if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
    if (!/^oid sha256:[a-f0-9]{64}$/m.test(content) || !/^size \d+$/m.test(content)) {
      fail(`${relativePath} is not a valid Git LFS pointer`);
    }
    continue;
  }

  try {
    const parsed = JSON.parse(content);
    assert.equal(parsed.type, 'FeatureCollection');
    assert.ok(Array.isArray(parsed.features), 'features must be an array');
  } catch (error) {
    fail(`${relativePath} is not a valid GeoJSON FeatureCollection: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Map asset check passed.');
