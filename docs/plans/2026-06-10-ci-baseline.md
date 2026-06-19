# Power Line Map Viz CI Baseline

## Status: Completed

## Context

`power-line-map-viz` has a Node-backed static map asset and dataset baseline
behind `make check`. The repository needs that baseline to run in GitHub
Actions so layer inventory, token, remote asset, and accessibility guardrails
are checked before review.

## Objectives

- Run the existing `make check` wrapper in GitHub Actions.
- Keep the hosted job dependency-free beyond supported Node 22 and Node 24
  runtimes.
- Pin third-party actions to reviewed release commits, keep permissions
  read-only, and disable persisted checkout credentials.
- Make the workflow presence part of the map asset baseline contract.

## Work Completed

- Added `.github/workflows/check.yml` to run `make check` on pushes, pull
  requests, and manual dispatches.
- Added a fixed Ubuntu 24.04 matrix for Node 22 and Node 24.
- Pinned checkout v6.0.3 and setup-node v6.4.0, added cancellation and a job
  timeout, and disabled persisted checkout credentials.
- Extended `scripts/check-map-assets.js` to require the CI workflow and this
  completed plan.
- Updated README, VISION, SECURITY, and CHANGES with the CI baseline.

## Verification

- `make check`
- `node scripts/check-map-assets.js`
- `git diff --check`

## Follow-Up Candidates

- Add browser smoke coverage only after a local map-token fixture strategy is
  documented.
