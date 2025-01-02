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
  micheldelving: { coords: [convertYCoordinate(2388), 2110], icon: HobbitsIcon, popup: 'Michel Delving' },
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

// Define the path (polyline)
const pathCoordinates = [
  locations.hobbiton.coords, 
  locations.bree.coords, 
  locations.rivendell.coords
];
const fellowshipPath = L.polyline(pathCoordinates, { color: 'blue' });

// Initialize toggle statesa
let visibilityState = {
  hobbits: false,
  men: false,
  elves: false,
  SamFrodoPathVisible: false
};

// Function to toggle visibility of layers
function toggleVisibility(layer, button, state) {
  if (layer instanceof L.ImageOverlay) { 
    // If the layer is an ImageOverlay (like the SamFrodoPath)
    if (state) {
      map.removeLayer(layer);
      button.innerHTML = `Show Sam Frodo Path`;
    } else {
      layer.addTo(map);
      button.innerHTML = `Hide Sam Frodo Path`;
    }
  } else if (layer instanceof L.Marker) {
    // Handle marker layers as before (if it's a marker)
    if (state) {
      map.removeLayer(layer);
      button.innerHTML = `Show ${layer.options.icon.options.iconUrl.split('/').pop().split('.')[0]}`;
    } else {
      layer.addTo(map);
      button.innerHTML = `Hide ${layer.options.icon.options.iconUrl.split('/').pop().split('.')[0]}`;
    }
  }

  return !state;
}

// Toggle buttons for markers and path
// const toggleHobbitsButton = document.getElementById('toggleHobbitsButton');
// toggleHobbitsButton.addEventListener('click', () => {
//   visibilityState.hobbits = toggleVisibility(markers.hobbiton, toggleHobbitsButton, visibilityState.hobbits);
//   visibilityState.micheldelving = toggleVisibility(markers.micheldelving, toggleHobbitsButton, visibilityState.micheldelving);
// });

const toggleMenButton = document.getElementById('toggleMenButton');
toggleMenButton.addEventListener('click', () => {
  visibilityState.men = toggleVisibility(markers.minastirith, toggleMenButton, visibilityState.men);
  visibilityState.bree = toggleVisibility(markers.bree, toggleMenButton, visibilityState.bree);
});

const toggleElvesButton = document.getElementById('toggleElvesButton');
toggleElvesButton.addEventListener('click', () => {
  visibilityState.elves = toggleVisibility(markers.rivendell, toggleElvesButton, visibilityState.elves);
});

// Change for Sam Frodo Path toggle specifically
const toggleSamFrodoPathButton = document.getElementById('toggleSamFrodoPathButton');
toggleSamFrodoPathButton.addEventListener('click', () => {
  visibilityState.SamFrodoPathVisible = toggleVisibility(SamFrodoPathOverlay, toggleSamFrodoPathButton, visibilityState.SamFrodoPathVisible);
});

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