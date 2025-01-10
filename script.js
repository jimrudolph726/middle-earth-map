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
const pathdata = { samfrodopath: { pathName: 'samfrodopath', color: 'red', map: map }, aragorn: { pathName: 'aragorn', color: 'blue', map:map }};
createPolyline(pathdata).then((polylines) => {addCheckboxListeners(polylines, map);});



const samfrodopathMarkers = createpathMarkers(samfrodocampsites);
addCheckboxListenerMultiple('datesCheckbox', samfrodopathMarkers, map);

// Add Locations
createlocationMarkers(menlocations).then((markers) => {addCheckboxListenerMultiple('menCheckbox', markers, map);})
createlocationMarkers(hobbitlocations).then((markers) => {addCheckboxListenerMultiple('hobbitsCheckbox', markers, map);})
createlocationMarkers(elveslocations).then((markers) => {addCheckboxListenerMultiple('elvesCheckbox', markers, map);})


// Add Geographic Features
createPolygon(mountain_ranges).then((polygons) => {addCheckboxListenerMultiple('mountain_rangesCheckbox', polygons, map);});