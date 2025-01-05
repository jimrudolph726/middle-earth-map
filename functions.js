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


// Function to create overlays
export const createPaths = (data, bounds) => {
  const overlays = {};
  data.forEach(({ name, url }) => {
    overlays[name] = L.imageOverlay(url, bounds);
  });
  return overlays;
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
  // Create an array of promises for each fetch operation
  const polylinePromises = Object.keys(paths).map((key) => {
    const { pathName, color, map } = paths[key];

    // Define the URL to the GeoJSON file
    const geojsonPath = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/' + pathName + '.geojson';

    // Return a promise for each polyline
    return fetch(geojsonPath)
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

        // Return an object with the key and polyline
        return { [key]: polyline };
      })
      .catch((error) => {
        console.error('Error loading GeoJSON for ' + pathName + ':', error);
      });
  });

  // Wait for all fetch operations to complete
  return Promise.all(polylinePromises)
    .then((results) => {
      // Combine the results into a single object
      const polylines = results.reduce((acc, result) => {
        return { ...acc, ...result };
      }, {});

      // After the polylines are created, add checkbox listeners
      console.log('Polylines:', polylines);
      Object.keys(polylines).forEach((key) => {
        addCheckboxListenerSingle(`${key}Checkbox`, polylines[key], map);
      });

      // Return the polylines object so it can be used further
      return polylines;
    })
    .catch((error) => {
      console.error('Error creating polylines:', error);
    });
};
