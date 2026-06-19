# Runtime Reduced-Motion Boundary

Status: Completed

## Context

The map checks `prefers-reduced-motion` only before starting the power-line
animation. If that browser or operating-system preference changes while the
page remains open, the existing 30 millisecond interval continues painting
animated dash frames.

## Requirements

- Recheck reduced motion before every scheduled paint frame.
- Clear the exact animation interval and return before painting when the
  preference becomes active.
- Preserve startup reduced-motion behavior, missing-layer cancellation, dash
  order, interval cadence, map loading, and layer toggles.
- Add mutation-sensitive VM and static contracts for the runtime preference
  transition.
- Record completed work and actual verification evidence.

## Scope Boundaries

- Do not add media-query listeners, restart animation when the preference later
  becomes inactive, or redesign animation timing.
- Do not change Mapbox styles, sources, layers, data, controls, or token
  behavior.
- Keep this change stacked on PR #8; do not merge or close either pull request
  without explicit owner authorization.

## Verification Plan

- Run focused map behavior coverage and the complete dependency-free Make gate
  on Node 22 and Node 24.
- Run the absolute-Makefile gate from `/tmp` on both Node lanes.
- Reject isolated mutations of the runtime media-query check, exact interval
  cancellation, paint suppression, test transition, guidance, and plan status.
- Audit the exact diff, generated artifacts, credentials, conflicts, modes,
  binaries, large files, and whitespace before commit and push.

## Work Completed

- Rechecked the existing reduced-motion media query before each scheduled
  power-line paint frame.
- Cleared the exact animation interval and returned before painting when the
  preference became active at runtime.
- Extended the VM harness with a mutable preference and added static runtime,
  test, guidance, and completed-plan contracts.

## Verification Results

- Node 22.22.1 and Node 24.16.0 passed JavaScript syntax checks and the focused
  map behavior regression.
- Six isolated hostile mutations were rejected across runtime preference
  rechecking, interval cancellation, transition execution, paint suppression,
  guidance, and completed plan status.
- Repository `make check` and the absolute-Makefile gate from `/tmp` passed on
  both Node 22.22.1 and Node 24.16.0.
- Exact diff, generated-artifact, credential, conflict-marker, mode, binary,
  large-file, and whitespace audits passed before commit.
