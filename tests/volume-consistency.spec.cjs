const { test, expect } = require('@playwright/test');
const volumes = [
  ['beleriand', '/maps/beleriand/beleriand.html'],
  ['numenor', '/maps/numenor/numenor.html'],
  ['middle-earth', '/maps/middle_earth/middle-earth.html'],
  ['shire', '/maps/the_shire/the_shire.html'],
];

test('popup space follows phone rotation and smaller screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => document.addEventListener('atlas:mapready', e => { window.testAtlasMap = e.detail.map; }));
  await page.goto('/maps/the_shire/the_shire.html#settlements');
  await page.locator('#settlements .sidebar-close').click();
  await page.evaluate(async () => {
    const { createSettlementPopup } = await import('/maps/shared/functions.js');
    const map = window.testAtlasMap;
    L.popup({ className: 'lore-popup-shell', maxWidth: 760 }).setLatLng(map.getCenter())
      .setContent(createSettlementPopup('A quiet inn', 'A place to rest. '.repeat(80), 'https://example.com')).openOn(map);
  });
  for (const viewport of [{ width: 844, height: 390 }, { width: 320, height: 568 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(async () => {
      const p = await page.locator('.leaflet-popup').boundingBox();
      const n = await page.locator('.atlas-map-nav').boundingBox();
      return p && p.x >= 0 && p.x + p.width <= viewport.width && p.y >= n.y + n.height + 10 && p.y + p.height <= viewport.height;
    }).toBe(true);
  }
});

test('global navigation uses stable book typography without a fourth About pill', async ({ page }) => {
  for (const url of ['/', '/about.html', '/family_tree/family_tree.html', ...volumes.map(v => v[1])]) {
    await page.goto(url);
    const pills = page.locator('.atlas-map-nav > a, .atlas-map-nav > details > summary');
    await expect(pills).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    const before = await pills.evaluateAll(els => els.map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, font: getComputedStyle(el).fontFamily })));
    expect(before.every(s => s.font.includes('Libre Baskerville') && s.height === 42)).toBe(true);
    await page.addStyleTag({ content: '.atlas-map-nav :is(a,summary) { font-family: Georgia, serif !important; }' });
    const after = await pills.evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
    expect(after).toEqual(before.map(s => s.width));
  }
});

for (const [volume, url] of volumes) {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    test(`${volume} consistent surfaces and popup safe area at ${viewport.width}px`, async ({ page }, testInfo) => {
      const missing = [], errors = [];
      page.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
      page.on('pageerror', e => errors.push(e.message));
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => document.addEventListener('atlas:mapready', e => { window.testAtlasMap = e.detail.map; }));
      await page.goto(`${url}?frontispiece=1`);
      await expect(page.locator('[data-atlas-volume-cover]')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      const invalid = await page.locator('label[for]').evaluateAll(labels => labels.filter(l => !l.control).map(l => l.htmlFor));
      expect(invalid).toEqual([]);
      if (['shire', 'numenor'].includes(volume)) await expect(page.locator('#paths')).not.toContainText('Beren');
      const cards = page.locator('#frontispiece .atlas-chapter-card');
      const paper = await cards.first().evaluate(el => getComputedStyle(el).backgroundImage);
      expect(paper).not.toContain('/maps/assets/');
      expect(paper).toContain('/assets/map_parchment.png');
      if (viewport.height === 390) {
        const first = await cards.first().boundingBox();
        expect(first.y + first.height).toBeLessThan(viewport.height - 10);
      }
      await page.screenshot({ path: testInfo.outputPath('frontispiece.png') });
      await page.locator('#frontispiece .sidebar-close').click();
      if (volume === 'middle-earth') await page.evaluate(async () => {
        window.testAtlasMap = (await import('/maps/middle_earth/variables.js')).map;
      });
      // Test all shared popup templates, including long text and narrow screens.
      for (const kind of ['settlement', 'geography', 'campsite']) {
        await page.evaluate(async ({ kind }) => {
          const api = await import('/maps/shared/functions.js');
          const text = 'A carefully preserved account of the roads, rivers, and people of this land. '.repeat(12);
          const content = kind === 'settlement' ? api.createSettlementPopup('An atlas entry', text, 'https://example.com')
            : kind === 'geography' ? api.createGeographicPopup('An atlas entry', 'An old name', 'Its meaning', text, 'https://example.com')
            : api.createCampsitePopup('A day on the road', 4, 12, 3, text, 'A sheltered campsite');
          const map = window.testAtlasMap;
          map.closePopup();
          L.popup({ className: kind === 'campsite' ? 'campsite-popup-shell' : 'lore-popup-shell', maxWidth: 760 })
            .setLatLng(map.getCenter()).setContent(content).openOn(map);
        }, { kind });
        const popup = page.locator('.leaflet-popup');
        // Leaflet retains the previous popup briefly while its fade finishes.
        await expect(popup).toHaveCount(1);
        await expect(popup).toBeVisible();
        await expect.poll(async () => {
          const r = await popup.boundingBox();
          const nav = await page.locator('.atlas-map-nav').boundingBox();
          return r.x >= 0 && r.x + r.width <= viewport.width && r.y >= ((viewport.width <= 600 || viewport.height <= 500) ? nav.y + nav.height + 10 : 0) && r.y + r.height <= viewport.height;
        }).toBe(true);
        const frame = page.locator(kind === 'campsite' ? '.campsite-popup__frame' : '.lore-popup__frame');
        const motif = await frame.evaluate(el => getComputedStyle(el, '::before').backgroundImage);
        expect(motif).toContain('.svg');
        await expect(page.locator('.leaflet-popup-tip-container')).toBeHidden();
        await page.screenshot({ path: testInfo.outputPath(`${kind}-popup.png`) });
      }
      expect(missing).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  for (const width of [1440, 390]) {
    test(`${volume} cover geometry at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${url}?frontispiece=1`, { waitUntil: 'domcontentloaded' });
      const cover = page.locator('[data-atlas-volume-cover]');
      await cover.evaluate(el => el.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = 1000; }));
      const styles = await cover.evaluate(el => {
        const frame = el.querySelector('[class$="-volume-cover__frame"]');
        const s = getComputedStyle(frame);
        return { width: s.width, sizing: s.boxSizing, padding: s.padding, delay: getComputedStyle(el).animationDelay };
      });
      expect(styles).toEqual({ width: width === 1440 ? '700px' : '294px', sizing: 'border-box', padding: width === 1440 ? '38px 28px 40px' : '28px 16px 30px', delay: '3s' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: testInfo.outputPath('cover.png') });
    });
  }
}
