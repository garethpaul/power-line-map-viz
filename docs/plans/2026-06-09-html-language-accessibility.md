# HTML Language Accessibility

Status: Completed

## Context

The static map page had a descriptive title and accessible no-token warning, but
the root `<html>` element did not declare the page language. Screen readers,
translation tools, and browser accessibility features rely on a stable language
attribute for correct pronunciation and interpretation.

## Objectives

- Add `lang="en"` to the root HTML element.
- Extend the offline map asset check so the language attribute cannot drift.
- Add a static `make build` target for the map verification gate.
- Document the completed accessibility and gate wrapper guard in README,
  SECURITY, VISION, and CHANGES.

## Work Completed

- Updated `index.html` to use `<html lang='en'>`.
- Extended `scripts/check-map-assets.js` with a root HTML language check.
- Added the new canonical docs plan to the validator's required plan coverage.
- Added `make build` as a static validation alias and wired `verify` through
  lint, test, and build.

## Verification

- Red check showing the validator accepted a missing HTML language attribute.
- Red `make build` before adding the target.
- `node --check scripts/check-map-assets.js`
- `node scripts/check-map-assets.js`
- `make lint`
- `make test`
- `make build`
- `make check`
- `make verify`
- `git diff --check`
