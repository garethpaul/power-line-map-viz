'use strict';

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

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validatePosition(value, valuePath, validationErrors) {
  if (!Array.isArray(value) || value.length < 2) {
    validationErrors.push(`${valuePath} must be a position with at least two numbers`);
    return;
  }

  value.forEach((coordinate, index) => {
    if (typeof coordinate !== 'number' || !Number.isFinite(coordinate)) {
      validationErrors.push(`${valuePath}[${index}] must be a finite number`);
    }
  });
}

function validatePositionArray(value, valuePath, validationErrors, minimumLength) {
  if (!Array.isArray(value)) {
    validationErrors.push(`${valuePath} must be an array of positions`);
    return;
  }

  if (minimumLength && value.length < minimumLength) {
    validationErrors.push(`${valuePath} must contain at least ${minimumLength} positions`);
  }

  value.forEach((position, index) => {
    validatePosition(position, `${valuePath}[${index}]`, validationErrors);
  });
}

function positionsMatch(first, last) {
  return Array.isArray(first)
    && Array.isArray(last)
    && first.length === last.length
    && first.every((coordinate, index) => coordinate === last[index]);
}

function validateLinearRing(value, valuePath, validationErrors) {
  validatePositionArray(value, valuePath, validationErrors, 4);
  if (Array.isArray(value) && value.length >= 4 && !positionsMatch(value[0], value[value.length - 1])) {
    validationErrors.push(`${valuePath} must be closed with matching first and last positions`);
  }
}

function validateGeometry(geometry, geometryPath, validationErrors) {
  if (!isObject(geometry)) {
    validationErrors.push(`${geometryPath} must be a GeoJSON geometry object or null`);
    return;
  }

  switch (geometry.type) {
    case 'Point':
      validatePosition(geometry.coordinates, `${geometryPath}.coordinates`, validationErrors);
      break;
    case 'MultiPoint':
      validatePositionArray(geometry.coordinates, `${geometryPath}.coordinates`, validationErrors);
      break;
    case 'LineString':
      validatePositionArray(geometry.coordinates, `${geometryPath}.coordinates`, validationErrors, 2);
      break;
    case 'MultiLineString':
      if (!Array.isArray(geometry.coordinates)) {
        validationErrors.push(`${geometryPath}.coordinates must be an array of LineStrings`);
        break;
      }
      geometry.coordinates.forEach((line, index) => {
        validatePositionArray(line, `${geometryPath}.coordinates[${index}]`, validationErrors, 2);
      });
      break;
    case 'Polygon':
      if (!Array.isArray(geometry.coordinates)) {
        validationErrors.push(`${geometryPath}.coordinates must be an array of linear rings`);
        break;
      }
      geometry.coordinates.forEach((ring, index) => {
        validateLinearRing(ring, `${geometryPath}.coordinates[${index}]`, validationErrors);
      });
      break;
    case 'MultiPolygon':
      if (!Array.isArray(geometry.coordinates)) {
        validationErrors.push(`${geometryPath}.coordinates must be an array of Polygons`);
        break;
      }
      geometry.coordinates.forEach((polygon, polygonIndex) => {
        if (!Array.isArray(polygon)) {
          validationErrors.push(`${geometryPath}.coordinates[${polygonIndex}] must be an array of linear rings`);
          return;
        }
        polygon.forEach((ring, ringIndex) => {
          validateLinearRing(ring, `${geometryPath}.coordinates[${polygonIndex}][${ringIndex}]`, validationErrors);
        });
      });
      break;
    case 'GeometryCollection':
      if (!Array.isArray(geometry.geometries)) {
        validationErrors.push(`${geometryPath}.geometries must be an array of geometry objects`);
        break;
      }
      geometry.geometries.forEach((member, index) => {
        validateGeometry(member, `${geometryPath}.geometries[${index}]`, validationErrors);
      });
      break;
    default:
      validationErrors.push(`${geometryPath}.type is unsupported: ${String(geometry.type)}`);
  }
}

