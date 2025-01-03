// script.js

// import functions
import { addCheckboxListener, createMarkers, createPaths } from './functions.js';
import { locations } from './variables.js';

// Initialize the map
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 2,
  zoom: -3,
});

// Image dimensions and bounds
const imageWidth = 8740;
const imageHeight = 8208;
const imageBounds = [[0, 0], [imageHeight, imageWidth]];

// Add the image as a map layer
const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.png';
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Overlay data with names and URLs
const pathsData = [
  { name: 'SamFrodoPathOverlay', url: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/samfrodopath.png' }
];

// Generate overlays dynamically
const overlays = createPaths(pathsData, imageBounds);

// Set the view to fit the image
map.fitBounds(imageBounds);

// Create markers
const markers = createMarkers(locations);

// Attach event listeners to checkboxes
addCheckboxListener('hobbitsCheckbox', markers['hobbiton'], map);
addCheckboxListener('hobbitsCheckbox', markers['micheldelving'], map);
addCheckboxListener('menCheckbox', markers['minastirith'], map);
addCheckboxListener('elvesCheckbox', markers['rivendell'], map);
addCheckboxListener('samfrodopathCheckbox', overlays['SamFrodoPathOverlay'], map);