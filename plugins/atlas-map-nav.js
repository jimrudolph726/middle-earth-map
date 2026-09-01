(() => {
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  function isPointInsideRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function getHoverRect(menu, summary, dropdown) {
    const summaryRect = summary.getBoundingClientRect();

    if (!menu.open) {
      return summaryRect;
    }

    const dropdownRect = dropdown.getBoundingClientRect();
    if (dropdownRect.width === 0 || dropdownRect.height === 0) {
      return summaryRect;
    }

    return {
      left: Math.min(summaryRect.left, dropdownRect.left),
      right: Math.max(summaryRect.right, dropdownRect.right),
      top: Math.min(summaryRect.top, dropdownRect.top),
      bottom: Math.max(summaryRect.bottom, dropdownRect.bottom)
    };
  }

  function initAtlasMapNav() {
    const currentPageLinks = Array.from(
      document.querySelectorAll('.atlas-map-nav__link[aria-current="page"]')
    );

    currentPageLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const isPlainPrimaryClick = (
          event.button === 0
          && !event.altKey
          && !event.ctrlKey
          && !event.metaKey
          && !event.shiftKey
        );

        if (!isPlainPrimaryClick) return;

        // The current-page pill is still a useful link for copying or opening
        // in another tab, but an ordinary click should not rebuild the page.
        event.preventDefault();

        const parentMenu = link.closest(".atlas-map-nav__menu");
        if (parentMenu) {
          parentMenu.open = false;
        }
      });
    });

    const menus = Array.from(document.querySelectorAll(".atlas-map-nav__menu"));
    if (menus.length === 0) return;

    const menuStates = new Map(
      menus
        .map((menu) => {
          const summary = menu.querySelector(".atlas-map-nav__toggle");
          const dropdown = menu.querySelector(".atlas-map-nav__dropdown");
          if (!summary || !dropdown) return null;

          return [
            menu,
            {
              summary,
              dropdown,
              suppressHoverUntilExit: false,
              wasPointerInside: false
            }
          ];
        })
        .filter(Boolean)
    );

    function closeOtherMenus(activeMenu) {
      menus.forEach((menu) => {
        if (menu === activeMenu) return;

        menu.open = false;

        const state = menuStates.get(menu);
        if (!state) return;

        state.suppressHoverUntilExit = false;
        state.wasPointerInside = false;
      });
    }

    menus.forEach((menu) => {
      const state = menuStates.get(menu);
      if (!state) return;

      menu.addEventListener("toggle", () => {
        if (menu.open) {
          closeOtherMenus(menu);
          return;
        }

        if (state.wasPointerInside) {
          // If the user clicks to collapse a hovered menu, keep it collapsed
          // until the pointer leaves that hover region once.
          state.suppressHoverUntilExit = true;
        }
      });
    });

    if (!hoverQuery.matches) return;

    document.addEventListener("pointermove", (event) => {
      const pointerX = event.clientX;
      const pointerY = event.clientY;
      let activeMenu = null;

      menus.forEach((menu) => {
        const state = menuStates.get(menu);
        if (!state) return;

        const hoverRect = getHoverRect(menu, state.summary, state.dropdown);
        const isPointerInside = isPointInsideRect(pointerX, pointerY, hoverRect);

        if (!isPointerInside && state.wasPointerInside) {
          state.suppressHoverUntilExit = false;
        }

        state.wasPointerInside = isPointerInside;

        if (isPointerInside && !state.suppressHoverUntilExit && activeMenu === null) {
          activeMenu = menu;
        }
      });

      menus.forEach((menu) => {
        const state = menuStates.get(menu);
        if (!state) return;

        if (menu === activeMenu) {
          closeOtherMenus(menu);
          menu.open = true;
        } else if (!state.wasPointerInside) {
          menu.open = false;
        }
      });
    });

    document.addEventListener("pointerleave", () => {
      menus.forEach((menu) => {
        const state = menuStates.get(menu);
        if (!state) return;

        state.suppressHoverUntilExit = false;
        state.wasPointerInside = false;
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
