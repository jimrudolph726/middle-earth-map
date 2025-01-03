// script.js

// import functions
import { addCheckboxListener, createMarkers, createPaths } from './functions.js';
// Import variables
import { locations, imageBounds, pathsData } from './variables.js';

// Initialize the map
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 2,
  zoom: -3,
});
// Add the image as a map layer
const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.png';
L.imageOverlay(imageUrl, imageBounds).addTo(map);
// Set the view to fit the image
map.fitBounds(imageBounds);

// Generate overlays dynamically
const overlays = createPaths(pathsData, imageBounds);
// Create markers
const markers = createMarkers(locations);
// Attach event listeners to checkboxes
addCheckboxListener('hobbitsCheckbox', markers['hobbiton'], map);
addCheckboxListener('hobbitsCheckbox', markers['micheldelving'], map);
addCheckboxListener('menCheckbox', markers['minastirith'], map);
addCheckboxListener('elvesCheckbox', markers['rivendell'], map);
addCheckboxListener('samfrodopathCheckbox', overlays['SamFrodoPathOverlay'], map);