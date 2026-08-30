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
  await expect(page.getByText("Welcome, traveller.")).toBeVisible();
  await expect(page.getByText(/Welcome to Bilbo's study/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Begin with Middle-earth/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Unofficial fan project.*Credits & provenance/i })).toBeVisible();

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

test("about page presents the disclaimer and provenance ledger", async ({ page }) => {
  await page.goto("/about.html", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/About, Credits & Provenance/i);
  await expect(page.getByRole("heading", { level: 1, name: "About, Credits & Provenance" })).toBeVisible();
  await expect(page.getByText(/(?:Middle-earth|Tolkien Legendarium) Atlas is an unofficial fan-made project\./i)).toBeVisible();
  await expect(page.getByText("This is a personal, non-commercial project created for exploration and study.")).toBeVisible();

  const sectionHeadings = [
    "Fan-project status",
    "Lore and map sources",
    "Artwork and image provenance",
    "AI-generated artwork",
    "Fonts and audio",
    "Software libraries and licenses",
    "Repository license",
    "Corrections and rights-holder contact"
  ];

  for (const heading of sectionHeadings) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeAttached();
  }

  await expect(page.getByRole("link", { name: /Return to Bilbo's study/i })).toHaveAttribute("href", "index.html");
});

test("every map Settings pane links to credits and provenance", async ({ page }) => {
  for (const mapPage of mapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: /Settings/i }).click();

    const provenanceLink = page.getByRole("link", { name: /Unofficial fan project.*Credits & provenance/i });
    await expect(provenanceLink, `${mapPage.label} should expose the provenance page in Settings.`).toBeVisible();
    await expect(provenanceLink).toHaveAttribute("href", "../../about.html");
  }
});

test("homepage hotspot welcome appears only on the first visit", async ({ page }) => {
  const hotspots = page.locator(".study-hotspots");

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(hotspots).toHaveClass(/study-hotspots--welcoming/);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await expect(hotspots).not.toHaveClass(/study-hotspots--welcoming/);
});

test("all map pages render a Leaflet map", async ({ page }) => {
  for (const mapPage of mapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#map.leaflet-container"), `${mapPage.label} should render its Leaflet map.`).toBeVisible();
  }
});

test("compact maps wire the sidebar groups declared by each page", async ({ page }) => {
  const compactMapPages = mapPages.filter(({ path }) => !path.includes("middle_earth"));

  for (const mapPage of compactMapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#map.leaflet-container")).toBeVisible();

    const geographyMaster = page.locator("#allGeographyCheckbox");
    const geographyChoices = page.locator("#geographySection input.geographyCheckbox");
    const choiceCount = await geographyChoices.count();

    expect(choiceCount, `${mapPage.label} should define its own geography choices.`).toBeGreaterThan(0);
    await geographyMaster.evaluate((checkbox) => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect(page.locator("#geographySection input.geographyCheckbox:not(:checked)")).toHaveCount(0);
  }
});

test("Beleriand opens as a distinct silver-blue atlas volume", async ({ page }) => {
  await page.goto("/maps/beleriand/beleriand.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toHaveAttribute("data-atlas-volume", "beleriand");
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
  await expect(page.locator("[data-beleriand-pane]")).toHaveCount(3);
  await expect(page.locator("[data-volume-cover]")).toHaveCount(0, { timeout: 6_000 });

  await page.getByRole("button", { name: /Enter the Lost Realms/i }).click();
  await expect(page.locator("#settlements")).toHaveClass(/active/);
  await page.locator("#allSettlementCheckbox").check();

  await expect(page.locator(".marker-cluster")).toHaveCount(1);
  await expect(page.locator(".leaflet-marker-icon.atlas-marker-icon")).toHaveCount(2);

  await page.locator(".leaflet-marker-icon.atlas-marker-icon").first().click();
  await expect(page.locator(".lore-popup-shell")).toBeVisible();

  const popupSurface = await page.locator(".lore-popup-shell").evaluate((popup) => {
    const wrapper = popup.querySelector(".leaflet-popup-content-wrapper");
    const frame = popup.querySelector(".lore-popup__frame");
    const title = popup.querySelector(".lore-popup__title");
    const link = popup.querySelector(".lore-popup__link");

    return {
      frameBorderWidth: getComputedStyle(frame).borderWidth,
      wrapperBackground: getComputedStyle(wrapper).backgroundImage,
      wrapperBackgroundColor: getComputedStyle(wrapper).backgroundColor,
      wrapperBorderWidth: getComputedStyle(wrapper).borderWidth,
      wrapperBoxShadow: getComputedStyle(wrapper).boxShadow,
      titleOrnament: getComputedStyle(title, "::after").content,
      linkBackground: getComputedStyle(link).backgroundImage,
      linkBorderTopWidth: getComputedStyle(link).borderTopWidth,
      navigationVisibility: getComputedStyle(document.querySelector(".atlas-map-nav")).visibility,
    };
  });

  expect(popupSurface.frameBorderWidth).toBe("0px");
  expect(popupSurface.wrapperBorderWidth).toBe("0px");
  expect(popupSurface.wrapperBackground).toContain("linear-gradient");
  expect(popupSurface.wrapperBackgroundColor).toBe("rgb(234, 234, 221)");
  expect(popupSurface.wrapperBoxShadow).toBe("none");
  expect(popupSurface.titleOrnament).toContain("✦");
  expect(popupSurface.linkBackground).toBe("none");
  expect(popupSurface.linkBorderTopWidth).toBe("0px");
  expect(popupSurface.navigationVisibility).toBe("visible");
});

test("Númenor opens as a royal maritime Second Volume", async ({ page }) => {
  await page.goto("/maps/numenor/numenor.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toHaveAttribute("data-atlas-volume", "numenor");
  await expect(page.locator("[data-numenor-volume-cover]")).toBeAttached();
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
  await expect(page.locator("#frontispiece .atlas-frontispiece__eyebrow")).toHaveText("The Second Volume");
  await expect(page.locator("#frontispiece .numenor-ornament")).toHaveCount(1);
  await expect(page.locator("#frontispiece .atlas-chapter-card")).toHaveCount(3);
  await expect(page.locator(".numenor-empty-state")).toHaveCount(6);
  await expect(page.locator(".numenor-volume-card")).toBeAttached();

  const coverTiming = await page.locator("[data-numenor-volume-cover]").evaluate((cover) => ({
    delay: getComputedStyle(cover).animationDelay,
    duration: getComputedStyle(cover).animationDuration,
  }));

  expect(coverTiming.delay).toBe("3s");
  expect(coverTiming.duration).toBe("0.76s");
  await expect(page.locator("[data-numenor-volume-cover]")).toHaveCount(0, { timeout: 6_000 });

  const plannedLayerInputs = page.locator(
    '#sidebar .sidebar-pane:not(#frontispiece):not(#settings) input[type="checkbox"]'
  );
  expect(await plannedLayerInputs.count()).toBeGreaterThan(0);
  await expect(page.locator(
    '#sidebar .sidebar-pane:not(#frontispiece):not(#settings) input[type="checkbox"]:not(:disabled)'
  )).toHaveCount(0);
  await expect(page.locator(".leaflet-marker-icon.atlas-marker-icon")).toHaveCount(0);

  await page.getByRole("button", { name: /Unfold the Sea-chart/i }).click();
  await expect(page.locator("#sidebar")).toHaveClass(/collapsed/);
  await page.getByRole("tab", { name: /Open Númenor frontispiece/i }).click();
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
});

test("Middle-earth opens as a warm travelling-atlas volume", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html?frontispiece=1", { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toHaveAttribute("data-atlas-volume", "middle-earth");
  await expect(page.locator("[data-middle-earth-volume-cover]")).toBeAttached();
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
  await expect(page.locator("#frontispiece .atlas-frontispiece__eyebrow")).toHaveText("The Third Volume");
  await expect(page.locator("#frontispiece .middle-earth-ornament")).toHaveCount(1);
  await expect(page.locator(".middle-earth-volume-card")).toBeAttached();

  const coverTiming = await page.locator("[data-middle-earth-volume-cover]").evaluate((cover) => ({
    delay: getComputedStyle(cover).animationDelay,
    duration: getComputedStyle(cover).animationDuration,
  }));

  expect(coverTiming.delay).toBe("3s");
  expect(coverTiming.duration).toBe("0.76s");
  await expect(page.locator("[data-middle-earth-volume-cover]")).toHaveCount(0, { timeout: 6_000 });
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
  await expect(page.locator("#storySceneTitle")).toHaveText(/The First Steps East/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 1 of 18/i);
  await expect(page.locator("#storyKicker")).toHaveText(/Chapter 1 of 5.*The Shadow Leaves the Shire/i);
  await expect(page.locator("#storyChapterNav .story-panel__chapter-button")).toHaveCount(5);
  await expect(page.locator("#samfrodopathCheckbox")).toBeChecked();
  await expect(page.locator("#storySceneImage")).toBeVisible();
  await expect(page.locator("#storyControls")).toBeVisible();

  const storyPanelBox = await page.locator("#storyPanel .story-panel__inner").boundingBox();
  expect(storyPanelBox?.width ?? 0).toBeLessThan(520);

  await page.getByRole("button", { name: /Next/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Riders Beneath the Trees/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 2 of 18/i);

  await page.getByRole("button", { name: /Previous/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/The First Steps East/i);

  await page.getByRole("button", { name: /Go to chapter 5: The Land of Shadow/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Shelob's Lair|Shelob’s Lair/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 15 of 18/i);

  await page.getByRole("button", { name: /Stop/i }).click();
  await expect(page.locator("#samfrodopathCheckbox")).not.toBeChecked();
  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Gandalf the White story/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/Awakening on Zirakzigil/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 1 of 18/i);
  await expect(page.locator("#storyKicker")).toHaveText(/Chapter 1 of 5.*Returned to the World/i);
  await expect(page.locator("#storyChapterNav .story-panel__chapter-button")).toHaveCount(5);
  await expect(page.locator("#gandalfthewhitepathCheckbox")).toBeChecked();

  await page.getByRole("button", { name: /Go to chapter 5: The Last Move/i }).click();
  await expect(page.locator("#storySceneTitle")).toHaveText(/The Last Debate/i);
  await expect(page.locator("#storySceneCounter")).toHaveText(/Scene 17 of 18/i);
});

test("middle-earth welcomes first-time visitors with three clear paths", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#sidebar")).not.toHaveClass(/collapsed/);
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
  await expect(page.getByRole("heading", { name: /Where shall the road take you/i })).toBeVisible();
  await expect(page.locator("[data-frontispiece-action]")).toHaveCount(3);
  await expect(page.getByRole("button", { name: /Explore places/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Follow a journey/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Browse the atlas/i })).toBeVisible();
});

test("frontispiece featured places travel to parchment map entries", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html?frontispiece=1", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Explore places/i }).click();

  await expect(page.locator("#featuredPlaces")).toHaveClass(/active/);
  await expect(page.locator("[data-featured-place]")).toHaveCount(8);
  await expect.poll(() => getLeafletMarkerLayerCount(page), {
    message: "Featured Places should add its eight curated medallions to the map."
  }).toBe(8);

  await page.locator('[data-featured-place="hobbiton"]').click();
  await expect(page.locator('[data-featured-place="hobbiton"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".lore-popup__title")).toHaveText("Hobbiton");

  await page.locator('#featuredPlaces [data-atlas-pane="frontispiece"]').click();
  await expect(page.getByRole("heading", { name: /Where shall the road take you/i })).toBeVisible();
  await expect.poll(() => getLeafletMarkerLayerCount(page), {
    message: "Leaving Featured Places should remove its temporary marker layer."
  }).toBe(0);
});

test("frontispiece routes into journeys and the complete atlas index", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html?frontispiece=1", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Follow a journey/i }).click();
  await expect(page.locator("#stories")).toHaveClass(/active/);
  await expect(page.getByRole("button", { name: /Start Sam and Frodo story/i })).toBeVisible();

  await page.getByRole("tab", { name: /Open atlas frontispiece/i }).click();
  await page.getByRole("button", { name: /Browse the atlas/i }).click();
  await expect(page.locator("#atlasIndex")).toHaveClass(/active/);
  await expect(page.locator("#atlasIndex [data-atlas-pane]")).toHaveCount(10);

  await page.locator('#atlasIndex [data-atlas-pane="geography"]').click();
  await expect(page.locator("#geography")).toHaveClass(/active/);
  await expect(page.locator("#mountain_rangesCheckbox")).toBeVisible();
});

test("frontispiece remembers dismissal but remains available from the book tab", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Browse the atlas/i }).click();
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator("#sidebar")).toHaveClass(/collapsed/);
  await expect(page.locator("#frontispiece")).not.toHaveClass(/active/);

  await page.getByRole("tab", { name: /Open atlas frontispiece/i }).click();
  await expect(page.getByRole("heading", { name: /Where shall the road take you/i })).toBeVisible();

  await page.goto("/maps/middle_earth/middle-earth.html?frontispiece=1", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
});

test("featured places hand the map back to visitors on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/maps/middle_earth/middle-earth.html?frontispiece=1", { waitUntil: "domcontentloaded" });

  await expect(page.locator("[data-frontispiece-action]")).toHaveCount(3);
  await page.getByRole("button", { name: /Explore places/i }).click();
  await expect(page.locator("#featuredPlaces")).toHaveClass(/active/);

  await page.locator('[data-featured-place="hobbiton"]').click();
  await expect(page.locator("#sidebar")).toHaveClass(/collapsed/);
  await expect(page.locator(".lore-popup__title")).toHaveText("Hobbiton");
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

test("atlas sounds are self-hosted and served as audio", async ({ request }) => {
  const soundFiles = [
    "wood-click.mp3",
    "parchment-flick.mp3",
    "quill-stroke.mp3",
    "book-thump.mp3"
  ];

  for (const soundFile of soundFiles) {
    const response = await request.get(`/assets/audio/atlas/${soundFile}`);

    expect(response.ok(), `${soundFile} should be available to the static site.`).toBe(true);
    expect(response.headers()["content-type"]).toBe("audio/mpeg");
    expect((await response.body()).length, `${soundFile} should not be empty.`).toBeGreaterThan(1_000);
  }
});

test("atlas sound preference persists across every map", async ({ page }) => {
  await page.goto(mapPages[0].path, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /Settings/i }).click();

  const firstToggle = page.getByRole("switch", { name: /Atlas sounds/i });
  await expect(page.locator(".atlas-sounds-card")).toBeVisible();
  await expect(firstToggle).toBeAttached();
  await expect(firstToggle).not.toBeChecked();

  await page.locator("label.atlas-sounds-toggle").click();
  await expect(firstToggle).toBeChecked();
  await expect(page.locator("#atlasSoundsStatus")).toContainText(/On/i);

  for (const mapPage of mapPages) {
    await page.goto(mapPage.path, { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: /Settings/i }).click();

    const toggle = page.getByRole("switch", { name: /Atlas sounds/i });
    await expect(page.locator(".atlas-sounds-card"), `${mapPage.label} should expose the atlas sound control.`).toBeVisible();
    await expect(toggle, `${mapPage.label} should remember that atlas sounds are on.`).toBeChecked();
  }

  await page.locator("label.atlas-sounds-toggle").click();
  await expect(page.getByRole("switch", { name: /Atlas sounds/i })).not.toBeChecked();
});

test("atlas sounds respond to controls, layers, and stories", async ({ page }) => {
  await page.goto("/maps/middle_earth/middle-earth.html", { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /Settings/i }).click();
  await page.locator("label.atlas-sounds-toggle").click();

  await expect.poll(async () => page.evaluate(() => window.AtlasSounds?.getState().playCounts.woodClick || 0), {
    message: "Enabling atlas sounds should play the wooden control click."
  }).toBeGreaterThan(0);

  await page.getByRole("tab", { name: /Geography/i }).click();
  await expect.poll(async () => page.evaluate(() => window.AtlasSounds?.getState().playCounts.parchmentFlick || 0), {
    message: "Opening a sidebar pane should play the parchment flick."
  }).toBeGreaterThan(0);

  await page.locator("#mountain_rangesCheckbox").check();
  await expect.poll(async () => page.evaluate(() => window.AtlasSounds?.getState().playCounts.quillStroke || 0), {
    message: "Successfully adding a map layer should play the quill stroke."
  }).toBeGreaterThan(0);

  await page.getByRole("tab", { name: /Curated Stories/i }).click();
  await page.getByRole("button", { name: /Start Sam and Frodo story/i }).click();
  await expect.poll(async () => page.evaluate(() => window.AtlasSounds?.getState().playCounts.bookThump || 0), {
    message: "Starting a curated story should play the book thump."
  }).toBeGreaterThan(0);
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
