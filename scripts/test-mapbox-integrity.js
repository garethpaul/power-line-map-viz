'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'power-line-map-sri-'));

function copyRepository(name) {
  const destination = path.join(temporaryRoot, name);
  fs.cpSync(ROOT, destination, {
    recursive: true,
    filter(source) {
      return path.basename(source) !== '.git';
    }
  });
  return destination;
}

function runChecker(repository) {
  return spawnSync(process.execPath, [path.join(repository, 'scripts/check-map-assets.js')], {
    cwd: repository,
    encoding: 'utf8'
  });
}

function replace(repository, relativePath, pattern, replacement) {
  const target = path.join(repository, relativePath);
  const source = fs.readFileSync(target, 'utf8');
  const changed = source.replace(pattern, replacement);
  assert.notEqual(changed, source, `${relativePath} mutation must change the fixture`);
  fs.writeFileSync(target, changed);
}

function assertRejected(name, mutate, expected) {
  const repository = copyRepository(name.replaceAll(' ', '-'));
  mutate(repository);
  const result = runChecker(repository);
  assert.notEqual(result.status, 0, `checker accepted ${name}`);
  assert.match(`${result.stdout}${result.stderr}`, expected, `${name} must fail with its contract error`);
}

try {
  const baseline = runChecker(ROOT);
  assert.equal(baseline.status, 0, `baseline checker failed:\n${baseline.stdout}${baseline.stderr}`);

  assertRejected('missing JavaScript integrity', repository => {
    replace(repository, 'index.html', / integrity='sha384-Xl0CA[^']+'/, '');
  }, /reviewed Mapbox integrity/);

  assertRejected('swapped Mapbox integrity', repository => {
    const target = path.join(repository, 'index.html');
    const source = fs.readFileSync(target, 'utf8');
    const javascript = 'sha384-Xl0CAgGkuwxYbsGqIVjAkd+dCJwYigLOy0OMNVQPJxTrRRuHJYBd1ePj727mUry5';
    const stylesheet = 'sha384-vL3ZAw2ReQIdxrwUqRWv0tBphVsMAJRrOLGU/rYaA1hnRjv8oBvlEywnbosRbPXG';
    const changed = source.replace(javascript, 'SWAP').replace(stylesheet, javascript).replace('SWAP', stylesheet);
    assert.notEqual(changed, source, 'swapped integrity mutation must change index.html');
    fs.writeFileSync(target, changed);
  }, /reviewed Mapbox integrity/);

  assertRejected('duplicate integrity attribute', repository => {
    replace(repository, 'index.html', /(<script[^>]+)( integrity=)/, "$1 integrity='sha384-shadow'$2");
  }, /reviewed Mapbox integrity/);

  assertRejected('duplicate Mapbox tag', repository => {
    replace(repository, 'index.html', /(<script[^>]+mapbox-gl\.js[^>]*><\/script>)/, '$1\n        $1');
  }, /exactly one Mapbox asset tag/);

  assertRejected('missing Mapbox crossorigin', repository => {
    replace(repository, 'index.html', /(<link[^>]+mapbox-gl\.css[^>]+) crossorigin='anonymous'/, '$1');
  }, /crossorigin="anonymous"/);

  assertRejected('stale Mapbox URL', repository => {
    replace(repository, 'index.html', /v1\.4\.1\/mapbox-gl\.js/, 'v1.4.2/mapbox-gl.js');
  }, /unapproved remote asset|keep approved remote asset/);

  assertRejected('removed SRI enforcement', repository => {
    const target = path.join(repository, 'scripts/check-map-assets.js');
    const source = fs.readFileSync(target, 'utf8');
    const changed = source.replace(/for \(const \[url, expectedIntegrity\] of mapboxIntegrity\) \{[\s\S]*?\n\}\n\nconst checkerSource/, 'const checkerSource');
    assert.notEqual(changed, source, 'SRI enforcement mutation must change the checker');
    fs.writeFileSync(target, changed);
  }, /Mapbox integrity checker must preserve/);

  console.log('Mapbox integrity mutation tests passed.');
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
