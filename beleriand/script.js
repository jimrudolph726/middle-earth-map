// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
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
  zoom: 15, // Fractional zoom level
  center: [0, 0],
  zoomSnap: 1, // Allows fractional zoom levels
  zoomDelta: 5, // Controls the increment of zoom changes
  preferCanvas: true
});
map.options.wheelPxPerZoomLevel = 40; 

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/beleriand/assets/beleriand.png';
const imageBounds = [[44.94393060,-93.30248833],[44.937485956,-93.290119813],];
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
createGeographicShape(pathdata).then((polygons) => {
  PathListeners(polygons, map);
  });

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  createGeographicShape(data).then((polygons) => {
  MarkerListeners(checkboxId, polygons, map);
  });
});

document.getElementById("allGeographyCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#geographySection input.geographyCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});