# Viewport Zoom Accessibility

Status: Completed

## Context

The static map page used `maximum-scale=1,user-scalable=no` in its viewport
metadata. That can prevent users from zooming the browser page, which is
especially harmful for map controls, status messages, and dense infrastructure
layers.

## Objectives

- Keep the viewport responsive with `width=device-width`.
- Remove viewport settings that disable user scaling or cap maximum zoom at 1.
- Add an offline checker guard so the accessibility regression does not return.
- Document the completed guard in README, SECURITY, VISION, and CHANGES.

## Work Completed

- Updated `index.html` to use `width=device-width, initial-scale=1`.
- Extended `scripts/check-map-assets.js` with viewport accessibility checks.
- Added this completed plan and maintenance documentation for the guard.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
