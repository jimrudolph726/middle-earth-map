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
  geographicData,
  imageUrl,
  map,
  imageBounds,
} from './variables.js';

// Add Map
map.options.wheelPxPerZoomLevel = 40; 
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

document.getElementById("allItemCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#itemsSection input.itemCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});
document.getElementById("allBattleCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#battlesSection input.battleCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});
document.getElementById("allGeographyCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#geographySection input.geographyCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});
document.getElementById("allSettlementCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#settlementsSection input.settlementCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});
document.getElementById("allPathCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#pathsSection input.pathCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});
document.getElementById("allCampCheckbox").addEventListener("change", function () {
  let itemCheckboxes = document.querySelectorAll("#campsSection input.campCheckbox");

  itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
  });
});