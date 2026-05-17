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
    "All Hobbit Families",
    "Baggins",
    "Tooks",
    "Brandybucks"
  ]);
  await expect(page.locator("#tree-view-title")).toHaveText("All Hobbit Families");

  await page.locator("#tree-view").selectOption("hobbit_baggins");
  await expect(page.locator("#tree-view-title")).toHaveText("Baggins");
  await expect(page.locator("#tree-empty-state")).toBeHidden();
  await expect.poll(async () => page.locator(".family-tree-node").count(), {
    timeout: 30_000,
    message: "Expected the Baggins view to render the starter Hobbit family."
  }).toBeGreaterThan(0);

  await page.getByRole("searchbox", { name: /Search current view/i }).fill("Bilbo");
  await page.locator('.tree-search-result[data-person-id="bilbo_baggins"]').click();

  await expect(page.locator("#character-sheet")).toBeVisible();
  await expect(page.locator("#character-sheet-content h1")).toHaveText(/Bilbo Baggins/i);

  await page.locator("#tree-view").selectOption("hobbit_tooks");
  await expect(page.locator("#tree-view-title")).toHaveText("Tooks");
  await expect(page.locator('.family-tree-node[aria-label^="Hildibrand Took:"]')).toBeVisible();
});
