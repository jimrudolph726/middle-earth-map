// functions.js

// Helper functions
export function createIcon(url, size = [48, 48]) {
  return L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
}
export const createCampsitePopup = (date, hoursTravelled, mileage, milesPerHour, comments, campsite) => {
  return `
    <div style="width: 100%; background-color: white; border: 1px solid #ddd; padding: 10px; box-sizing: border-box; margin: auto;" 
         onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
         onmouseout="this.querySelector('.popup-content').style.display = 'none';">
        <h3>${date}</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px; font-size: 14px;">
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
                <td style="border: 1px solid #ddd; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">${name}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sindarin Elvish Name</th>
                <td style="border: 1px solid #ddd; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">${elvish_name}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sindarin Elvish Meaning</th>
                <td style="border: 1px solid #ddd; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">${elvish_meaning}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <td style="border: 1px solid #ddd; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">${description}</td>
            </tr>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Learn more here</th>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <a href="${url}" target="_blank" rel="noopener noreferrer">Visit</a>
                </td>
            </tr>
        </table>
        <div class="popup-content" style="display: none; margin-top: 10px;">
        </div>
    </div>
  `;
};
export const createSettlementPopup = (name, description, url) => {
  return`<div>
    <h3 style="font-size: 24px;">${name}</h3>
  <p style="font-size: 18px;">${description}</p>
    <button onclick="window.open('${url}', '_blank');" 
            style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
      Learn more here
    </button>
  </div>`;
};

// Checkbox listener functions
export const MarkerListeners = (checkboxId, markers, map) => {
  const checkbox = document.getElementById(checkboxId);
  console.log(`Looking for checkbox with ID: ${checkboxId}`, checkbox); // Debugging line

  if (!checkbox) {
    console.error(`Checkbox with ID "${checkboxId}" not found in the DOM.`);
    return; // Exit the function early
  }

  const markersArray = Array.isArray(markers) ? markers : Object.values(markers);

  const toggleMarkers = () => {
    markersArray.forEach(marker => 
      checkbox.checked ? marker.addTo(map) : map.removeLayer(marker)
    );
  };

  checkbox.addEventListener('change', toggleMarkers);
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

// Paths and Geographic Features function
export const createGeographicShape = async (geographic_data, map) => {
  const polygons = {};
  const promises = Object.keys(geographic_data).map(async (key) => {
    const { pathName, color, name, PopupContent, tolerance, weight } = geographic_data[key];
    const geojsonPath = `https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/beleriand/geojson_files/${pathName}.geojson`;

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();
      console.log(`Data for ${key}:`, data);

      let polyline;  // Declare polyline variable

      // Create either a polygon (default) or polyline if pathName includes "path"
      const geoLayer = L.geoJSON(data, {
        style: {
          color,
          weight: 5,
          fillOpacity: 0.5,
        },
        clickTolerance: tolerance,
        onEachFeature: (feature, layer) => {
          const tooltip = L.tooltip({
            permanent: false,
            className: "polygon-label",
            direction: "center",
            offset: L.point(0, 0)
          });

          layer.on('mousemove', (e) => {
            tooltip.setLatLng(e.latlng).setContent(name);
            if (!layer._map.hasLayer(tooltip)) {
              tooltip.addTo(layer._map);
            }
          });

          layer.on('mouseout', () => {
            if (layer._map.hasLayer(tooltip)) {
              layer._map.removeLayer(tooltip);
            }
          });

          layer.on('click', (e) => {
            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(PopupContent || `Name: ${name}`)
              .openOn(layer._map);
          });
        }
      });

      // If pathName contains "path", extract coordinates and create a Polyline
      if (pathName.toLowerCase().includes("path")) {
        const coordinates = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        console.log(`Coordinates for ${key}:`, coordinates);
        polyline = L.polyline(coordinates, { color, weight: 5 }).addTo(map);
        console.log(`Polyline created for ${key}:`, polyline);
        
        setTimeout(() => {
          polyline.arrowheads({
            fill: true,
            frequency: 'endonly',
            size: '15px',
            yawn: 60
          });
          console.log(`Arrowheads added to polyline for ${key}`);
        }, 500);
        
        polygons[key] = polyline;  // Store polyline instead of GeoJSON layer
      } else {
        polygons[key] = geoLayer;  // Store normal geoJSON layer if not a path
      }

      console.log(`Polygon created for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises);
  return polygons;
};



