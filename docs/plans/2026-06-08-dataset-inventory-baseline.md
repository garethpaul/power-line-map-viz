# Dataset Inventory Baseline

## Status: Completed

## Context

`power-line-map-viz` stores infrastructure layers as GeoJSON paths that may be
hydrated data or Git LFS pointer files. The existing map asset gate validates
file shape and Mapbox token behavior, but dataset source, freshness, and
handling assumptions were not captured in a maintained inventory.

## Objectives

- Add a visible dataset inventory for every checked-in GeoJSON layer.
- Record the current LFS pointer sizes so pointer drift is explicit.
- Mark source and refresh status as unknown until concrete provenance is
  documented.
- Extend `make check` so dataset inventory coverage is required.

## Work Completed

- Added `DATASETS.md` with layer-by-layer inventory and handling rules.
- Extended `scripts/check-map-assets.js` to require the inventory, source
  status, refresh-date guidance, private infrastructure warning, and LFS sizes.
- Updated README, VISION, and CHANGES to include the dataset inventory baseline.

## Verification

- `make check`
- `make verify`
- `node scripts/check-map-assets.js`
- `git diff --check`

## Follow-Up Candidates

- Replace unknown source/freshness notes with concrete source URLs, license
  terms, collection dates, and refresh dates.
- Add a tiny non-sensitive fixture GeoJSON layer for local demos without Git
  LFS.
