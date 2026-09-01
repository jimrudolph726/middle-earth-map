import {
  MarkerListeners,
  PathListeners,
  createGeographicShape,
  createMarkers,
} from './functions.js';
import { initializePhysicalMapFrame } from './physical-map-frame.js';

const defaultMapOptions = {
  crs: L.CRS.EPSG3857,
  minZoom: 15,
  maxZoom: 20,
  zoom: 15.5,
  center: [0, 0],
  zoomSnap: 1,
  zoomDelta: 5,
  preferCanvas: true,
};

const initializeMasterCheckboxes = (root = document) => {
  root.querySelectorAll('[data-toggle-all]').forEach((masterCheckbox) => {
    const selector = masterCheckbox.dataset.toggleAll;

    if (!selector) {
      return;
    }

    masterCheckbox.addEventListener('change', () => {
      root.querySelectorAll(selector).forEach((checkbox) => {
        checkbox.checked = masterCheckbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      });
    });
  });
};

const announceLayerChange = (source, enabled) => {
  document.dispatchEvent(new CustomEvent('atlas:layerchange', {
    detail: { source, enabled }
  }));
};

const initializeClusteredMarkerListeners = ({
  checkboxId,
  markers,
  clusterGroup,
  map,
}) => {
  const checkbox = document.getElementById(checkboxId);

  if (!checkbox) {
    console.error(`Checkbox with ID "${checkboxId}" not found in the DOM.`);
    return;
  }

  const markerLayers = Object.values(markers);
  const syncCluster = (event) => {
    let changed = false;

    markerLayers.forEach((marker) => {
      const markerIsClustered = clusterGroup.hasLayer(marker);

      if (checkbox.checked && !markerIsClustered) {
        clusterGroup.addLayer(marker);
        changed = true;
      } else if (!checkbox.checked && markerIsClustered) {
        clusterGroup.removeLayer(marker);
        changed = true;
      }
    });

    if (clusterGroup.getLayers().length > 0) {
      if (!map.hasLayer(clusterGroup)) {
        clusterGroup.addTo(map);
        changed = true;
      }
    } else if (map.hasLayer(clusterGroup)) {
      map.removeLayer(clusterGroup);
      changed = true;
    }

    if (event && changed) {
      announceLayerChange(checkboxId, checkbox.checked);
    }
  };

  checkbox.addEventListener('change', syncCluster);
  syncCluster();
};

export const initializeImageAtlasMap = ({
  mapElementId = 'map',
  mapOptions = {},
  imageUrl,
  imageBounds,
  settlementsData = [],
  pathdata = {},
  geographicData = [],
  geojsonBaseUrl,
  markerClusterOptions = null,
  physicalFrame = null,
}) => {
  if (!imageUrl || !imageBounds) {
    throw new Error('The map image URL and image bounds are required.');
  }

  const map = L.map(mapElementId, { ...defaultMapOptions, ...mapOptions });
  map.options.wheelPxPerZoomLevel = 40;

  const imageLayer = L.imageOverlay(imageUrl, imageBounds, {
    className: physicalFrame
      ? `atlas-physical-map__surface atlas-physical-map__surface--${physicalFrame.theme || 'default'}`
      : '',
  }).addTo(map);
  map.fitBounds(imageBounds);
  const physicalMapFrame = initializePhysicalMapFrame({
    map,
    imageBounds,
    options: physicalFrame,
  });

  let sidebar = null;

  if (document.getElementById('sidebar')) {
    sidebar = L.control.sidebar('sidebar').addTo(map);
  }

  const {
    checkboxIds: clusteredCheckboxIds = null,
    includeCampsites = false,
    ...leafletClusterOptions
  } = markerClusterOptions || {};
  const canClusterMarkers = Boolean(
    markerClusterOptions && typeof L.markerClusterGroup === 'function'
  );
  const settlementClusterGroup = canClusterMarkers
    ? L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 19,
        maxClusterRadius: 38,
        ...leafletClusterOptions,
      })
    : null;

  settlementsData.forEach(({ data, checkboxId, campsite }) => {
    createMarkers(data, campsite).then((markers) => {
      const checkboxIsClustered = !clusteredCheckboxIds
        || clusteredCheckboxIds.includes(checkboxId);
      const shouldCluster = settlementClusterGroup
        && checkboxIsClustered
        && (includeCampsites || campsite !== 'campsite');

      if (shouldCluster) {
        initializeClusteredMarkerListeners({
          checkboxId,
          markers,
          clusterGroup: settlementClusterGroup,
          map,
        });
        return;
      }

      MarkerListeners(checkboxId, markers, map);
    });
  });

  createGeographicShape(pathdata, geojsonBaseUrl).then((polygons) => {
    PathListeners(polygons, map);
  });

  geographicData.forEach(({ data, checkboxId }) => {
    createGeographicShape(data, geojsonBaseUrl).then((polygons) => {
      MarkerListeners(checkboxId, polygons, map);
    });
  });

  initializeMasterCheckboxes();

  document.dispatchEvent(new CustomEvent('atlas:mapready', {
    detail: { map, mapElementId, sidebar, imageLayer, physicalMapFrame }
  }));

  return map;
};
