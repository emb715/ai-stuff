#!/usr/bin/env node
// render: screenshot a page so a model can look at it.
// usage: node render.js <page.html> [outdir]
// writes <outdir>/desktop.png (1280 wide, first 2400px) and <outdir>/mobile.png (375 wide, first 1600px).
// outdir defaults to the page's own folder. Needs Playwright with Chromium.
const path = require('path');
(async () => {
  const page = process.argv[2];
  if (!page) { console.error('usage: node render.js <page.html> [outdir]'); process.exit(2); }
  const out = process.argv[3] || path.dirname(path.resolve(page));
  const url = /^https?:|^file:/.test(page) ? page : 'file://' + path.resolve(page);
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  try {
    for (const [name, w, h, cap] of [['desktop', 1280, 800, 2400], ['mobile', 375, 760, 1600]]) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      const failed = new Set();
      p.on('requestfailed', r => { if (/font|\.woff2?|css/.test(r.url())) failed.add(new URL(r.url()).host); });
      await p.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => p.goto(url));
      await p.evaluate(() => document.fonts && document.fonts.ready); await p.waitForTimeout(300);
      const missing = await p.evaluate(() => document.fonts ? [...document.fonts].filter(f => f.status === 'error').map(f => f.family) : []);
      if (missing.length || failed.size) console.log(`warning: web fonts did not load (${[...new Set(missing)].join(', ') || [...failed].join(', ')}); the screenshot shows fallback faces, so judge type with that in mind`);
      const full = await p.evaluate(() => document.documentElement.scrollHeight);
      await p.screenshot({ path: path.join(out, name + '.png'), clip: { x: 0, y: 0, width: w, height: Math.min(full, cap) } });
      console.log(`${name}.png ${w}x${Math.min(full, cap)}${full > cap ? ` (page is ${full}px tall, cut at ${cap})` : ''}`);
      await p.close();
    }
  } finally { await b.close(); }
})().catch(e => { console.error(e.message); process.exit(2); });
