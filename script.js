// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
  createMarkers,
  createMarkerClusterGroup,
  buildMarkers
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
const sharedClusterGroups = {};

// Add Campsites and Settlements
Promise.all(
  settlementsData.map(({ data, checkboxId, campsite, clusterScope }) => ({
    checkboxId,
    campsite,
    clusterScope,
    data,
  }))
).then((markerEntries) => {
  const sharedClusterEntries = markerEntries.filter(
    ({ clusterScope }) => clusterScope === 'sharedSettlementCluster' || clusterScope === 'sharedCampsiteCluster'
  );

  const categoryClusterEntries = markerEntries.filter(
    ({ clusterScope }) => clusterScope !== 'sharedSettlementCluster' && clusterScope !== 'sharedCampsiteCluster'
  );

  const sharedClusterConfig = {
    sharedSettlementCluster: {
      maxClusterRadius: 50,
    },
    sharedCampsiteCluster: {
      maxClusterRadius: 50,
    },
  };

  const syncSharedCluster = (clusterScope) => {
    const activeMarkers = [];
    const entries = sharedClusterEntries.filter((entry) => entry.clusterScope === clusterScope);

    entries.forEach(({ checkboxId, data, campsite }) => {
      const checkbox = document.getElementById(checkboxId);

      if (!checkbox?.checked) {
        return;
      }

      const markers = buildMarkers(data, campsite);

      Object.values(markers).forEach((marker) => {
        activeMarkers.push(marker);
      });
    });

    if (sharedClusterGroups[clusterScope]) {
      if (map.hasLayer(sharedClusterGroups[clusterScope])) {
        map.removeLayer(sharedClusterGroups[clusterScope]);
      }

      sharedClusterGroups[clusterScope].clearLayers();
    }

    if (activeMarkers.length === 0) {
      sharedClusterGroups[clusterScope] = null;
      return;
    }

    sharedClusterGroups[clusterScope] = createMarkerClusterGroup(sharedClusterConfig[clusterScope]);

    sharedClusterGroups[clusterScope].addLayers(activeMarkers);
    map.addLayer(sharedClusterGroups[clusterScope]);
  };

  sharedClusterEntries.forEach(({ checkboxId, clusterScope }) => {
    const checkbox = document.getElementById(checkboxId);
    checkbox?.addEventListener('change', () => syncSharedCluster(clusterScope));
  });

  Object.keys(sharedClusterConfig).forEach((clusterScope) => {
    syncSharedCluster(clusterScope);
  });

  categoryClusterEntries.forEach(({ checkboxId, data, campsite }) => {
    const clusterGroup = createMarkerClusterGroup();

    createMarkers(data, campsite, clusterGroup).then(({ markers, clusterGroup }) => {
      MarkerListeners(checkboxId, { markers, clusterGroup }, map);
    });
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
