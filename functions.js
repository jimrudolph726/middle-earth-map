// functions.js

  // In functions.js
  export function createIcon(url) {
    return L.icon({
      iconUrl: url,
      iconSize: [48, 48],  // Adjust size as needed
      iconAnchor: [16, 32],
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

// Function to handle multiple markers or overlays with a single checkbox
export const addCheckboxListenerMultiple = (checkboxId, markers, map) => {
  document.getElementById(checkboxId).addEventListener('change', (event) => {
    // Loop through the markers object and call addCheckboxListenerSingle for each marker
    Object.values(markers).forEach((marker) => {
      addCheckboxListenerSingle(checkboxId, marker, map); // Apply to each marker
    });
  });
};

// export const addCheckboxListenerMultiple = (checkboxId, markers, map) => {
//   Object.values(markers).forEach((marker) => {
//     // Send each marker and checkboxId to addCheckboxListener
//     addCheckboxListenerSingle(checkboxId, marker, map);
//   });
// };