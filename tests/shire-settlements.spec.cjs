const { test, expect } = require('@playwright/test');

for (const { place, category, asset, prefix } of [
  { place: 'Hobbiton', category: 'Towns and Villages', asset: 'shire-village-medallion.svg', prefix: 'shire-village' },
  { place: 'Bamfurlong', category: 'Homes and Farms', asset: 'shire-homestead-medallion.svg', prefix: 'shire-homestead' },
  { place: 'The Green Dragon', category: 'Inns and Gathering Places', asset: 'shire-homestead-medallion.svg', prefix: 'shire-inn' },
]) {
test(`${place} uses its Shire medallion and settlement checkbox`, async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/maps/the_shire/the_shire.html');
  await expect(page.locator('.atlas-physical-frame__corner')).toHaveCount(4);
  await page.locator('.sidebar-tabs a[href="#settlements"]').click();
  const checkbox = page.getByRole('checkbox', { name: category, exact: true });
  await page.locator('#settlementsSection label').filter({ hasText: category }).click();
  await expect(checkbox).toBeChecked();
  const marker = page.locator(`.leaflet-marker-icon[src$="${asset}"]`);
  await expect(marker).toHaveCount(1);
  await marker.evaluate(image => image.decode());
  await page.locator('#settlements .sidebar-close').click();
  await marker.click();
  await expect(page.locator('.lore-popup__title')).toHaveText(place);
  await expect(page.locator('.leaflet-popup')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath(`${prefix}-map.png`) });
  await page.locator('.leaflet-popup-close-button').click();
  await page.locator('.sidebar-tabs a[href="#settlements"]').click();
  await checkbox.uncheck();
  await expect(marker).toHaveCount(0);
  await checkbox.check();
  await expect(marker).toHaveCount(1);
  expect(errors).toEqual([]);

  await page.setContent(`<body style="margin:0;padding:28px;background:#f1e4c3;color:#393b2b;font-family:Georgia">
    <h2>Shire · ${category}</h2>
    <div style="display:flex;align-items:center;gap:32px">
    <img src="/maps/the_shire/assets/${asset}" width="192" height="192">
    <img src="/maps/the_shire/assets/${asset}" width="48" height="48">
    </div></body>`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.screenshot({ path: testInfo.outputPath(`${prefix}-icon.png`) });
});
}
