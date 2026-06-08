# Mapbox Token Fallback

## Status

Completed

## Context

`power-line-map-viz` intentionally keeps the checked-in Mapbox token empty, but
the current browser entry point constructs a Mapbox GL map immediately. That can
leave local viewers with a blank or broken page before they know a token is
required.

## Objectives

- Keep the committed Mapbox token empty.
- Show a clear local browser message when Mapbox GL JS is unavailable or no
  token is configured.
- Avoid creating map controls or layer toggle UI until the map can be
  initialized.
- Extend the deterministic asset validator so the fallback remains present.

## Implementation Notes

- Update `index.html` with a hidden fallback message container and keep the
  layer menu hidden by default.
- Wrap `map-script.js` initialization behind Mapbox runtime and token guards.
- Update `styles.css` so the warning is readable without overlapping the map
  surface.
- Extend `scripts/check-map-assets.js` to reject committed tokens and require
  the fallback guard.
- Update `README.md`, `VISION.md`, `CHANGES.md`, and the prior plan follow-up
  list to reflect the new baseline.

## Verification

- `make verify`
- `node scripts/check-map-assets.js`
- `git diff --check`
