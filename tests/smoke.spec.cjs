const { test, expect } = require("@playwright/test");

const pageErrors = new WeakMap();
const mapPages = [
  { path: "/maps/middle_earth/middle-earth.html", label: "Middle-earth" },
  { path: "/maps/beleriand/beleriand.html", label: "Beleriand" },
  { path: "/maps/numenor/numenor.html", label: "Numenor" },
  { path: "/maps/the_shire/the_shire.html", label: "The Shire" },
  { path: "/maps/minas_tirith/minas_tirith.html", label: "Minas Tirith" }
];

async function getLeafletMarkerLayerCount(page) {
  return page.locator(".leaflet-marker-pane .leaflet-marker-icon").count();
}

async function getLeafletCanvasPaintedPixelCount(page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".leaflet-overlay-pane canvas"))
      .reduce((totalPixels, canvas) => {
        const context = canvas.getContext("2d");
        if (!context || canvas.width === 0 || canvas.height === 0) {
          return totalPixels;
        }

        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        let paintedPixels = 0;

        for (let index = 3; index < data.length; index += 4) {
          if (data[index] > 0) {
            paintedPixels += 1;
          }
        }

        return totalPixels + paintedPixels;
      }, 0);
  });
}

async function getLeafletLayerSignal(page, layerType) {
  if (layerType === "canvas") {
    return getLeafletCanvasPaintedPixelCount(page);
  }

  return getLeafletMarkerLayerCount(page);
}

test.beforeEach(({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
});

test.afterEach(({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

test("homepage exposes the major atlas destinations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Middle-earth Atlas/i);

  const homepageLinks = [
    /Open the Middle-earth map/i,
    /Open The Shire map/i,
    /Open the Numenor map/i,
    /Open the Beleriand map/i,
    /Open the Minas Tirith map/i,
    /Open the family tree/i
  ];

  for (const linkName of homepageLinks) {
    await expect(page.getByRole("link", { name: linkName })).toBeVisible();
  }
});

test("all map pages render a Leaflet map", async ({ page }) => {
  for (const mapPage of mapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#map.leaflet-container"), `${mapPage.label} should render its Leaflet map.`).toBeVisible();
  }
});

test("map pages highlight exactly one current map nav link", async ({ page }) => {
  for (const mapPage of mapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });

    const mapsDropdown = page.locator(".atlas-map-nav__dropdown").first();
    const currentMapLinks = mapsDropdown.locator(".atlas-map-nav__link--current");
    await expect(currentMapLinks, `${mapPage.label} should be the only highlighted map link.`).toHaveCount(1);
    await expect(currentMapLinks).toHaveText(new RegExp(mapPage.label, "i"));
  }
});

test("middle-earth map loads and can start story mode", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Sam and Frodo story/i }).click();

  await expect(page.locator("#storyPanel")).toBeVisible();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Leaving the Shire/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 1 of/i);
  await expect(page.locator("#storyControls")).toBeVisible();

  const storyPanelBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();
  expect(storyPanelBox?.width ?? 0).toBeLessThan(520);

  await page.getByRole("button", { name: /Next/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Black Riders on the Road/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 2 of/i);

  await page.getByRole("button", { name: /Previous/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Leaving the Shire/i);

  await page.getByRole("button", { name: /Stop/i }).click();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Gandalf the White story/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Awakening on Zirakzigil/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 1 of \d+/i);
});

test("middle-earth defers GeoJSON overlay requests until a layer is toggled", async ({ page }) => {
  const geojsonRequests = [];
  page.on("request", (request) => {
    if (request.url().includes("/maps/middle_earth/geojson_files/")) {
      geojsonRequests.push(request.url());
    }
  });

  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(geojsonRequests).toEqual([]);

  await page.getByRole("tab", { name: /Geography/i }).click();
  await page.locator("#mountain_rangesCheckbox").check();
  await expect.poll(() => geojsonRequests.length, {
    message: "Expected a Middle-earth GeoJSON file to be requested only after a layer is toggled."
  }).toBeGreaterThan(0);
});

