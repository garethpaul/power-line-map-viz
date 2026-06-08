# Map Token and Asset Baseline

## Status: Completed

## Context

`power-line-map-viz` is a static Mapbox GL prototype with local marker images
and infrastructure GeoJSON layers. Existing maintenance plans documented asset
validation and no-token fallback behavior under top-level `plans/`; this file
records the canonical `docs/plans` baseline for the same verification surface.

## Objectives

- Keep the checked-in Mapbox access token empty.
- Keep the no-token browser fallback visible and validated.
- Validate local HTML, image, and GeoJSON references without Mapbox credentials.
- Accept either hydrated GeoJSON FeatureCollections or valid Git LFS pointer
  metadata.
- Require the canonical completed plan from the local validation gate.

## Work Completed

- Added this completed baseline under `docs/plans/`.
- Extended `scripts/check-map-assets.js` to require this plan and `make check`
  verification notes.
- Updated README, VISION, and CHANGES to document the canonical plan location.

## Verification

- `make check`
- `make verify`
- `node scripts/check-map-assets.js`
- `git diff --check`

## Follow-Up Candidates

- Document dataset source URLs and refresh dates.
- Add a small fixture GeoJSON layer for local demos without Git LFS.
