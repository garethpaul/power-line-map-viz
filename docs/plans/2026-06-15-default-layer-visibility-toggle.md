# Default Layer Visibility Toggle

Status: Completed

## Context

Mapbox layers are visible by default when their `visibility` layout property is
unset. The control-state synchronizer already treats every value other than
`none` as visible, but the click handler hides only an explicit `visible`
value. A default-visible layer can therefore ignore the first hide click.

## Requirements

- Treat unset/default visibility exactly like explicit `visible` during a
  layer-toggle click.
- Preserve hidden-layer, unavailable-layer, asynchronous image-load, reduced
  motion, and accessibility behavior.
- Add a mutation-sensitive regression that starts with an unset visibility
  property and proves the first click hides the layer.
- Record completed work and actual local/external verification.

## Approach

- Reuse the existing semantic boundary: only `none` is hidden.
- Change the click branch to hide whenever current visibility is not `none`.
- Extend the dependency-free map behavior harness and static contract.

## Scope Boundaries

- Do not change layer inventories, GeoJSON, images, Mapbox configuration,
  animation timing, initial visibility, or asynchronous control creation.
- Do not add dependencies or alter hosted workflow coverage.

## Verification

- Run the focused behavior test, complete Make gate, external-directory gate,
  and existing asset/GeoJSON validation.
- Reject a hostile mutation restoring the explicit-`visible` comparison or
  removing the default-visible regression.
- Audit the exact diff, generated artifacts, credentials, conflicts, modes,
  binaries, and large files.

## Risks

- The click handler and state synchronizer must continue using the same Mapbox
  visibility semantics so control state cannot drift from the rendered layer.

## Work Completed

- Changed the click handler to treat every visibility value other than `none`
  as currently visible, matching the existing state synchronizer.
- Added a default-visible map stub whose unset visibility becomes `none` on
  the first click and whose `aria-pressed` state changes with it.
- Added static, documentation, changelog, and completed-plan contracts.

## Verification Results

- The focused browser behavior harness passed the unset/default-visible first
  click regression alongside hidden, explicit-visible, unavailable,
  asynchronous image, warning, reduced-motion, and animation paths.
- `make check` and the external-directory absolute-Makefile gate passed the
  complete asset, GeoJSON, behavior, workflow, and plan contract suite.
- Hostile mutations restoring the explicit-`visible` comparison and removing
  the default-visible test contract were rejected.
- `git diff --check` plus exact diff, secret, and generated-artifact audits
  passed.
