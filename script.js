// script.js

import {
  addCheckboxListenerMultiple,
  createlocationMarkers,
  createpathMarkers,
  createPolyline,
  addCheckboxListeners,
  createPolygon,
} from './functions.js';

import {
  elveslocations,
  menlocations,
  hobbitlocations,
  samfrodocampsites,
  pathdata,
  mountain_ranges
} from './variables.js';

// Add Map
const map = L.map('map', {
  crs: L.CRS.EPSG3857,
  minZoom: -5,
  maxZoom: 20,
  zoom: 0,
  center: [0, 0],
});

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/output_file.png';
const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

// Add Paths and Campsites
createPolyline(pathdata).then((polylines) => {addCheckboxListeners(polylines, map);});



const samfrodopathMarkers = createpathMarkers(samfrodocampsites);
addCheckboxListenerMultiple('datesCheckbox', samfrodopathMarkers, map);

// Add Locations
// const elvesMarkers = createlocationMarkers(elveslocations);
// const menMarkers = createlocationMarkers(menlocations);
// const hobbitMarkers = createlocationMarkers(hobbitlocations);
// addCheckboxListenerMultiple('elvesCheckbox', elvesMarkers, map);
// addCheckboxListenerMultiple('menCheckbox', menMarkers, map);
// addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);



createlocationMarkers(menlocations).then((markers) => {
  console.log('Markers created:', markers); // Check if markers are created
  addCheckboxListeners('men', markers, map); // Add checkbox listeners
})
.catch((error) => {
  console.error('Error:', error); // Catch any issues
});



createlocationMarkers(hobbitlocations).then((markers) => {
  console.log('Markers created:', markers); // Check if markers are created
  addCheckboxListeners('hobbits', markers, map); // Add checkbox listeners
})
.catch((error) => {
  console.error('Error:', error); // Catch any issues
});



createlocationMarkers(elveslocations).then((markers) => {
    console.log('Markers created:', markers); // Check if markers are created
    addCheckboxListeners('elves', markers, map); // Add checkbox listeners
  })
  .catch((error) => {
    console.error('Error:', error); // Catch any issues
  });

// Add Geographic Features
createPolygon(mountain_ranges).then((polygons) => {addCheckboxListeners('mountain_ranges', polygons, map);});