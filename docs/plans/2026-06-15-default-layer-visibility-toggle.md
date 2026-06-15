# Default Layer Visibility Toggle

status: planned

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
