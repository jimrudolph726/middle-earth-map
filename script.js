// script.js

// Function to create icons
const createIcon = (url) => L.icon({
  iconUrl: url,
  iconSize: [48, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Create marker icons
const HobbitsIcon = createIcon('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png');
const MenIcon = createIcon('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png');
const RivendellIcon = createIcon('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png');

// Initialize the map
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 2,
  zoom: -3,
});

// Image dimensions and bounds
const imageWidth = 8740;
const imageHeight = 8208;
const imageBounds = [[0, 0], [imageHeight, imageWidth]];

// Add the image as a map layer
const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.png';
L.imageOverlay(imageUrl, imageBounds).addTo(map);

// Add the path overlay
const SamFrodoPathUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/samfrodopath.png';
const SamFrodoPathOverlay = L.imageOverlay(SamFrodoPathUrl, imageBounds);

// Set the view to fit the image
map.fitBounds(imageBounds);

// Function to convert the Y-coordinate
function convertYCoordinate(y) {
  return imageHeight - y;
}

// Create markers and their coordinates
const locations = {
  hobbiton: { coords: [convertYCoordinate(2329), 2247], icon: HobbitsIcon, popup: 'Hobbiton' },
  micheldelving: { coords: [convertYCoordinate(2388), 2110], icon: HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  bree: { coords: [convertYCoordinate(2251), 2794], icon: MenIcon, popup: 'Bree' },
  rivendell: { coords: [convertYCoordinate(2244), 4240], icon: RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [convertYCoordinate(5113), 5726], icon: MenIcon, popup: 'Minas Tirith' }
};

// Add markers to the map
const markers = Object.keys(locations).reduce((acc, key) => {
  const { coords, icon, popup } = locations[key];
  const marker = L.marker(coords, { icon }).bindPopup(popup);
  acc[key] = marker;
  return acc;
}, {});

// Add event listeners to the checkboxes
document.getElementById('hobbitsCheckbox').addEventListener('change', (event) => {
  if (event.target.checked) {
    markers.hobbiton.addTo(map);
    markers.micheldelving.addTo(map);
  } else {
    map.removeLayer(markers.hobbiton);
    map.removeLayer(markers.micheldelving);
  }
});

document.getElementById('menCheckbox').addEventListener('change', (event) => {
  if (event.target.checked) {
    markers.minastirith.addTo(map);
  } else {
    map.removeLayer(markers.minastirith);
  }
});

document.getElementById('elvesCheckbox').addEventListener('change', (event) => {
  if (event.target.checked) {
    markers.rivendell.addTo(map);
  } else {
    map.removeLayer(markers.rivendell);
  }
});

document.getElementById('samfrodopathCheckbox').addEventListener('change', (event) => {
  if (event.target.checked) {
    SamFrodoPathOverlay.addTo(map);
  } else {
    map.removeLayer(SamFrodoPathOverlay);
  }
});