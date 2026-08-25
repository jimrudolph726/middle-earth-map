import {
  MarkerListeners,
  PathListeners,
  createGeographicShape,
  createMarkers,
} from './functions.js';

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

export const initializeImageAtlasMap = ({
  mapElementId = 'map',
  mapOptions = {},
  imageUrl,
  imageBounds,
  settlementsData = [],
  pathdata = {},
  geographicData = [],
  geojsonBaseUrl,
}) => {
  if (!imageUrl || !imageBounds) {
    throw new Error('The map image URL and image bounds are required.');
  }

  const map = L.map(mapElementId, { ...defaultMapOptions, ...mapOptions });
  map.options.wheelPxPerZoomLevel = 40;

  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  map.fitBounds(imageBounds);

  if (document.getElementById('sidebar')) {
    L.control.sidebar('sidebar').addTo(map);
  }

  settlementsData.forEach(({ data, checkboxId, campsite }) => {
    createMarkers(data, campsite).then((markers) => {
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

  return map;
};
