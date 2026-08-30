(() => {
  const cover = document.querySelector('[data-numenor-volume-cover]');

  if (cover) {
    let coverRemoved = false;
    const removeCover = () => {
      if (coverRemoved) {
        return;
      }

      coverRemoved = true;
      cover.remove();
      document.dispatchEvent(new CustomEvent('atlas:volumeopen', {
        detail: { volume: 'numenor' }
      }));
    };

    cover.addEventListener('animationend', (event) => {
      if (event.target === cover) {
        removeCover();
      }
    }, { once: true });

    window.setTimeout(removeCover, 4800);
  }

  const layerPaneSelector = '#paths, #settlements, #geography, #battles, #items, #regions';
  document.querySelectorAll(layerPaneSelector).forEach((pane) => {
    pane.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.disabled = true;
      checkbox.setAttribute('aria-disabled', 'true');
    });
  });

  document.addEventListener('atlas:mapready', (event) => {
    const { sidebar } = event.detail || {};

    if (!sidebar) {
      return;
    }

    document.querySelectorAll('[data-numenor-pane]').forEach((button) => {
      button.addEventListener('click', () => {
        sidebar.open(button.dataset.numenorPane);
      });
    });

    document.querySelectorAll('[data-numenor-action="map"]').forEach((button) => {
      button.addEventListener('click', () => {
        sidebar.close();
      });
    });

    const requestedPaneId = decodeURIComponent(window.location.hash.slice(1));
    const requestedPane = requestedPaneId
      ? document.getElementById(requestedPaneId)
      : null;
    const initialPaneId = requestedPane?.classList.contains('sidebar-pane')
      ? requestedPaneId
      : 'frontispiece';

    window.requestAnimationFrame(() => {
      sidebar.open(initialPaneId);
    });
  }, { once: true });
})();
