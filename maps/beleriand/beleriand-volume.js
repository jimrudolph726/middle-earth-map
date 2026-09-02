(() => {
  window.AtlasVolumeIntroduction?.prepare();

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

    window.AtlasVolumeIntroduction?.connectSidebar({ sidebar });
  }, { once: true });
})();
