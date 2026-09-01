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
  await expect(page.locator('link[rel="preload"][as="image"][href="assets/bag_end_study.webp"]')).toHaveCount(1);

  const studyImage = page.locator(".splash-table__image");
  await expect(studyImage).toBeVisible();
  await expect(studyImage).toHaveAttribute("src", "assets/bag_end_study.webp");
  await studyImage.evaluate((image) => image.decode());
  expect(await studyImage.evaluate((image) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }))).toEqual({
    complete: true,
    naturalWidth: 2304,
    naturalHeight: 1296,
  });

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

test("the current Home pill does not reload an already-open homepage", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    window.__atlasHomepageDocumentWasRetained = true;
  });

  await page.locator('.atlas-map-nav__link[aria-current="page"]').click();
  await page.waitForTimeout(150);

  expect(page.url()).toMatch(/\/$/);
  expect(await page.evaluate(() => window.__atlasHomepageDocumentWasRetained)).toBe(true);
  await expect(page.getByRole("heading", { name: "Tolkien Legendarium Atlas" })).toBeVisible();
  await expect(page.locator(".splash-table__image")).toBeVisible();
});

test("primary pages share the themed pill navigation", async ({ page }) => {
  const primaryPages = [
    "/",
    "/about.html",
    "/family_tree/family_tree.html",
    ...mapPages.map(({ path }) => path),
  ];

  for (const pagePath of primaryPages) {
    await page.goto(pagePath, { waitUntil: "domcontentloaded" });

    const navigation = page.locator(".atlas-map-nav");
    await expect(navigation, `${pagePath} should expose the atlas navigation.`).toBeVisible();
    await expect(page.locator(".atlas-map-nav--bookshelf")).toHaveCount(0);
    await expect(page.locator('link[rel="preload"][href*="material-icons-v145.woff2"]')).toHaveCount(1);

    const pillStyles = await navigation.locator(
      ":scope > .atlas-map-nav__link, :scope > .atlas-map-nav__menu > .atlas-map-nav__toggle"
    ).evaluateAll((pills) => pills.map((pill) => {
      const style = getComputedStyle(pill);
      return {
        radius: style.borderTopLeftRadius,
      };
    }));

    expect(pillStyles.length).toBeGreaterThanOrEqual(3);
    expect(pillStyles.every(({ radius }) => radius === "999px")).toBe(true);

    const iconStyles = await navigation.locator(".material-icons").evaluateAll((icons) => icons.map((icon) => {
      const style = getComputedStyle(icon);
      return {
        width: style.width,
        minWidth: style.minWidth,
        height: style.height,
        flexBasis: style.flexBasis,
        overflow: style.overflow,
      };
    }));

    expect(iconStyles.length).toBeGreaterThanOrEqual(5);
    expect(iconStyles.every((style) => (
      style.width === "20px"
      && style.minWidth === "20px"
      && style.height === "20px"
      && style.flexBasis === "20px"
      && style.overflow === "hidden"
    ))).toBe(true);

    await expect(navigation.locator("[data-book-kicker], .atlas-map-nav__bookmark")).toHaveCount(0);
    await expect(navigation.locator(".atlas-map-nav__chevron")).toHaveCount(2);

    const mapVolumeOrder = await navigation.locator(
      ":scope > .atlas-map-nav__menu:first-of-type .atlas-map-nav__dropdown .atlas-map-nav__link > span"
    ).allTextContents();
    expect(mapVolumeOrder).toEqual([
      "Beleriand",
      "Numenor",
      "Middle-earth",
      "The Shire",
      "Minas Tirith",
    ]);
  }
});

test("navigation pill geometry is stable while the icon font is unavailable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  const pills = page.locator(
    ".atlas-map-nav > .atlas-map-nav__link, .atlas-map-nav > .atlas-map-nav__menu > .atlas-map-nav__toggle"
  );
  const loadedFontWidths = await pills.evaluateAll((elements) => (
    elements.map((element) => element.getBoundingClientRect().width)
  ));

  await page.addStyleTag({
    content: '.atlas-map-nav .material-icons { font-family: Arial, sans-serif !important; }',
  });

  const fallbackFontWidths = await pills.evaluateAll((elements) => (
    elements.map((element) => element.getBoundingClientRect().width)
  ));

  expect(fallbackFontWidths).toHaveLength(loadedFontWidths.length);
  fallbackFontWidths.forEach((width, index) => {
    expect(Math.abs(width - loadedFontWidths[index])).toBeLessThan(0.1);
  });
});

