const { test, expect } = require('@playwright/test');

for (const [volume, stylesheet] of [
  ['middle-earth', 'middle_earth/middle-earth-volume.css'],
  ['beleriand', 'beleriand/beleriand-volume.css'],
  ['numenor', 'numenor/numenor-volume.css'],
  ['shire', 'the_shire/shire-volume.css'],
]) {
  test(`${volume} popup motifs are centered above titles`, async ({ page, baseURL }, testInfo) => {
    // Isolate popup presentation from map data and first-visit cover animations.
    await page.setContent(`<head>
      <link rel="stylesheet" href="${baseURL}/maps/shared/map-shell.css">
      <link rel="stylesheet" href="${baseURL}/plugins/atlas-map-theme.css">
      <link rel="stylesheet" href="${baseURL}/maps/${stylesheet}">
      <link rel="stylesheet" href="${baseURL}/maps/shared/volume-consistency.css">
      </head><body class="${volume}-volume" style="margin:30px;background:#eee8d8">
      ${['lore', 'campsite'].map(type => `<article class="${type}-popup" style="width:320px">
        <div class="${type}-popup__frame"><h3 class="${type}-popup__title">A note from the atlas</h3>
        <p>A parchment entry with a decorative opening.</p></div></article>`).join('')}
      </body>`);
    for (const type of ['lore', 'campsite']) {
      const frame = page.locator(`.${type}-popup__frame`);
      await expect.poll(() => frame.evaluate(el => getComputedStyle(el, '::before').width)).toBe('96px');
      const style = await frame.evaluate(el => {
        const ornament = getComputedStyle(el, '::before');
        const title = el.querySelector('h3');
        return {
          height: ornament.height, margin: ornament.marginBottom,
          left: ornament.marginLeft, right: ornament.marginRight,
          shrink: ornament.flexShrink,
          after: getComputedStyle(title, '::after').content,
          titleOffset: title.getBoundingClientRect().top - el.getBoundingClientRect().top,
        };
      });
      expect(style.height).toBe('24px');
      expect(style.margin).toBe('10px');
      expect(style.left).toBe(style.right);
      expect(style.shrink).toBe('0');
      expect(['none', 'normal']).toContain(style.after);
      expect(style.titleOffset).toBeGreaterThanOrEqual(34);
    }
    await page.screenshot({ path: testInfo.outputPath(`${volume}-popup-motifs.png`) });
  });
}