test("middle-earth story mode uses a collapsible bottom sheet on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Sam and Frodo story/i }).click();

  const storyPanel = page.locator("#storyPanel");
  const storyBody = page.locator("#storyPanelBody");
  const summaryButton = page.locator("#storyPanelSummaryButton");

  await expect(storyPanel).toBeVisible();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-peek/);
  await expect(summaryButton).toBeVisible();
  await expect(storyBody).toBeHidden();

  const peekBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();
  expect(peekBox?.x ?? 0).toBeGreaterThanOrEqual(52);
  expect((peekBox?.x ?? 0) + (peekBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await summaryButton.click();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-expanded/);
  await expect(storyBody).toBeVisible();

  const expandedBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();
  expect(expandedBox?.height ?? 0).toBeGreaterThan((peekBox?.height ?? 0) + 80);
  expect(expandedBox?.x ?? 0).toBeGreaterThanOrEqual(52);
  expect((expandedBox?.x ?? 0) + (expandedBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await summaryButton.click();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-peek/);
  await expect(storyBody).toBeHidden();
});

test("middle-earth story mode stays map-friendly on landscape mobile", async ({ page }) => {
  await page.setViewportSize({ width: 932, height: 430 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Sam and Frodo story/i }).click();

  const storyPanel = page.locator("#storyPanel");
  const storyBody = page.locator("#storyPanelBody");
  const summaryButton = page.locator("#storyPanelSummaryButton");
  const controls = page.locator("#storyControls");

  await expect(storyPanel).toBeVisible();
  await expect(summaryButton).toBeVisible();
  await expect(controls).toBeVisible();
  await expect(storyBody).toBeHidden();
  const summaryBox = await summaryButton.boundingBox();
  const controlsBox = await controls.boundingBox();
  expect(summaryBox?.y ?? 0).toBeLessThan(controlsBox?.y ?? 0);
  expect(summaryBox?.x ?? 0).toBeGreaterThanOrEqual(52);
  expect(controlsBox?.x ?? 0).toBeGreaterThanOrEqual(52);
  expect((summaryBox?.x ?? 0) + (summaryBox?.width ?? 0)).toBeLessThanOrEqual(908);
  expect((controlsBox?.x ?? 0) + (controlsBox?.width ?? 0)).toBeLessThanOrEqual(908);
  expect(Math.abs((summaryBox?.width ?? 0) - (controlsBox?.width ?? 0))).toBeLessThanOrEqual(1);

  await summaryButton.click();
  await expect(storyPanel).toHaveClass(/story-panel--landscape-expanded/);
  await expect(storyBody).toBeVisible();
});

test("middle-earth sidebar category checkboxes toggle", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  const checkboxChecks = [
    { tabName: /Campsites and Paths/i, checkboxId: "samfrodocampsitesCheckbox", layerType: "marker" },
    { tabName: /Campsites and Paths/i, checkboxId: "samfrodopathCheckbox", layerType: "canvas" },
    { tabName: /Campsites and Paths/i, checkboxId: "great_east_roadCheckbox", layerType: "canvas" },
    { tabName: /Settlements/i, checkboxId: "hobbitsCheckbox", layerType: "marker" },
    { tabName: /Geography/i, checkboxId: "mountain_rangesCheckbox", layerType: "canvas" },
    { tabName: /Battles/i, checkboxId: "battlesCheckbox", layerType: "marker" },
    { tabName: /Important Items/i, checkboxId: "swordsCheckbox", layerType: "marker" },
    { tabName: /Provisions/i, checkboxId: "foodCheckbox", layerType: "marker" },
    { tabName: /Creatures & Beings/i, checkboxId: "spidersCheckbox", layerType: "marker" },
    { tabName: /Regions/i, checkboxId: "large_regionsCheckbox", layerType: "canvas" }
  ];

  for (const { tabName, checkboxId, layerType } of checkboxChecks) {
    await page.getByRole("tab", { name: tabName }).click();

    const checkbox = page.locator(`#${checkboxId}`);
    await expect(checkbox).toBeVisible();
    const layerSignalBeforeCheck = await getLeafletLayerSignal(page, layerType);

    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect.poll(async () => getLeafletLayerSignal(page, layerType), {
      message: `Expected ${checkboxId} to render at least one Leaflet marker or path layer.`
    }).toBeGreaterThan(layerSignalBeforeCheck);

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await expect.poll(async () => getLeafletLayerSignal(page, layerType), {
      message: `Expected ${checkboxId} layers to be removed after unchecking.`
    }).toBeLessThanOrEqual(layerSignalBeforeCheck);
  }
});

