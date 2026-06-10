# Power-Line Reduced Motion

Status: Completed

## Context

The power-line layer updated its dash pattern every 30 milliseconds whenever
the map loaded. The animation ran regardless of the browser's reduced-motion
preference, which could create unnecessary motion for users who explicitly ask
sites to minimize animation.

## Objectives

- Respect the browser's `prefers-reduced-motion: reduce` preference.
- Keep the power-line layer visible as a static dashed line when animation is
  disabled.
- Preserve the existing animation for users without the preference.
- Protect the behavior with the dependency-free map contract check.

## Work Completed

- Added a browser-safe `prefersReducedMotion` helper in `map-script.js`.
- Guarded the line-animation interval before it is created.
- Extended `scripts/check-map-assets.js` to require the media query and early
  return in the animation function.
- Documented the accessibility behavior in README, VISION, and CHANGES.

## Verification

- `node --check map-script.js`
- `make check`
- Removed the animation guard in a mutation check and confirmed `make check`
  rejected the change.
- `git diff --check`
