(function () {
    "use strict";

    var welcomeStorageKey = "middle-earth-atlas:study-welcome:v1";
    var hotspots = document.querySelector(".study-hotspots");

    if (!hotspots) {
        return;
    }

    try {
        if (window.localStorage.getItem(welcomeStorageKey) === "seen") {
            return;
        }

        window.localStorage.setItem(welcomeStorageKey, "seen");
    } catch (_error) {
        // The welcome still works when storage is unavailable; it may simply replay later.
    }

    window.setTimeout(function () {
        hotspots.classList.add("study-hotspots--welcoming");

        window.setTimeout(function () {
            hotspots.classList.remove("study-hotspots--welcoming");
        }, 3600);
    }, 450);
})();