test("middle-earth point marker categories share one marker cluster", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    [
      "samfrodocampsitesCheckbox",
      "hobbitsCheckbox",
      "battlesCheckbox",
      "swordsCheckbox",
      "foodCheckbox",
      "entsCheckbox"
    ].forEach((checkboxId) => {
      const checkbox = document.getElementById(checkboxId);

      if (!checkbox) {
        throw new Error(`Could not find ${checkboxId}.`);
      }

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  await expect.poll(async () => {
    return page.evaluate(async () => {
      const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
        import("/maps/middle_earth/functions.js"),
        import("/maps/middle_earth/variables.js")
      ]);

      const markers = [
        getMarkerFromRegistry("samfrodocampsites", "September23"),
        getMarkerFromRegistry("hobbits", "hobbiton"),
        getMarkerFromRegistry("battles", "battle_of_dagorlad"),
        getMarkerFromRegistry("swords", "glamdring"),
        getMarkerFromRegistry("food", "lembas"),
        getMarkerFromRegistry("ents", "treebeard")
      ];

      if (markers.some((marker) => !marker)) {
        return null;
      }

      const clusterGroups = [];
      map.eachLayer((layer) => {
        if (window.L.MarkerClusterGroup && layer instanceof window.L.MarkerClusterGroup) {
          clusterGroups.push(layer.getLayers());
        }
      });

      const markerClusterIndexes = markers.map((marker) => (
        clusterGroups.findIndex((clusterGroup) => clusterGroup.includes(marker))
      ));

      return {
        allMarkersClustered: markerClusterIndexes.every((clusterIndex) => clusterIndex >= 0),
        uniqueClusterCount: new Set(markerClusterIndexes).size,
      };
    });
  }, {
    message: "Expected point-marker categories to be registered in one shared marker-cluster group."
  }).toEqual({
    allMarkersClustered: true,
    uniqueClusterCount: 1
  });
});

test("middle-earth shared marker groups reuse cached marker instances across toggles", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  const reusesMarkerInstance = await page.evaluate(async () => {
    const { getMarkerGroupFromRegistry } = await import("/maps/middle_earth/functions.js");
    const checkbox = document.getElementById("hobbitsCheckbox");

    if (!checkbox) {
      throw new Error("Could not find the hobbits checkbox.");
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    const firstMarker = getMarkerGroupFromRegistry("hobbits")?.hobbiton;

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    const secondMarker = getMarkerGroupFromRegistry("hobbits")?.hobbiton;

    return Boolean(firstMarker) && firstMarker === secondMarker;
  });

  expect(reusesMarkerInstance).toBe(true);
});

test("middle-earth markers bounce and fade on hover", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    const checkbox = document.getElementById("hobbitsCheckbox");

    if (!checkbox) {
      throw new Error("Could not find the hobbits checkbox.");
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await expect.poll(async () => {
    return page.evaluate(async () => {
      const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
        import("/maps/middle_earth/functions.js"),
        import("/maps/middle_earth/variables.js")
      ]);
      const marker = getMarkerFromRegistry("hobbits", "hobbiton");

      if (!marker) {
        return false;
      }

      map.setView(marker.getLatLng(), 19, { animate: false });
      return Boolean(marker.getElement());
    });
  }, {
    message: "Expected the Hobbiton marker to become available on the map."
  }).toBe(true);

  const hoveredState = await page.evaluate(async () => {
    const { getMarkerFromRegistry } = await import("/maps/middle_earth/functions.js");
    const marker = getMarkerFromRegistry("hobbits", "hobbiton");
    marker.fire("mouseover");
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

    const element = marker.getElement();
    return {
      hasHoverClass: element.classList.contains("atlas-marker-icon--hover"),
      hasBounceClass: element.classList.contains("atlas-marker-icon--hover-bounce"),
      opacity: Number.parseFloat(element.style.opacity || "1"),
    };
  });

  expect(hoveredState.hasHoverClass).toBe(true);
  expect(hoveredState.hasBounceClass).toBe(true);
  expect(hoveredState.opacity).toBeLessThan(1);

  const resetState = await page.evaluate(async () => {
    const { getMarkerFromRegistry } = await import("/maps/middle_earth/functions.js");
    const marker = getMarkerFromRegistry("hobbits", "hobbiton");
    marker.fire("mouseout");

    const element = marker.getElement();
    return {
      hasHoverClass: element.classList.contains("atlas-marker-icon--hover"),
      hasBounceClass: element.classList.contains("atlas-marker-icon--hover-bounce"),
    };
  });

  expect(resetState.hasHoverClass).toBe(false);
  expect(resetState.hasBounceClass).toBe(false);
});