function validateFeatureCollection(value, relativePath) {
  const validationErrors = [];
  if (!isObject(value) || value.type !== 'FeatureCollection') {
    return [`${relativePath} must be a GeoJSON FeatureCollection`];
  }
  if (!Array.isArray(value.features)) {
    return [`${relativePath}.features must be an array`];
  }

  value.features.forEach((feature, index) => {
    const featurePath = `${relativePath}.features[${index}]`;
    if (!isObject(feature) || feature.type !== 'Feature') {
      validationErrors.push(`${featurePath} must be a GeoJSON Feature object`);
      return;
    }
    const validId = typeof feature.id === 'string'
      || (typeof feature.id === 'number' && Number.isFinite(feature.id));
    if (feature.id !== undefined && !validId) {
      validationErrors.push(`${featurePath}.id must be a string or number`);
    }
    if (feature.properties !== null && !isObject(feature.properties)) {
      validationErrors.push(`${featurePath}.properties must be an object or null`);
    }
    if (feature.geometry !== null) {
      validateGeometry(feature.geometry, `${featurePath}.geometry`, validationErrors);
    }
  });

  return validationErrors;
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('map-script.js', 'utf8');
const styles = fs.readFileSync('styles.css', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');
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
const behaviorTestPlanPath = 'docs/plans/2026-06-12-map-behavior-tests.md';
const unavailableLayerPlanPath = 'docs/plans/2026-06-12-unavailable-layer-controls.md';
const hydratedGeojsonPlanPath = 'docs/plans/2026-06-13-hydrated-geojson-validation.md';
const initialLayerVisibilityPlanPath = 'docs/plans/2026-06-13-initial-layer-toggle-visibility.md';
const asyncLayerTogglePlanPath = 'docs/plans/2026-06-13-async-layer-toggle-sync.md';
const locationIndependentMakePlanPath = 'docs/plans/2026-06-14-location-independent-make.md';
const defaultVisibilityTogglePlanPath = 'docs/plans/2026-06-15-default-layer-visibility-toggle.md';
const animationLifecyclePlanPath = 'docs/plans/2026-06-16-power-line-animation-lifecycle.md';
const runtimeReducedMotionPlanPath = 'docs/plans/2026-06-16-runtime-reduced-motion.md';
const staleLayerTogglePlanPath = 'docs/plans/2026-06-17-stale-layer-toggle-state.md';
const workflowPath = '.github/workflows/check.yml';
const behaviorTestPath = 'scripts/test-map-behavior.js';
const geojsonTestPath = 'scripts/test-geojson-validation.js';
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
exists(behaviorTestPlanPath, 'map behavior test docs plan');
exists(unavailableLayerPlanPath, 'unavailable layer controls docs plan');
exists(hydratedGeojsonPlanPath, 'hydrated GeoJSON validation docs plan');
exists(initialLayerVisibilityPlanPath, 'initial layer visibility docs plan');
exists(asyncLayerTogglePlanPath, 'asynchronous layer toggle synchronization docs plan');
exists(locationIndependentMakePlanPath, 'location-independent Make docs plan');
exists(defaultVisibilityTogglePlanPath, 'default layer visibility toggle docs plan');
exists(animationLifecyclePlanPath, 'power-line animation lifecycle docs plan');
exists(runtimeReducedMotionPlanPath, 'runtime reduced-motion docs plan');
exists(staleLayerTogglePlanPath, 'stale layer toggle state docs plan');
exists(workflowPath, 'hosted map validation workflow');
exists(behaviorTestPath, 'map behavior tests');
exists(geojsonTestPath, 'hydrated GeoJSON validation tests');
exists(datasetInventoryPath, 'dataset inventory');

for (const completedPlanPath of [planPath, datasetPlanPath, layerInventoryPlanPath, imageInventoryPlanPath, pageTitlePlanPath, remoteAssetPlanPath, tokenWarningAccessibilityPlanPath, viewportAccessibilityPlanPath, htmlLanguagePlanPath, layerToggleAccessibilityPlanPath, ciPlanPath, mapRegionAccessibilityPlanPath, hostedValidationPlanPath, reducedMotionPlanPath, behaviorTestPlanPath, unavailableLayerPlanPath, hydratedGeojsonPlanPath, initialLayerVisibilityPlanPath, asyncLayerTogglePlanPath, locationIndependentMakePlanPath, defaultVisibilityTogglePlanPath, animationLifecyclePlanPath, runtimeReducedMotionPlanPath, staleLayerTogglePlanPath]) {
  if (!fs.existsSync(completedPlanPath)) {
    continue;
  }

  const plan = fs.readFileSync(completedPlanPath, 'utf8');
  if (!/Status: Completed/.test(plan) || !plan.includes('make check')) {
    fail(`${completedPlanPath} must record completed status and make check verification`);
  }
}

if (fs.existsSync(locationIndependentMakePlanPath)) {
  const locationIndependentMakePlan = fs.readFileSync(locationIndependentMakePlanPath, 'utf8');
  for (const evidence of ['Node 22', 'Node 24', 'unrelated directory', 'hostile mutations rejected']) {
    if (!locationIndependentMakePlan.includes(evidence)) {
      fail(`${locationIndependentMakePlanPath} must preserve completed evidence: ${evidence}`);
    }
  }
}

if (fs.existsSync(asyncLayerTogglePlanPath)) {
  const asyncLayerTogglePlan = fs.readFileSync(asyncLayerTogglePlanPath, 'utf8');
  for (const evidence of [
    'Node 22',
    'Node 24',
    'hostile mutations rejected',
    'git diff --check',
    'secret, captured-prompt, and generated-artifact scans'
  ]) {
    if (!asyncLayerTogglePlan.includes(evidence)) {
      fail(`${asyncLayerTogglePlanPath} must preserve completed evidence: ${evidence}`);
    }
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

const makefile = fs.readFileSync('Makefile', 'utf8').replace(/\r\n/g, '\n');
if (!/^override REPO_ROOT := \$\(abspath \$\(dir \$\(lastword \$\(MAKEFILE_LIST\)\)\)\)$/m.test(makefile)) {
  fail('Makefile must resolve an override-protected repository root from its own path');
}
if (!/^lint:\n\tcd "\$\(REPO_ROOT\)" && node scripts\/check-map-assets\.js$/m.test(makefile)) {
  fail('Makefile lint target must run the map asset checker from the repository root');
}
const testTarget = makefile.match(/^test: lint\n((?:\t.*\n)+)/m);
if (!testTarget || !testTarget[1].includes('\tcd "$(REPO_ROOT)" && node scripts/test-map-behavior.js\n')) {
  fail('Makefile test target must run the dependency-free map behavior tests');
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

if (/if\s*\(error\)\s*throw\s+error/.test(script) ||
    !script.includes('A map marker image could not be loaded.')) {
  fail('map image failures must show a stable warning instead of throwing raw errors');
}

if (!/function\s+prefersReducedMotion\b/.test(script) ||
    !/matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/.test(script)) {
  fail('map-script.js must detect the browser reduced-motion preference');
}

if (!/function\s+enableLineAnimation\b[\s\S]*?if\s*\(prefersReducedMotion\(\)\)\s*\{\s*return;\s*\}/.test(script)) {
  fail('power-line animation must stay disabled when reduced motion is requested');
}

for (const contract of [
  'var intervalId = setInterval',
  'if (prefersReducedMotion() || !map.getLayer(layerId))',
  'clearInterval(intervalId)'
]) {
  if (!script.includes(contract)) {
    fail(`power-line animation must stop when its layer disappears: ${contract}`);
  }
}

for (const contract of [
  'setReducedMotion(value) { reducedMotion = value; }',
  'runtimeReduced.setReducedMotion(true)',
  'assert.deepEqual(runtimeReduced.clearedIntervals, [1])',
  'assert.equal(runtimeReduced.maps[0].paintChanges.length, 0)'
]) {
  if (!fs.readFileSync(behaviorTestPath, 'utf8').includes(contract)) {
    fail(`${behaviorTestPath} must preserve runtime reduced-motion regression: ${contract}`);
  }
}

for (const documentPath of ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md']) {
  if (!fs.readFileSync(documentPath, 'utf8').toLowerCase().includes('runtime reduced-motion changes')) {
    fail(`${documentPath} must document runtime reduced-motion changes`);
  }
}

if (!/typeof\s+mapboxgl\s*===\s*['"]undefined['"]/.test(script)) {
  fail('map-script.js must guard against Mapbox GL JS failing to load');
}

if (!/document\.createElement\(['"]button['"]\)/.test(script)) {
  fail('map-script.js must create button controls for layer toggles');
}

if (!script.includes("map.getLayoutProperty(layerId, 'visibility') !== 'none'") ||
    !script.includes("button.className = layerVisible ? 'active' : ''") ||
    !script.includes('button.disabled = !layerAvailable') ||
    !script.includes("button.setAttribute('aria-pressed', layerVisible ? 'true' : 'false')")) {
  fail('map-script.js must disable unavailable layer toggles and expose their actual pressed state');
}

if (!script.includes("if (visibility !== 'none')")) {
  fail('map-script.js must hide default-visible layers on the first toggle click');
}

if (!readme.includes('Unavailable marker layers expose disabled, unpressed controls')) {
  fail('README.md must document unavailable marker layer control behavior');
}

if (!readme.includes('Successfully loaded marker layers enable their existing controls')) {
  fail('README.md must document asynchronous marker layer control synchronization');
}

if (!readme.includes('Controls for layers removed after setup disable themselves when clicked')) {
  fail('README.md must document stale removed-layer control synchronization');
}

for (const contract of [
  'function syncLayerToggleState(map, button)',
  'syncLayerToggleState(map, this)',
  "syncLayerToggle(map, 'power_stations')",
  "syncLayerToggle(map, 'cell_towers')"
]) {
  if (!script.includes(contract)) {
    fail(`map-script.js must preserve asynchronous layer toggle synchronization: ${contract}`);
  }
}

if (!/this\.setAttribute\(['"]aria-pressed['"],\s*['"]false['"]\)/.test(script)) {
  fail('map-script.js must mark hidden layer toggles with aria-pressed="false"');
}

if (!/this\.setAttribute\(['"]aria-pressed['"],\s*['"]true['"]\)/.test(script)) {
  fail('map-script.js must mark visible layer toggles with aria-pressed="true"');
}

for (const selector of ['#menu button', '#menu button:last-child', '#menu button:hover', '#menu button.active', '#menu button:disabled']) {
  if (!styles.includes(selector)) {
    fail(`styles.css must style layer toggle selector ${selector}`);
  }
}

for (const contract of [
  'getLayer(id) { return this.layers.get(id); }',
  'assert.equal(missingImage.menu.children[1].disabled, true)',
  "assert.equal(missingImage.menu.children[1].getAttribute('aria-pressed'), 'false')",
  "assert.equal(missingToken.menu.children[0].className, '')",
  "assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'false')",
  "assert.equal(initiallyHiddenMap.visibility, 'visible')",
  'visibility: undefined',
  "assert.equal(defaultVisibleMap.visibility, 'none')",
  'assert.equal(delayedImages.menu.children[1].disabled, false)',
  'assert.equal(delayedImages.menu.children[2].disabled, true)',
  "delayedImages.imageCallbacks[1](new Error('/private/map-assets/cell-towers.png'))",
  'staleLayerMap.available = false',
  'assert.equal(missingToken.menu.children[0].disabled, true)',
  "assert.equal(missingToken.menu.children[0].getAttribute('aria-pressed'), 'false')",
  'assert.equal(staleLayerMap.layoutChanges, 0)'
]) {
  if (!fs.readFileSync(behaviorTestPath, 'utf8').includes(contract)) {
    fail(`${behaviorTestPath} must preserve layer-control state regression: ${contract}`);
  }
}

for (const contract of [
  "animated.maps[0].removeLayer('power_lines')",
  'assert.doesNotThrow(() => animated.intervals[0].callback())',
  'assert.deepEqual(animated.clearedIntervals, [1])',
  'assert.equal(animated.maps[0].paintChanges.length, 1)'
]) {
  if (!fs.readFileSync(behaviorTestPath, 'utf8').includes(contract)) {
    fail(`${behaviorTestPath} must preserve animation lifecycle regression: ${contract}`);
  }
}

if (fs.existsSync(geojsonTestPath)) {
  const geojsonTests = fs.readFileSync(geojsonTestPath, 'utf8');
  for (const contract of [
    "assertAccepted('valid-geometries'",
    "assertRejected('invalid-feature'",
    "assertRejected('missing-geometry'",
    "assertRejected('missing-geometries'",
    "assertRejected('non-finite-position'",
    "assertRejected('short-ring'",
    "assertRejected('open-ring'",
    "assertRejected('nested-collection'"
  ]) {
    if (!geojsonTests.includes(contract)) {
      fail(`${geojsonTestPath} must preserve hydrated GeoJSON regression: ${contract}`);
    }
  }
  if (!geojsonTests.includes('const baseline = runChecker(ROOT)')) {
    fail(`${geojsonTestPath} must validate the clean repository before fixture mutations`);
  }
  if (!geojsonTests.includes('fs.unlinkSync(datasetPath)')) {
    fail(`${geojsonTestPath} must break fixture hard links before replacement`);
  }
}

for (const contract of [
  'function validateFeatureCollection',
  'function validateGeometry',
  'function validateLinearRing',
  'must be a finite number',
  'must be closed with matching first and last positions'
]) {
  if (!fs.readFileSync('scripts/check-map-assets.js', 'utf8').includes(contract)) {
    fail(`hydrated GeoJSON validator must preserve: ${contract}`);
  }
}

if (!testTarget || !testTarget[1].includes('\tcd "$(REPO_ROOT)" && node scripts/test-geojson-validation.js\n')) {
  fail('Makefile test gate must run hydrated GeoJSON validation tests');
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
    validateFeatureCollection(parsed, relativePath).forEach(fail);
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
