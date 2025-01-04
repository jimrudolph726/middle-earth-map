// script.js

// import functions
import { addCheckboxListenerSingle, addCheckboxListenerMultiple, createMarkers, createPaths } from './functions.js';
// Import variables
import { locations, imageBounds, pathsData, hobbitlocations, samfrodosteps } from './variables.js';

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

// t

// var map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// var geotiffLayer = L.leafletGeotiff('path_to_your_file.tif', {
//     band: 0, // specify the band if needed
//     opacity: 0.7,
//     max: 255, // maximum value for the color scale
//     min: 0    // minimum value for the color scale
// }).addTo(map);



// Create markers
const markers = createMarkers(locations);
const hobbitmarkers = createMarkers(hobbitlocations);
const samfrodomarkers = createMarkers(samfrodosteps);
// Generate overlays dynamically
const overlays = createPaths(pathsData, imageBounds);

// Attach event listeners to checkboxes
// addCheckboxListener('hobbitsCheckbox', markers['hobbiton'], map);
// addCheckboxListener('hobbitsCheckbox', markers['micheldelving'], map);

addCheckboxListenerMultiple('hobbitsCheckbox', hobbitmarkers, map);
addCheckboxListenerSingle('menCheckbox', markers['minastirith'], map);
addCheckboxListenerSingle('elvesCheckbox', markers['rivendell'], map);
addCheckboxListenerSingle('samfrodopathCheckbox', overlays['SamFrodoPathOverlay'], map);
addCheckboxListenerMultiple('samfrodopathCheckbox', samfrodomarkers, map);