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

// Initialize the map with EPSG:4326 CRS
const map = L.map('map', {
  crs: L.CRS.EPSG4326,
  minZoom: -5, // Allow deep zoom for detailed inspection
  maxZoom: 10, // Adjust as needed for your data
  zoom: 0,
  center: [0, 0], // Adjust to the approximate center of your raster if needed
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
