// script.js

// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate reference system for flat maps
    minZoom: -2,
    zoom: -10, // Allows zooming out to see the whole image
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
  L.marker([convertYCoordinate(2329), 2247]) // Hobbiton
    .addTo(map)
    .bindPopup('Hobbiton');
  
  L.marker([convertYCoordinate(2251), 2794]) // Bree
    .addTo(map)
    .bindPopup('Bree');
  
  L.marker([convertYCoordinate(2244), 4240]) // Rivendell
    .addTo(map)
    .bindPopup('Rivendell');

  L.marker([convertYCoordinate(5113), 5726]) // Rivendell
    .addTo(map)
    .bindPopup('Minas Tirith');

  // Define the path (polyline)
  const pathCoordinates = [
    [convertYCoordinate(2329), 2247], // Hobbiton
    [convertYCoordinate(2251), 2794], // Bree
    [convertYCoordinate(5113), 5726]  // Rivendell
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