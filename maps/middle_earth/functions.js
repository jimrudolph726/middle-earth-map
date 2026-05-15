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

        <div class="lore-popup__notes lore-popup__notes--scrollable">
          <p class="lore-popup__notes-text">${description}</p>
        </div>

        <a class="lore-popup__link" href="${url}" target="_blank" rel="noopener noreferrer">Read More</a>
      </div>
    </article>
  `;
};

const campsitePopupOptions = {
  className: 'campsite-popup-shell',
  maxWidth: 520,
  autoPanPadding: [24, 24],
};

const lorePopupOptions = {
  className: 'lore-popup-shell',
  maxWidth: 760,
  autoPanPadding: [24, 24],
};

export const createMarkerClusterGroup = (options = {}) => {
  return L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    // The map tops out at zoom 20, so decluster before the final zoom step.
    disableClusteringAtZoom: 19,
    maxClusterRadius: 25,
    ...options,
  });
};

const markerRegistry = new Map();
let campsiteHoverPopupsEnabled = true;
const MARKER_HOVER_CLASS = 'atlas-marker-icon--hover';
const MARKER_HOVER_BOUNCE_CLASS = 'atlas-marker-icon--hover-bounce';

export const setCampsiteHoverPopupsEnabled = (enabled) => {
  campsiteHoverPopupsEnabled = enabled;
};

export const getMarkerFromRegistry = (groupName, markerKey) => {
  return markerRegistry.get(groupName)?.[markerKey] || null;
};

export const getMarkerGroupFromRegistry = (groupName) => {
  return groupName ? markerRegistry.get(groupName) || null : null;
};

export const getOrBuildMarkers = (locations, campsite = 'no', groupName = null) => {
  if (groupName) {
    const cachedMarkers = markerRegistry.get(groupName);

    if (cachedMarkers) {
      return cachedMarkers;
    }
  }

  return buildMarkers(locations, campsite, groupName);
};

const updateMarkerHoverState = (marker, isHovering = false) => {
  marker.setOpacity(isHovering ? 0.5 : 1);

  const markerElement = marker.getElement();

  if (!markerElement) {
    return;
  }

  markerElement.classList.add('atlas-marker-icon');
  markerElement.style.opacity = isHovering ? '0.5' : '1';

  if (!isHovering) {
    markerElement.classList.remove(MARKER_HOVER_CLASS, MARKER_HOVER_BOUNCE_CLASS);
    return;
  }

  markerElement.classList.add(MARKER_HOVER_CLASS);
  markerElement.classList.remove(MARKER_HOVER_BOUNCE_CLASS);
  void markerElement.offsetWidth;
  markerElement.classList.add(MARKER_HOVER_BOUNCE_CLASS);
};

const attachMarkerHoverAnimation = (marker) => {
  marker.on('add', () => {
    updateMarkerHoverState(marker, false);
  });

  marker.on('mouseover', () => {
    updateMarkerHoverState(marker, true);
  });

  marker.on('mouseout', () => {
    updateMarkerHoverState(marker, false);
  });

  marker.on('remove', () => {
    updateMarkerHoverState(marker, false);
  });
};

export const buildMarkers = (locations, campsite = 'no', groupName = null) => {
  const markers = Object.keys(locations).reduce((acc, key) => {
    const { coords, icon, popup } = locations[key];

    const popupOptions = campsite == 'campsite'
      ? campsitePopupOptions
      : lorePopupOptions;

    const marker = L.marker(coords, { icon }).bindPopup(popup, { ...popupOptions });
    attachMarkerHoverAnimation(marker);

    if (campsite == 'campsite') {
      marker.on('mouseover', () => {
        if (campsiteHoverPopupsEnabled) {
          marker.openPopup();
        }
      });
      marker.on('mouseout', () => {
        if (campsiteHoverPopupsEnabled) {
          marker.closePopup();
        }
      });
    }

    acc[key] = marker;
    return acc;
  }, {});

  if (groupName) {
    markerRegistry.set(groupName, markers);
  }

  return markers;
};

// Checkbox listener functions
export const MarkerListeners = (checkboxId, markerData, map) => {
  const checkbox = document.getElementById(checkboxId);

  if (!checkbox) {
    console.error(`Checkbox with ID "${checkboxId}" not found in the DOM.`);
    return;
  }

  // 👇 Detect if clustering is being used
  const isClustered = markerData && markerData.clusterGroup;

  let markersArray = [];
  let clusterGroup = null;

  if (isClustered) {
    const { markers, clusterGroup: resolvedClusterGroup } = markerData;
    markersArray = Array.isArray(markers) ? markers : Object.values(markers);
    clusterGroup = resolvedClusterGroup;
  } else {
    markersArray = Array.isArray(markerData)
      ? markerData
      : Object.values(markerData);
  }

  const toggleMarkers = () => {
    if (isClustered) {
      markersArray.forEach((marker) => {
        const markerIsClustered = clusterGroup.hasLayer(marker);

        if (checkbox.checked && !markerIsClustered) {
          clusterGroup.addLayer(marker);
        }

        if (!checkbox.checked && markerIsClustered) {
          clusterGroup.removeLayer(marker);
        }
      });

      if (clusterGroup.getLayers().length > 0) {
        if (!map.hasLayer(clusterGroup)) {
          map.addLayer(clusterGroup);
        }
      } else if (map.hasLayer(clusterGroup)) {
        map.removeLayer(clusterGroup);
      }
    } else {
      markersArray.forEach(marker =>
        checkbox.checked ? marker.addTo(map) : map.removeLayer(marker)
      );
    }
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
export const createMarkers = (locations, campsite = 'no', clusterGroup = null, groupName = null) => {
  return new Promise((resolve) => {
    const markers = getOrBuildMarkers(locations, campsite, groupName);

    Object.values(markers).forEach((marker) => {
      if (clusterGroup) {
        clusterGroup.addLayer(marker);
      }
    });

    resolve({
      markers,
      clusterGroup
    });
  });
};

// Paths and Geographic Features function
const geographicLayerCache = new Map();
const geographicShapeGroupCache = new Map();

const buildGeographicLayer = async (geographicItem) => {
  const {
    pathName,
    color,
    outlineColor,
    outlineWeight,
    name,
    PopupContent,
    tolerance,
    weight,
    arrows,
  } = geographicItem;
  const geojsonPath = new URL(`./geojson_files/${pathName}.geojson`, import.meta.url);
  const response = await fetch(geojsonPath);

  if (!response.ok) {
    throw new Error(`Failed to load ${geojsonPath} (${response.status})`);
  }

  const data = await response.json();
  const outlinePolygon = outlineColor
    ? L.geoJSON(data, {
        style: {
          color: outlineColor,
          weight: outlineWeight ?? ((weight ?? 5) + 4),
          fillOpacity: 0,
        },
        interactive: false,
      })
    : null;

  // Create the visible path after the outline so it renders above it.
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
        const popup = L.popup({ ...lorePopupOptions })
          .setLatLng(e.latlng)
          .setContent(PopupContent || `Name: ${name}`);
        popup.openOn(layer._map);
      });
    }
  });

  if (arrows) {
    polygon.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        layer.arrowheads({
          size: '16px',
          frequency: '120px',
          yawn: 25,
          fill: true,
          color: '#222',
        });
      }
    });
  }

  if (pathName == 'minhiriath') {
    polygon.bringToFront();
  }

  return outlinePolygon
    ? L.layerGroup([outlinePolygon, polygon])
    : polygon;
};

export const loadGeographicLayer = (geographicItem) => {
  const cacheKey = geographicItem.pathName;
  const cachedLayerPromise = geographicLayerCache.get(cacheKey);

  if (cachedLayerPromise) {
    return cachedLayerPromise;
  }

  const layerPromise = buildGeographicLayer(geographicItem).catch((error) => {
    geographicLayerCache.delete(cacheKey);
    throw error;
  });

  geographicLayerCache.set(cacheKey, layerPromise);
  return layerPromise;
};

export const LazyLayerListeners = (items, map) => {
  Object.entries(items).forEach(([key, geographicItem]) => {
    const checkbox = document.getElementById(`${key}Checkbox`);

    if (!checkbox) {
      return;
    }

    const toggleLayer = () => {
      const cachedLayerPromise = geographicLayerCache.get(geographicItem.pathName);

      if (!checkbox.checked) {
        if (!cachedLayerPromise) {
          return;
        }

        cachedLayerPromise
          .then((layer) => {
            if (!checkbox.checked && map.hasLayer(layer)) {
              map.removeLayer(layer);
            }
          })
          .catch((error) => {
            console.error(`Error unloading layer for ${key}:`, error);
          });
        return;
      }

      loadGeographicLayer(geographicItem)
        .then((layer) => {
          if (checkbox.checked && !map.hasLayer(layer)) {
            layer.addTo(map);
          }
        })
        .catch((error) => {
          console.error(`Error fetching data for ${key}:`, error);
        });
    };

    checkbox.addEventListener('change', toggleLayer);
    toggleLayer();
  });
};

export const LazyShapeGroupListeners = (checkboxId, geographicData, map) => {
  const checkbox = document.getElementById(checkboxId);

  if (!checkbox) {
    return;
  }

  const loadShapeGroup = () => {
    const cachedGroupPromise = geographicShapeGroupCache.get(checkboxId);

    if (cachedGroupPromise) {
      return cachedGroupPromise;
    }

    const groupPromise = createGeographicShape(geographicData).catch((error) => {
      geographicShapeGroupCache.delete(checkboxId);
      throw error;
    });

    geographicShapeGroupCache.set(checkboxId, groupPromise);
    return groupPromise;
  };

  const toggleShapes = () => {
    const cachedGroupPromise = geographicShapeGroupCache.get(checkboxId);

    if (!checkbox.checked) {
      if (!cachedGroupPromise) {
        return;
      }

      cachedGroupPromise
        .then((shapes) => {
          if (!checkbox.checked) {
            Object.values(shapes).forEach((shape) => {
              if (shape && map.hasLayer(shape)) {
                map.removeLayer(shape);
              }
            });
          }
        })
        .catch((error) => {
          console.error(`Error unloading layer group for ${checkboxId}:`, error);
        });
      return;
    }

    loadShapeGroup()
      .then((shapes) => {
        if (!checkbox.checked) {
          return;
        }

        Object.values(shapes).forEach((shape) => {
          if (shape && !map.hasLayer(shape)) {
            shape.addTo(map);
          }
        });
      })
      .catch((error) => {
        console.error(`Error fetching data for ${checkboxId}:`, error);
      });
  };

  checkbox.addEventListener('change', toggleShapes);
  toggleShapes();
};

export const createGeographicShape = async (geographic_data) => {
  const polygons = {};
  const promises = Object.keys(geographic_data).map(async (key) => {
    try {
      polygons[key] = await loadGeographicLayer(geographic_data[key]);
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
    }
  });

  await Promise.all(promises);
  return polygons;
};
