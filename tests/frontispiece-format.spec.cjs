const { test, expect } = require('@playwright/test');

const volumes = [
  ['Beleriand', '/maps/beleriand/beleriand.html'],
  ['Numenor', '/maps/numenor/numenor.html'],
  ['Middle-earth', '/maps/middle_earth/middle-earth.html'],
  ['Shire', '/maps/the_shire/the_shire.html'],
];

for (const [volume, url] of volumes) {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    test(`${volume} uses the shared frontispiece motif format at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${url}?frontispiece=1`);
      await expect(page.locator('[data-atlas-volume-cover]')).toHaveCount(0);
      await expect(page.locator('#frontispiece')).toHaveClass(/active/);
      const ornament = page.locator('#frontispiece .atlas-frontispiece__ornament');
      await expect(ornament).toHaveCount(1);
      await expect(ornament).toHaveAttribute('alt', '');
      const layout = await ornament.evaluate(async image => {
        await image.decode();
        const rect = image.getBoundingClientRect();
        const parent = image.parentElement.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          centered: Math.abs((rect.left + rect.right) / 2 - (parent.left + parent.right) / 2) < 1,
          precedingLabel: image.previousElementSibling.classList.contains('atlas-frontispiece__eyebrow'),
          followingTitle: image.nextElementSibling.classList.contains('atlas-frontispiece__title'),
          margin: getComputedStyle(image).marginBottom,
          before: getComputedStyle(image, '::before').content,
          after: getComputedStyle(image, '::after').content,
          loaded: image.naturalWidth > 0,
        };
      });
      expect(layout).toEqual({
        width: 120, height: 64, centered: true,
        precedingLabel: true, followingTitle: true,
        margin: '18px', before: 'none', after: 'none', loaded: true,
      });
      await page.locator('#sidebar').screenshot({ path: testInfo.outputPath('frontispiece.png') });
    });
  }
}
