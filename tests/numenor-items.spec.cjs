const { test, expect } = require('@playwright/test');

test('Númenor Royal Heirlooms checkbox displays the sceptre and its popup', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/maps/numenor/numenor.html');
  await expect(page.locator('[data-numenor-volume-cover]')).toHaveCount(0, { timeout: 6000 });
  await page.locator('.sidebar-tabs a[href="#items"]').click();
  const checkbox = page.locator('#royalheirloomsCheckbox');
  const marker = page.locator('.leaflet-marker-icon.atlas-marker-icon');
  const counts = await page.evaluate(async () => {
    const { royalheirlooms, jewels_and_keepsakes } = await import('/maps/numenor/settlement_item_data.js');
    return { royal: Object.keys(royalheirlooms).length, all: Object.keys(royalheirlooms).length + Object.keys(jewels_and_keepsakes).length };
  });
  await checkbox.check();
  await expect(marker).toHaveCount(counts.royal);
  await expect(marker.first()).toHaveAttribute('src', /sceptre-of-numenor-medallion\.svg$/);
  await marker.first().evaluate(image => image.decode());
  await page.locator('#items .sidebar-close').click();
  await marker.first().click();
  await expect(page.locator('.lore-popup__title')).toHaveText('Sceptre of Númenor');
  await page.locator('.leaflet-popup-close-button').click();
  await page.locator('.sidebar-tabs a[href="#items"]').click();
  await checkbox.uncheck();
  await expect(marker).toHaveCount(0);
  await page.locator('#allItemCheckbox').check();
  await expect(checkbox).toBeChecked();
  await expect(marker).toHaveCount(counts.all);
  await page.locator('#allItemCheckbox').uncheck();
  await expect(marker).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Númenor jewel and letter use distinct medallions and working popups', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => document.addEventListener('atlas:mapready', event => {
    window.itemTestMap = event.detail.map;
  }));
  await page.goto('/maps/numenor/numenor.html');
  await expect(page.locator('[data-numenor-volume-cover]')).toHaveCount(0, { timeout: 6000 });
  await page.locator('.sidebar-tabs a[href="#items"]').click();
  const checkbox = page.locator('#jewels_and_keepsakesCheckbox');
  await checkbox.check();
  for (const [file, title] of [
    ['diamond-of-erendis-medallion.svg', 'Jewel of Erendis'],
    ['gil-galads-letter-medallion.svg', "Gil-galad's Letter"],
  ]) {
    const icon = page.locator(`.leaflet-marker-icon[src$="${file}"]`);
    await expect(icon).toHaveCount(1);
    await icon.evaluate(image => image.decode());
    // The author's current coordinates coincide; test each bound popup without relocating the items.
    await page.evaluate(file => window.itemTestMap.eachLayer(layer => {
      if (layer.options.icon?.options.iconUrl?.endsWith(file)) layer.openPopup();
    }), file);
    await expect(page.locator('.lore-popup__title')).toHaveText(title);
    await page.locator('.leaflet-popup-close-button').click();
    await expect(page.locator('.lore-popup__title')).toHaveCount(0);
  }
  await checkbox.uncheck();
  await expect(page.locator('.leaflet-marker-icon.atlas-marker-icon')).toHaveCount(0);
  expect(errors).toEqual([]);

  // A local visual-proof sheet shows both SVGs at working and enlarged sizes.
  await page.setContent(`<body style="margin:0;padding:32px;background:#eee8d8;color:#17334d;font-family:Georgia">
    <h2>Númenor · Item medallions</h2><div style="display:flex;gap:50px">
    ${[['diamond-of-erendis-medallion.svg', 'Diamond of Erendis'], ['gil-galads-letter-medallion.svg', "Gil-galad’s letter"]].map(([file, title]) => `
      <section><h3>${title}</h3><div style="display:flex;align-items:center;gap:24px">
      <img src="/maps/numenor/assets/${file}" width="192" height="192">
      <img src="/maps/numenor/assets/${file}" width="48" height="48">
      </div></section>`).join('')}</div></body>`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.screenshot({ path: testInfo.outputPath('numenor-item-medallions.png') });
});
