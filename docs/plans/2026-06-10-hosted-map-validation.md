# Hosted Map Validation

Status: Completed

## Context

The dependency-free map validator covered local assets, remote allowlists,
GeoJSON shape, LFS pointers, layer/toggle alignment, dataset inventory, token
state, and accessibility, but pushes and pull requests did not run it. Direct
script invocation also depended on the caller's working directory.

## Work Completed

- Anchored `scripts/check-map-assets.js` to the repository before reading map,
  image, dataset, or plan files.
- Added a fixed-runner GitHub Actions matrix for Node 22 and Node 24 without a
  dependency installation step.
- Limited the workflow token to read-only contents access and pinned checkout
  and Node setup actions to reviewed release commits, with checkout credential
  persistence disabled.
- Extended the map validator to preserve the workflow permissions, action pins,
  runtime matrix, canonical command, no-install boundary, and completed plan.

## Verification

- `node scripts/check-map-assets.js`
- `(cd / && node /path/to/scripts/check-map-assets.js)`
- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
