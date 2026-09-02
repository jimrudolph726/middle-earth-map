(() => {
  const FRONTISPIECE_PANE_ID = 'frontispiece';
  const KNOWN_VOLUMES = ['beleriand', 'numenor', 'middle-earth'];
  const LEGACY_STORAGE_KEYS = {
    'middle-earth': ['middle-earth-atlas:frontispiece-seen:v1'],
  };
  let controller = null;

  const getStorageKey = (volume) => `atlas.frontispiece.${volume}.seen:v1`;

  const readStorage = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // The atlas remains usable when private storage is unavailable.
    }
  };

  const removeStorage = (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // A blocked storage API should not block the settings interface.
    }
  };

  const readIntroductionSeen = (volume) => {
    const storedValue = readStorage(getStorageKey(volume));

    if (storedValue === 'seen' || storedValue === 'true') {
      return true;
    }

    const legacySeen = (LEGACY_STORAGE_KEYS[volume] || []).some(
      (legacyKey) => readStorage(legacyKey) === 'true'
    );

    if (legacySeen) {
      writeStorage(getStorageKey(volume), 'seen');
    }

    return legacySeen;
  };

  const resetAllIntroductions = () => {
    KNOWN_VOLUMES.forEach((volume) => {
      removeStorage(getStorageKey(volume));
      (LEGACY_STORAGE_KEYS[volume] || []).forEach(removeStorage);
    });

    if (controller) {
      controller.seen = false;
    }
  };

  const prepare = () => {
    if (controller) {
      return controller;
    }

    const body = document.body;
    const volume = body?.dataset.atlasVolume;

    if (!body || !KNOWN_VOLUMES.includes(volume)) {
      return null;
    }

    const requestedPaneId = decodeURIComponent(window.location.hash.slice(1));
    const requestedPane = requestedPaneId
      ? document.getElementById(requestedPaneId)
      : null;
    const hasRequestedPane = requestedPane?.classList.contains('sidebar-pane');
    const forcedByQuery = new URLSearchParams(window.location.search).get('frontispiece') === '1';
    const forcedByHash = hasRequestedPane && requestedPaneId === FRONTISPIECE_PANE_ID;
    const forcedFrontispiece = forcedByQuery || forcedByHash;
    const deepLinked = hasRequestedPane && requestedPaneId !== FRONTISPIECE_PANE_ID;
    const seen = readIntroductionSeen(volume);
    const shouldOpenFrontispiece = forcedFrontispiece || (!seen && !deepLinked);
    const state = forcedFrontispiece
      ? 'forced'
      : deepLinked
        ? 'deep-link'
        : seen
          ? 'returning'
          : 'first';
    const cover = document.querySelector('[data-atlas-volume-cover]');
    const useShortCover = state === 'returning' || state === 'deep-link';

    body.dataset.atlasIntroductionState = state;

    controller = {
      volume,
      seen,
      state,
      requestedPaneId: hasRequestedPane ? requestedPaneId : null,
      shouldOpenFrontispiece,
      sidebar: null,
    };

    if (cover) {
      let coverRemoved = false;
      const removeCover = () => {
        if (coverRemoved) {
          return;
        }

        coverRemoved = true;
        cover.remove();
        document.dispatchEvent(new CustomEvent('atlas:volumeopen', {
          detail: {
            volume,
            introductionState: state,
          },
        }));
      };

      cover.dataset.atlasCoverMode = useShortCover ? 'returning' : 'first';
      cover.classList.toggle('atlas-volume-cover--returning', useShortCover);
      cover.addEventListener('animationend', (event) => {
        if (event.target === cover) {
          removeCover();
        }
      }, { once: true });
      window.setTimeout(removeCover, useShortCover ? 1600 : 4800);
    }

    return controller;
  };

  const rememberCurrentIntroduction = () => {
    const current = prepare();

    if (!current || current.seen) {
      return;
    }

    current.seen = true;
    writeStorage(getStorageKey(current.volume), 'seen');
  };

  const connectSidebar = ({ sidebar } = {}) => {
    const current = prepare();

    if (!current || !sidebar || current.sidebar === sidebar) {
      return current;
    }

    current.sidebar = sidebar;

    window.requestAnimationFrame(() => {
      if (current.requestedPaneId) {
        sidebar.open(current.requestedPaneId);
        return;
      }

      if (current.shouldOpenFrontispiece) {
        sidebar.open(FRONTISPIECE_PANE_ID);

        // A normal first visit is complete once its frontispiece is actually
        // presented. Forced previews remain independent of saved visit state.
        if (current.state === 'first') {
          rememberCurrentIntroduction();
        }
        return;
      }

      sidebar.close();
    });

    return current;
  };

  document.addEventListener('click', (event) => {
    const resetButton = event.target.closest('[data-atlas-introduction-reset]');

    if (resetButton) {
      resetAllIntroductions();
      const status = document.querySelector('[data-atlas-introduction-status]');

      if (status) {
        status.textContent = 'Introductions reset. Each volume will reopen its frontispiece on your next visit.';
      }
      return;
    }
  });

  window.AtlasVolumeIntroduction = Object.freeze({
    connectSidebar,
    getStorageKey,
    prepare,
    rememberCurrentIntroduction,
    resetAllIntroductions,
  });

  prepare();
})();
