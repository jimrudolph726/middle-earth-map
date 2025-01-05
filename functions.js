// functions.js

  // In functions.js
  export function createIcon(url) {
    return L.icon({
      iconUrl: url,
      iconSize: [48, 48],  // Adjust size as needed
      iconAnchor: [32, 32],
      popupAnchor: [0, -32],
    });
  }

  // Function to convert the Y-coordinate
export function convertYCoordinate(imageHeight, y) {
  return imageHeight - y;
}
  
// Function to create markers from a locations dictionary
export const createMarkers = (locations) => {
  return Object.keys(locations).reduce((acc, key) => {
    const { coords, icon, popup } = locations[key];
    const marker = L.marker(coords, { icon }).bindPopup(popup);
    acc[key] = marker;
    return acc;
  }, {});
};

export const addCheckboxListenerSingle = (checkboxId, element, map) => {
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

export const addCheckboxListenerMultiple = (checkboxId, markers, map) => {
  const checkbox = document.getElementById(checkboxId);

  // Ensure markers is an array (if it's not, make it an array of a single element)
  const markersArray = Array.isArray(markers) ? markers : Object.values(markers);

  // Function to add/remove markers based on checkbox state
  const toggleMarkers = () => {
    markersArray.forEach(marker => 
      checkbox.checked ? marker.addTo(map) : map.removeLayer(marker)
    );
  };

  // Attach the change event listener
  checkbox.addEventListener('change', toggleMarkers);

  // Trigger toggleMarkers on load based on the initial checkbox state
  toggleMarkers();
};

export const createPolyline = (paths) => {
  const polylines = {}; // Object to store polylines by their keys

  // Loop through each path in the paths object
  Object.keys(paths).forEach((key) => {
    const { pathName, color, map } = paths[key];

    // Define the URL to the GeoJSON file
    const geojsonPath = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/' + pathName + '.geojson';

    // Fetch the GeoJSON data directly
    fetch(geojsonPath)
      .then((response) => response.json())
      .then((data) => {
        // Extract the coordinates from the GeoJSON
        const coordinates = data.features[0].geometry.coordinates;

        // Flatten the array if it's nested too deeply (if needed)
        const flatCoordinates = coordinates.flat();

        // Convert GeoJSON coordinates (lon, lat) to Leaflet format (lat, lon)
        const latLngs = flatCoordinates.map(coord => [coord[1], coord[0]]);

        // Create a polyline using the coordinates and color
        const polyline = L.polyline(latLngs, {
          color: color,     // Use the passed color for the polyline
          weight: 5,         // Line thickness
          opacity: 0.8,      // Line opacity
        });

        // Optionally, you can log the polyline to verify it's added
        console.log(polyline);

        // Add the polyline to the map
        // polyline.addTo(map);

        // Store the polyline in the polylines object
        polylines[key] = polyline;

        // Optionally, you can also log this
        console.log(`${key} polyline added to map.`);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON for ' + pathName + ':', error);
      });
  });

  // Return the polylines object
  return polylines;
};



export const addpolylineCheckboxListeners = (polylines, map) => {
  // Loop through each key in the polylines object
  Object.keys(polylines).forEach((key) => {
    console.log(`Processing polyline: ${key}`); // Debug log
    const checkboxId = `${key}Checkbox`;
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
      console.log(`Checkbox found: ${checkboxId}`); // Debug log
      checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
          polylines[key].addTo(map);
          console.log(`${key} polyline added to map.`);
        } else {
          map.removeLayer(polylines[key]);
          console.log(`${key} polyline removed from map.`);
        }
      });
    } else {
      console.warn(`Checkbox with ID '${checkboxId}' not found for polyline '${key}'.`);
    }
  });
};

