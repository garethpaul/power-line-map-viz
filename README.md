# power-line-map-viz

<!-- README-OVERVIEW-IMAGE -->
![Project overview](docs/readme-overview.svg)

## Overview

`garethpaul/power-line-map-viz` is a static web project. Visualize Power Lines

This README is based on the checked-in source, manifests, scripts, and repository metadata on the `master` branch. The project language mix found during review was: JavaScript (1).

## Repository Contents

- `SECURITY.md` - security reporting and disclosure guidance
- `CHANGES.md` - notable maintenance changes
- `Makefile` - local verification entry points
- `geojson` - local infrastructure datasets, stored as GeoJSON or Git LFS pointers
- `images` - marker and map image assets
- `plans` - completed maintenance plans
- `scripts` - deterministic map asset validation checks
- `VISION.md` - project direction and maintenance guardrails

Additional scan context:

- Source directories: geojson, images, scripts
- Dependency and build manifests: Makefile
- Entry points or build surfaces: index.html, map-script.js, Makefile
- Test-looking files: scripts/check-map-assets.js

## Getting Started

### Prerequisites

- Git
- Node.js and `make`
- Git LFS if you need hydrated GeoJSON data instead of pointer files

### Setup

```bash
git clone https://github.com/garethpaul/power-line-map-viz.git
cd power-line-map-viz
```

The setup commands above are derived from repository files. Legacy mobile, Python, or JavaScript samples may require older SDKs or package versions than a modern workstation uses by default.

## Running or Using the Project

- Open `index.html` in a browser or serve the directory with a static file server.
- The checked-in page shows a browser warning until a Mapbox token is configured.
- Set a local Mapbox access token in `map-script.js` for manual map rendering, then reset it to an empty string before running verification or committing.

## Testing and Verification

- Run `make check` or `make verify` before committing map asset, GeoJSON, or HTML script changes.
- The verification gate checks local script/style references, marker and GeoJSON references, empty Mapbox token state, the no-token browser fallback, and either hydrated GeoJSON shape or valid Git LFS pointer metadata.

When the required SDK or runtime is unavailable, use static checks and source review first, then verify on a machine that has the matching platform toolchain.

## Configuration and Secrets

- Detected references to Mapbox. Keep API keys, OAuth credentials, tokens, and account-specific values in local configuration only.

## Security and Privacy Notes

- Review changes touching external API calls or credential-adjacent configuration; examples from the scan include map-script.js.
- Review changes touching network requests, sockets, or service endpoints; examples from the scan include index.html.
- Review changes touching file, media, JSON, XML, CSV, OCR, or data parsing; examples from the scan include map-script.js.

## Maintenance Notes

- See `SECURITY.md` for vulnerability reporting and safe research guidance.
- See `VISION.md` for project direction and contribution guardrails.

## Contributing

Keep changes small and tied to the project that is already present in this repository. For code changes, document the toolchain used, avoid committing generated dependency directories or local configuration, and update this README when setup or verification steps change.
