// script.js

// Import functions and variables
import {
  addCheckboxListenerSingle,
  addCheckboxListenerMultiple,
  createlocationMarkers,
  createpathMarkers,
  createPolyline,
  addpolylineCheckboxListeners,
} from './functions.js';

import {
  locations,
  hobbitlocations,
  samfrodosteps,
} from './variables.js';

// Initialize the map with EPSG:4326 CRS
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: -5, // Allow deep zoom for detailed inspection
  maxZoom: 20, // Adjust as needed for your data
  zoom: 0,
  center: [0, 0], // Adjust to the approximate center of your raster if needed
});

// Define the URL of your image (the .tif file)
const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/output_file.png';

// Define the bounds of your image in geographic coordinates (latitude/longitude)
// You need to specify the coordinates of the top-left and bottom-right corners of the image
const imageBounds = [
  [44.95133395351252, -93.31776393673807], // Top-left corner (latitude, longitude)
  [44.93460911676505, -93.29255872642499], // Bottom-right corner (latitude, longitude)
];

// Add the image as an overlay to the map
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Optionally, fit the map view to the bounds of the image
map.fitBounds(imageBounds);

// Create markers and paths
const markers = createlocationMarkers(locations);
const hobbitMarkers = createlocationMarkers(hobbitlocations);
const samFrodoMarkers = createpathMarkers(samfrodosteps);
// d
// Add event listeners for checkboxes
addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);
addCheckboxListenerSingle('menCheckbox', markers['minastirith'], map);
addCheckboxListenerSingle('menCheckbox', markers['bree'], map);
addCheckboxListenerSingle('elvesCheckbox', markers['rivendell'], map);
addCheckboxListenerMultiple('samfrodopathCheckbox', samFrodoMarkers, map);

document.addEventListener('DOMContentLoaded', async () => {
  const pathsraw = { samfrodopath: { pathName: 'samfrodopath', color: 'red', map: map },
                             test: { pathName: 'aragorn', color: 'blue', map: map }};

  console.log('Initializing polylines...');
  const polylines = await createPolyline(pathsraw); // Wait for polylines to be ready
  console.log('Polylines initialized:', polylines);

  console.log('Adding checkbox listeners...');
  addpolylineCheckboxListeners(polylines, map);
  console.log('Checkbox listeners added.');
});
