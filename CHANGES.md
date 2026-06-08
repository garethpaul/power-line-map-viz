# Changes

## 2026-06-08

- Fixed `index.html` so it loads the checked-in `map-script.js` file.
- Added a Node-based map asset validator for local script/style references, marker images, GeoJSON references, Git LFS pointers, and empty Mapbox token state.
- Added `make verify` as the local validation gate for static map changes.
