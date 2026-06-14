# Make Map Validation Location Independent

Status: Completed

## Context

The Make recipes invoke dependency-free Node validators in the caller's
current directory. Running the repository Makefile through an absolute path
from another directory therefore cannot find the checked-in scripts or map
assets and does not reproduce the repository gate.

## Objectives

- Resolve the repository root from the loaded Makefile, independent of the
  caller's current directory.
- Run each executable lint and test recipe from that resolved root.
- Protect the root derivation and every rooted recipe with dependency-free,
  mutation-sensitive static contracts.
- Preserve all current map, GeoJSON, remote-asset, accessibility, and browser
  behavior validation.

## Scope Boundaries

- Do not change map behavior, data, images, HTML, styles, remote assets,
  dependencies, or hosted workflow coverage.
- Do not add package tooling, generated files, browser automation, or network
  requirements.

## Verification

- every Make alias, including `make check`, from the repository root on Node 22
  and Node 24
- `make -f /path/to/Makefile check` from an unrelated directory, including an
  attempted command-line repository-root override
- hostile mutations covering root derivation and every rooted recipe
- exact-base map, GeoJSON, image, HTML, style, remote-asset, dependency, and
  workflow preservation scans
- `git diff --check` plus secret, captured-prompt, and generated-artifact scans

## Work Completed

- Added an override-protected absolute repository root to the Makefile.
- Prefixed the lint and both test recipes with a change to that root.
- Extended the map asset checker with exact Make and completed-plan contracts.

## Verification Results

- Node 22.22.2 and Node 24.16.0 passed every Make alias from both the repository
  root and an unrelated directory, including full `make check` runs with
  `REPO_ROOT=/tmp` supplied on the command line.
- Four hostile mutations rejected removal of override protection and each
  rooted Node recipe.
- Exact-base checks preserved the map source, GeoJSON, images, HTML, styles,
  dataset inventory, remote-asset contracts, dependencies, and workflow.
- `git diff --check` plus the secret, captured-prompt, and generated-artifact
  scans passed.
