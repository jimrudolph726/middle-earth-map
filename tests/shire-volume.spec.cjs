const { test, expect } = require('@playwright/test');

for (const viewport of [{ width: 1440, height: 1000 }, { width: 844, height: 390 }, { width: 390, height: 844 }]) {
  test(`Shire harvest treatment at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    const missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
    await page.addInitScript(() => document.addEventListener('atlas:mapready', event => {
      window.shireTestMap = event.detail.map;
    }));
    await page.goto('/maps/the_shire/the_shire.html');
    await expect(page.locator('.atlas-physical-frame__corner')).toHaveCount(4);
    await expect(page.locator('.atlas-physical-frame__acorn')).toHaveCount(4);
    await expect(page.locator('.atlas-physical-frame__line')).toHaveCount(6);
    await expect(page.locator('.atlas-physical-mat__layer')).toHaveCount(4);
    await expect(page.locator('#sidebar input:disabled')).toHaveCount(0);
    await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
    await expect(page.locator('#map')).toHaveCSS('background-color', 'rgb(33, 20, 14)');
    expect(await page.locator('#map').evaluate(el => getComputedStyle(el).backgroundImage)).toContain('atlas-mahogany-v1.webp');
    const pills = page.locator('.atlas-map-nav > .atlas-map-nav__link, .atlas-map-nav > .atlas-map-nav__menu > .atlas-map-nav__toggle');
    for (const pill of await pills.all()) {
      await expect(pill).toHaveCSS('background-color', 'rgb(201, 154, 58)');
      await expect(pill).toHaveCSS('color', 'rgb(53, 55, 39)');
    }
    expect(await page.locator('.atlas-physical-frame__corner').evaluateAll(corners => corners.every(el => Number(getComputedStyle(el).zIndex) > 9000))).toBe(true);
    await page.locator('.leaflet-image-layer').evaluate(image => image.decode());
    await page.screenshot({ path: testInfo.outputPath('shire-desk.png') });
    await page.evaluate(() => window.shireTestMap.setZoom(20, { animate: false }));
    await expect(page.locator('.atlas-physical-frame-pane--shire')).toHaveClass(/--detail/);
    await page.evaluate(() => window.shireTestMap.setZoom(17, { animate: false }));
    await expect(page.locator('.atlas-physical-frame-pane--shire')).not.toHaveClass(/--detail/);
    await page.locator('.sidebar-tabs a[href="#settlements"]').click();
    await expect(page.locator('#settlements')).toHaveClass(/active/);
    if (viewport.height < 520) {
      const rail = page.locator('.sidebar-tabs > ul').first();
      await rail.evaluate(el => { el.scrollTop = el.scrollHeight; });
      await expect(page.locator('.sidebar-tabs a[href="#regions"]')).toBeInViewport();
      await expect(page.locator('.sidebar-tabs a[href="#settings"]')).toBeInViewport();
    }
    await page.screenshot({ path: testInfo.outputPath('shire-sidebar.png') });
    await page.locator('#settlements .sidebar-close').click();
    await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
    // Preview the real shared popup builder without adding dummy map records.
    await page.evaluate(async () => {
      const { createSettlementPopup } = await import('/maps/shared/functions.js');
      L.popup({ className: 'lore-popup-shell', maxWidth: 350 })
        .setLatLng(window.shireTestMap.getCenter())
        .setContent(createSettlementPopup('The Shire', 'A quiet country of fields and gardens.', 'https://tolkiengateway.net/wiki/The_Shire'))
        .openOn(window.shireTestMap);
    });
    const wrapper = page.locator('.leaflet-popup-content-wrapper');
    await expect(wrapper).toHaveCSS('border-top-width', '0px');
    await expect(wrapper).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const paper = await wrapper.evaluate(el => ({ mask: getComputedStyle(el, '::before').maskImage, background: getComputedStyle(el, '::before').backgroundColor }));
    expect(paper.mask).toContain('map_parchment.png');
    expect(paper.background).toBe('rgb(241, 228, 195)');
    await expect(page.locator('.lore-popup__link')).toBeVisible();
    await expect(page.locator('.leaflet-popup')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: testInfo.outputPath('shire-popup.png') });
    expect(errors).toEqual([]);
    expect(missing).toEqual([]);
  });
}