test("middle-earth campsite popups still open and close on desktop hover", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    const checkbox = document.getElementById("samfrodocampsitesCheckbox");

    if (!checkbox) {
      throw new Error("Could not find the Sam and Frodo campsites checkbox.");
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await expect.poll(async () => {
    return page.evaluate(async () => {
      const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
        import("/maps/middle_earth/functions.js"),
        import("/maps/middle_earth/variables.js")
      ]);
      const marker = getMarkerFromRegistry("samfrodocampsites", "September23");

      if (!marker) {
        return false;
      }

      map.setView(marker.getLatLng(), 19, { animate: false });
      return Boolean(marker.getElement());
    });
  }, {
    message: "Expected the first Sam and Frodo campsite marker to become available on the map."
  }).toBe(true);

  await page.evaluate(async () => {
    const { getMarkerFromRegistry } = await import("/maps/middle_earth/functions.js");
    getMarkerFromRegistry("samfrodocampsites", "September23").fire("mouseover");
  });
  await expect(page.locator(".campsite-popup")).toBeVisible();

  await page.evaluate(async () => {
    const { getMarkerFromRegistry } = await import("/maps/middle_earth/functions.js");
    getMarkerFromRegistry("samfrodocampsites", "September23").fire("mouseout");
  });
  await expect(page.locator(".campsite-popup")).toBeHidden();
});

test.describe("mobile campsite interactions", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }
  });

  test("middle-earth campsite popups open with one mobile tap", async ({ page }) => {
    await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator("#map.leaflet-container")).toBeVisible();
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => {
      const checkbox = document.getElementById("samfrodocampsitesCheckbox");

      if (!checkbox) {
        throw new Error("Could not find the Sam and Frodo campsites checkbox.");
      }

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    });

    let tapPoint = null;
    await expect.poll(async () => {
      tapPoint = await page.evaluate(async () => {
        const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
          import("/maps/middle_earth/functions.js"),
          import("/maps/middle_earth/variables.js")
        ]);
        const marker = getMarkerFromRegistry("samfrodocampsites", "September23");

        if (!marker) {
          return null;
        }

        map.setView(marker.getLatLng(), 19, { animate: false });
        await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

        const markerElement = marker.getElement();

        if (!markerElement) {
          return null;
        }

        const markerBox = markerElement.getBoundingClientRect();

        if (markerBox.width === 0 || markerBox.height === 0) {
          return null;
        }

        return {
          x: markerBox.left + (markerBox.width / 2),
          y: markerBox.top + (markerBox.height / 2)
        };
      });

      return Boolean(tapPoint);
    }, {
      message: "Expected the first Sam and Frodo campsite marker to be tappable on mobile."
    }).toBe(true);

    await page.touchscreen.tap(tapPoint.x, tapPoint.y);
    await expect(page.locator(".campsite-popup")).toBeVisible();
  });

  test("middle-earth campsite popups survive mobile synthetic hover events", async ({ page }) => {
    await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator("#map.leaflet-container")).toBeVisible();
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => {
      const checkbox = document.getElementById("samfrodocampsitesCheckbox");

      if (!checkbox) {
        throw new Error("Could not find the Sam and Frodo campsites checkbox.");
      }

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await expect.poll(async () => {
      return page.evaluate(async () => {
        const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
          import("/maps/middle_earth/functions.js"),
          import("/maps/middle_earth/variables.js")
        ]);
        const marker = getMarkerFromRegistry("samfrodocampsites", "September23");

        if (!marker) {
          return false;
        }

        map.setView(marker.getLatLng(), 19, { animate: false });
        await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
        return Boolean(marker.getElement());
      });
    }, {
      message: "Expected the first Sam and Frodo campsite marker to become available on mobile."
    }).toBe(true);

    await page.evaluate(async () => {
      const { getMarkerFromRegistry } = await import("/maps/middle_earth/functions.js");
      const marker = getMarkerFromRegistry("samfrodocampsites", "September23");
      marker.fire("mouseover");
      marker.fire("mouseout");
    });

    await expect(page.locator(".campsite-popup")).toBeVisible();
  });
});

