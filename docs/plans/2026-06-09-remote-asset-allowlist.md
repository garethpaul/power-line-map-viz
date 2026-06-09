# Remote Asset Allowlist

## Status: Completed

## Context

The static map intentionally loads Mapbox GL JS/CSS and Google Fonts from
remote URLs. The asset checker already validated local script and stylesheet
references, but new remote script or stylesheet references could be added to
`index.html` without being reviewed as part of the local verification gate.

## Goals

- Record the intentional remote browser assets in the map asset checker.
- Fail when `index.html` adds an unapproved remote script or stylesheet.
- Fail when the expected Mapbox or Google Fonts references drift unexpectedly.
- Document the allowlist with the other static map guardrails.

## Work Completed

- Extended `scripts/check-map-assets.js` with an explicit remote asset
  allowlist for Mapbox GL JS/CSS and Google Fonts.
- Added README, VISION, SECURITY, and CHANGES notes for the allowlist guard.
- Added this completed plan under `docs/plans/`.

## Verification

- `node scripts/check-map-assets.js`
- `make check`
- `make verify`
- `git diff --check`
