// functions.js

export const addCheckboxListener = (checkboxId, element) => {
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
  
  const addCheckboxListenersForLocations = (markers, checkboxId) => {
    Object.values(markers).forEach((marker) => {
      // Send each marker and checkboxId to addCheckboxListener
      addCheckboxListener(checkboxId, marker);
    });
  };