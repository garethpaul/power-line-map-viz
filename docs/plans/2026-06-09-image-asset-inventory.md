# Image Asset Inventory

## Status: Completed

## Context

The map validator checked image references that appear in `map-script.js`, but
it did not require every checked-in `images/*` file to be documented. Several
marker-style assets are present without active map layers, so their intended
status should stay visible.

## Goals

- Inventory every checked-in file under `images/`.
- Mark images referenced by `map-script.js` as referenced marker images.
- Mark other checked-in images as unused candidates.
- Preserve the image inventory through `make check`.

## Work Completed

- Added image-reference and image-directory validation to
  `scripts/check-map-assets.js`.
- Added an image asset inventory table to `DATASETS.md`.
- Updated README, VISION, and CHANGES for the new guard.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
