## Power Line Map Viz Vision

Power Line Map Viz is a browser-based Mapbox GL visualization for power lines,
power stations, and cell towers using local GeoJSON layers and custom marker
images.

The repository is useful as a focused map prototype: it demonstrates layer
loading, toggles, animated line styling, and infrastructure-oriented map
overlays.

The goal is to keep the visualization inspectable and reproducible while making
token, data-source, and layer assumptions explicit.

Current baseline: `make check` verifies local asset references, layer inventory
consistency, GeoJSON or Git LFS pointer shape, empty Mapbox token state,
no-token browser fallback behavior, browser remote asset allowlisting, dataset
inventory coverage, layer toggle accessibility, and canonical `docs/plans`
coverage.

The current focus is:

Priority:

- Preserve the local GeoJSON layer structure
- Keep layer toggles and power-line animation easy to understand
- Maintain `make check`, `make verify`, and `make build` as the local map asset
  and data-reference gates
- Keep GitHub Actions running the Node-backed `make check` baseline before
  review on maintained Node 22 and Node 24 runtimes
- Run the dependency-free map contracts on Node 22 and Node 24 in hosted CI
  with read-only permissions and pinned actions
- Keep map validation independent of the caller's working directory
- Keep dependency-free executable coverage for token warnings, layer toggles,
  and reduced-motion behavior
- Keep GeoJSON filenames, Mapbox layer IDs, toggles, and dataset inventory rows aligned
- Keep checked-in image marker assets inventoried by referenced or unused status
- Keep completed maintenance plans under `docs/plans`
- Keep the browser page title aligned with the Power Line Map purpose
- Keep intentional remote browser assets allowlisted and explicit
- Bind pinned Mapbox JavaScript and CSS to reviewed Subresource Integrity hashes
- Avoid committing real Mapbox access tokens
- Keep no-token local browsing explicit instead of silently blank
- Keep the no-token warning accessible as a status live region
- Keep browser zoom available for the static map page
- Keep the static map page language declared for accessibility tooling
- Keep the primary map container exposed as a labelled region
- Keep layer toggles labelled and expose visible/hidden state to assistive
  tooling
- Keep controls for unavailable map layers disabled and accurately unpressed
- Keep power-line animation disabled when the browser requests reduced motion
- Make infrastructure data provenance visible
- Maintain `DATASETS.md` before adding or refreshing infrastructure layers

Next priorities:

- Add README setup notes for Mapbox token configuration
- Replace unknown dataset source/freshness notes with concrete source URLs,
  licenses, and refresh dates
- Add a small fixture GeoJSON layer for local demos without Git LFS

Contribution rules:

- One PR = one focused layer, style, data, token, or documentation change.
- Do not commit access tokens or private infrastructure data.
- Keep data refreshes separate from UI changes.
- Include a screenshot or manual verification note for visual changes.
- Keep `.github/workflows/check.yml` aligned with the dependency-free map asset
  validator.

## Security And Responsible Use

Canonical security policy and reporting:

- [`SECURITY.md`](SECURITY.md)

Infrastructure maps can expose sensitive operational context. Data sources,
refresh dates, and public availability should be documented before adding or
updating layers.

## What We Will Not Merge (For Now)

- Private infrastructure datasets
- Checked-in Mapbox tokens
- Silent external data fetches
- Visual rewrites that obscure layer provenance

This list is a roadmap guardrail, not a permanent rule.
Strong user demand and strong technical rationale can change it.
