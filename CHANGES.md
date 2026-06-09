# Changes

## 2026-06-08

- Added layer inventory validation so checked-in GeoJSON files, Mapbox layer
  IDs, layer toggles, and `DATASETS.md` rows stay aligned.
- Added image asset inventory validation so checked-in marker images are listed
  as referenced or unused in `DATASETS.md`.
- Added a browser page title contract so `index.html` stays branded as Power
  Line Map instead of a generic map placeholder.
- Added `DATASETS.md` and validation coverage for infrastructure dataset
  provenance and LFS pointer inventory.
- Fixed `index.html` so it loads the checked-in `map-script.js` file.
- Added `make check` as an alias for the existing map asset verification gate.
- Added a Node-based map asset validator for local script/style references, marker images, GeoJSON references, Git LFS pointers, and empty Mapbox token state.
- Added `make verify` as the local validation gate for static map changes.
- Added a no-token browser warning so local viewers do not see a silent blank map when the checked-in token is empty.
- Added a canonical `docs/plans` baseline and made the map validator require it.
