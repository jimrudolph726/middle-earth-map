import {
  buildMarkers,
} from './functions.js';
import {
  dwarves,
  elves,
  enemies,
  hobbits,
  men,
} from './settlement_item_data.js';
import {
  map,
} from './variables.js';

const FRONTISPIECE_STORAGE_KEY = 'middle-earth-atlas:frontispiece-seen:v1';
const FEATURED_PLACES_PANE_ID = 'featuredPlaces';
const FRONTISPIECE_PANE_ID = 'frontispiece';
const MOBILE_MAP_QUERY = window.matchMedia('(max-width: 767px)');
const REDUCED_MOTION_QUERY = window.matchMedia('(prefers-reduced-motion: reduce)');

const FEATURED_PLACE_DEFINITIONS = [
  { id: 'hobbiton', name: 'Hobbiton', location: hobbits.hobbiton },
  { id: 'rivendell', name: 'Rivendell', location: elves.rivendell },
  { id: 'khazad-dum', name: 'Khazad-dûm', location: dwarves.khazad_dûm },
  { id: 'lothlorien', name: 'Lothlórien', location: elves.lothlorien },
  { id: 'edoras', name: 'Edoras', location: men.edoras },
  { id: 'minas-tirith', name: 'Minas Tirith', location: men.minastirith },
  { id: 'erebor', name: 'Erebor', location: dwarves.erebor },
  { id: 'barad-dur', name: 'Barad-dûr', location: enemies.barad_dur },
];

const featuredMarkers = buildMarkers(Object.fromEntries(
  FEATURED_PLACE_DEFINITIONS.map(({ id, location }) => [id, location])
));

FEATURED_PLACE_DEFINITIONS.forEach(({ id, name }) => {
  const marker = featuredMarkers[id];

  if (marker) {
    marker.options.alt = name;
    marker.options.title = name;
  }
});

const featuredPlacesLayer = L.featureGroup(Object.values(featuredMarkers));

