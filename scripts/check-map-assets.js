'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
process.chdir(ROOT);

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
const styles = fs.readFileSync('styles.css', 'utf8');
const planPath = 'docs/plans/2026-06-08-map-token-and-assets-baseline.md';
const datasetPlanPath = 'docs/plans/2026-06-08-dataset-inventory-baseline.md';
const layerInventoryPlanPath = 'docs/plans/2026-06-08-layer-inventory-validation.md';
const imageInventoryPlanPath = 'docs/plans/2026-06-09-image-asset-inventory.md';
const pageTitlePlanPath = 'docs/plans/2026-06-09-page-title-contract.md';
const remoteAssetPlanPath = 'docs/plans/2026-06-09-remote-asset-allowlist.md';
const tokenWarningAccessibilityPlanPath = 'docs/plans/2026-06-09-map-token-warning-accessibility.md';
const viewportAccessibilityPlanPath = 'docs/plans/2026-06-09-viewport-zoom-accessibility.md';
const htmlLanguagePlanPath = 'docs/plans/2026-06-09-html-language-accessibility.md';
const layerToggleAccessibilityPlanPath = 'docs/plans/2026-06-09-layer-toggle-accessibility.md';
const ciPlanPath = 'docs/plans/2026-06-10-ci-baseline.md';
const mapRegionAccessibilityPlanPath = 'docs/plans/2026-06-10-map-region-accessibility.md';
const hostedValidationPlanPath = 'docs/plans/2026-06-10-hosted-map-validation.md';
const reducedMotionPlanPath = 'docs/plans/2026-06-10-power-line-reduced-motion.md';
const workflowPath = '.github/workflows/check.yml';
const datasetInventoryPath = 'DATASETS.md';
const allowedRemoteAssets = new Set([
  'https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.js',
  'https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.css',
  'https://fonts.googleapis.com/css?family=Roboto&display=swap'
]);

exists(planPath, 'canonical docs plan');
exists(datasetPlanPath, 'dataset inventory docs plan');
exists(layerInventoryPlanPath, 'layer inventory docs plan');
exists(imageInventoryPlanPath, 'image asset inventory docs plan');
exists(pageTitlePlanPath, 'page title docs plan');
exists(remoteAssetPlanPath, 'remote asset allowlist docs plan');
exists(tokenWarningAccessibilityPlanPath, 'map token warning accessibility docs plan');
exists(viewportAccessibilityPlanPath, 'viewport accessibility docs plan');
exists(htmlLanguagePlanPath, 'HTML language accessibility docs plan');
exists(layerToggleAccessibilityPlanPath, 'layer toggle accessibility docs plan');
exists(ciPlanPath, 'CI baseline docs plan');
exists(mapRegionAccessibilityPlanPath, 'map region accessibility docs plan');
exists(hostedValidationPlanPath, 'hosted map validation docs plan');
exists(reducedMotionPlanPath, 'power-line reduced-motion docs plan');
exists(workflowPath, 'hosted map validation workflow');
exists(datasetInventoryPath, 'dataset inventory');

for (const completedPlanPath of [planPath, datasetPlanPath, layerInventoryPlanPath, imageInventoryPlanPath, pageTitlePlanPath, remoteAssetPlanPath, tokenWarningAccessibilityPlanPath, viewportAccessibilityPlanPath, htmlLanguagePlanPath, layerToggleAccessibilityPlanPath, ciPlanPath, mapRegionAccessibilityPlanPath, hostedValidationPlanPath, reducedMotionPlanPath]) {
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

if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8').replace(/\r\n/g, '\n');
  for (const phrase of [
    'permissions:\n  contents: read',
    'cancel-in-progress: true',
    'runs-on: ubuntu-24.04',
    'timeout-minutes: 10',
    'node: [22.x, 24.x]',
    'actions/checkout@9f698171ed81b15d1823a05fc7211befd50c8ae0',
    'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e',
    'persist-credentials: false',
    'run: make check'
  ]) {
    if (!workflow.includes(phrase)) {
      fail(`${workflowPath} must keep ${phrase}`);
    }
  }
  const expectedActions = [
    'actions/checkout@9f698171ed81b15d1823a05fc7211befd50c8ae0',
    'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'
  ];
  const actions = [...workflow.matchAll(/^\s*(?:-\s*)?uses:\s*(\S+)/gm)].map(match => match[1]);
  if (JSON.stringify(actions) !== JSON.stringify(expectedActions)) {
    fail(`${workflowPath} must use only the approved pinned checkout and setup-node actions`);
  }
  if ((workflow.match(/^permissions:/gm) || []).length !== 1 || /^\s+[\w-]+:\s*write\s*$/m.test(workflow)) {
    fail(`${workflowPath} must keep one read-only permissions block`);
  }
  if ((workflow.match(/persist-credentials: false/g) || []).length !== 1) {
    fail(`${workflowPath} must disable persisted checkout credentials exactly once`);
  }
  if (/\bnpm (?:ci|install)\b/.test(workflow)) {
    fail(`${workflowPath} must keep the built-in-only validator dependency-free`);
  }
}

