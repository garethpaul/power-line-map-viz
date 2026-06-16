# Power-Line Animation Lifecycle

Status: Planned

## Context

The power-line dash animation installs a 30 millisecond interval that assumes
the `power_lines` layer remains present forever. If a Mapbox style reload or
other lifecycle change removes that layer, the callback continues calling
`setPaintProperty` and Mapbox throws because the target layer no longer
exists.

## Requirements

- Stop the power-line animation interval when its target layer is no longer
  available.
- Avoid paint updates after the layer has disappeared.
- Preserve the existing dash sequence, 30 millisecond timing, and reduced
  motion behavior while the layer exists.
- Add a mutation-sensitive regression that removes the layer, invokes the
  scheduled callback, and proves the timer is cleared without a paint update.
- Record completed work and the actual verification results.

## Approach

- Retain the interval identifier returned by `setInterval`.
- Check `map.getLayer(layerId)` at the start of each callback.
- Clear and retire the interval before returning when the layer is missing.
- Extend the dependency-free VM harness with explicit interval cancellation
  tracking and Mapbox-like missing-layer behavior.

## Scope Boundaries

- Do not change Mapbox styles, data sources, layer inventories, animation
  frames, animation speed, initial visibility, or layer-toggle behavior.
- Do not restart animation after a later style reload; this change only makes
  the existing animation fail closed when its original layer disappears.
- Do not add dependencies or alter hosted workflow coverage.

## Verification

- Run the focused map behavior harness, complete Make gate, and the
  external-directory absolute-Makefile gate.
- Reject hostile mutations that remove the missing-layer guard, timer
  cancellation, or lifecycle regression.
- Audit the exact diff, generated artifacts, credentials, conflicts, modes,
  binaries, and large files before committing the implementation.

## Risks

- The callback must not advance or paint another dash frame after detecting a
  missing layer.
- Interval cancellation must use the exact identifier returned for that
  animation instance.
