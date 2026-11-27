#!/usr/bin/env node
// Post-build link check for the static site.
//
// Scans every HTML page in dist/ and resolves each href/src the way a browser
// would on GitHub Pages (a page at notes/foo/index.html is served as
// /ai-stuff/notes/foo/, so relative links resolve against that folder).
//
// Fails when a link:
//   - points inside the site base and no built file serves it;
//   - is relative or root-relative and lands outside the base path;
//   - points to this repo on GitHub (blob/tree/raw on main) and the path does
//     not exist in the checkout.
// Other external links are not fetched.
//
// Usage: node scripts/check-links.mjs [distDir]

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const repoRoot = resolve(siteRoot, '../..');
const dist = resolve(process.argv[2] ?? join(siteRoot, 'dist'));

const origin = 'https://emb715.github.io';
const basePath = '/ai-stuff/';
const repoPrefixes = [
  'https://github.com/emb715/ai-stuff/blob/main/',
  'https://github.com/emb715/ai-stuff/tree/main/',
  'https://raw.githubusercontent.com/emb715/ai-stuff/main/',
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function pageUrl(file) {
  const rel = relative(dist, file).split(sep).join('/');
  const path = rel === 'index.html' ? '' : rel.replace(/(^|\/)index\.html$/, '$1');
  return new URL(basePath + path, origin);
}

function servedBy(pathname) {
  let p = decodeURIComponent(pathname.slice(basePath.length));
  const candidates = p === '' || p.endsWith('/')
    ? [join(dist, p, 'index.html')]
    : [join(dist, p), join(dist, p, 'index.html'), join(dist, `${p}.html`)];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

const attr = /\s(?:href|src)=(["'])(.*?)\1/g;
const problems = [];
let checked = 0;

if (!existsSync(dist)) {
  console.error(`check-links: ${dist} does not exist. Run the build first.`);
  process.exit(2);
}

for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  const from = pageUrl(file);
  for (const m of html.matchAll(attr)) {
    const raw = m[2].replace(/&amp;/g, '&');
    if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(raw)) continue;
    let url;
    try {
      url = new URL(raw, from);
    } catch {
      problems.push({ page: from.pathname, href: raw, why: 'unparseable URL' });
      continue;
    }
    checked++;
    const href = url.href.split('#')[0].split('?')[0];

    if (url.origin === origin) {
      if (!url.pathname.startsWith(basePath) && url.pathname !== basePath.slice(0, -1)) {
        // Full URLs to sibling sites on the same host are fine; a root-relative
        // or relative link that lands outside the base is a missing base prefix.
        if (!/^https?:/i.test(raw)) {
          problems.push({ page: from.pathname, href: raw, why: `outside the site base ${basePath}` });
        }
      } else if (url.pathname !== basePath.slice(0, -1) && !servedBy(url.pathname)) {
        problems.push({ page: from.pathname, href: raw, why: `no page at ${url.pathname}` });
      }
      continue;
    }

    const prefix = repoPrefixes.find((p) => href.startsWith(p));
    if (prefix) {
      const repoPath = decodeURIComponent(href.slice(prefix.length)).replace(/\/+$/, '');
      if (!existsSync(join(repoRoot, repoPath))) {
        problems.push({ page: from.pathname, href: raw, why: `${repoPath} not in the repo` });
      }
    }
  }
}

if (problems.length) {
  console.error(`check-links: ${problems.length} broken link(s) out of ${checked} checked\n`);
  for (const p of problems) console.error(`  ${p.page}\n    ${p.href}\n    -> ${p.why}`);
  process.exit(1);
}
console.log(`check-links: ${checked} links checked, none broken.`);
