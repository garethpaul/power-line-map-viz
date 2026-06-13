---
title: Hydrated GeoJSON Structure Validation
type: test
status: completed
date: 2026-06-13
---

# Hydrated GeoJSON Structure Validation

Status: Completed

## Context

The map asset checker accepts checked-in Git LFS pointers and parses hydrated
GeoJSON files. Hydrated files currently pass when they only declare a
`FeatureCollection` with a `features` array; malformed feature records,
unsupported geometry types, non-finite positions, invalid coordinate nesting,
and broken polygon rings are not rejected.

RFC 7946 defines Feature, FeatureCollection, the seven GeoJSON geometry types,
positions, and the coordinate-array structures used by each geometry. The
repository can enforce those structural contracts without downloading the
large infrastructure datasets or adding a geospatial dependency.

## Priority

Hydrated dataset corruption otherwise reaches Mapbox at runtime and may produce
partial or silent layer failures. Structural validation keeps the offline gate
useful for both lightweight LFS-pointer checkouts and maintainers working with
fully hydrated data.

## Prioritized Engineering Backlog

1. Validate hydrated FeatureCollection records, geometry types, finite
   positions, coordinate nesting, and polygon ring closure now.
2. Add isolated valid and invalid fixture coverage for every supported geometry
   family and representative feature failures.
3. Add source-specific schemas and provenance checks only after authoritative
   dataset documentation is available.

## Approach

- Extend `scripts/check-map-assets.js` with dependency-free structural helpers
  that return path-specific validation errors and traverse each parsed dataset
  once.
- Accept Feature properties as an object or `null`, geometry as a supported
  geometry object or `null`, Feature IDs as strings or numbers, and optional
  foreign members as allowed by RFC 7946.
- Validate Point, MultiPoint, LineString, MultiLineString, Polygon,
  MultiPolygon, and GeometryCollection recursively.
- Require positions to contain at least longitude and latitude as finite
  numbers. Require LineStrings to have at least two positions and polygon
  linear rings to have at least four positions with matching first and last
  positions.
- Preserve the current exact Git LFS pointer validation path unchanged.
- Add `scripts/test-geojson-validation.js`, using an isolated hard-linked
  repository copy with replaced fixture files so checked-in pointers cannot be
  modified.
- Run the new regression suite from `make test` and preserve its wiring,
  completed plan, and public contract through the existing checker.

## Implementation Units

### 1. Structural validator

Files:

- `scripts/check-map-assets.js`

Requirements:

- Produce deterministic errors that include the dataset and failing feature or
  geometry path.
- Reject malformed feature collections, features, properties, geometry types,
  coordinate arrays, non-finite numbers, undersized lines/rings, and unclosed
  rings.
- Accept all seven RFC 7946 geometry types, null feature geometries, valid
  foreign members, and the existing LFS pointers.

### 2. Isolated regression coverage

Files:

- `scripts/test-geojson-validation.js`
- `Makefile`

Requirements:

- Prove a representative valid FeatureCollection containing every supported
  geometry family passes.
- Prove malformed collections, features, properties, geometry types,
  coordinates, line cardinality, and polygon closure fail with expected
  diagnostics.
- Validate the unchanged repository baseline before running mutated fixtures.
- Break hard links before replacing a dataset fixture.

### 3. Contracts and documentation

Files:

- `scripts/check-map-assets.js`
- `README.md`
- `DATASETS.md`
- `VISION.md`
- `CHANGES.md`
- `docs/plans/2026-06-13-hydrated-geojson-validation.md`

Requirements:

- Explain that hydrated data receives structural RFC 7946 validation while LFS
  pointers remain supported.
- Preserve the new test wiring, representative mutation labels, completed plan,
  and verification evidence.
- Do not claim source provenance, freshness, semantic correctness, or live map
  rendering coverage.

## Test Scenarios

- Existing three LFS pointer files pass unchanged.
- A valid collection covers Point, MultiPoint, LineString, MultiLineString,
  Polygon, MultiPolygon, GeometryCollection, null geometry, string and numeric
  Feature IDs, and foreign members.
- The root is not a FeatureCollection or lacks a features array.
- A feature is not an object, has the wrong type, invalid properties, or an
  invalid geometry member.
- A geometry type is unsupported or lacks the required member.
- A position is undersized or contains a non-finite/non-number coordinate.
- A LineString contains fewer than two positions.
- A Polygon ring contains fewer than four positions or is not closed.
- Nested Multi* and GeometryCollection errors retain their precise path.
- A deeply nested malformed GeometryCollection reports its exact member path
  without rescanning unrelated features.

## Scope Boundaries

- Do not hydrate, rewrite, or commit the large infrastructure datasets.
- Do not enforce dataset-specific geometry types until their source contracts
  are documented.
- Do not enforce coordinate ranges, winding order, topology, self-intersection,
  or semantic accuracy beyond RFC 7946 structural shape.
- Do not change Mapbox runtime behavior, access-token handling, remote assets,
  or SRI metadata.
- Do not add npm packages, network access, or a build toolchain.

## Verification

- `node --check scripts/check-map-assets.js`
- `node --check scripts/test-geojson-validation.js`
- `node scripts/test-geojson-validation.js`
- `make lint`
- `make test`
- `make build`
- `make verify`
- `make check`
- checker execution from outside the repository working directory
- unchanged GeoJSON pointer blob hashes against the base commit
- `git diff --check`

## References

- RFC 7946, The GeoJSON Format: https://www.rfc-editor.org/rfc/rfc7946
- `scripts/check-map-assets.js`
- `DATASETS.md`
- `docs/plans/2026-06-08-dataset-inventory-baseline.md`

## Work Completed

- Added single-pass structural validation for hydrated FeatureCollections,
  Features, IDs, properties, null geometries, all seven RFC 7946 geometry
  types, finite positions, coordinate nesting, line cardinality, and closed
  polygon rings.
- Preserved the existing exact Git LFS pointer validation path and all three
  checked-in pointer blobs.
- Added an isolated hard-linked fixture suite with one valid collection
  covering every geometry family and 15 malformed dataset cases.
- Made the fixture suite validate the clean repository first and unlink each
  pointer before replacing it, preventing accidental mutation of checked-in
  data.
- Wired the suite into `make test` and protected the implementation, test
  labels, Makefile wiring, completed plan, and documentation through the
  repository checker.
- Updated README, DATASETS, VISION, and CHANGES without claiming provenance,
  freshness, topology, semantic accuracy, or live map coverage.

## Verification Results

- `node --check` passed for the checker, GeoJSON fixture suite, and existing
  browser behavior suite on Node 20.19.5.
- `node scripts/test-geojson-validation.js` passed the valid fixture and all 15
  malformed cases.
- `make lint`, `make test`, `make build`, `make verify`, and `make check`
  passed.
- Checker execution from `/` passed.
- The base and current GeoJSON Git-tree aggregate SHA-256 values both equal
  `e627341a595756c5292cc7662b8d9d327555ec20344884f2638cd67fe6d8919e`.
- Plan-aware review found one test-completeness gap; missing Feature geometry,
  missing GeometryCollection members, and short polygon ring regressions were
  added, after which no actionable findings remained.
- Browser automation was not applicable to this offline validation-only change;
  `agent-browser` was unavailable and the existing VM map behavior suite passed.
- `git diff --check` passed.
