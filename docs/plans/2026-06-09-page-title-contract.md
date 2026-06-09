# Page Title Contract

## Status: Completed

## Context

`index.html` used the generic title `Assistance Map`, which did not match the
repository purpose or the visible map layers focused on power lines, power
stations, and cell towers. The existing asset checker inspected scripts,
datasets, warnings, and layer inventory, but it did not preserve user-facing
page metadata.

## Goals

- Rename the browser page title to `Power Line Map`.
- Add a deterministic asset-check assertion for the page title.
- Keep the title contract documented with the other static map guards.

## Work Completed

- Updated `index.html` to use `<title>Power Line Map</title>`.
- Extended `scripts/check-map-assets.js` to preserve the title and this
  completed plan.
- Added README, VISION, and CHANGES notes for the page-title guard.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
