# Stale Layer Toggle State

Status: Completed

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

## Work Completed

- Reused the existing control-state synchronization helper when a click finds
  that its backing layer is no longer available.
- Added a dependency-free regression that removes availability after setup and
  proves the clicked control becomes disabled and unpressed without a layout
  mutation.
- Added static runtime, behavior, README guidance, changelog, and completed-plan
  contracts.

## Verification Results

- Node 22.22.1 and Node 24.16.0 passed JavaScript syntax checks, the focused map
  behavior regression, repository `make check`, and the absolute-Makefile gate
  from `/tmp`.
- Seven isolated hostile mutations were rejected across click-path
  resynchronization, removal transition execution, disabled state, pressed
  state, layout-mutation suppression, README guidance, and completed plan
  status.
- Exact diff, generated-artifact, credential, conflict-marker, mode, binary,
  large-file, and whitespace audits were completed before commit.
