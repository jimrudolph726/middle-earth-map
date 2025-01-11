// script.js

import {
  PathListeners,
  createPolyline,
  MarkerListeners,
  createPolygon,
  createMarkers
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

var sidebar = L.control.sidebar('sidebar').addTo(map);

const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/output_file.png';
const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

// Add Paths and Campsites
createPolyline(pathdata).then((polylines) => {PathListeners(polylines, map);});
createMarkers(samfrodocampsites, 'campsite').then((markers) => {MarkerListeners('datesCheckbox', markers, map);})

// Add Locations
createMarkers(menlocations).then((markers) => {MarkerListeners('menCheckbox', markers, map);})
createMarkers(hobbitlocations).then((markers) => {MarkerListeners('hobbitsCheckbox', markers, map);})
createMarkers(elveslocations).then((markers) => {MarkerListeners('elvesCheckbox', markers, map);})

// Add Geographic Features
createPolygon(mountain_ranges).then((polygons) => {MarkerListeners('mountain_rangesCheckbox', polygons, map);});