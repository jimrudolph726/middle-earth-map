// script.js

import {
  addCheckboxListenerMultiple,
  createlocationMarkers,
  createpathMarkers,
  createPolyline,
  addCheckboxListeners,
  createPolygon,
  addCheckboxListenersForGroup
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

// Paths and Campsites
createPolyline(pathdata).then((polylines) => {addCheckboxListeners(polylines, map);});
addCheckboxListenerMultiple('datesCheckbox', samfrodopathMarkers, map);

// Add Locations
const elvesMarkers = createlocationMarkers(elveslocations);
const menMarkers = createlocationMarkers(menlocations);
const hobbitMarkers = createlocationMarkers(hobbitlocations);
const samfrodopathMarkers = createpathMarkers(samfrodocampsites);
addCheckboxListenerMultiple('elvesCheckbox', elvesMarkers, map);
addCheckboxListenerMultiple('menCheckbox', menMarkers, map);
addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);

// Add Geographic Features
createPolygon(mountain_ranges).then((polygons) => {addCheckboxListeners(polygons, map);});