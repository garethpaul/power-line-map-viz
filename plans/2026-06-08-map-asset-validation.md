# Map Asset Validation

## Status

Completed

## Context

`power-line-map-viz` is a static Mapbox GL visualization with local marker
assets and GeoJSON datasets. The HTML entry point referenced `map-script1.js`,
which was not checked in, and the repository had no deterministic local
validation command. In this environment the GeoJSON files are Git LFS pointer
files because `git lfs` is not installed.

## Objectives

- Add a local validation command that does not require Mapbox credentials.
- Verify that `index.html` references checked-in local files.
- Verify that `map-script.js` references checked-in marker and GeoJSON paths.
- Reject committed non-empty Mapbox access tokens.
- Validate hydrated GeoJSON files when available, or validate Git LFS pointer
  metadata when the data is not hydrated.

## Verification

- `make verify`
- `node scripts/check-map-assets.js`
- `git diff --check`

## Follow-Up Candidates

- Add a no-token browser fallback message.
- Document dataset source URLs and refresh dates.
- Add a small fixture GeoJSON layer for local demos without Git LFS.
