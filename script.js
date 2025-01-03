// script.js

// import functions
import { addCheckboxListenerSingle, addCheckboxListenerMultiple, createMarkers, createPaths } from './functions.js';
// Import variables
import { locations, imageBounds, pathsData, hobbitlocations } from './variables.js';

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

// Create markers
const markers = createMarkers(locations);
const hobbitmarkers = createMarkers(hobbitlocations);
// Generate overlays dynamically
const overlays = createPaths(pathsData, imageBounds);

// Attach event listeners to checkboxes
// addCheckboxListener('hobbitsCheckbox', markers['hobbiton'], map);
// addCheckboxListener('hobbitsCheckbox', markers['micheldelving'], map);

addCheckboxListenerMultiple('hobbitsCheckbox', hobbitmarkers, map);
addCheckboxListenerMultiple('menCheckbox', markers['minastirith'], map);
addCheckboxListenerMultiple('elvesCheckbox', markers['rivendell'], map);
addCheckboxListenerMultiple('samfrodopathCheckbox', overlays['SamFrodoPathOverlay'], map);