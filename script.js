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

  const hobbitonX = 876; // X-coordinate from Paint
  const hobbitonY = 479; // Y-coordinate from Paint

  L.marker([imageHeight - hobbitonY, hobbitonX]) // Convert Y-coordinate
    .addTo(map)
    .bindPopup('Hobbiton')
    .openPopup();
  
  const breeX = 1027; // X-coordinate from Paint
  const breeY = 483; // Y-coordinate from Paint

  // Add a marker for demonstration
  L.marker([imageHeight - breeX, breeY]) // Coordinates in the same scale as the image dimensions
    .addTo(map)
    .bindPopup('Bree')
    .openPopup(); 
    
  const rivendellX = 1363; // X-coordinate from Paint
  const rivendellY = 458; // Y-coordinate from Paint

  L.marker([imageHeight - rivendellX, rivendellY]) // Coordinates in the same scale as the image dimensions
    .addTo(map)
    .bindPopup('Rivendell')
    .openPopup();  