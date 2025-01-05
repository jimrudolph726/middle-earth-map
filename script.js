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
  pathsData,
  hobbitlocations,
  samfrodosteps,
} from './variables.js';

// Initialize the map with EPSG:4326 CRS
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: -5, // Allow deep zoom for detailed inspection
  maxZoom: 10, // Adjust as needed for your data
  zoom: 0,
  center: [0, 0], // Adjust to the approximate center of your raster if needed
});

// Define the URL of your image (the .tif file)
const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/output_file.png';

// Define the bounds of your image in geographic coordinates (latitude/longitude)
// You need to specify the coordinates of the top-left and bottom-right corners of the image
const imageBounds = [[34.1108,-96.9792], [39.6299,-89.7568]];

// Add the image as an overlay to the map
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Optionally, fit the map view to the bounds of the image
map.fitBounds(imageBounds);







// fetch('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth-tif.tif') // Replace with your GeoTIFF file URL
//   .then(response => response.arrayBuffer())
//   .then(arrayBuffer => {
//     parseGeoraster(arrayBuffer).then(georaster => {
//       console.log("Parsed GeoRaster:", georaster);
//       const layer = new GeoRasterLayer({
//         georaster,
//         opacity: 1, // Adjust transparency
//         resolution: 1024, // Adjust quality
//       });
//       layer.addTo(map);

//       map.fitBounds(layer.getBounds());
//     });
//   })
//   .catch(error => console.error("Error parsing GeoRaster:", error));





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
