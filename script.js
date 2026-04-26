// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
  createMarkers,
  createMarkerClusterGroup
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
const settlementClusterGroup = createMarkerClusterGroup();

// Add Campsites and Settlements
settlementsData.forEach(({ data, checkboxId, campsite, clusterScope }) => {
  const clusterGroup = clusterScope === 'sharedSettlementCluster'
    ? settlementClusterGroup
    : createMarkerClusterGroup();

  createMarkers(data, campsite, clusterGroup).then(({ markers, clusterGroup }) => {
  MarkerListeners(checkboxId, { markers, clusterGroup }, map);
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

// Add "All" Checkboxes
const checkboxMappings = {
  allItemCheckbox: "#itemsSection input.itemCheckbox",
  allBattleCheckbox: "#battlesSection input.battleCheckbox",
  allGeographyCheckbox: "#geographySection input.geographyCheckbox",
  allSettlementCheckbox: "#settlementsSection input.settlementCheckbox",
  allPathCheckbox: "#pathsSection input.pathCheckbox",
  allCampCheckbox: "#campsSection input.campCheckbox",
  allRegionCheckbox: "#regionsSection input.regionCheckbox",
};
Object.keys(checkboxMappings).forEach(masterCheckboxId => {
  document.getElementById(masterCheckboxId).addEventListener("change", function () {
    document.querySelectorAll(checkboxMappings[masterCheckboxId]).forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change")); // Ensures MarkerListeners function runs
    });
  });
});
