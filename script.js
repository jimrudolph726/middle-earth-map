// script.js

// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate reference system for flat maps
    minZoom: -2, // Allows zooming out to see the whole image
  });
  
  // Image dimensions (width and height in pixels)
  const imageWidth = 2500; // Adjust to your image's width
  const imageHeight = 1667; // Adjust to your image's height
  
  // Define the image bounds ([top-left corner, bottom-right corner])
  const imageBounds = [[0, 0], [imageHeight, imageWidth]];
  
  // Add the image as a map layer
  const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth2.png'; // Path to your image file
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  
  // Set the view to fit the image
  map.fitBounds(imageBounds);
  
// Function to convert the Y-coordinate
  function convertYCoordinate(y) {
    return imageHeight - y;
  }
  
  // Set up markers using the convertYCoordinate function with raw Y-values
  L.marker([convertYCoordinate(479), 876]) // Hobbiton
    .addTo(map)
    .bindPopup('Hobbiton')
    .openPopup();
  
  L.marker([convertYCoordinate(483), 1027]) // Bree
    .addTo(map)
    .bindPopup('Bree')
    .openPopup();
  
  L.marker([convertYCoordinate(458), 1363]) // Rivendell
    .addTo(map)
    .bindPopup('Rivendell')
    .openPopup();

  // Define the path (polyline)
  const pathCoordinates = [
    [convertYCoordinate(479), 876], // Hobbiton
    [convertYCoordinate(483), 1027], // Bree
    [convertYCoordinate(458), 1363]  // Rivendell
  ];
  
  // Create the polyline and add it to a variable
  const path = L.polyline(pathCoordinates, { color: 'blue' });
  
  // Add the polyline to the map (but initially don't show it)
  let pathVisible = false;
  
  // Toggle the path visibility
  document.getElementById('toggleButton').addEventListener('click', function() {
    if (pathVisible) {
      path.remove(); // Remove the path from the map
    } else {
      path.addTo(map); // Add the path to the map
    }
    pathVisible = !pathVisible; // Toggle the visibility state
  });