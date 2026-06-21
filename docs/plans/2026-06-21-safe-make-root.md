# Safe Makefile Root Resolution

Status: Completed

## Context

Caller-controlled `MAKEFILE_LIST` redirected dependency-free map validation
outside the reviewed checkout despite the protected `REPO_ROOT` assignment.

## Scope Boundaries

- Do not change map behavior, datasets, GeoJSON validation, or Mapbox SRI pins.
- Preserve dependency-free Node 22 and Node 24 validation.
- Do not contact Mapbox or require a production access token.

## Work Completed

- Reject command-line and environment replacement of `MAKEFILE_LIST`.
- Reject invocations that load another makefile before the repository Makefile.
- Canonicalize the checked-in Makefile directory through quoted POSIX tools.
- Add coverage for all five pre-existing public Make targets plus the root regression gate.
- Include the root policy in `make verify` and `make check`.

## Verification Completed

- Node 22.22.2 and Node 24.16.0 passed the complete map asset, GeoJSON,
  browser-behavior, and Mapbox integrity suites.
- All 18 target and `REPO_ROOT` override cases passed from a checkout path with
  spaces and an apostrophe.
- Command-line and environment `MAKEFILE_LIST` overrides failed closed.
- Additional makefiles fail closed instead of producing an empty or attacker-shaped root.
- Map source, datasets, images, and remote-resource integrity values were unchanged.
