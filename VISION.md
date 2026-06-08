## Power Line Map Viz Vision

Power Line Map Viz is a browser-based Mapbox GL visualization for power lines,
power stations, and cell towers using local GeoJSON layers and custom marker
images.

The repository is useful as a focused map prototype: it demonstrates layer
loading, toggles, animated line styling, and infrastructure-oriented map
overlays.

The goal is to keep the visualization inspectable and reproducible while making
token, data-source, and layer assumptions explicit.

The current focus is:

Priority:

- Preserve the local GeoJSON layer structure
- Keep layer toggles and power-line animation easy to understand
- Maintain `make verify` as the local map asset and data-reference gate
- Avoid committing real Mapbox access tokens
- Keep no-token local browsing explicit instead of silently blank
- Make infrastructure data provenance visible

Next priorities:

- Add README setup notes for Mapbox token configuration
- Document the source and freshness of each GeoJSON dataset
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
