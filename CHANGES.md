# Changes

## 2026-06-16

- Runtime reduced-motion changes now stop an active power-line animation before
  its next paint frame.
- Stopped the power-line animation interval when its Mapbox layer disappears,
  preventing stale paint updates after style lifecycle changes.

## 2026-06-15

- Made the first toggle click hide layers whose Mapbox visibility is unset and
  therefore defaults to visible.

## 2026-06-13

- Synchronized delayed marker-layer success with existing disabled controls
  while preserving failure-disabled state.
- Synchronized each layer control's initial active and pressed state with the
  layer's actual Mapbox layout visibility.
- Added dependency-free RFC 7946 structural validation for hydrated GeoJSON
  features, supported geometries, finite positions, coordinate nesting, and
  polygon ring closure while preserving valid Git LFS pointers.
- Added isolated valid-geometry and malformed-dataset regression fixtures to
  the canonical test gate.

## 2026-06-12

- Disabled layer controls when marker-image failures prevent their Mapbox
  layers from loading, with executable accessibility regression coverage.

## 2026-06-10

- Added a GitHub Actions check workflow that runs the existing Node-backed
  `make check` map asset baseline on pushes, pull requests, and manual
  dispatches.
- Added a map asset guard requiring the CI workflow and completed CI baseline
  plan to remain checked in.
- Pinned hosted actions and validate the dependency-free map contracts on
  maintained Node 22 and Node 24 with read-only permissions.
- Added pinned, read-only hosted map contract validation on Node 22 and Node 24
  without dependency installation.
- Made the map validator independent of the caller's working directory and
  protected the hosted workflow contract locally.
- Added labelled map-region validation so the primary map container stays
  exposed to assistive tooling.
- Added a reduced-motion guard so the power-line layer remains static when the
  browser requests less animation.
- Added dependency-free executable tests for token warnings, layer toggle
  state, and reduced-motion animation behavior.
- Replaced unhandled marker-image errors with a stable visible warning.

## 2026-06-09

- Added layer toggle accessibility validation for labelled buttons and
  `aria-pressed` state.
- Added root HTML language validation so the static map page declares
  `lang="en"` for accessibility tooling.
- Added a static `make build` gate for map asset validation.

## 2026-06-08

- Added layer inventory validation so checked-in GeoJSON files, Mapbox layer
  IDs, layer toggles, and `DATASETS.md` rows stay aligned.
- Added image asset inventory validation so checked-in marker images are listed
  as referenced or unused in `DATASETS.md`.
- Added a browser page title contract so `index.html` stays branded as Power
  Line Map instead of a generic map placeholder.
- Added no-token warning accessibility validation for the Mapbox token fallback
  message.
- Added viewport zoom accessibility validation so the map page does not disable
  browser zoom.
- Added a remote browser asset allowlist for Mapbox GL JS/CSS and Google Fonts.
- Added `DATASETS.md` and validation coverage for infrastructure dataset
  provenance and LFS pointer inventory.
- Fixed `index.html` so it loads the checked-in `map-script.js` file.
- Added `make check` as an alias for the existing map asset verification gate.
- Added a Node-based map asset validator for local script/style references, marker images, GeoJSON references, Git LFS pointers, and empty Mapbox token state.
- Added `make verify` as the local validation gate for static map changes.
- Added a no-token browser warning so local viewers do not see a silent blank map when the checked-in token is empty.
- Added a canonical `docs/plans` baseline and made the map validator require it.
