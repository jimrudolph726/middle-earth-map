(() => {
  window.AtlasVolumeIntroduction?.prepare();

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

    window.AtlasVolumeIntroduction?.connectSidebar({ sidebar });
  }, { once: true });
})();
