(function initializeAtlasMapTheme() {
  "use strict";

  function bindSidebarReadingState() {
    var sidebar = document.getElementById("sidebar");

    if (!sidebar) {
      return;
    }

    var syncReadingState = function syncReadingState() {
      document.documentElement.classList.toggle(
        "atlas-sidebar-open",
        !sidebar.classList.contains("collapsed")
      );
    };

    new MutationObserver(syncReadingState).observe(sidebar, {
      attributes: true,
      attributeFilter: ["class"]
    });

    syncReadingState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindSidebarReadingState, { once: true });
  } else {
    bindSidebarReadingState();
  }
})();
