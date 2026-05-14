// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
  createMarkers,
  createMarkerClusterGroup,
  buildMarkers,
  setCampsiteHoverPopupsEnabled,
} from './functions.js';

import {
  settlementsData,
  pathData,
  roadData,
  geographicData,
  baseTileUrl,
  baseTileOptions,
  map,
  imageBounds,
} from './variables.js';

import {
  initializeStoryMode,
} from './stories.js';

// Add Map
map.options.wheelPxPerZoomLevel = 40; 
L.tileLayer(baseTileUrl, baseTileOptions).addTo(map);
map.fitBounds(imageBounds);
var sidebar = L.control.sidebar('sidebar').addTo(map);
initializeStoryMode({ sidebar });
const sharedClusterGroups = {};

// Add Campsites, Settlements, Items and Clustering
Promise.all(
  settlementsData.map(({ data, checkboxId, groupName, campsite, clusterScope }) => ({
    checkboxId,
    groupName,
    campsite,
    clusterScope,
    data,
  }))
).then((markerEntries) => {
  const sharedClusterEntries = markerEntries.filter(
    ({ clusterScope }) =>
      clusterScope === 'sharedSettlementCluster' ||
      clusterScope === 'sharedCampsiteCluster' ||
      clusterScope === 'sharedItemCluster' ||
      clusterScope === 'sharedBattleCluster' ||
      clusterScope === 'sharedProvisionCluster'
  );

  const categoryClusterEntries = markerEntries.filter(
    ({ clusterScope }) =>
      clusterScope !== 'sharedSettlementCluster' &&
      clusterScope !== 'sharedCampsiteCluster' &&
      clusterScope !== 'sharedItemCluster' &&
      clusterScope !== 'sharedBattleCluster' &&
      clusterScope !== 'sharedProvisionCluster'
  );

  const sharedClusterConfig = {
    sharedSettlementCluster: {
      maxClusterRadius: 50,
    },
    sharedCampsiteCluster: {
      maxClusterRadius: 50,
    },
    sharedItemCluster: {
      maxClusterRadius: 25,
    },
    sharedBattleCluster: {
      maxClusterRadius: 25,
    },
    sharedProvisionCluster: {
      maxClusterRadius: 25,
    },
  };

  const syncSharedCluster = (clusterScope) => {
    const activeMarkers = [];
    const entries = sharedClusterEntries.filter((entry) => entry.clusterScope === clusterScope);

    entries.forEach(({ checkboxId, groupName, data, campsite }) => {
      const checkbox = document.getElementById(checkboxId);

      if (!checkbox?.checked) {
        return;
      }

      const markers = buildMarkers(data, campsite, groupName);

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

  categoryClusterEntries.forEach(({ checkboxId, groupName, data, campsite }) => {
    const clusterGroup = createMarkerClusterGroup();

    createMarkers(data, campsite, clusterGroup, groupName).then(({ markers, clusterGroup }) => {
      MarkerListeners(checkboxId, { markers, clusterGroup }, map);
    });
  });
});
 
// Add Paths and Roads
[pathData, roadData].forEach((data) => {
  createGeographicShape(data).then((polygons) => {
    PathListeners(polygons, map);
  });
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
  allRoadCheckbox: "#roadsSection input.roadCheckbox",
  allProvisionCheckbox: "#provisionsSection input.provisionCheckbox",
  allCreaturesAndBeingsCheckbox: "#creatures_and_beingsSection input.creatures_and_beingCheckbox",
};
Object.keys(checkboxMappings).forEach(masterCheckboxId => {
  const masterCheckbox = document.getElementById(masterCheckboxId);

  if (!masterCheckbox) {
    return;
  }

  masterCheckbox.addEventListener("change", function () {
    document.querySelectorAll(checkboxMappings[masterCheckboxId]).forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change")); // Ensures MarkerListeners function runs
    });
  });
});
