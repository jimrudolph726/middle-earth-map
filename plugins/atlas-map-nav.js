(() => {
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  function closeSiblingMenus(activeMenu, menus) {
    menus.forEach((menu) => {
      if (menu !== activeMenu) {
        menu.open = false;
      }
    });
  }

  function initAtlasMapNav() {
    const menus = Array.from(document.querySelectorAll(".atlas-map-nav__menu"));
    if (menus.length === 0) return;

    menus.forEach((menu) => {
      menu.addEventListener("toggle", () => {
        if (menu.open) {
          closeSiblingMenus(menu, menus);
        }
      });

      if (!hoverQuery.matches) return;

      menu.addEventListener("mouseenter", () => {
        closeSiblingMenus(menu, menus);
        menu.open = true;
      });

      menu.addEventListener("mouseleave", () => {
        menu.open = false;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAtlasMapNav, { once: true });
  } else {
    initAtlasMapNav();
  }
})();
