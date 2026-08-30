(() => {
  const cover = document.querySelector('[data-volume-cover]');

  if (cover) {
    const removeCover = () => cover.remove();

    cover.addEventListener('animationend', (event) => {
      if (event.target === cover) {
        removeCover();
      }
    }, { once: true });

    window.setTimeout(removeCover, 4800);
  }

  document.addEventListener('atlas:mapready', (event) => {
    const { sidebar } = event.detail || {};

    if (!sidebar) {
      return;
    }

    document.querySelectorAll('[data-beleriand-pane]').forEach((button) => {
      button.addEventListener('click', () => {
        sidebar.open(button.dataset.beleriandPane);
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
