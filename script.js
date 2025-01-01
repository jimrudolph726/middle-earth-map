// script.js

const HobbitsIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png', // Path to your custom image
  iconSize: [48, 48],  // Size of the icon (adjust as needed)
  iconAnchor: [16, 32], // Point of the icon that will be at the marker's location
  popupAnchor: [0, -32] // Position of the popup relative to the icon
});
const MenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png', // Path to your custom image
  iconSize: [48, 48],  // Size of the icon (adjust as needed)
  iconAnchor: [16, 32], // Point of the icon that will be at the marker's location
  popupAnchor: [0, -32] // Position of the popup relative to the icon
});
const RivendellIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png', // Path to your custom image
  iconSize: [48, 48],  // Size of the icon (adjust as needed)
  iconAnchor: [16, 32], // Point of the icon that will be at the marker's location
  popupAnchor: [0, -32] // Position of the popup relative to the icon
});

// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate reference system for flat maps
    minZoom: -3, // Allow zooming out more
    maxZoom: 2, // You can adjust this to restrict zooming in
    zoom: -3, // Set the initial zoom level
  });
  
  // Image dimensions (width and height in pixels)
  const imageWidth = 8740; // Adjust to your image's width
  const imageHeight = 8208; // Adjust to your image's height
  
  // Define the image bounds ([top-left corner, bottom-right corner])
  const imageBounds = [[0, 0], [imageHeight, imageWidth]];
  
  // Add the image as a map layer
  const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.png'; // Path to your image file
  L.imageOverlay(imageUrl, imageBounds).addTo(map);

  // Add the image as a map layer
  const SamFrodoPathUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/samfrodopath.png'; // Path to your image file
  const SamFrodoPathOverlay = L.imageOverlay(SamFrodoPathUrl, imageBounds).addTo(map);

  // Hide the path initially
  fellowshipPathOverlay.setOpacity(0);
  
  // Set the view to fit the image
  map.fitBounds(imageBounds);
  
// Function to convert the Y-coordinate
  function convertYCoordinate(y) {
    return imageHeight - y;
  }
  
  // Set up markers using the convertYCoordinate function with raw Y-values
  const hobbitonMarker = L.marker([convertYCoordinate(2329), 2247], { icon: HobbitsIcon })// Hobbiton
    .bindPopup('Hobbiton');
  const micheldelvingMarker = L.marker([convertYCoordinate(2388), 2110], { icon: HobbitsIcon }) // Hobbiton
  .bindPopup('Michel Delving');
  
  const breeMarker = L.marker([convertYCoordinate(2251), 2794], { icon: MenIcon }) // Bree
    .bindPopup('Bree');
  
  const rivendellMarker = L.marker([convertYCoordinate(2244), 4240], { icon: RivendellIcon }) // Rivendell
  .bindPopup(`
      <div>
          <h3>Rivendell</h3>
          <button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button>
      </div>
  `);

  const minastirithMarker = L.marker([convertYCoordinate(5113), 5726], { icon: MenIcon }) // Minas Tirith
    .bindPopup('Minas Tirith');

  // Define the path (polyline)
  const pathCoordinates = [
    [convertYCoordinate(2329), 2247], // Hobbiton
    [convertYCoordinate(2251), 2794], // Bree
    [convertYCoordinate(2244), 4240]  // Rivendell
  ];
  
  const fellowshipPath = L.polyline(pathCoordinates, { color: 'blue' });

  // Toggle button functionality for Hobbits
  let isHobbitonVisible = false; // Initially, Hobbiton marker is visible
  const toggleHobbitsButton = document.getElementById('toggleHobbitsButton');

  toggleHobbitsButton.addEventListener('click', () => {
    if (isHobbitonVisible) {
      map.removeLayer(hobbitonMarker); // Remove Hobbiton marker from the map
      map.removeLayer(micheldelvingMarker);  
      toggleHobbitsButton.innerHTML = 'Show Hobbits';  // Change button text
    } else {
      hobbitonMarker.addTo(map);  // Add Hobbiton marker to the map
      micheldelvingMarker.addTo(map);
      toggleHobbitsButton.innerHTML = 'Hide Hobbits';  // Change button text
    }
    isHobbitonVisible = !isHobbitonVisible;
  });

    // Toggle button functionality for Hobbits
    let isMinasTirithVisible = false; // Initially, Hobbiton marker is visible
    const toggleMenButton = document.getElementById('toggleMenButton');
  
    toggleMenButton.addEventListener('click', () => {
      if (isMinasTirithVisible) {
        map.removeLayer(minastirithMarker); // Remove Hobbiton marker from the map 
        map.removeLayer(breeMarker); 
        toggleMenButton.innerHTML = 'Show Men';  // Change button text
      } else {
        minastirithMarker.addTo(map);  // Add Hobbiton marker to the map
        breeMarker.addTo(map); 
        toggleMenButton.innerHTML = 'Hide Men';  // Change button text
      }
      isMinasTirithVisible = !isMinasTirithVisible;
    });

    
    // Toggle button functionality for Hobbits
    let isRivendellVisible = false; // Initially, Hobbiton marker is visible
    const toggleElvesButton = document.getElementById('toggleElvesButton');
    toggleElvesButton.addEventListener('click', () => {
      if (isRivendellVisible) {
        map.removeLayer(rivendellMarker); // Remove Hobbiton marker from the map 
        toggleElvesButton.innerHTML = 'Show Elves';  // Change button text
      } else {
        rivendellMarker.addTo(map);  // Add Hobbiton marker to the map
        toggleElvesButton.innerHTML = 'Hide Elves';  // Change button text
      }
      isRivendellVisible = !isRivendellVisible;
    });

        // Add event listener to the Fellowship Path button to toggle visibility
    document.getElementById('toggleSamFrodoPathButton').addEventListener('click', function() {
      if (fellowshipPathOverlay._map) {
        // If the path is currently displayed, hide it
        fellowshipPathOverlay.setOpacity(0); 
      } else {
        // Otherwise, display the path
        fellowshipPathOverlay.setOpacity(1); 
      }
    });