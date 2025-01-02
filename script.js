// script.js

// Function to create icons
const createIcon = (url) => L.icon({
  iconUrl: url,
  iconSize: [48, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Map of icon URLs
const iconUrls = {
  hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
  men: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png',
  rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png'
};

// Initialize icons
const icons = {
  HobbitsIcon: createIcon(iconUrls.hobbits),
  MenIcon: createIcon(iconUrls.men),
  RivendellIcon: createIcon(iconUrls.rivendell)
};

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

// Overlay data with names and URLs
const overlayData = [
  { name: 'SamFrodoPathOverlay', url: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/samfrodopath.png' }
];

// Function to create overlays
const createOverlays = (data, bounds) => {
  const overlays = {};
  data.forEach(({ name, url }) => {
    overlays[name] = L.imageOverlay(url, bounds);
  });
  return overlays;
};

// Generate overlays dynamically
const overlays = createOverlays(overlayData, imageBounds);

// Example usage
console.log(overlays.SamFrodoPathOverlay); // Access the generated overlay
console.log(overlays.MerryPippinPathOverlay); // Access the generated overlay


// Set the view to fit the image
map.fitBounds(imageBounds);

// Function to convert the Y-coordinate
const convertYCoordinate = (y) => imageHeight - y;

// Locations with coordinates and icons
const locations = {
  hobbiton: { coords: [convertYCoordinate(2329), 2247], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
  micheldelving: { coords: [convertYCoordinate(2388), 2110], icon: icons.HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  bree: { coords: [convertYCoordinate(2251), 2794], icon: icons.MenIcon, popup: 'Bree' },
  rivendell: { coords: [convertYCoordinate(2244), 4240], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [convertYCoordinate(5113), 5726], icon: icons.MenIcon, popup: 'Minas Tirith' }
};

// Create markers and add to map
const markers = Object.keys(locations).reduce((acc, key) => {
  const { coords, icon, popup } = locations[key];
  const marker = L.marker(coords, { icon }).bindPopup(popup);
  acc[key] = marker;
  return acc;
}, {});

// Add event listeners for checkbox changes
const addCheckboxListener = (checkboxId, element) => {
  document.getElementById(checkboxId).addEventListener('change', (event) => {
    if (event.target.checked) {
      // Add the element (marker or overlay) to the map
      element.addTo(map);
    } else {
      // Remove the element (marker or overlay) from the map
      map.removeLayer(element);
    }
  });
};

// Attach event listeners to checkboxes
addCheckboxListener('hobbitsCheckbox', markers['hobbiton']);
addCheckboxListener('hobbitsCheckbox', markers['micheldelving']);
addCheckboxListener('menCheckbox', markers['minastirith']);
addCheckboxListener('elvesCheckbox', markers['rivendell']);
addCheckboxListener('samfrodopathCheckbox', overlays['SamFrodoPathOverlay']);
