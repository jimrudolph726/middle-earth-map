(() => {
  window.AtlasVolumeIntroduction?.prepare();

  document.addEventListener('atlas:mapready', ({ detail }) => {
    const sidebar = detail?.sidebar;
    if (!sidebar) return;

    document.querySelectorAll('[data-shire-pane]').forEach(button => {
      button.addEventListener('click', () => sidebar.open(button.dataset.shirePane));
    });
    document.querySelectorAll('[data-shire-action="map"]').forEach(button => {
      button.addEventListener('click', () => sidebar.close());
    });
    window.AtlasVolumeIntroduction?.connectSidebar({ sidebar });
  }, { once: true });
})();