test("the atlas pills and volume menu stay inside a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about.html", { waitUntil: "domcontentloaded" });

  const navigation = page.locator(".atlas-map-nav");
  const navigationBounds = await navigation.boundingBox();
  expect(navigationBounds.x).toBeGreaterThanOrEqual(0);
  expect(navigationBounds.x + navigationBounds.width).toBeLessThanOrEqual(390);

  const mapsMenu = navigation.locator(":scope > .atlas-map-nav__menu").first();
  await mapsMenu.evaluate((menu) => {
    menu.open = true;
  });
  await expect(mapsMenu).toHaveAttribute("open", "");

  const catalogueBounds = await mapsMenu.locator(".atlas-map-nav__dropdown").boundingBox();
  expect(catalogueBounds.x).toBeGreaterThanOrEqual(0);
  expect(catalogueBounds.x + catalogueBounds.width).toBeLessThanOrEqual(390);
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

  await expect(page.getByRole("heading", { level: 3, name: "Beleriand physical-volume materials" })).toBeAttached();
  await expect(page.getByRole("link", { name: "Rough Linen archival cloth" })).toHaveAttribute(
    "href",
    "https://polyhaven.com/a/rough_linen"
  );
  await expect(page.getByRole("link", { name: "Blue Metal Plate frame patina" })).toHaveAttribute(
    "href",
    "https://polyhaven.com/a/blue_metal_plate"
  );
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
  const materialAssets = [
    { path: "/maps/beleriand/assets/materials/beleriand-cloth-v1.webp", maximumBytes: 300_000 },
    { path: "/maps/beleriand/assets/materials/beleriand-frame-metal-v1.webp", maximumBytes: 20_000 },
  ];

  for (const asset of materialAssets) {
    const response = await page.request.get(asset.path);
    expect(response.ok(), `${asset.path} should be served successfully.`).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).length).toBeLessThan(asset.maximumBytes);
  }

  await page.goto("/maps/beleriand/beleriand.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toHaveAttribute("data-atlas-volume", "beleriand");
  await expect(page.locator("#frontispiece")).toHaveClass(/active/);
  await expect(page.locator("[data-beleriand-pane]")).toHaveCount(3);
  await expect(page.locator("[data-volume-cover]")).toHaveCount(0, { timeout: 6_000 });

  const physicalMapSurface = page.locator(".atlas-physical-map__surface--beleriand");
  const physicalFramePane = page.locator(".atlas-physical-frame-pane--beleriand");
  await expect(physicalMapSurface).toBeVisible();
  await expect(physicalFramePane).toHaveCount(1);
  await expect(page.locator(".atlas-physical-frame__line")).toHaveCount(6);
  await expect(page.locator(".atlas-physical-frame__corner")).toHaveCount(4);

  const physicalVolumeSurface = await page.locator("#map").evaluate((mapElement) => {
    const framePane = document.querySelector(".atlas-physical-frame-pane--beleriand");
    const mapSurface = document.querySelector(".atlas-physical-map__surface--beleriand");
    const shadowLine = document.querySelector(".atlas-physical-frame__line--shadow");
    const textureLine = document.querySelector(".atlas-physical-frame__line--texture");
    const textureImage = document.querySelector("#atlas-physical-frame-texture-beleriand image");

    return {
      backgroundColor: getComputedStyle(mapElement).backgroundColor,
      backgroundImage: getComputedStyle(mapElement).backgroundImage,
      backgroundSize: getComputedStyle(mapElement).backgroundSize,
      framePointerEvents: getComputedStyle(framePane).pointerEvents,
      frameTextureHref: textureImage?.getAttribute("href"),
      mapSurfaceFilter: getComputedStyle(mapSurface).filter,
      shadowWidth: getComputedStyle(shadowLine).strokeWidth,
      textureStroke: getComputedStyle(textureLine).stroke,
    };
  });

  expect(physicalVolumeSurface.backgroundColor).toBe("rgb(16, 25, 32)");
  expect(physicalVolumeSurface.backgroundImage).toContain("beleriand-cloth-v1.webp");
  expect(physicalVolumeSurface.backgroundSize).toContain("620px 620px");
  expect(physicalVolumeSurface.framePointerEvents).toBe("none");
  expect(physicalVolumeSurface.frameTextureHref).toContain("beleriand-frame-metal-v1.webp");
  expect(physicalVolumeSurface.mapSurfaceFilter).toContain("drop-shadow");
  expect(physicalVolumeSurface.shadowWidth).toBe("30px");
  expect(physicalVolumeSurface.textureStroke).toContain("atlas-physical-frame-texture-beleriand");

  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(physicalFramePane).toHaveClass(/atlas-physical-frame-pane--detail/);
  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect(physicalFramePane).not.toHaveClass(/atlas-physical-frame-pane--detail/);

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

  const beleriandPillBackgrounds = await page.locator(
    '.atlas-map-nav > .atlas-map-nav__link, .atlas-map-nav > .atlas-map-nav__menu > .atlas-map-nav__toggle'
  ).evaluateAll((pills) => pills.map((pill) => getComputedStyle(pill).backgroundColor));
  expect(beleriandPillBackgrounds).toHaveLength(3);
  expect(new Set(beleriandPillBackgrounds)).toEqual(new Set(["rgba(45, 72, 85, 0.96)"]));
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

  const numenorPillBackgrounds = await page.locator(
    '.atlas-map-nav > .atlas-map-nav__link, .atlas-map-nav > .atlas-map-nav__menu > .atlas-map-nav__toggle'
  ).evaluateAll((pills) => pills.map((pill) => getComputedStyle(pill).backgroundColor));
  expect(numenorPillBackgrounds).toHaveLength(3);
  expect(new Set(numenorPillBackgrounds)).toEqual(new Set(["rgba(7, 28, 45, 0.94)"]));

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
  const materialAssets = [
    { path: "/maps/middle_earth/assets/materials/middle-earth-mahogany-v1.webp", maximumBytes: 250_000 },
    { path: "/maps/middle_earth/assets/materials/middle-earth-frame-brass-v1.webp", maximumBytes: 40_000 },
  ];

  for (const asset of materialAssets) {
    const response = await page.request.get(asset.path);
    expect(response.ok(), `${asset.path} should be served successfully.`).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).length).toBeLessThan(asset.maximumBytes);
  }

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

  const physicalMapSurface = page.locator(".atlas-physical-map__surface--middle-earth");
  const physicalFramePane = page.locator(".atlas-physical-frame-pane--middle-earth");
  await expect(physicalMapSurface).toHaveCount(1);
  await expect(physicalFramePane).toHaveCount(1);
  await expect(page.locator(".atlas-physical-frame__line")).toHaveCount(6);
  await expect(page.locator(".atlas-physical-frame__corner")).toHaveCount(4);
  await expect(page.locator(".atlas-physical-frame__leaf")).toHaveCount(12);

  const physicalVolumeSurface = await page.locator("#map").evaluate((mapElement) => {
    const framePane = document.querySelector(".atlas-physical-frame-pane--middle-earth");
    const mapSurface = document.querySelector(".atlas-physical-map__surface--middle-earth");
    const textureLine = document.querySelector(".atlas-physical-frame__line--texture");
    const textureImage = document.querySelector("#atlas-physical-frame-texture-middle-earth image");

    return {
      backgroundColor: getComputedStyle(mapElement).backgroundColor,
      backgroundImage: getComputedStyle(mapElement).backgroundImage,
      framePointerEvents: getComputedStyle(framePane).pointerEvents,
      frameTextureHref: textureImage?.getAttribute("href"),
      mapSurfaceFilter: getComputedStyle(mapSurface).filter,
      textureStroke: getComputedStyle(textureLine).stroke,
    };
  });

  expect(physicalVolumeSurface.backgroundColor).toBe("rgb(33, 20, 14)");
  expect(physicalVolumeSurface.backgroundImage).toContain("middle-earth-mahogany-v1.webp");
  expect(physicalVolumeSurface.framePointerEvents).toBe("none");
  expect(physicalVolumeSurface.frameTextureHref).toContain("middle-earth-frame-brass-v1.webp");
  expect(physicalVolumeSurface.mapSurfaceFilter).toContain("drop-shadow");
  expect(physicalVolumeSurface.textureStroke).toContain("atlas-physical-frame-texture-middle-earth");

  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(physicalFramePane).toHaveClass(/atlas-physical-frame-pane--detail/);
  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect(physicalFramePane).not.toHaveClass(/atlas-physical-frame-pane--detail/);

  const middleEarthPillBackgrounds = await page.locator(
    '.atlas-map-nav > .atlas-map-nav__link, .atlas-map-nav > .atlas-map-nav__menu > .atlas-map-nav__toggle'
  ).evaluateAll((pills) => pills.map((pill) => getComputedStyle(pill).backgroundColor));
  expect(middleEarthPillBackgrounds).toHaveLength(3);
  expect(new Set(middleEarthPillBackgrounds)).toEqual(new Set(["rgba(38, 58, 36, 0.96)"]));
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

  const popupAppearance = await page.locator(".lore-popup-shell").evaluate((popup) => {
    const wrapper = popup.querySelector(".leaflet-popup-content-wrapper");
    const title = popup.querySelector(".lore-popup__title");

    return {
      borderWidth: getComputedStyle(wrapper).borderWidth,
      boxShadow: getComputedStyle(wrapper).boxShadow,
      ornament: getComputedStyle(title, "::after").content,
    };
  });

  expect(popupAppearance.borderWidth).toBe("0px");
  expect(popupAppearance.boxShadow).toBe("none");
  expect(popupAppearance.ornament).toContain("❧");

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
  let activeTabName = null;

  for (const { tabName, checkboxId, layerType } of checkboxChecks) {
    const tabNameKey = tabName.toString();

    if (activeTabName !== tabNameKey) {
      await page.getByRole("tab", { name: tabName }).click();
      activeTabName = tabNameKey;
    }

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

  await expect(page.getByRole("heading", { name: /Whose tale shall we follow/i })).toBeVisible();
  await page.getByRole("button", { name: /Find a person/i }).click();
  await page.getByRole("searchbox", { name: /Search this family volume/i }).fill("Aragorn");
  await page.locator('[data-welcome-person-id="aragorn_second"]').click();

  await expect(page.locator("#character-sheet")).toBeVisible();
  await expect(page.locator("#character-sheet-content h1")).toHaveText(/Aragorn II Elessar/i);
  await expect(page.locator("#character-sheet-content img")).toHaveAttribute("src", /aragorn_second\.png$/);
});

