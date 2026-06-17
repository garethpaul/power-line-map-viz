# Stale Layer Toggle State

Status: Planned

## Context

Layer controls are synchronized when they are created and when asynchronous
marker layers finish loading. If an available layer is later removed, clicking
its previously enabled control returns without updating the control, leaving an
enabled and pressed button for a layer that no longer exists.

## Requirements

- Resynchronize the clicked control before returning when its layer is no
  longer available.
- Disable the stale control and expose `aria-pressed="false"` through the
  existing synchronization helper.
- Preserve normal visible and hidden layer toggles, initial control state,
  asynchronous marker loading, animation lifecycle, and reduced-motion logic.
- Add mutation-sensitive behavior and static contracts for the removal case.
- Record completed work and actual verification evidence.

## Scope Boundaries

- Do not add Mapbox lifecycle listeners or rebuild the complete control menu.
- Do not change styles, sources, layers, data, animation timing, token behavior,
  dependencies, or hosted workflows.
- Keep this change stacked on PR #9; do not merge or close either pull request
  without explicit owner authorization.

## Verification Plan

- Run JavaScript syntax checks, the focused map behavior harness, and the
  complete dependency-free Make gate on Node 22 and Node 24.
- Run the absolute-Makefile gate from an external directory on both Node lanes.
- Reject isolated mutations of the click-path resync, disabled state, pressed
  state, regression execution, guidance, and completed plan status.
- Audit the exact diff, generated artifacts, credentials, conflicts, modes,
  binaries, large files, and whitespace before commit and push.
