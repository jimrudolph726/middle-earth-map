// Initialize the map
var map = L.map('map').setView([0, 0], 2); // Set initial coordinates and zoom level

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add the georeferenced map image overlay
L.imageOverlay('https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/middle-earth.tif', 
               [[-60, -150], [60, 150]])  // Adjust the bounds to match your image
    .addTo(map);

// Load the GeoJSON file from the GitHub repository
fetch('https://raw.githubusercontent.com/your-username/your-repository/main/points.geojson')
    .then(response => response.json())
    .then(data => {
        // Add the GeoJSON data to the map
        L.geoJSON(data).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON file:', error);
    });
