# Dataset Inventory

This repository stores infrastructure map layers as local GeoJSON files or Git
LFS pointer files. Treat the checked-in data as prototype evidence, not as a
fresh or authoritative public-safety source.

Source status: unknown. The original source URLs, collection methods, license
terms, and refresh dates are not recorded in this repository yet.

| File | Map layer | Checked-in state | Current known size | Handling rule |
| --- | --- | --- | --- | --- |
| geojson/power_lines.geojson | `power_lines` | Git LFS pointer | 128064384 bytes | Document source URL, license, and refresh date before replacing or refreshing. |
| geojson/power_stations.geojson | `power_stations` | Git LFS pointer | 45409768 bytes | Document source URL, license, and refresh date before replacing or refreshing. |
| geojson/cell_towers.geojson | `cell_towers` | Git LFS pointer | 11496172 bytes | Document source URL, license, and refresh date before replacing or refreshing. |

## Image Asset Inventory

| File | Map usage | Handling rule |
| --- | --- | --- |
| images/cali.png | Checked-in unused image | Document the intended map layer or remove it before adding more unused imagery. |
| images/cell-towers.png | Referenced marker image | Keep aligned with the `cell_towers` layer and avoid replacing without source notes. |
| images/gas-stations.png | Checked-in unused image | Document the intended map layer or remove it before adding more unused imagery. |
| images/grocery-store.png | Checked-in unused image | Document the intended map layer or remove it before adding more unused imagery. |
| images/hospital.png | Checked-in unused image | Document the intended map layer or remove it before adding more unused imagery. |
| images/power-stations.png | Referenced marker image | Keep aligned with the `power_stations` layer and avoid replacing without source notes. |
| images/shelters.png | Checked-in unused image | Document the intended map layer or remove it before adding more unused imagery. |

## Maintenance Rules

- Keep private infrastructure data out of this repository.
- Hydrated files must remain structurally valid RFC 7946 FeatureCollections;
  the offline gate validates features, supported geometries, finite positions,
  coordinate nesting, and closed polygon rings without claiming semantic
  accuracy.
- Do not treat these layers as operational, emergency, or compliance-grade
  data until source and freshness are documented.
- Record source URL, license or permission basis, collection date, refresh
  date, and transformation notes before committing refreshed datasets.
- Keep image marker assets inventoried as referenced or checked-in unused before
  adding new map layers.
- Keep Mapbox access tokens out of the repository; use local configuration for
  manual rendering.
