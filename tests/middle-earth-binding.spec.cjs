const { test, expect } = require('@playwright/test');
for (const volume of [
  { name: 'Middle-earth', prefix: 'middle-earth', url: '/maps/middle_earth/middle-earth.html', texture: 'middle-earth-green-leather-v1.webp', fallback: 'rgb(38, 58, 36)', tab: 'Open atlas frontispiece' },
  { name: 'Beleriand', prefix: 'beleriand', url: '/maps/beleriand/beleriand.html', texture: 'beleriand-cloth-v1.webp', fallback: 'rgb(69, 92, 112)', tab: 'Open Beleriand frontispiece' },
  { name: 'Numenor', prefix: 'numenor', url: '/maps/numenor/numenor.html', texture: 'middle-earth-green-leather-v1.webp', textureUrl: '../middle_earth/assets/materials/middle-earth-green-leather-v1.webp', fallback: 'rgb(23, 61, 93)', tab: 'Open Númenor frontispiece' },
  { name: 'Shire', prefix: 'shire', url: '/maps/the_shire/the_shire.html', texture: 'beleriand-cloth-v1.webp', textureUrl: '../beleriand/assets/materials/beleriand-cloth-v1.webp', fallback: 'rgb(205, 164, 83)', tab: 'Open Shire frontispiece' },
]) {
const { url } = volume;
const coverSelector = '[data-atlas-volume-cover]';
const part = name => `.${volume.prefix}-volume-cover__${name}`;

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  test(`${volume.name} layered binding at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const cover = page.locator(coverSelector);
    await cover.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = 1000;
    }));
    await expect(cover).toHaveCSS('animation-delay', '3s');
    await expect(cover).toHaveCSS('animation-duration', '0.76s');
    await expect(page.locator(part('board'))).toHaveCSS('transform-style', 'preserve-3d');
    await expect(page.locator(part('frame'))).toBeInViewport({ ratio: 1 });
    await page.evaluate(async textureFile => {
      await document.fonts.ready;
      const texture = new Image();
      texture.src = textureFile;
      await texture.decode();
    }, volume.textureUrl || `./assets/materials/${volume.texture}`);
    await page.screenshot({ path: testInfo.outputPath('binding-closed.png') });
    await cover.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => {
      animation.currentTime = 3380;
    }));
    const matrix = await page.locator(part('board')).evaluate(element => {
      const transform = new DOMMatrix(getComputedStyle(element).transform);
      return { rotation: transform.m13, translation: transform.m41 };
    });
    expect(Math.abs(matrix.rotation)).toBeGreaterThan(0.1);
    expect(matrix.translation).toBe(0);
    await page.screenshot({ path: testInfo.outputPath('binding-opening.png') });
    // A child completing early must neither remove the cover nor consume its listener.
    await page.locator(part('light')).evaluate(element => {
      element.dispatchEvent(new AnimationEvent('animationend', { bubbles: true }));
    });
    await expect(cover).toHaveCount(1);
    await cover.evaluate(element => element.dispatchEvent(new AnimationEvent('animationend', { bubbles: true })));
    await expect(cover).toHaveCount(0);
    await expect(page.locator('#frontispiece')).toHaveClass(/active/);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(cover).toHaveCSS('animation-delay', '0s');
    await expect(cover).toHaveCSS('animation-duration', '0.62s');
    await expect(page.locator(part('board'))).toHaveCSS('animation-duration', '0.62s');
    await expect(cover).toHaveCount(0, { timeout: 1400 });
    await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
    expect(errors).toEqual([]);
  });
}

test(`${volume.name} binding respects reduced motion and a missing texture`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(`**/${volume.texture}`, route => route.abort());
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Capture computed styles at creation, before the short fade removes the scene.
  await expect(page.locator('#frontispiece')).toHaveClass(/active/);
  await expect(page.locator(coverSelector)).toHaveCount(0, { timeout: 1000 });
  const styles = await page.evaluate(prefix => {
    const cover = document.createElement('div');
    cover.setAttribute('data-atlas-volume-cover', '');
    cover.className = `${prefix}-volume-cover atlas-volume-cover--returning`;
    cover.innerHTML = `<div class="${prefix}-volume-cover__board"><div class="${prefix}-volume-cover__face"></div></div>`;
    document.body.append(cover);
    const result = {
      delay: getComputedStyle(cover).animationDelay,
      duration: getComputedStyle(cover).animationDuration,
      animation: getComputedStyle(cover).animationName,
      board: getComputedStyle(cover.firstElementChild).animationName,
      fallback: getComputedStyle(cover.querySelector(`.${prefix}-volume-cover__face`)).backgroundColor,
    };
    cover.remove();
    return result;
  }, volume.prefix);
  expect(styles).toEqual({ delay: '0s', duration: '0.18s', animation: `${volume.prefix}-volume-fade`, board: 'none', fallback: volume.fallback });
  await page.getByRole('tab', { name: volume.tab }).click();
  await expect(page.locator('#sidebar')).toHaveClass(/collapsed/);
});
}
