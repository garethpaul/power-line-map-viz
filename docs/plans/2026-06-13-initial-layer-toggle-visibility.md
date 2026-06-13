# Initial Layer Toggle Visibility

Status: Planned

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

## Verification

Pending implementation.
