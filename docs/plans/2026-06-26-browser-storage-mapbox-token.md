---
title: "fix: Keep local Mapbox tokens out of tracked source"
type: fix
date: 2026-06-26
status: completed
---

# fix: Keep local Mapbox tokens out of tracked source

## Context

The README told maintainers to edit the tracked `mapboxAccessToken` literal and
remember to erase it before verification or commit. That workflow makes an
account-specific token leak depend on perfect manual cleanup.

## Decision

Read `powerLineMapboxAccessToken` from same-origin browser storage, trim it,
and keep the existing no-token warning when the value is missing or storage
access fails. No token value is written to logs, DOM text, or tracked files.

## Alternatives

- Gitignored local script: rejected because an optional missing script creates
  a noisy load failure and another file-copy step for a one-value setup.
- URL query or fragment: rejected because tokens can persist in copied URLs,
  history, diagnostics, or surrounding tooling.
- Tracked empty config file: rejected because ignored patterns do not protect a
  file after it is tracked.

## Verification Completed

- The stored-token regression failed before implementation because no map was
  initialized, then passed with a trimmed token.
- The storage-denial regression failed with an uncaught error before the
  fail-closed catch, then passed with the accessible warning.
- All Make gates, the external-directory gate, and `git diff --check` passed.
- Isolated literal-token and valid catch-rethrow mutations were rejected.

## Boundary

Tests use a dependency-free browser harness. No live Mapbox token, network
request, WebGL rendering, or browser persistence behavior is claimed.
