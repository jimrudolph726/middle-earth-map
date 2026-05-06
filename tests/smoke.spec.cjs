const { test, expect } = require("@playwright/test");

const pageErrors = new WeakMap();

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

test("beleriand map loads and can start story mode", async ({ page }) => {
  await page.goto("/maps/beleriand/beleriand.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#map.leaflet-container")).toBeVisible();
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

  const checkboxChecks = [
    { tabName: /Campsites and Paths/i, checkboxId: "samfrodocampsitesCheckbox" },
    { tabName: /Campsites and Paths/i, checkboxId: "samfrodopathCheckbox" },
    { tabName: /Campsites and Paths/i, checkboxId: "great_east_roadCheckbox" },
    { tabName: /Settlements/i, checkboxId: "hobbitsCheckbox" },
    { tabName: /Geography/i, checkboxId: "mountain_rangesCheckbox" },
    { tabName: /Battles/i, checkboxId: "battlesCheckbox" },
    { tabName: /Important Items/i, checkboxId: "swordsCheckbox" },
    { tabName: /Regions/i, checkboxId: "large_regionsCheckbox" }
  ];

  for (const { tabName, checkboxId } of checkboxChecks) {
    await page.getByRole("tab", { name: tabName }).click();

    const checkbox = page.locator(`#${checkboxId}`);
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
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
