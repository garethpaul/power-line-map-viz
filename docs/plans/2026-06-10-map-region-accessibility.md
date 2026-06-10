# Map Region Accessibility

Status: Completed

## Context

The page already labelled layer controls and the no-token warning, but the
primary map container was still a plain `div`. Assistive tooling could reach
the page without a useful label for the main visualization area.

## Objectives

- Mark the `#map` container as a labelled region.
- Keep the label specific to the power-line infrastructure visualization.
- Extend the dependency-free map asset checker to preserve the region role and
  label.
- Document the guard in README, SECURITY, VISION, and CHANGES.

## Work Completed

- Added `role="region"` and a descriptive `aria-label` to the map container.
- Added static validation for the map container role and label.
- Recorded the completed accessibility guard under `docs/plans/`.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
