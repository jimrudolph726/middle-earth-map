// script.js
import 'leaflet.almostover'; // Then import the plugin (no need to assign)

// ... rest of your script.js ...
import {
  PathListeners,
  createPolyline,
  MarkerListeners,
  createPolygon,
  createMarkers
} from './functions.js';

import {
  markersData,
  pathdata,
  riverData,
  geographicData
} from './variables.js';

// Initialize Map
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: 15,
  maxZoom: 20,
  zoom: 15.5,
  center: [0, 0],
  zoomSnap: 0.1,
  zoomDelta: 2,
});

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/middle-earth.png';
const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

var sidebar = L.control.sidebar('sidebar').addTo(map);

// Initialize almostOver plugin
map.almostOver = new L.AlmostOver();

// Add Campsites and Settlements
markersData.forEach(({ data, checkboxId, campsite }) => {
  createMarkers(data, campsite).then((markers) => {
    MarkerListeners(checkboxId, markers, map);
  });
});

// Add Paths and Rivers
createPolyline(pathdata).then((polylines) => {
  PathListeners(polylines, map);

  for (const key in polylines) {
    map.almostOver.addLayer(polylines[key]);
  }
});

// Add Geographic Features (polygons)
geographicData.forEach(({ data, checkboxId }) => {
  createPolygon(data).then((polygons) => {
    MarkerListeners(checkboxId, polygons, map);
    for (const key in polygons) {
      map.almostOver.addLayer(polygons[key]);  // If you want almostOver for polygons
    }
  });
});

// Add Rivers
riverData.forEach(({ data, checkboxId }) => {
  createPolyline(data).then((polylines) => {
    MarkerListeners(checkboxId, polylines, map);

    for (const key in polylines) {
      map.almostOver.addLayer(polylines[key]);
    }
  });
});

// almost:over event listener (for polylines only)
map.on('almost:over', function (e) {
  if (e.layer instanceof L.Polyline) {
    console.log('Almost over polyline:', e.layer);
    e.layer.setStyle({ color: 'red', weight: 4 });

    map.on('almost:out', function(outEvent) {
      if (outEvent.layer === e.layer) {
        outEvent.layer.setStyle({color: e.layer.options.color, weight: 2})
      }
    })
  }
});

// almost:click event listener (for polylines only)
map.on('almost:click', function (e) {
  if (e.layer instanceof L.Polyline) {
    console.log('Almost clicked polyline:', e.layer);
    e.layer.fire('click'); // Fire the original click event
  }
});