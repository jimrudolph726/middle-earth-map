const { test, expect } = require('@playwright/test');
const url = '/maps/the_shire/the_shire.html';

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  test(`Shire Fourth Volume opens and welcomes visitors at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const cover = page.locator('[data-shire-volume-cover]');
    await expect(page.locator('body')).toHaveAttribute('data-atlas-introduction-state', 'first');
    await expect(cover).toHaveCSS('animation-delay', '3s');
    await expect(cover).toHaveCSS('animation-duration', '0.76s');
    await expect(cover).toContainText('The Fourth Volume');
    await expect(cover).toContainText('An Almanac of Hearth & Harvest');
    await expect(cover.locator('.shire-volume-cover__frame')).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath('shire-cover.png') });
    await expect(cover).toHaveCount(0, { timeout: 6000 });
    await expect(page.locator('#frontispiece')).toHaveClass(/active/);
    await expect(page.locator('#frontispiece .atlas-chapter-card')).toHaveCount(3);
    await expect(page.locator('#sidebar input:disabled')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('shire-frontispiece.png') });
    await page.getByRole('button', { name: /Find a Place to Call Home/ }).click();
    await expect(page.locator('#settlements')).toHaveClass(/active/);
    await page.getByRole('tab', { name: 'Open Shire frontispiece' }).click();
    await page.getByRole('button', { name: /Wander Field & Stream/ }).click();
    await expect(page.locator('#geography')).toHaveClass(/active/);
    await page.getByRole('tab', { name: 'Open Shire frontispiece' }).click();
    // Reload with the frontispiece still open: returning visits must collapse it.
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toHaveAttribute('data-atlas-introduction-state', 'returning');
    await expect(cover).toHaveCSS('animation-delay', '0s');
    await expect(cover).toHaveCSS('animation-duration', '0.62s');
    await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
    await expect(cover).toHaveCount(0, { timeout: 2000 });
    await page.getByRole('tab', { name: 'Open Shire frontispiece' }).click();
    await page.getByRole('button', { name: /Unfold the Shire/ }).click();
    await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
    expect(errors).toEqual([]);
  });
}

test('Shire deep links, forced previews, reduced motion and blocked storage remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${url}#settings`);
  await expect(page.locator('body')).toHaveAttribute('data-atlas-introduction-state', 'deep-link');
  await expect(page.locator('#settings')).toHaveClass(/active/);
  expect(await page.evaluate(() => localStorage.getItem('atlas.frontispiece.shire.seen:v1'))).toBeNull();
  await page.goto(`${url}?frontispiece=1`);
  await expect(page.locator('#frontispiece')).toHaveClass(/active/);
  await expect(page.locator('[data-shire-volume-cover]')).toHaveCount(0, { timeout: 1000 });
  expect(await page.evaluate(() => localStorage.getItem('atlas.frontispiece.shire.seen:v1'))).toBeNull();
  await page.addInitScript(() => {
    Storage.prototype.getItem = Storage.prototype.setItem = Storage.prototype.removeItem = () => { throw new Error('Storage blocked for test'); };
  });
  await page.goto(url);
  await expect(page.locator('#frontispiece')).toHaveClass(/active/);
  await expect(page.locator('[data-shire-volume-cover]')).toHaveCount(0, { timeout: 1000 });
  await page.getByRole('button', { name: /Unfold the Shire/ }).click();
  await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
});