const readFrontispieceSeen = () => {
  try {
    return window.localStorage.getItem(FRONTISPIECE_STORAGE_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

const rememberFrontispiece = () => {
  try {
    window.localStorage.setItem(FRONTISPIECE_STORAGE_KEY, 'true');
  } catch (error) {
    // The frontispiece still works when private storage is unavailable.
  }
};

const announceFeaturedPlacesChange = (enabled) => {
  document.dispatchEvent(new CustomEvent('atlas:layerchange', {
    detail: { source: 'featured-places', enabled }
  }));
};

const getDesktopMapPadding = () => {
  const sidebarElement = document.getElementById('sidebar');
  const sidebarIsOpen = sidebarElement && !sidebarElement.classList.contains('collapsed');
  const sidebarWidth = sidebarIsOpen && !MOBILE_MAP_QUERY.matches
    ? sidebarElement.getBoundingClientRect().width
    : 0;

  return {
    paddingTopLeft: [sidebarWidth + 38, 38],
    paddingBottomRight: [38, 38],
  };
};

const activateFeaturedPlaces = () => {
  if (!map.hasLayer(featuredPlacesLayer)) {
    featuredPlacesLayer.addTo(map);
    announceFeaturedPlacesChange(true);
  }

  document.querySelectorAll('[data-featured-place]').forEach((button) => {
    button.classList.remove('is-active');
    button.removeAttribute('aria-current');
  });

  const bounds = featuredPlacesLayer.getBounds();

  if (bounds.isValid()) {
    map.fitBounds(bounds, {
      ...getDesktopMapPadding(),
      animate: !REDUCED_MOTION_QUERY.matches,
      maxZoom: 16,
    });
  }
};

const deactivateFeaturedPlaces = () => {
  if (!map.hasLayer(featuredPlacesLayer)) {
    return;
  }

  map.closePopup();
  map.removeLayer(featuredPlacesLayer);
  announceFeaturedPlacesChange(false);
};

const shiftMarkerIntoReadingArea = () => {
  const sidebarElement = document.getElementById('sidebar');

  if (!sidebarElement || sidebarElement.classList.contains('collapsed') || MOBILE_MAP_QUERY.matches) {
    return;
  }

  const sidebarOffset = Math.min(sidebarElement.getBoundingClientRect().width / 2, 230);
  map.panBy([-sidebarOffset, -42], { animate: false });
};

const focusFeaturedPlace = (placeId, sidebar) => {
  const marker = featuredMarkers[placeId];

  if (!marker) {
    return;
  }

  if (!map.hasLayer(featuredPlacesLayer)) {
    featuredPlacesLayer.addTo(map);
    announceFeaturedPlacesChange(true);
  }

  document.querySelectorAll('[data-featured-place]').forEach((button) => {
    const isCurrentPlace = button.dataset.featuredPlace === placeId;
    button.classList.toggle('is-active', isCurrentPlace);

    if (isCurrentPlace) {
      button.setAttribute('aria-current', 'location');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  if (MOBILE_MAP_QUERY.matches) {
    sidebar.close();
  }

  map.stop();

  let placeRevealed = false;
  const revealPlace = () => {
    if (placeRevealed) {
      return;
    }

    placeRevealed = true;
    shiftMarkerIntoReadingArea();
    marker.openPopup();
  };

  map.once('moveend', revealPlace);

  if (REDUCED_MOTION_QUERY.matches) {
    map.setView(marker.getLatLng(), 18, { animate: false });
  } else {
    map.flyTo(marker.getLatLng(), 18, { animate: true, duration: 0.65 });
  }

  window.setTimeout(revealPlace, REDUCED_MOTION_QUERY.matches ? 80 : 900);
};

const focusPaneHeading = (paneId) => {
  window.requestAnimationFrame(() => {
    const heading = document.querySelector(`#${CSS.escape(paneId)} .sidebar-header`);

    if (!heading) {
      return;
    }

    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  });
};

export const initializeAtlasFrontispiece = ({ sidebar } = {}) => {
  if (!sidebar) {
    return;
  }

  const sidebarElement = document.getElementById('sidebar');
  const forcedFrontispiece = new URLSearchParams(window.location.search).get('frontispiece') === '1';
  let activePaneId = null;

  const openPane = (paneId, { focusHeading = true } = {}) => {
    sidebar.open(paneId);

    if (focusHeading) {
      focusPaneHeading(paneId);
    }
  };

  sidebar.on('content', ({ id }) => {
    if (activePaneId === FRONTISPIECE_PANE_ID && id !== FRONTISPIECE_PANE_ID) {
      rememberFrontispiece();
    }

    activePaneId = id;

    if (id !== FEATURED_PLACES_PANE_ID) {
      deactivateFeaturedPlaces();
    }
  });

  document.querySelectorAll('[data-frontispiece-action]').forEach((button) => {
    button.addEventListener('click', () => {
      rememberFrontispiece();

      if (button.dataset.frontispieceAction === 'places') {
        openPane(FEATURED_PLACES_PANE_ID);
        activateFeaturedPlaces();
        return;
      }

      if (button.dataset.frontispieceAction === 'journey') {
        openPane('stories');
        return;
      }

      if (button.dataset.frontispieceAction === 'atlas') {
        openPane('atlasIndex');
      }
    });
  });

  document.querySelectorAll('[data-atlas-pane]').forEach((button) => {
    button.addEventListener('click', () => {
      openPane(button.dataset.atlasPane);
    });
  });

  document.querySelectorAll('[data-featured-place]').forEach((button) => {
    button.addEventListener('click', () => {
      focusFeaturedPlace(button.dataset.featuredPlace, sidebar);
    });
  });

  if (sidebarElement) {
    new MutationObserver(() => {
      if (sidebarElement.classList.contains('collapsed') && activePaneId === FRONTISPIECE_PANE_ID) {
        rememberFrontispiece();
      }
    }).observe(sidebarElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  const requestedPaneId = decodeURIComponent(window.location.hash.slice(1));
  const requestedPane = requestedPaneId
    ? document.getElementById(requestedPaneId)
    : null;
  const hasRequestedSidebarPane = requestedPane?.classList.contains('sidebar-pane');

  window.requestAnimationFrame(() => {
    if (hasRequestedSidebarPane) {
      openPane(requestedPaneId, { focusHeading: false });

      if (requestedPaneId === FEATURED_PLACES_PANE_ID) {
        activateFeaturedPlaces();
      }
      return;
    }

    if (forcedFrontispiece || !readFrontispieceSeen()) {
      openPane(FRONTISPIECE_PANE_ID, { focusHeading: false });
    }
  });
};
