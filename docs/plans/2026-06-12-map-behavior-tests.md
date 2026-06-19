# Map Browser Behavior Tests

Status: Completed

## Context

The map asset checker protected source-level contracts, but `make test` did not
execute browser behavior. Regressions in the no-token fallback, layer toggle
state, or reduced-motion decision could pass while matching static patterns.

## Work Completed

- Added a dependency-free Node VM harness for `map-script.js`.
- Covered missing Mapbox GL JS and missing-token warnings.
- Covered layer toggle visibility and `aria-pressed` transitions.
- Covered both reduced-motion and animated power-line initialization paths.
- Replaced unhandled marker-image exceptions with a stable visible warning and
  covered failure details remaining out of browser output.
- Added the behavior suite to `make test` and the repository baseline.

## Verification

- `node scripts/test-map-behavior.js`
- `make test`
- `make check`
- hostile behavior mutations
- `git diff --check`