for (const docsBaselineFile of ['README.md', 'VISION.md', 'SECURITY.md', 'CHANGES.md']) {
  const docsBaseline = fs.readFileSync(docsBaselineFile, 'utf8');
  if (!docsBaseline.includes('GitHub Actions')) {
    fail(`${docsBaselineFile} must document the GitHub Actions baseline`);
  }
}

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

const remoteAssets = new Set();
for (const match of indexHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=['"]([^'"]+)['"]/g)) {
  const reference = match[1];
  if (reference.startsWith('http://') || reference.startsWith('https://')) {
    remoteAssets.add(reference);
    if (!allowedRemoteAssets.has(reference)) {
      fail(`index.html references unapproved remote asset: ${reference}`);
    }
  } else {
    exists(reference, 'index.html');
  }
}

for (const expectedRemoteAsset of allowedRemoteAssets) {
  if (!remoteAssets.has(expectedRemoteAsset)) {
    fail(`index.html must keep approved remote asset: ${expectedRemoteAsset}`);
  }
}

if (/mapboxgl\.accessToken\s*=\s*['"][^'"]+['"]/.test(script)) {
  fail('map-script.js must not commit a non-empty Mapbox access token');
}

if (/mapboxAccessToken\s*=\s*['"][^'"]+['"]/.test(script)) {
  fail('map-script.js must keep mapboxAccessToken empty by default');
}

const tokenWarningTag = indexHtml.match(/<[^>]+id=['"]map-token-warning['"][^>]*>/);
if (!tokenWarningTag) {
  fail('index.html must include the no-token map warning container');
} else {
  if (!/\brole=['"]status['"]/.test(tokenWarningTag[0])) {
    fail('index.html map token warning must use role="status"');
  }

  if (!/\baria-live=['"]polite['"]/.test(tokenWarningTag[0])) {
    fail('index.html map token warning must use aria-live="polite"');
  }
}

if (!/<title>Power Line Map<\/title>/.test(indexHtml)) {
  fail('index.html must use the Power Line Map page title');
}

if (!/<html\b[^>]*\blang=['"]en['"]/i.test(indexHtml)) {
  fail('index.html must set html lang="en"');
}

if (!/<nav\b[^>]*\bid=['"]menu['"][^>]*\baria-label=['"]Map layers['"]/i.test(indexHtml)) {
  fail('index.html layer menu nav must expose aria-label="Map layers"');
}

const mapContainerTag = indexHtml.match(/<div\b[^>]*\bid=['"]map['"][^>]*>/i);
if (!mapContainerTag) {
  fail('index.html must include the map container');
} else {
  if (!/\brole=['"]region['"]/.test(mapContainerTag[0])) {
    fail('index.html map container must use role="region"');
  }

  if (!/\baria-label=['"]Power line infrastructure map['"]/.test(mapContainerTag[0])) {
    fail('index.html map container must expose a descriptive aria-label');
  }
}

const viewportTag = indexHtml.match(/<meta\b[^>]+name=['"]viewport['"][^>]*>/i);
if (!viewportTag) {
  fail('index.html must include a viewport meta tag');
} else {
  const viewportContent = viewportTag[0].match(/\bcontent=['"]([^'"]+)['"]/i)?.[1] || '';
  if (!/width\s*=\s*device-width/i.test(viewportContent)) {
    fail('index.html viewport must include width=device-width');
  }

  if (/user-scalable\s*=\s*no/i.test(viewportContent)) {
    fail('index.html viewport must not disable user scaling');
  }

  if (/maximum-scale\s*=\s*1(?:\.0)?/i.test(viewportContent)) {
    fail('index.html viewport must not cap maximum zoom at 1');
  }
}

if (!/function\s+showMapTokenWarning\b/.test(script)) {
  fail('map-script.js must expose a browser-visible no-token warning');
}

if (!/function\s+prefersReducedMotion\b/.test(script) ||
    !/matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/.test(script)) {
  fail('map-script.js must detect the browser reduced-motion preference');
}

if (!/function\s+enableLineAnimation\b[\s\S]*?if\s*\(prefersReducedMotion\(\)\)\s*\{\s*return;\s*\}/.test(script)) {
  fail('power-line animation must stay disabled when reduced motion is requested');
}

if (!/typeof\s+mapboxgl\s*===\s*['"]undefined['"]/.test(script)) {
  fail('map-script.js must guard against Mapbox GL JS failing to load');
}

if (!/document\.createElement\(['"]button['"]\)/.test(script)) {
  fail('map-script.js must create button controls for layer toggles');
}

if (!/link\.setAttribute\(['"]aria-pressed['"],\s*['"]true['"]\)/.test(script)) {
  fail('map-script.js must initialize layer toggles with aria-pressed="true"');
}

if (!/this\.setAttribute\(['"]aria-pressed['"],\s*['"]false['"]\)/.test(script)) {
  fail('map-script.js must mark hidden layer toggles with aria-pressed="false"');
}

if (!/this\.setAttribute\(['"]aria-pressed['"],\s*['"]true['"]\)/.test(script)) {
  fail('map-script.js must mark visible layer toggles with aria-pressed="true"');
}

for (const selector of ['#menu button', '#menu button:last-child', '#menu button:hover', '#menu button.active']) {
  if (!styles.includes(selector)) {
    fail(`styles.css must style layer toggle selector ${selector}`);
  }
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
