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
no-token browser fallback behavior, dataset inventory coverage, and canonical
`docs/plans` coverage.

The current focus is:

Priority:

- Preserve the local GeoJSON layer structure
- Keep layer toggles and power-line animation easy to understand
- Maintain `make check` and `make verify` as the local map asset and data-reference gates
- Keep GeoJSON filenames, Mapbox layer IDs, toggles, and dataset inventory rows aligned
- Keep checked-in image marker assets inventoried by referenced or unused status
- Keep completed maintenance plans under `docs/plans`
- Avoid committing real Mapbox access tokens
- Keep no-token local browsing explicit instead of silently blank
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
