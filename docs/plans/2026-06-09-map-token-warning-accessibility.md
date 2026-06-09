# Map Token Warning Accessibility

Status: Completed

## Context

The static map intentionally ships with an empty Mapbox access token and shows a
browser warning instead of silently rendering a blank map. The validator already
required the warning container to exist, but it did not preserve the accessible
status semantics that make the message available to assistive technologies.

## Objectives

- Require the no-token warning container in `index.html`.
- Require `role="status"` on the warning container.
- Require `aria-live="polite"` on the warning container.
- Document the accessibility guard in README, VISION, SECURITY, and CHANGES.

## Work Completed

- Extended `scripts/check-map-assets.js` to parse the warning tag and validate
  its live-region attributes.
- Added this completed plan under `docs/plans/`.
- Updated repository documentation for the warning accessibility contract.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
