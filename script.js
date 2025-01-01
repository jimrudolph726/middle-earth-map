// script.js

const HobbitsIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png', // Path to your custom image
  iconSize: [32, 32],  // Size of the icon (adjust as needed)
  iconAnchor: [16, 32], // Point of the icon that will be at the marker's location
  popupAnchor: [0, -32] // Position of the popup relative to the icon
});
const MenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png', // Path to your custom image
  iconSize: [32, 32],  // Size of the icon (adjust as needed)
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
  
  // Set the view to fit the image
  map.fitBounds(imageBounds);
  
// Function to convert the Y-coordinate
  function convertYCoordinate(y) {
    return imageHeight - y;
  }
  
  // Set up markers using the convertYCoordinate function with raw Y-values
  const hobbitonMarker = L.marker([convertYCoordinate(2329), 2247], { icon: HobbitsIcon })// Hobbiton
    .addTo(map)
    .bindPopup('Hobbiton');
  const micheldelvingMarker = L.marker([convertYCoordinate(2388), 2110], { icon: HobbitsIcon }) // Hobbiton
  .addTo(map)
  .bindPopup('Michel Delving');
  
  L.marker([convertYCoordinate(2251), 2794], { icon: HobbitsIcon }) // Bree
    .addTo(map)
    .bindPopup('Bree');
  
  L.marker([convertYCoordinate(2244), 4240]) // Rivendell
    .addTo(map)
    .bindPopup('Rivendell');

  const minastirithMarker = L.marker([convertYCoordinate(5113), 5726], { icon: MenIcon }) // Minas Tirith
    .addTo(map)
    .bindPopup('Minas Tirith');

  // Define the path (polyline)
  const pathCoordinates = [
    [convertYCoordinate(2329), 2247], // Hobbiton
    [convertYCoordinate(2251), 2794], // Bree
    [convertYCoordinate(2244), 4240]  // Rivendell
  ];
  
  const fellowshipPath = L.polyline(pathCoordinates, { color: 'blue' });

  // Toggle button functionality
  let isPathVisible = false;
  const toggleButton = document.getElementById('toggleButton');
  
  toggleButton.addEventListener('click', () => {
    if (isPathVisible) {
      map.removeLayer(fellowshipPath);  // Remove path from the map
      toggleButton.innerHTML = 'Fellowship Path';  // Change button text back
    } else {
      fellowshipPath.addTo(map);  // Add path to the map
      toggleButton.innerHTML = 'Hide Fellowship Path';  // Change button text
    }
    isPathVisible = !isPathVisible;
  });

  // Toggle button functionality for Hobbits
  let isHobbitonVisible = true; // Initially, Hobbiton marker is visible
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
    let isMinasTirithVisible = true; // Initially, Hobbiton marker is visible
    const toggleMenButton = document.getElementById('toggleMenButton');
  
    toggleMenButton.addEventListener('click', () => {
      if (isMinasTirithVisible) {
        map.removeLayer(minastirithMarker); // Remove Hobbiton marker from the map 
        toggleMenButton.innerHTML = 'Show Men';  // Change button text
      } else {
        minastirithMarker.addTo(map);  // Add Hobbiton marker to the map
        toggleMenButton.innerHTML = 'Show Men';  // Change button text
      }
      isMinasTirithVisible = !isMinasTirithVisible;
    });