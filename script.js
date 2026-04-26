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
let settlementClusterGroup = null;

// Add Campsites and Settlements
Promise.all(
  settlementsData.map(({ data, checkboxId, campsite, clusterScope }) =>
    createMarkers(data, campsite).then(({ markers }) => ({
      checkboxId,
      campsite,
      clusterScope,
      markers,
    }))
  )
).then((markerEntries) => {
  const sharedClusterEntries = markerEntries.filter(
    ({ clusterScope }) => clusterScope === 'sharedSettlementCluster'
  );

  const categoryClusterEntries = markerEntries.filter(
    ({ clusterScope }) => clusterScope !== 'sharedSettlementCluster'
  );

  const syncSharedSettlementCluster = () => {
    const activeMarkers = [];

    sharedClusterEntries.forEach(({ checkboxId, markers }) => {
      const checkbox = document.getElementById(checkboxId);

      if (!checkbox?.checked) {
        return;
      }

      Object.values(markers).forEach((marker) => {
        activeMarkers.push(marker);
      });
    });

    if (settlementClusterGroup && map.hasLayer(settlementClusterGroup)) {
      map.removeLayer(settlementClusterGroup);
    }

    if (activeMarkers.length === 0) {
      settlementClusterGroup = null;
      return;
    }

    settlementClusterGroup = createMarkerClusterGroup({
      // This map uses a custom image overlay, so a larger radius helps nearby
      // settlement categories merge into one cluster instead of only same-group markers.
      maxClusterRadius: 500,
    });

    settlementClusterGroup.addLayers(activeMarkers);
    settlementClusterGroup.refreshClusters();
    map.addLayer(settlementClusterGroup);
  };

  sharedClusterEntries.forEach(({ checkboxId }) => {
    const checkbox = document.getElementById(checkboxId);
    checkbox?.addEventListener('change', syncSharedSettlementCluster);
  });

  syncSharedSettlementCluster();

  categoryClusterEntries.forEach(({ checkboxId, markers }) => {
    const clusterGroup = createMarkerClusterGroup();

    Object.values(markers).forEach((marker) => {
      clusterGroup.addLayer(marker);
    });

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
