const { test, expect } = require("@playwright/test");

const pageErrors = new WeakMap();

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
  await expect(page.getByRole("link", { name: /Open the Middle-earth map/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the family tree/i })).toBeVisible();
});

test("All maps load", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });
  await page.goto("/maps/beleriand/beleriand.html", { waitUntil: "domcontentloaded" });
  await page.goto("/maps/numenor/numenor.html", { waitUntil: "domcontentloaded" });
  await page.goto("/maps/the_shire/the_shire.html", { waitUntil: "domcontentloaded" });
  await page.goto("/maps/minas_tirith/minas_tirith.html", { waitUntil: "domcontentloaded" });

});

test("middle-earth map loads and can start story mode", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#map.leaflet-container")).toBeVisible();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Story/i }).click();

  await expect(page.locator("#storyPanel")).toBeVisible();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Leaving the Shire/i);
  await expect(page.locator("#storyControls")).toBeVisible();
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
