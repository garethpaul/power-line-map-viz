# Unavailable Map Layer Controls

Status: Completed

## Context

Layer controls are created as active before checking whether their Mapbox layer
exists. If a marker image fails to load, the corresponding layer is skipped but
its button still reports `aria-pressed="true"` and appears interactive. The
behavior test stub returned a synthetic layer for every ID, masking the issue.

## Priority

Controls must accurately represent map state. An active control for a missing
infrastructure layer misleads sighted and assistive-technology users and cannot
perform the action it advertises.

## Objectives

- Derive each toggle's initial state from `map.getLayer()`.
- Disable unavailable layer controls and report them as not pressed.
- Preserve toggling for layers that loaded successfully.
- Make the behavior test stub return only actual layers.
- Cover marker-image failure and mixed available/unavailable controls.
- Protect the implementation, regression, documentation, and completed plan.

## Verification

- `node --check map-script.js`
- `node --check scripts/test-map-behavior.js`
- `node scripts/test-map-behavior.js`
- `make lint`
- `make test`
- `make build`
- `make verify`
- `make check`
- `git diff --check`

## Work Completed

- Layer controls derive their initial active, disabled, and pressed state from
  the corresponding Mapbox layer.
- The behavior stub now returns only layers that were actually added.
- Marker-image failure coverage verifies the power-line control remains active
  while missing station and tower layers are disabled and unpressed.
- Static contracts protect the implementation, exact regression assertions,
  disabled styling, documentation, and this completed plan.

## Verification Results

- `node --check map-script.js` passed.
- `node --check scripts/test-map-behavior.js` passed.
- `node --check scripts/check-map-assets.js` passed.
- `node scripts/test-map-behavior.js` passed.
- `make lint`, `make test`, `make build`, `make verify`, and `make check`
  passed on Node 20.19.5.
- Caller-independent asset validation from `/` passed.
- `make check` passed in the official Node 22 and Node 24 containers.
- All eight hostile plan, control-state, stub, regression, styling, and
  documentation mutations were rejected.
- `git diff --check` passed.
