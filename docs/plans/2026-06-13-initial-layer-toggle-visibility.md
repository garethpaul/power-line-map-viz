# Initial Layer Toggle Visibility

Status: Completed

## Problem

Layer controls currently treat every available Mapbox layer as visible when
they are first rendered. An available layer whose layout visibility is
`none` therefore appears active and exposes `aria-pressed="true"`, which
misstates both the map and control state until the first click.

## Plan

1. Derive each available control's initial active and pressed state from the
   layer's actual layout visibility.
2. Keep unavailable controls disabled and unpressed.
3. Preserve the existing click behavior for showing and hiding layers.
4. Add executable and static mutation-sensitive coverage for an initially
   hidden available layer.
5. Run the complete supported validation matrix and record actual results.

## Compatibility Boundary

- Treat an omitted Mapbox visibility property as visible, matching Mapbox's
  default layout behavior.
- Do not alter layer loading, data sources, animation, or unavailable-layer
  handling.
- Keep the controls as native buttons with synchronized active class and
  `aria-pressed` state.

## Work Completed

- Derived each available control's initial state from the Mapbox layer's
  current layout visibility while preserving default-visible behavior.
- Kept unavailable controls disabled and unpressed without querying a missing
  layer's layout.
- Added executable coverage for an initially hidden layer becoming visible on
  click and static contracts for the runtime and assertion boundaries.
- Updated maintenance and behavior documentation.

## Verification

- `make check` passed the complete static asset, hydrated GeoJSON, and
  executable map behavior gate on Node 22.22.2 and Node 24.16.0.
- Four temporary hostile mutations were rejected: inverted visibility,
  availability-only active styling, removed hidden-state assertions, and a
  regressed plan completion status.
- `git diff --check` passed for the completed implementation.
