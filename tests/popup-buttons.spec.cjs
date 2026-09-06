const { test, expect } = require('@playwright/test');

for (const width of [1440, 390]) {
  test(`popup entry buttons share geometry and interaction states at ${width}px`, async ({ page, baseURL }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    let baseline;
    for (const [volume, stylesheet] of [
      ['middle-earth', 'middle_earth/middle-earth-volume.css'],
      ['numenor', 'numenor/numenor-volume.css'],
      ['shire', 'the_shire/shire-volume.css'],
      ['beleriand', 'beleriand/beleriand-volume.css'],
    ]) {
      await page.setContent(`<head>
        <link rel="stylesheet" href="${baseURL}/assets/vendor/fonts.css">
        <link rel="stylesheet" href="${baseURL}/plugins/leaflet/leaflet.css">
        <link rel="stylesheet" href="${baseURL}/maps/shared/map-shell.css">
        <link rel="stylesheet" href="${baseURL}/plugins/atlas-map-theme.css">
        <link rel="stylesheet" href="${baseURL}/maps/${stylesheet}">
        <link rel="stylesheet" href="${baseURL}/maps/shared/volume-consistency.css">
        </head><body class="${volume}-volume" style="padding:24px;box-sizing:border-box">
          <div class="leaflet-container" style="padding:30px 0;background:#eee8d8">
            <article class="lore-popup"><div class="lore-popup__frame">
              <h3 class="lore-popup__title">An atlas entry</h3>
              <a class="lore-popup__link" href="#entry">Read the full entry</a>
            </div></article>
          </div>
        </body>`);
      await page.evaluate(() => document.fonts.ready);
      const button = page.locator('.lore-popup__link');
      const metrics = () => button.evaluate(el => {
        const s = getComputedStyle(el), a = getComputedStyle(el, '::after');
        const r = el.getBoundingClientRect();
        return {
          width: r.width, height: r.height, radius: s.borderRadius, padding: s.padding,
          border: s.borderWidth, font: s.fontFamily, size: s.fontSize, weight: s.fontWeight,
          line: s.lineHeight, spacing: s.letterSpacing, shadow: s.boxShadow,
          translate: s.translate, outline: [s.outlineWidth, s.outlineStyle, s.outlineOffset],
          arrow: [a.content, a.fontSize, a.marginLeft, a.lineHeight, a.verticalAlign, a.translate],
        };
      });
      await page.mouse.move(0, 0);
      const states = { normal: await metrics() };
      await page.screenshot({ path: testInfo.outputPath(`${volume}-button.png`) });
      await button.hover();
      await expect(button).toHaveCSS('translate', '0px -1px');
      await expect.poll(() => button.evaluate(el => getComputedStyle(el, '::after').translate)).toBe('2px');
      states.hover = await metrics();
      await page.mouse.down();
      await expect(button).toHaveCSS('translate', '0px 1px');
      states.pressed = await metrics();
      // Release outside the link without navigating or leaving focus on it.
      await page.mouse.move(0, 0);
      await page.mouse.up();
      await button.evaluate(el => el.blur());
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS('outline-width', '2px');
      await expect.poll(() => button.evaluate(el => getComputedStyle(el, '::after').translate)).toBe('2px');
      states.focus = await metrics();
      if (baseline) expect(states, `${volume} should use the shared button geometry`).toEqual(baseline);
      else baseline = states;
      if (volume === 'beleriand') {
        await expect(button).toHaveCSS('border-top-color', 'rgb(217, 224, 218)');
        await expect(button).toHaveCSS('background-image', 'linear-gradient(rgb(82, 118, 133), rgb(52, 84, 99))');
      }
    }
  });
}
