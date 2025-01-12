// script.js

import {
  PathListeners,
  createPolyline,
  MarkerListeners,
  createPolygon,
  createMarkers
} from './functions.js';

import {
  elvessettlements,
  mensettlements,
  hobbitsettlements,
  samfrodocampsites,
  aragorncampsites,
  pippincampsites,
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

var sidebar = L.control.sidebar('sidebar').addTo(map);

// Add Paths and Campsites
const campsites = [samfrodocampsites, aragorncampsites, pippincampsites];

for(const campsite of campsites) {
  createMarkers(campsite, 'campsite').then((markers) => {MarkerListeners(`${campsite}Checkbox`, markers, map);})
}



createPolyline(pathdata).then((polylines) => {PathListeners(polylines, map);});
// createMarkers(samfrodocampsites, 'campsite').then((markers) => {MarkerListeners('samfrodocampsitesCheckbox', markers, map);})
// createMarkers(aragorncampsites, 'campsite').then((markers) => {MarkerListeners('aragorncampsitesCheckbox', markers, map);})
// createMarkers(pippincampsites, 'campsite').then((markers) => {MarkerListeners('pippincampsitesCheckbox', markers, map);})

// Add Settlements
createMarkers(elvessettlements).then((markers) => {MarkerListeners('elvesCheckbox', markers, map);})
createMarkers(mensettlements).then((markers) => {MarkerListeners('menCheckbox', markers, map);})
createMarkers(hobbitsettlements).then((markers) => {MarkerListeners('hobbitsCheckbox', markers, map);})

// Add Geographic Features
createPolygon(mountain_ranges).then((polygons) => {MarkerListeners('mountain_rangesCheckbox', polygons, map);});