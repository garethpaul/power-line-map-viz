# Layer Inventory Validation

## Status: Completed

## Context

`power-line-map-viz` keeps infrastructure layers in three places: checked-in
`geojson/*.geojson` files, Mapbox layer definitions in `map-script.js`, and the
dataset inventory in `DATASETS.md`. The existing check validated file
references and dataset rows, but it did not fail when a GeoJSON file became
orphaned, a layer ID drifted from the filename, or a layer stopped being
toggleable.

## Objectives

- Keep validation dependency-free and independent of Mapbox credentials.
- Require every checked-in GeoJSON layer to be referenced by `map-script.js`.
- Require map layer IDs and toggle IDs to match the GeoJSON filename stem.
- Require `DATASETS.md` to record each GeoJSON file with the matching map layer
  ID.

## Work Completed

- Extended `scripts/check-map-assets.js` with GeoJSON-to-layer inventory
  consistency checks.
- Added this completed plan under `docs/plans/`.
- Updated README, VISION, and CHANGES notes for layer inventory validation.

## Verification

- `make check`
- `make verify`
- `node scripts/check-map-assets.js`
- `git diff --check`
