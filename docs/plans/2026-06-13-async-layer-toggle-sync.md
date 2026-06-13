# Synchronize Asynchronous Layer Toggle Availability

Status: Completed

## Context

The layer menu is built immediately after the power-line layer is added, while
station and tower layers are added later from asynchronous `loadImage`
callbacks. Their controls therefore start disabled and remain stale even after
the corresponding marker layer loads successfully.

## Objectives

- Recompute one layer control's disabled, active, and `aria-pressed` state after
  that asynchronous layer is added.
- Preserve the existing initial-visibility contract and keep failed marker
  layers disabled and unpressed.
- Add mutation-sensitive browser-harness tests for delayed success and failure
  ordering without Mapbox or network access.
- Protect the implementation, tests, documentation, and completed plan in the
  dependency-free map contract checker.

## Scope Boundaries

- Do not change layer IDs, map sources, marker assets, token handling, styles,
  animation timing, or remote asset versions.
- Do not retry failed images or enable controls before `map.addLayer` succeeds.
- Do not add dependencies or require browser automation.

## Verification

- focused browser behavior and static contract tests
- all Make gates including `make check` on Node 22 and Node 24
- hostile mutations covering success-only synchronization, failed-layer state,
  test contracts, documentation, plan status, and verification evidence
- exact-base GeoJSON, image, HTML, workflow, remote-asset, and dependency scans
- `git diff --check` plus secret, captured-prompt, and generated-artifact scans

## Work Completed

- Extracted reusable layer-control state synchronization for availability,
  active styling, and `aria-pressed` state.
- Resynchronized only the matching station or tower control after its
  asynchronous `map.addLayer` succeeds.
- Added deferred image callbacks to the browser harness and protected success,
  sibling-failure, documentation, and plan contracts in the static checker.

## Verification Results

- JavaScript syntax and focused browser behavior tests passed.
- Node 22 and Node 24 `make check` passed in network-disabled, read-only
  containers against disposable writable repository copies.
- Nine hostile mutations rejected missing success synchronization, failure
  ordering changes, disabled-state drift, missing delayed tests, documentation
  drift, plan status drift, and verification-evidence drift.
- Exact-base comparison confirmed GeoJSON, images, HTML, styles, workflow,
  Makefile, and dataset inventory were unchanged.
- `git diff --check` plus secret, captured-prompt, and generated-artifact scans
  passed; no dependency or remote-asset references changed.
