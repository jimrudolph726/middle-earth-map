// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
  createMarkers
} from './functions.js';

import {
  settlementsData,
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
  zoomSnap: 1, // Allows fractional zoom levels
  zoomDelta: 5, // Controls the increment of zoom changes
  preferCanvas: true
});
map.options.wheelPxPerZoomLevel = 40; 

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/middle-earth.png';
const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

var sidebar = L.control.sidebar('sidebar').addTo(map);

// Add Campsites and Settlements
settlementsData.forEach(({ data, checkboxId, campsite }) => {
  createMarkers(data, campsite).then((markers) => {
  MarkerListeners(checkboxId, markers, map);
  });
});

// Add Paths
createGeographicShape(pathdata).then((polygons) => {
  PathListeners(polygons, map);
  });

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  createGeographicShape(data).then((polygons) => {
  MarkerListeners(checkboxId, polygons, map);
  });
});
