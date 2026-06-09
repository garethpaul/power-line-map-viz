'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

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
const planPath = 'docs/plans/2026-06-08-map-token-and-assets-baseline.md';
const datasetPlanPath = 'docs/plans/2026-06-08-dataset-inventory-baseline.md';
const layerInventoryPlanPath = 'docs/plans/2026-06-08-layer-inventory-validation.md';
const imageInventoryPlanPath = 'docs/plans/2026-06-09-image-asset-inventory.md';
const datasetInventoryPath = 'DATASETS.md';

exists(planPath, 'canonical docs plan');
exists(datasetPlanPath, 'dataset inventory docs plan');
exists(layerInventoryPlanPath, 'layer inventory docs plan');
exists(imageInventoryPlanPath, 'image asset inventory docs plan');
exists(datasetInventoryPath, 'dataset inventory');

for (const completedPlanPath of [planPath, datasetPlanPath, layerInventoryPlanPath, imageInventoryPlanPath]) {
  if (!fs.existsSync(completedPlanPath)) {
    continue;
  }

  const plan = fs.readFileSync(completedPlanPath, 'utf8');
  if (!/Status: Completed/.test(plan) || !plan.includes('make check')) {
    fail(`${completedPlanPath} must record completed status and make check verification`);
  }
}

const datasetInventory = fs.existsSync(datasetInventoryPath)
  ? fs.readFileSync(datasetInventoryPath, 'utf8')
  : '';

const geojsonReferences = new Set(
  Array.from(script.matchAll(/['"](geojson\/[^'"]+\.geojson)['"]/g), match => match[1])
);
const imageReferences = new Set(
  Array.from(script.matchAll(/['"](images\/[^'"]+\.(?:png|jpg|jpeg|svg))['"]/g), match => match[1])
);
const mapLayerIds = new Set(
  Array.from(script.matchAll(/map\.addLayer\(\{[\s\S]*?['"]id['"]\s*:\s*['"]([^'"]+)['"]/g), match => match[1])
);
const toggleLayerIds = new Set(
  Array.from(script.matchAll(/\{\s*['"]id['"]\s*:\s*['"]([^'"]+)['"]\s*,\s*['"]name['"]\s*:/g), match => match[1])
);

function layerIdForGeojson(relativePath) {
  return relativePath.replace(/^geojson\//, '').replace(/\.geojson$/, '');
}

for (const term of ['Source status: unknown', 'refresh date', 'private infrastructure', 'Git LFS']) {
  if (!datasetInventory.includes(term)) {
    fail(`${datasetInventoryPath} must document ${term}`);
  }
}

for (const match of indexHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=['"]([^'"]+)['"]/g)) {
  const reference = match[1];
  if (!reference.startsWith('http://') && !reference.startsWith('https://')) {
    exists(reference, 'index.html');
  }
}

if (/mapboxgl\.accessToken\s*=\s*['"][^'"]+['"]/.test(script)) {
  fail('map-script.js must not commit a non-empty Mapbox access token');
}

if (/mapboxAccessToken\s*=\s*['"][^'"]+['"]/.test(script)) {
  fail('map-script.js must keep mapboxAccessToken empty by default');
}

if (!/id=['"]map-token-warning['"]/.test(indexHtml)) {
  fail('index.html must include the no-token map warning container');
}

if (!/function\s+showMapTokenWarning\b/.test(script)) {
  fail('map-script.js must expose a browser-visible no-token warning');
}

if (!/typeof\s+mapboxgl\s*===\s*['"]undefined['"]/.test(script)) {
  fail('map-script.js must guard against Mapbox GL JS failing to load');
}

for (const match of script.matchAll(/['"]((?:geojson|images)\/[^'"]+)['"]/g)) {
  exists(match[1], 'map-script.js');
}

for (const file of fs.readdirSync('geojson').filter(name => name.endsWith('.geojson')).sort()) {
  const relativePath = `geojson/${file}`;
  const layerId = layerIdForGeojson(relativePath);
  const content = fs.readFileSync(relativePath, 'utf8');

  if (!datasetInventory.includes(`| ${relativePath} |`)) {
    fail(`${datasetInventoryPath} is missing ${relativePath}`);
  }

  if (!datasetInventory.includes(`| ${relativePath} | \`${layerId}\` |`)) {
    fail(`${datasetInventoryPath} must record ${relativePath} with map layer \`${layerId}\``);
  }

  if (!geojsonReferences.has(relativePath)) {
    fail(`map-script.js must reference checked-in layer data ${relativePath}`);
  }

  if (!mapLayerIds.has(layerId)) {
    fail(`map-script.js must add a map layer with id ${layerId} for ${relativePath}`);
  }

  if (!toggleLayerIds.has(layerId)) {
    fail(`map-script.js must expose a layer toggle for ${layerId}`);
  }

  if (content.startsWith('version https://git-lfs.github.com/spec/v1')) {
    const sizeMatch = content.match(/^size (\d+)$/m);
    if (!/^oid sha256:[a-f0-9]{64}$/m.test(content) || !sizeMatch) {
      fail(`${relativePath} is not a valid Git LFS pointer`);
    } else if (!datasetInventory.includes(`${sizeMatch[1]} bytes`)) {
      fail(`${datasetInventoryPath} must record the current LFS size for ${relativePath}`);
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

for (const file of fs.readdirSync('images').sort()) {
  const relativePath = `images/${file}`;
  if (!fs.statSync(relativePath).isFile()) {
    continue;
  }

  if (!datasetInventory.includes(`| ${relativePath} |`)) {
    fail(`${datasetInventoryPath} is missing image asset ${relativePath}`);
  }

  const expectedStatus = imageReferences.has(relativePath)
    ? 'Referenced marker image'
    : 'Checked-in unused image';
  if (!datasetInventory.includes(`| ${relativePath} | ${expectedStatus} |`)) {
    fail(`${datasetInventoryPath} must record ${relativePath} as ${expectedStatus}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Map asset check passed.');