test("family tree welcome offers three clear opening paths and readable lineage chapters", async ({ page }) => {
  await page.goto("/family_tree/family_tree.html?family=elves-men", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#tree-welcome")).toBeVisible();
  await expect(page.getByRole("button", { name: /Explore a lineage/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Find a person/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /View the complete genealogy/i })).toBeVisible();

  await page.getByRole("button", { name: /Explore a lineage/i }).click();
  await page.getByRole("button", { name: /Kings of Arnor/i }).click();

  await expect(page.locator("#tree-welcome")).toBeHidden();
  await expect(page.locator("#tree-view-title")).toHaveText("Kings of Arnor");
  await expect.poll(async () => page.locator(".family-tree-node").count(), {
    timeout: 30_000,
    message: "Expected the selected lineage chapter to render character nodes."
  }).toBeGreaterThan(0);

  const renderedCardWidth = await page.locator(".family-tree-node__card").first().evaluate((card) => card.getBoundingClientRect().width);
  expect(renderedCardWidth).toBeGreaterThan(80);
});

test("family tree uses initials medallions for people without portrait artwork", async ({ page }) => {
  await page.goto("/family_tree/family_tree.html?family=elves-men", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: /Find a person/i }).click();
  await page.getByRole("searchbox", { name: /Search this family volume/i }).fill("Aldamir");
  await page.locator('[data-welcome-person-id="aldamir"]').click();

  await expect(page.locator("#character-sheet")).toBeVisible();
  await expect(page.locator("#character-sheet-content img")).toHaveAttribute("src", /^data:image\/svg\+xml/);
});

test("family tree controls use a compact drawer on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/family_tree/family_tree.html?family=hobbits&view=hobbit_baggins", { waitUntil: "domcontentloaded" });

  const toggle = page.getByRole("button", { name: /Browse tree/i });
  await expect(toggle).toBeVisible();
  await expect(page.locator("#tree-view-panel")).not.toHaveClass(/is-open/);

  await toggle.click();
  await expect(page.locator("#tree-view-panel")).toHaveClass(/is-open/);
  await expect(page.getByRole("button", { name: /Close family tree controls/i })).toBeVisible();

  await page.getByRole("button", { name: /Close family tree controls/i }).click();
  await expect(page.locator("#tree-view-panel")).not.toHaveClass(/is-open/);
});

test("family tree family groups filter switch view options", async ({ page }) => {
  await page.goto("/family_tree/family_tree.html?family=elves-men&view=all_lineages", { waitUntil: "domcontentloaded" });

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

  await page.goto("/family_tree/family_tree.html?family=hobbits&view=all_hobbit_families", { waitUntil: "domcontentloaded" });

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
