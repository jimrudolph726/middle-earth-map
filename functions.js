// functions.js

export const addCheckboxListener = (checkboxId, element, map) => {
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

// Function to create markers from a locations dictionary
export const createMarkers = (locations) => {
  return Object.keys(locations).reduce((acc, key) => {
    const { coords, icon, popup } = locations[key];
    const marker = L.marker(coords, { icon }).bindPopup(popup);
    acc[key] = marker;
    return acc;
  }, {});
};
  
// Function to create icons
export const createIcon = (url) => L.icon({
    iconUrl: url,
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
//   const addCheckboxListenersForLocations = (markers, checkboxId) => {
//     Object.values(markers).forEach((marker) => {
//       // Send each marker and checkboxId to addCheckboxListener
//       addCheckboxListener(checkboxId, marker);
//     });
//   };