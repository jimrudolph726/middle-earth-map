// Popup space is measured inside Leaflet's map, not the wider browser viewport.
// The visible navigation remains available above the reading surface on phones.
export function initializePopupLayout(map) {
  if (!['beleriand', 'numenor', 'middle-earth', 'shire'].includes(document.body.dataset.atlasVolume)) return;
  const container = map.getContainer();
  const navigation = document.querySelector('.atlas-map-nav');
  let pending = 0;

  const measure = (popup = map._popup) => {
    const rect = container.getBoundingClientRect();
    const navRect = navigation?.getBoundingClientRect();
    const top = navRect ? Math.max(24, navRect.bottom - rect.top + 16) : 24;
    // Two 24px gutters, plus 2px for Leaflet's rounded content measurements.
    const width = Math.max(1, map.getSize().x - 50);
    const height = Math.max(80, map.getSize().y - top - 54);
    container.style.setProperty('--atlas-popup-width', `${width}px`);
    container.style.setProperty('--atlas-popup-height', `${height}px`);
    if (popup) {
      popup.options.autoPanPaddingTopLeft = L.point(24, top);
      popup.options.autoPanPaddingBottomRight = L.point(24, 24);
      popup.update();
    }
  };
  const schedule = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      measure();
    });
  };
  const onOpen = ({ popup }) => measure(popup);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  observer?.observe(container);
  if (navigation) observer?.observe(navigation);
  map.on('popupopen', onOpen);
  map.on('resize', schedule);
  window.addEventListener('resize', schedule);
  map.on('unload', () => {
    cancelAnimationFrame(pending);
    observer?.disconnect();
    window.removeEventListener('resize', schedule);
    map.off('popupopen', onOpen);
    map.off('resize', schedule);
  });
  measure();
}
