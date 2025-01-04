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
  
// Function to create path markers from a locations dictionary
export const createpathMarkers = (locations) => {
  return Object.keys(locations).reduce((acc, key) => {
    const { coords, popup } = locations[key];
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