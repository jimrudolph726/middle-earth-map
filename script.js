// script.js

// Import functions and variables
import {
  addCheckboxListenerSingle,
  addCheckboxListenerMultiple,
  createMarkers,
  createPaths,
} from './functions.js';
import {
  locations,
  imageBounds,
  pathsData,
  hobbitlocations,
  samfrodosteps,
} from './variables.js';

// Initialize the map
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 2,
  zoom: -3,
});

// Add the image as a map layer
// const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.png';
// L.imageOverlay(imageUrl, imageBounds).addTo(map);
// // Set the view to fit the image
// map.fitBounds(imageBounds);

// Load GeoTIFF and add to the map
fetch('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth-tif.tif')
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    parseGeoraster(arrayBuffer)
      .then((georaster) => {
        // Ensure GeoRasterLayer is available
        const GeoRasterLayer = window.GeoRasterLayer;
        if (!GeoRasterLayer) {
          throw new Error('GeoRasterLayer is not defined. Ensure the library is loaded.');
        }

        const layer = new GeoRasterLayer({
          georaster,
          opacity: 1, // Adjust transparency
          resolution: 256, // Adjust for quality
        });
        layer.addTo(map);
        map.fitBounds(layer.getBounds());
      })
      .catch((error) => console.error('Error parsing GeoRaster:', error));
  })
  .catch((error) => console.error('Error loading GeoTIFF:', error));

// Create markers and paths
const markers = createMarkers(locations);
const hobbitMarkers = createMarkers(hobbitlocations);
const samFrodoMarkers = createMarkers(samfrodosteps);
const overlays = createPaths(pathsData, imageBounds);

// Add event listeners for checkboxes
addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);
addCheckboxListenerSingle('menCheckbox', markers['minastirith'], map);
addCheckboxListenerSingle('elvesCheckbox', markers['rivendell'], map);
addCheckboxListenerSingle('samfrodopathCheckbox', overlays['SamFrodoPathOverlay'], map);
addCheckboxListenerMultiple('samfrodopathCheckbox', samFrodoMarkers, map);