test("long settlement popups stay usable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    const checkbox = document.getElementById("palantíriCheckbox");

    if (!checkbox) {
      throw new Error("Could not find the palantíri checkbox.");
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await page.evaluate(async () => {
    const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
      import("/maps/middle_earth/functions.js"),
      import("/maps/middle_earth/variables.js")
    ]);
    const marker = getMarkerFromRegistry("palantíri", "ithil_stone");

    if (!marker) {
      throw new Error("Could not find the Ithil-stone marker.");
    }

    map.setView(marker.getLatLng(), 19, { animate: false });
    marker.openPopup();
  });

  const popup = page.locator(".lore-popup--settlement");
  const scrollableNotes = page.locator(".lore-popup--settlement .lore-popup__notes--scrollable");

  await expect(popup).toBeVisible();
  await expect(scrollableNotes).toBeVisible();

  const metrics = await scrollableNotes.evaluate((element) => ({
    clientHeight: element.clientHeight,
    overflowY: getComputedStyle(element).overflowY,
    scrollHeight: element.scrollHeight,
  }));

  expect(metrics.overflowY).toBe("auto");
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  await scrollableNotes.click();
  await expect(popup).toBeVisible();
});

test("long settlement popups can expand wider on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => {
    const checkbox = document.getElementById("palantíriCheckbox");

    if (!checkbox) {
      throw new Error("Could not find the palantíri checkbox.");
    }

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await page.evaluate(async () => {
    const [{ getMarkerFromRegistry }, { map }] = await Promise.all([
      import("/maps/middle_earth/functions.js"),
      import("/maps/middle_earth/variables.js")
    ]);
    const marker = getMarkerFromRegistry("palantíri", "ithil_stone");

    if (!marker) {
      throw new Error("Could not find the Ithil-stone marker.");
    }

    map.setView(marker.getLatLng(), 19, { animate: false });
    marker.openPopup();
  });

  const popup = page.locator(".lore-popup--settlement");
  const scrollableNotes = page.locator(".lore-popup--settlement .lore-popup__notes--scrollable");
  await expect(popup).toBeVisible();
  await expect(scrollableNotes).toBeVisible();

  const popupWidth = await popup.evaluate((element) => element.getBoundingClientRect().width);
  const popupHeight = await popup.evaluate((element) => element.getBoundingClientRect().height);
  const metrics = await scrollableNotes.evaluate((element) => ({
    clientHeight: element.clientHeight,
    overflowY: getComputedStyle(element).overflowY,
    scrollHeight: element.scrollHeight,
  }));

  expect(popupWidth).toBeGreaterThan(560);
  expect(popupHeight).toBeLessThan(560);
  expect(metrics.overflowY).toBe("auto");
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

test("family tree renders and opens a character sheet", async ({ page }) => {
  await page.goto("/family_tree/family_tree.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator(".family-tree-canvas")).toBeVisible();
  const treeNodes = page.locator(".family-tree-node");

  await expect.poll(async () => treeNodes.count(), {
    timeout: 30_000,
    message: "Expected the family tree to render at least one character node."
  }).toBeGreaterThan(0);

  await page.getByRole("searchbox", { name: /Search current view/i }).fill("Aragorn");
  await page.locator('.tree-search-result[data-person-id="aragorn_second"]').click();

  await expect(page.locator("#character-sheet")).toBeVisible();
  await expect(page.locator("#character-sheet-content h1")).toHaveText(/Aragorn II Elessar/i);
});

test("family tree family groups filter switch view options", async ({ page }) => {
  await page.goto("/family_tree/family_tree.html?family=elves-men", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#tree-view option")).toHaveText([
    "All Lineages",
    "Kings of Arnor",
    "Kings of Arthedain",
    "Chieftains of the Dúnedain"
  ]);
  await expect(page.locator("#tree-view-title")).toHaveText("All Lineages");

  await page.locator("#tree-view").selectOption("kings_of_arnor");
  await expect(page.locator("#tree-view-title")).toHaveText("Kings of Arnor");
  await expect.poll(async () => page.locator(".family-tree-node").count(), {
    timeout: 30_000,
    message: "Expected the Kings of Arnor view to render at least one character node."
  }).toBeGreaterThan(0);

  await page.goto("/family_tree/family_tree.html?family=hobbits", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#tree-view option")).toHaveText([
    "Baggins",
    "Tooks",
    "Brandybucks"
  ]);
  await expect(page.locator("#tree-view-title")).toHaveText("Baggins");
  await expect(page.locator("#tree-empty-state")).toBeVisible();
});
