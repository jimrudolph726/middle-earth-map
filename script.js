// Initialize the map
var map = L.map('map').setView([0, 0], 2); // Set initial coordinates and zoom level

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Optionally, you can center the map on a specific location
map.setView([34.0, -118.0], 5); // Example coordinates for a location in Middle-Earth (e.g., Minas Tirith)

// Add a marker to a location
L.marker([34.0, -118.0]).addTo(map)
    .bindPopup('<b>Minas Tirith</b><br>Capital of Gondor')
    .openPopup();
