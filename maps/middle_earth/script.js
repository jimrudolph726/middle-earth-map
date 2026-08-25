// script.js

import {
  LazyLayerListeners,
  LazyShapeGroupListeners,
  MarkerListeners,
  createMarkerClusterGroup,
  getMarkerGroupFromRegistry,
  getOrBuildMarkers,
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
import {
  initializeAtlasFrontispiece,
} from './frontispiece.js';

// Add Map
map.options.wheelPxPerZoomLevel = 40; 
L.tileLayer(baseTileUrl, baseTileOptions).addTo(map);
map.fitBounds(imageBounds);
var sidebar = L.control.sidebar('sidebar').addTo(map);
initializeStoryMode({ sidebar });
initializeAtlasFrontispiece({ sidebar });
const sharedClusterGroups = {};

// Add Campsites, Settlements, Items and Clustering
const markerEntries = settlementsData.map(({ data, checkboxId, groupName, campsite, clusterScope }) => ({
  checkboxId,
  groupName,
  campsite,
  clusterScope,
  data,
}));

const sharedAtlasMarkerClusterScope = 'sharedAtlasMarkerCluster';
const sharedClusterEntries = markerEntries.filter(
  ({ clusterScope }) => clusterScope === sharedAtlasMarkerClusterScope
);

const categoryClusterEntries = markerEntries.filter(
  ({ clusterScope }) => clusterScope !== sharedAtlasMarkerClusterScope
);

const sharedClusterConfig = {
  [sharedAtlasMarkerClusterScope]: {
    maxClusterRadius: 40,
  },
};

const getSharedClusterGroup = (clusterScope) => {
  if (!sharedClusterGroups[clusterScope]) {
    sharedClusterGroups[clusterScope] = createMarkerClusterGroup(sharedClusterConfig[clusterScope]);
  }

  return sharedClusterGroups[clusterScope];
};

const syncSharedCluster = (clusterScope) => {
  const clusterGroup = getSharedClusterGroup(clusterScope);
  const entries = sharedClusterEntries.filter((entry) => entry.clusterScope === clusterScope);
  let changed = false;

  entries.forEach(({ checkboxId, groupName, data, campsite }) => {
    const checkbox = document.getElementById(checkboxId);

    if (!checkbox) {
      return;
    }

    const markers = checkbox.checked
      ? getOrBuildMarkers(data, campsite, groupName)
      : getMarkerGroupFromRegistry(groupName);

    if (!markers) {
      return;
    }

    Object.values(markers).forEach((marker) => {
      const markerIsClustered = clusterGroup.hasLayer(marker);

      if (checkbox.checked && !markerIsClustered) {
        clusterGroup.addLayer(marker);
        changed = true;
      }

      if (!checkbox.checked && markerIsClustered) {
        clusterGroup.removeLayer(marker);
        changed = true;
      }
    });
  });

  if (clusterGroup.getLayers().length > 0) {
    if (!map.hasLayer(clusterGroup)) {
      map.addLayer(clusterGroup);
      changed = true;
    }
  } else if (map.hasLayer(clusterGroup)) {
    map.removeLayer(clusterGroup);
    changed = true;
  }

  return changed;
};

sharedClusterEntries.forEach(({ checkboxId, clusterScope }) => {
  const checkbox = document.getElementById(checkboxId);
  checkbox?.addEventListener('change', () => {
    if (syncSharedCluster(clusterScope)) {
      document.dispatchEvent(new CustomEvent('atlas:layerchange', {
        detail: { source: checkboxId, enabled: checkbox.checked }
      }));
    }
  });
});

Object.keys(sharedClusterConfig).forEach((clusterScope) => {
  syncSharedCluster(clusterScope);
});

categoryClusterEntries.forEach(({ checkboxId, groupName, data, campsite }) => {
  const markers = getOrBuildMarkers(data, campsite, groupName);
  const clusterGroup = createMarkerClusterGroup();

  clusterGroup.addLayers(Object.values(markers));
  MarkerListeners(checkboxId, { markers, clusterGroup }, map);
});
 
// Add Paths and Roads
[pathData, roadData].forEach((data) => {
  LazyLayerListeners(data, map);
});

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  LazyShapeGroupListeners(checkboxId, data, map);
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
