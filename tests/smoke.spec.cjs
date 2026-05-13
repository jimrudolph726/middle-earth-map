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
  await page.getByRole("button", { name: /Start Story/i }).click();

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
});

test("middle-earth story mode uses a collapsible bottom sheet on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Story/i }).click();

  const storyPanel = page.locator("#storyPanel");
  const storyBody = page.locator("#storyPanelBody");
  const summaryButton = page.locator("#storyPanelSummaryButton");

  await expect(storyPanel).toBeVisible();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-peek/);
  await expect(summaryButton).toBeVisible();
  await expect(storyBody).toBeHidden();

  const peekBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();

  await summaryButton.click();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-expanded/);
  await expect(storyBody).toBeVisible();

  const expandedBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();
  expect(expandedBox?.height ?? 0).toBeGreaterThan((peekBox?.height ?? 0) + 80);

  await summaryButton.click();
  await expect(storyPanel).toHaveClass(/story-panel--mobile-peek/);
  await expect(storyBody).toBeHidden();
});

test("middle-earth story mode stays map-friendly on landscape mobile", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Story/i }).click();

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
