# Layer Toggle Accessibility

Status: Completed

## Context

The layer menu exposed clickable layer names as anchors and used only the
`active` CSS class to show whether a layer was visible. That made the state
clear visually, but it left assistive tooling without a stable button control
or pressed-state signal.

## Objectives

- Keep the layer menu labelled as map-layer controls.
- Render layer toggles as buttons instead of inert links.
- Keep visible and hidden layer state mirrored through `aria-pressed`.
- Extend the static map checker so the HTML, script, CSS, and completed plan
  record cannot drift silently.
- Document the guard in README, VISION, and CHANGES.

## Work Completed

- Added `aria-label="Map layers"` to the layer navigation container.
- Changed runtime layer toggles from anchors to buttons.
- Initialized layer toggles with `aria-pressed="true"` and update the value
  when layers are hidden or shown.
- Updated menu CSS selectors for button-based toggles.
- Extended `scripts/check-map-assets.js` to validate the menu label, button
  creation, pressed-state updates, CSS selectors, and completed plan record.
- Updated top-level maintenance documentation for the new accessibility guard.

## Verification

- `node --check scripts/check-map-assets.js`
- `node scripts/check-map-assets.js`
- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
