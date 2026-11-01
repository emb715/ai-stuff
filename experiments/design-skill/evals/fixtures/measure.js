// Render each <dir>/index.html at 1280px, save <dir>/shot.png, print consistency metrics.
// usage: node measure.js <dir> [<dir> ...]
const {chromium} = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const d of process.argv.slice(2)) {
    const p = await b.newPage({viewport: {width: 1280, height: 800}});
    await p.goto('file://' + d + '/index.html');
    await p.waitForTimeout(800);
    await p.screenshot({path: d + '/shot.png', fullPage: true});
    const m = await p.evaluate(() => {
      const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
      const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
      const bgOf = e => { for (let n = e; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > .5)) return c; } return [255, 255, 255]; };
      const sizes = new Set(), fams = new Set(), radii = new Set(), shadows = new Set(), spacing = new Set();
      let minContrast = 99, offGrid = 0, spacingTotal = 0, centeredLong = 0, gradient = false;
      for (const e of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(e);
        const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (hasText && e.offsetParent !== null) {
          sizes.add(cs.fontSize); fams.add(cs.fontFamily.split(',')[0]);
          const L1 = lum(rgb(cs.color)), L2 = lum(bgOf(e));
          const cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
          if (parseFloat(cs.fontSize) < 24) minContrast = Math.min(minContrast, cr);
        }
        if (cs.borderRadius !== '0px' && !cs.borderRadius.includes('%') && parseFloat(cs.borderRadius) < 999) radii.add(cs.borderRadius);
        if (cs.boxShadow !== 'none') shadows.add(cs.boxShadow);
        for (const k of ['paddingTop', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap']) {
          const v = parseFloat(cs[k]); if (v > 0) { spacing.add(v); spacingTotal++; if (v % 4) offGrid++; }
        }
        if (e.tagName === 'P' && e.textContent.length > 120 && cs.textAlign === 'center') centeredLong++;
        if (cs.backgroundImage.includes('gradient')) gradient = true;
      }
      return {fontSizes: sizes.size, families: fams.size, radii: radii.size, shadows: shadows.size,
        spacingValues: spacing.size, offGridPct: Math.round(100 * offGrid / Math.max(1, spacingTotal)),
        minContrastSmallText: Math.round(minContrast * 10) / 10, centeredLong, gradient};
    });
    console.log(JSON.stringify({run: d.split('/').pop(), ...m}));
    await p.close();
  }
  await b.close();
})();
