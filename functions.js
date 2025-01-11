// functions.js

// Helper functions
export const generatePopupContent = (date, hoursTravelled, mileage, milesPerHour, comments, campsite) => {
  return `
    <div onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
         onmouseout="this.querySelector('.popup-content').style.display = 'none';">
        <h3>${date}</h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${date}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Hours Travelled</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${hoursTravelled}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mileage</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${mileage}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Miles per hour</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${milesPerHour}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Comments</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${comments}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Campsite</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${campsite}</td>
            </tr>
        </table>
        <div class="popup-content" style="display: none; margin-top: 10px;">
        </div>
    </div>
  `;
};

// Checkbox listener functions
export const MarkerListeners = (checkboxId, markers, map) => {
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
export const PathListeners = (items, map) => {
  Object.keys(items).forEach((key) => {
    const checkbox = document.getElementById(`${key}Checkbox`);
    if (checkbox) {
      checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
          // Add the item (polygon or polyline) to the map when checkbox is checked
          items[key].addTo(map);
        } else {
          // Remove the item (polygon or polyline) from the map when checkbox is unchecked
          map.removeLayer(items[key]);
        }
      });
    }
  });
};

// Paths function
export const createPolyline = async (paths) => {
  const polylines = {};
  const promises = Object.keys(paths).map(async (key) => {
    const { pathName, color, map, name } = paths[key]; // Ensure `map` and `name` are properly provided
    const geojsonPath = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/' + pathName + '.geojson';

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();

      // Extract and transform coordinates
      const coordinates = data.features[0].geometry.coordinates;
      const latLngs = coordinates.map(coord => [coord[1], coord[0]]);

      // Create the polyline
      const polyline = L.polyline(latLngs, { color, weight: 5, opacity: 0.8 });

      // Add the polyline to the map
      polyline.addTo(map);

      // Add mouseover event listener to show popup
      polyline.on('mouseover', (e) => {
        const popup = L.popup()
          .setLatLng(e.latlng)
          .setContent(`Path Name: ${name}`) // Display the name of the path
          .openOn(map);
      });

      // Add mouseout event listener to close the popup
      polyline.on('mouseout', () => {
        map.closePopup();
      });

      // Store the polyline in the polylines object
      polylines[key] = polyline;
      console.log(`Polyline created and added for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
  return polylines;
};


// Location function
export const createMarkers = (locations, campsite = 'no') => {
  return new Promise((resolve) => {
    const markers = Object.keys(locations).reduce((acc, key) => {
      const { coords, icon, popup } = locations[key];
      const marker = L.marker(coords, { icon }).bindPopup(popup);

      // Attach specific logic based on whether the campsite variable is 'yes'
      if (campsite === 'campsite') {
        marker.on('mouseover', () => marker.openPopup());
        marker.on('mouseout', () => marker.closePopup());
      }

      acc[key] = marker;
      return acc;
    }, {});

    resolve(markers); // Resolve the promise with the created markers
  });
};

// Geographic Features functions
export const createPolygon = async (ranges) => {
  const polygons = {};
  const promises = Object.keys(ranges).map(async (key) => {
    const { mountain_range_name, color, name } = ranges[key];
    const geojsonPath = `https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/${mountain_range_name}.geojson`;

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();

      // Create the polygon using the GeoJSON data
      const polygon = L.geoJSON(data, {
        style: {
          color,
          weight: 2,
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          // Add interactivity for mouseover and mouseout
          layer.bindTooltip(name, {
            permanent: true, // Set to true to make the label always visible
            direction: "center", // Display the label at the center of the polygon
            className: "polygon-label", // Optional: Add a custom CSS class for styling
          });
          layer.on('click', (e) => {
            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(`Name: ${name}`)
              .openOn(layer._map); // Use the map instance to display the popup
          });
        },
      });

      // Store the polygon in the polygons object
      polygons[key] = polygon;
      console.log(`Polygon created for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
  return polygons;
};
