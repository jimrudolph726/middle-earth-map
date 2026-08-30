(() => {
  const cover = document.querySelector('[data-middle-earth-volume-cover]');

  if (!cover) {
    return;
  }

  let coverRemoved = false;
  const removeCover = () => {
    if (coverRemoved) {
      return;
    }

    coverRemoved = true;
    cover.remove();
    document.dispatchEvent(new CustomEvent('atlas:volumeopen', {
      detail: { volume: 'middle-earth' }
    }));
  };

  cover.addEventListener('animationend', (event) => {
    if (event.target === cover) {
      removeCover();
    }
  }, { once: true });

  window.setTimeout(removeCover, 4800);
})();
