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

export const createPolyline = async (paths) => {
  const polylines = {};
  const promises = Object.keys(paths).map(async (key) => {
    const { pathName, color, map } = paths[key];
    const geojsonPath = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/' + pathName + '.geojson';

    try {
      const response = await fetch(geojsonPath);
      console.log(`Response received for ${key}`);
      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates;
      const flatCoordinates = coordinates.flat();
      const latLngs = flatCoordinates.map(coord => [coord[1], coord[0]]);
      const polyline = L.polyline(latLngs, { color, weight: 5, opacity: 0.8 });
      // polyline.addTo(map);
      polylines[key] = polyline;
      console.log(`Polyline created and added for ${key}`);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
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