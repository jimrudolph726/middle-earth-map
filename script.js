// script.js

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
  geographicData
} from './variables.js';

// Add Map
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: 15,
  maxZoom: 20,
  zoom: 15.5, // Fractional zoom level
  center: [0, 0],
  zoomSnap: 0.1, // Allows fractional zoom levels
  zoomDelta: 2, // Controls the increment of zoom changes
  preferCanvas: true
});


const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/middle-earth.png';
const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

var sidebar = L.control.sidebar('sidebar').addTo(map);

// Add Campsites and Settlements
markersData.forEach(({ data, checkboxId, campsite }) => {
  createMarkers(data, campsite).then((markers) => {
  MarkerListeners(checkboxId, markers, map);
  });
});

// Add Paths
  createPolyline(pathdata).then((polylines) => {
  PathListeners(polylines, map);
  });

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  createPolygon(data).then((polygons) => {
  MarkerListeners(checkboxId, polygons, map);
  });
});