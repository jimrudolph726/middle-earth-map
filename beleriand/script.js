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

// Add Mapd
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: 15,
  maxZoom: 20,
  zoom: 15,
  center: [0, 0],
});

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/beleriand/assets/beleriand.png';
const imageBounds = [[44.953738818,-93.332723306],[44.938367334,-93.303071917],];
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
createPolyline(pathdata).then((polylines) => {PathListeners(polylines, map);});

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  createPolygon(data).then((polygons) => {
  MarkerListeners(checkboxId, polygons, map);
  });
});