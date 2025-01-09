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
} from './variables.js';

// Map
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

// Create markers
const elvesMarkers = createlocationMarkers(elveslocations);
const menMarkers = createlocationMarkers(menlocations);
const hobbitMarkers = createlocationMarkers(hobbitlocations);
const samfrodopathMarkers = createpathMarkers(samfrodocampsites);

// Add event listeners for checkboxes
addCheckboxListenerMultiple('elvesCheckbox', elvesMarkers, map);
addCheckboxListenerMultiple('menCheckbox', menMarkers, map);
addCheckboxListenerMultiple('hobbitsCheckbox', hobbitMarkers, map);
addCheckboxListenerMultiple('datesCheckbox', samfrodopathMarkers, map);

// Add paths
const pathdata = { samfrodopath: { pathName: 'samfrodopath', color: 'red', map: map },
                        aragorn: { pathName: 'aragorn', color: 'blue', map: map }};
createPolyline(pathdata).then((polylines) => {addCheckboxListeners(polylines, map);});

// Add polygons
const mountain_ranges = {misty_mountains: {mountain_range_name:'misty_mountains', color: 'orange', map: map },}
createPolygon(mountain_ranges).then((polygons) => {addCheckboxListeners(polygons, map);});