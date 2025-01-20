// functions.js

// Helper functions
export const createCampsitePopup = (date, hoursTravelled, mileage, milesPerHour, comments, campsite) => {
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
export const createGeographicPopup = (name, elvish_name, elvish_meaning, description, url) => {
  return `
    <div onclick="const content = this.querySelector('.popup-content'); 
                   content.style.display = content.style.display === 'block' ? 'none' : 'block';">
        <h3>${name}</h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sindarin Elvish Name</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${elvish_name}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sindarin Elvish Meaning</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${elvish_meaning}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <td style="border: 1px solid #ddd; padding: 8px;">${description}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Learn more on Thain's Book</th>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <a href="${url}" target="_blank" rel="noopener noreferrer">Visit</a>
                </td>
            </tr>
        </table>
        <div class="popup-content" style="display: none; margin-top: 10px;">
            Additional content goes here.
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

// Campsites and Settlements function
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

// Paths function
export const createPolyline = async (paths) => {
  const polylines = {};
  const promises = Object.keys(paths).map(async (key) => {
    const { pathName, color } = paths[key];
    const geojsonPath = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/geojson_files/' + pathName + '.geojson';

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();

      // Handle both LineString and MultiLineString
      const geometry = data.features[0].geometry;
      let latLngs = [];

      if (geometry.type === 'LineString') {
        latLngs = geometry.coordinates.map(coord => [coord[1], coord[0]]);
      } else if (geometry.type === 'MultiLineString') {
        latLngs = geometry.coordinates.flat().map(coord => [coord[1], coord[0]]);
      }

      const polyline = L.polyline(latLngs, { color, weight: 5, opacity: 0.8 }).arrowheads({
        size: '20px',       // Size of the arrows
        frequency: '75px',   // Frequency of arrows along the path
        yawn: 30,           // Width of the opening of the arrowhead
        fill: true,
      });

      polylines[key] = polyline;
      console.log(`Polyline created and added for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
  return polylines;
};

// Geographic Features functions
export const createPolygon = async (geographic_data) => {
  const polygons = {};
  const promises = Object.keys(geographic_data).map(async (key) => {
    const { pathName, color, name, PopupContent } = geographic_data[key];
    const geojsonPath = `https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/geojson_files/${pathName}.geojson`;

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
          // Disable hover-based style changes
          layer.on('mouseover', () => {
            layer.setStyle({
              weight: 2, // Keep original styles
              color: layer.options.color,
              fillOpacity: 0.5,
            });
          });
          layer.on('mouseout', () => {
            layer.setStyle({
              weight: 2, // Reset styles to original
              color: layer.options.color,
              fillOpacity: 0.5,
            });
          });
        
          // Add tooltip
          layer.bindTooltip(name, {
            direction: "top",
            className: "polygon-label",
            permanent: false,
          });
        
          // Add click event
          layer.on('click', (e) => {
            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(PopupContent || `Name: ${name}`)
              .openOn(layer._map);
          });
        }
        
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
