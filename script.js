// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use simple coordinate reference system for flat maps
    minZoom: -2, // Allows zooming out to see the whole image
  });
  
  // Image dimensions (adjust to your image's width and height)
  const imageWidth = 2500;
  const imageHeight = 1667;
  
  // Define the image bounds ([top-left corner, bottom-right corner])
  const imageBounds = [[0, 0], [imageHeight, imageWidth]];
  
  // Add the image as a map layer
  const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth2.png';
  L.imageOverlay(imageUrl, imageBounds).addTo(map);
  
  // Set the view to fit the image
  map.fitBounds(imageBounds);
  
  // Add the Fellowship Path
  const pathCoordinates = [
    [convertYCoordinate(479), 876], // Hobbiton
    [convertYCoordinate(483), 1027], // Bree
    [convertYCoordinate(458), 1363], // Rivendell
  ];
  
  const fellowshipPath = L.polyline(pathCoordinates, { color: 'blue' }).addTo(map);
  
  // Toggle button functionality
  let isPathVisible = false;
  const toggleButton = document.getElementById('toggleButton');
  
  toggleButton.addEventListener('click', () => {
    if (isPathVisible) {
      map.removeLayer(fellowshipPath);
      toggleButton.innerHTML = 'Fellowship Path'; // Change button text
    } else {
      fellowshipPath.addTo(map);
      toggleButton.innerHTML = 'Hide Fellowship Path'; // Change button text
    }
    isPathVisible = !isPathVisible;
  });
  