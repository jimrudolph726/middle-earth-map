Vendored browser dependencies served locally by the atlas.

- `MarkerCluster.css`
  Source: `https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css`
- `MarkerCluster.Default.css`
  Source: `https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css`
- `leaflet.markercluster.js`
  Source: `https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js`
- `click-tolerance.js`
  Source: existing local plugin copy retained as the shared canonical file.
- `d3.v7.min.js`
  Source: `https://d3js.org/d3.v7.min.js`
  Version banner in file: `7.9.0`
- `elk.bundled.js`
  Source: `https://cdn.jsdelivr.net/npm/elkjs/lib/elk.bundled.js`

These files are intentionally checked into the repo so the static site does not depend on those CDNs at runtime.
