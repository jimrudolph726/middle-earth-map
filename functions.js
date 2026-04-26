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
    <article class="campsite-popup">
      <div class="campsite-popup__frame">
        <h3 class="campsite-popup__title">${date}</h3>
        <p class="campsite-popup__subtitle">${campsite}</p>

        <div class="campsite-popup__details">
          <div class="campsite-popup__row">
            <span class="campsite-popup__label">Hours on the Road</span>
            <span class="campsite-popup__value">${hoursTravelled}</span>
          </div>
          <div class="campsite-popup__row">
            <span class="campsite-popup__label">Miles Traveled</span>
            <span class="campsite-popup__value">${mileage}</span>
          </div>
          <div class="campsite-popup__row">
            <span class="campsite-popup__label">Pace</span>
            <span class="campsite-popup__value">${milesPerHour} mph</span>
          </div>
        </div>

        <div class="campsite-popup__notes">
          <p class="campsite-popup__notes-label">Notes from the Road</p>
          <p class="campsite-popup__notes-text">${comments}</p>
        </div>
      </div>
    </article>
  `;
};
export const createGeographicPopup = (name, elvish_name, elvish_meaning, description, url) => {
  return `
    <article class="lore-popup lore-popup--geography">
      <div class="lore-popup__frame">
        <h3 class="lore-popup__title">${name}</h3>

        <div class="lore-popup__sections">
          <div class="lore-popup__section">
            <div class="lore-popup__section-title">Elvish Name</div>
            <div class="lore-popup__section-text">${elvish_name}</div>
          </div>
          <div class="lore-popup__section">
            <div class="lore-popup__section-title">Meaning</div>
            <div class="lore-popup__section-text">${elvish_meaning}</div>
          </div>
        </div>

        <div class="lore-popup__notes">
          <div class="lore-popup__section-title">Description</div>
          <div class="lore-popup__section-text">${description}</div>
        </div>

        <a class="lore-popup__link" href="${url}" target="_blank" rel="noopener noreferrer">Read More</a>
      </div>
    </article>
  `;
};
export const createSettlementPopup = (name, description, url) => {
  return `
    <article class="lore-popup lore-popup--settlement">
      <div class="lore-popup__frame">
        <h3 class="lore-popup__title">${name}</h3>

        <div class="lore-popup__notes">
          <p class="lore-popup__notes-text">${description}</p>
        </div>

        <a class="lore-popup__link" href="${url}" target="_blank" rel="noopener noreferrer">Read More</a>
      </div>
    </article>
  `;
};

// Checkbox listener functions
export const MarkerListeners = (checkboxId, markers, map) => {
  const checkbox = document.getElementById(checkboxId);

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
      const popupOptions = campsite == 'campsite'
        ? { className: 'campsite-popup-shell', maxWidth: 520 }
        : { className: 'lore-popup-shell', maxWidth: 520 };
      const marker = L.marker(coords, { icon }).bindPopup(popup, popupOptions);

      // Attach specific logic based on whether the campsite variable is 'yes'
      if (campsite == 'campsite') {
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
export const createGeographicShape = async (geographic_data) => {
  const polygons = {};
  const promises = Object.keys(geographic_data).map(async (key) => {
    const { pathName, color, name, PopupContent, tolerance, weight, arrows } = geographic_data[key];
    const geojsonPath = new URL(`./geojson_files/${pathName}.geojson`, import.meta.url);

    try {
      const response = await fetch(geojsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${geojsonPath} (${response.status})`);
      }
      const data = await response.json();
      
      // Create the polygon using the GeoJSON data
      const polygon = L.geoJSON(data, {
        style: {
          color,
          weight: weight ?? 5,
          fillOpacity: 0.5,
        },
        clickTolerance: tolerance,
        onEachFeature: (feature, layer) => {
          // Create a tooltip but do not bind it statically
          const tooltip = L.tooltip({
            permanent: false,
            className: "polygon-label",
            direction: "center",
            offset: L.point(0, 0) // Prevent offset issues
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

          // Add click event
          layer.on('click', (e) => {
            const popup = L.popup({ className: 'lore-popup-shell', maxWidth: 520 })
              .setLatLng(e.latlng)
              .setContent(PopupContent || `Name: ${name}`);
            popup
              .openOn(layer._map);
          });
        }
      });
      
      if (arrows) {
        polygon.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            layer.arrowheads({
              size: '18px',
              frequency: '100px',
              yawn: 25,
              fill: true,
              color: color
            });
          }
        });
      }
          
      // Store the polygon in the polygons object
      if (pathName == 'minhiriath'){
        polygon.bringToFront();
      }
      polygons[key] = polygon;
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises); // Wait for all fetches to complete
  return polygons;
};
