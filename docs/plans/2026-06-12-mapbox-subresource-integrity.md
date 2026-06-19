# Mapbox Subresource Integrity

Status: Completed

## Context

The static page loads pinned Mapbox GL JS 1.4.1 JavaScript and CSS from the
official Mapbox CDN. The repository allowlists those exact URLs, but it does not
bind the browser to reviewed response bytes. Content drift at either versioned
URL would therefore execute or style the page without a repository change.

The official CDN currently serves both resources with cross-origin access
enabled, so browser-native Subresource Integrity can enforce reviewed SHA-384
digests without adding dependencies, vendoring Mapbox, requiring a token, or
changing map behavior.

## Priority

The JavaScript resource executes with the page's authority and is the highest
impact remote supply-chain surface in this dependency-free repository. Binding
both Mapbox resources to verified bytes raises the security bar while preserving
the separate compatibility work required for a future Mapbox upgrade.

## Objectives

- Add reviewed SHA-384 integrity metadata to the pinned Mapbox JavaScript and
  stylesheet tags.
- Add anonymous cross-origin mode required for cross-origin SRI enforcement.
- Make the static checker reject missing, duplicated, malformed, swapped, or
  stale integrity and CORS metadata.
- Document how maintainers deliberately refresh the hashes when Mapbox changes.
- Preserve the current Mapbox version, Google Fonts reference, token boundary,
  map behavior, styles, data, and accessibility contracts.

## Implementation Units

### U1. Browser-enforced Mapbox integrity

**Files:** `index.html`

**Goal:** Prevent the browser from accepting unreviewed bytes from the two
allowlisted Mapbox CDN URLs.

**Approach:** Add the verified SHA-384 digest and `crossorigin="anonymous"` to
each exact Mapbox tag. Keep local resource order and every other remote or local
reference unchanged.

### U2. Fail-closed static contracts

**Files:** `scripts/check-map-assets.js`, `scripts/test-mapbox-integrity.js`,
`Makefile`

**Goal:** Ensure future HTML edits cannot silently remove or weaken SRI.

**Approach:** Parse remote script/link tags, require exactly one Mapbox tag per
approved URL, and compare its integrity and cross-origin metadata with a single
reviewed resource contract. Add isolated mutations for missing, swapped,
duplicated, and removed enforcement; run them through the canonical Make gate.

### U3. Maintenance documentation

**Files:** `README.md`, `SECURITY.md`, `VISION.md`, `CHANGES.md`, `AGENTS.md`,
`docs/plans/2026-06-12-mapbox-subresource-integrity.md`

**Goal:** Keep the remote dependency review procedure visible and durable.

**Approach:** Record the SRI boundary, the official-CDN byte verification
requirement, and the need to update HTML and checker contracts together. Mark
this plan completed only after local and hostile verification succeeds.

## Verification

- `node --check scripts/check-map-assets.js`
- `node scripts/check-map-assets.js`
- `make lint`
- `make test`
- `make build`
- `make verify`
- `make check`
- validator invocation outside the repository working directory
- workflow YAML and README SVG parsing
- hostile missing, duplicate, malformed, swapped, and stale SRI mutations
- direct SHA-384 comparison with the official CDN responses
- no-token desktop and mobile browser smoke when browser tooling is available
- `git diff --check`

## Work Completed

- Added browser-enforced SHA-384 Subresource Integrity and anonymous
  cross-origin mode to the exact pinned Mapbox JavaScript and CSS tags.
- Added one reviewed URL-to-digest contract that requires exactly one tag per
  Mapbox resource and rejects missing, duplicate, malformed, swapped, or stale
  integrity and cross-origin metadata.
- Added committed isolated mutations for missing, swapped, and duplicate
  integrity, duplicate tags, missing cross-origin metadata, stale URLs, and
  removed enforcement, wired through `make test` and `make check`.
- Registered this completed plan and updated contributor, security, vision,
  README, and changelog documentation with the deliberate hash-refresh process.
- Preserved Mapbox GL JS 1.4.1, Google Fonts, all local code and styles, the
  empty-token boundary, map behavior, GeoJSON, images, and accessibility state.

## Verification Results

- The official Mapbox CDN returned `Access-Control-Allow-Origin: *` for both
  reviewed resources.
- Direct response-byte verification produced JavaScript SHA-384
  `Xl0CAgGkuwxYbsGqIVjAkd+dCJwYigLOy0OMNVQPJxTrRRuHJYBd1ePj727mUry5`
  and CSS SHA-384
  `vL3ZAw2ReQIdxrwUqRWv0tBphVsMAJRrOLGU/rYaA1hnRjv8oBvlEywnbosRbPXG`.
- A disposable completed-plan copy passed `node scripts/check-map-assets.js`
  and JavaScript syntax validation.
- All 12 hostile missing, malformed, swapped, duplicated, stale, checker, and
  plan mutations were rejected.
- `make lint`, `make test`, `make build`, `make verify`, and `make check`
  passed locally.
- Network-isolated exact-file `make check` passed on Node 22.22.3 and Node
  24.16.0.
- External-working-directory execution through Node, workflow YAML parsing,
  README SVG parsing, JavaScript syntax validation, and `git diff --check`
  passed.
- Browser capture is not applicable because SRI metadata does not alter layout
  or interaction; `agent-browser` is unavailable in this environment.

## Boundaries

- Do not upgrade Mapbox GL JS or change its URLs in this successor.
- Do not add a Mapbox token, package manager, build step, vendored dependency,
  or network call to the local or hosted verification gate.
- Do not alter map behavior, layer inventory, GeoJSON, images, styles, or
  accessibility behavior.
- Preserve the existing remediation PR and canonical exact-head evidence.
