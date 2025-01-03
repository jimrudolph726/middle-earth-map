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

export const addCheckboxListenerSingle = (checkboxId, marker, map) => {
  const checkbox = document.getElementById(checkboxId);
  if (checkbox) {
    checkbox.addEventListener('change', (event) => {
      if (event.target.checked) {
        // Add the marker to the map
        marker.addTo(map);
      } else {
        // Remove the marker from the map
        map.removeLayer(marker);
      }
    });
  }
};

export const addCheckboxListenerMultiple = (checkboxIds, markers, map) => {
  checkboxIds.forEach((checkboxId) => {
    const marker = markers[checkboxId];
    if (marker) {
      addCheckboxListenerSingle(checkboxId, marker, map);
    }
  });
};
