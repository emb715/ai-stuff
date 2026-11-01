#!/usr/bin/env node
// taste-audit: grade a rendered page against the `rule` column of refs/taste.csv.
//
// usage: node taste-audit.js <page.html | url> [--json] [--csv path/to/taste.csv]
// exit:  0 when every rule passes, 1 when any rule fails, 2 on usage or load error.
//
// Needs Playwright with a Chromium build (require('playwright')).
// Metrics are computed on the rendered page at 1280px; overflow is checked at 375px.

const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

function measurePage() {
  const rgb = s => { const v = (s.match(/[\d.]+/g) || []).map(Number); return s.startsWith('color(') ? [v[0] * 255, v[1] * 255, v[2] * 255, v[3]] : v; };
  const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const bgOf = e => { for (let n = e; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > .5)) return c; } return [255, 255, 255]; };
  const visible = e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed';
  const ownText = e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();

  const sizes = new Map(), fams = new Set(), radii = new Set(), shadows = new Set(), spacing = new Set();
  let offGrid = 0, spacingTotal = 0, centeredLong = 0, gradients = 0, minContrast = 99, worst = '';
  let maxMeasure = 0, motion = false, minTarget = 999, smallTarget = '';
  const lineHeights = [];

  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    const txt = ownText(e);
    if (txt && visible(e)) {
      const fs = parseFloat(cs.fontSize);
      sizes.set(fs, (sizes.get(fs) || 0) + txt.length);
      fams.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      if (fs < 24) {
        const L1 = lum(rgb(cs.color)), L2 = lum(bgOf(e));
        const cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
        if (cr < minContrast) { minContrast = cr; worst = `${e.tagName.toLowerCase()} "${txt.slice(0, 30)}"`; }
      }
    }
    if (e.tagName === 'P' && visible(e) && e.textContent.trim().length > 120) {
      const fs = parseFloat(cs.fontSize);
      maxMeasure = Math.max(maxMeasure, e.clientWidth / (fs * 0.5)); // 1ch ≈ 0.5em for proportional faces
      if (cs.textAlign === 'center') centeredLong++;
      const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / fs;
      lineHeights.push(lh);
    }
    if (cs.borderRadius !== '0px' && !cs.borderRadius.includes('%') && parseFloat(cs.borderRadius) < 999) radii.add(cs.borderRadius);
    if (cs.boxShadow !== 'none') shadows.add(cs.boxShadow);
    if (cs.backgroundImage.includes('gradient')) gradients++;
    for (const k of ['paddingTop', 'paddingLeft', 'marginTop', 'marginBottom', 'rowGap', 'columnGap']) {
      const v = parseFloat(cs[k]); if (v > 0) { spacing.add(v); spacingTotal++; if (v % 4) offGrid++; }
    }
    if (parseFloat(cs.transitionDuration) > 0 || cs.animationName !== 'none') motion = true;
    const interactive = e.matches('button, [role=button], input:not([type=hidden]), select, a.btn, a[class*=button], a[class*=btn]');
    if (interactive && visible(e)) {
      const r = e.getBoundingClientRect(); const m = Math.min(r.width, r.height);
      if (m > 0 && m < minTarget) { minTarget = m; smallTarget = `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 20)}"`; }
    }
  }

  // body size = the size carrying the most characters
  const bodyPx = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
  const distinct = [...sizes.keys()].sort((a, b) => a - b);
  let minStep = 99; for (let i = 1; i < distinct.length; i++) minStep = Math.min(minStep, distinct[i] / distinct[i - 1]);

  const unlabeled = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')]
    .filter(i => !(i.id && document.querySelector(`label[for="${CSS.escape(i.id)}"]`)) && !i.closest('label') && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length;

  let css = '';
  for (const s of document.styleSheets) { try { for (const r of s.cssRules) css += r.cssText + '\n'; } catch (_) {} }
  const focusRemoved = /:focus[^{-]*\{[^}]*outline:\s*(none|0)/.test(css) && !/:focus-visible/.test(css) ? 1 : 0;
  const reduced = /prefers-reduced-motion/.test(css);

  const med = a => a.length ? a.sort((x, y) => x - y)[Math.floor(a.length / 2)] : 1.5;
  return {
    metrics: {
      font_sizes: distinct.length, min_size_step: Math.round(minStep * 100) / 100, font_families: fams.size,
      body_font_px: bodyPx, body_line_height: Math.round(med(lineHeights) * 100) / 100,
      max_measure_ch: Math.round(maxMeasure), centered_long_paragraphs: centeredLong,
      off_grid_pct: Math.round(100 * offGrid / Math.max(1, spacingTotal)), spacing_values: spacing.size,
      radii: radii.size, shadows: shadows.size, min_text_contrast: Math.round(minContrast * 10) / 10,
      gradients, min_target_px: minTarget === 999 ? 999 : Math.round(minTarget), unlabeled_inputs: unlabeled,
      focus_outline_removed: focusRemoved, motion_without_reduced: motion && !reduced ? 1 : 0,
    },
    evidence: { min_text_contrast: worst, min_target_px: smallTarget, font_sizes: distinct.join(' ') },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const csvAt = args.includes('--csv') ? args[args.indexOf('--csv') + 1] : path.join(__dirname, '..', 'refs', 'taste.csv');
  const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--csv');
  if (!target) { console.error('usage: node taste-audit.js <page.html | url> [--json] [--csv taste.csv]'); process.exit(2); }
  const url = /^https?:|^file:/.test(target) ? target : 'file://' + path.resolve(target);
  const rules = parseCsv(fs.readFileSync(csvAt, 'utf8')).filter(r => r.rule);

  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url); await page.waitForTimeout(500);
    const { metrics, evidence } = await page.evaluate(measurePage);
    const mobile = await browser.newPage({ viewport: { width: 375, height: 800 } });
    await mobile.goto(url); await mobile.waitForTimeout(300);
    metrics.mobile_overflow_px = await mobile.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));

    const results = rules.map(r => {
      const m = r.rule.match(/^(\w+)\s*(<=|>=|==)\s*([\d.]+)$/);
      if (!m || !(m[1] in metrics)) return { id: r.id, rule: r.rule, status: 'skip' };
      const v = metrics[m[1]], t = Number(m[3]);
      const ok = m[2] === '<=' ? v <= t : m[2] === '>=' ? v >= t : v === t;
      return { id: r.id, property: r.property, rule: r.rule, value: v, status: ok ? 'pass' : 'fail',
        smell: ok ? undefined : r.smell, laws: r.laws, evidence: evidence[m[1]] };
    });
    const failed = results.filter(r => r.status === 'fail');
    const scored = results.filter(r => r.status !== 'skip');
    if (json) console.log(JSON.stringify({ target, score: `${scored.length - failed.length}/${scored.length}`, metrics, results }, null, 1));
    else {
      console.log(`taste-audit ${target}\nscore ${scored.length - failed.length}/${scored.length}\n`);
      for (const r of results) {
        const mark = r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : '·';
        console.log(`${mark} ${r.id.padEnd(5)} ${r.rule.padEnd(28)} value=${r.value}${r.evidence ? `  (${r.evidence})` : ''}`);
        if (r.status === 'fail') console.log(`        smell: ${r.smell}  [${r.laws}]`);
      }
    }
    process.exitCode = failed.length ? 1 : 0;
  } finally { await browser.close(); }
}

main().catch(e => { console.error(e.message); process.exit(2); });
