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
- Avoid committing real Mapbox access tokens
- Make infrastructure data provenance visible

Next priorities:

- Fix the HTML script reference so it loads the checked-in map script
- Add README setup notes for Mapbox token configuration
- Document the source and freshness of each GeoJSON dataset
- Add a no-token local-development fallback or clear failure message

Contribution rules:

- One PR = one focused layer, style, data, token, or documentation change.
- Do not commit access tokens or private infrastructure data.
- Keep data refreshes separate from UI changes.
- Include a screenshot or manual verification note for visual changes.

## Security And Responsible Use

Infrastructure maps can expose sensitive operational context. Data sources,
refresh dates, and public availability should be documented before adding or
updating layers.

## What We Will Not Merge (For Now)

- Private infrastructure datasets
- Checked-in Mapbox tokens
- Silent external data fetches
- Visual rewrites that obscure layer provenance
