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
  samfrodocampsites,
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
const samfrodopathMarkers = createpathMarkers(samfrodocampsites);


// Add event listeners for checkboxes
addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);
addCheckboxListenerSingle('menCheckbox', markers['minastirith'], map);
addCheckboxListenerSingle('menCheckbox', markers['bree'], map);
addCheckboxListenerSingle('elvesCheckbox', markers['rivendell'], map);
addCheckboxListenerMultiple('datesCheckbox', samfrodopathMarkers, map);

const pathsraw = { 
  samfrodopath: { pathName: 'samfrodopath', color: 'red', map: map },
  aragorn: { pathName: 'aragorn', color: 'blue', map: map }
};

const polylines = await createPolyline(pathsraw); // Wait for polylines to be ready
addpolylineCheckboxListeners(polylines, map);




const mountain_ranges = {
  misty_mountains: {misty_mountains:'misty_mountains', color: 'orange', map: map },
  // white_mountains: {white_mountains:'white_mountains', color: 'orange', map: map },
}

// Define the createPolygon function
export const createPolygon = async (ranges) => {
  const polygons = {};
  const promises = Object.keys(ranges).map(async (key) => {
    const { mountain_range_name, color, map } = ranges[key];
    const geojsonPath = `https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/${mountain_range_name}.geojson`;

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();

      // Create the polygon using the GeoJSON data
      const polygon = L.geoJSON(data, {
        style: {
          color,
          weight: 2,
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          // Add popups or interactivity
          layer.bindPopup(`Name: ${feature.properties.name}`);
        },
      });

      // Store the polygon in the polygons object
      polygons[key] = polygon;
      console.log(`Polygon created for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
  return polygons;
};

// Usage example

createPolygon(mountain_ranges).then(polygons => {
  // Access the created polygons
  console.log('Polygons created:', polygons);

  // Example: Add the Misty Mountains polygon to the map
  if (polygons.misty_mountains) {
    polygons.misty_mountains.addTo(map);
  }

  // Example: Add checkbox listeners for polygons
  Object.keys(polygons).forEach(key => {
    addCheckboxListenerSingle(`${key}Checkbox`, polygons[key], map);
  });
});