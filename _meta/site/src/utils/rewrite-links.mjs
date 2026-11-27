// Rewrite relative links in rendered Markdown HTML to working URLs.
//
// Markdown in the vault links to other repo files with relative paths
// (`commit-as-yourself.md`, `../raa/playbook.md`, `references/web.md`). Those
// paths are relative to the source file in the repo, not to the page URL, so a
// browser resolves them wrongly. For every relative href we:
//   1. resolve it against the source file's folder to get a repo path;
//   2. if that repo path has a page on this site, link to the page;
//   3. otherwise link to the file (or folder) on GitHub.
// Fragments (`#section`) and query strings are kept.

import { existsSync, statSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';

const githubBlob = 'https://github.com/emb715/ai-stuff/blob/main';
const githubTree = 'https://github.com/emb715/ai-stuff/tree/main';

// Folder collections: <name>/<id>/README.md is the entry page.
// `consumable` is the file rendered at <name>/<id>/<fileSlug>.
const folderCollections = {
  prompts: { consumable: 'prompt.md' },
  playbooks: { consumable: 'playbook.md' },
  skills: { consumable: 'SKILL.md' },
  tools: { consumable: null },
  agents: { consumable: 'system-prompt.md' },
};

// File collections: <dir>/<slug>.md is the entry page, <dir>/ is the index.
const fileCollections = {
  'docs/notes': 'notes',
  'docs/standards': 'standards',
};

function findRepoRoot() {
  let dir = process.cwd();
  while (true) {
    if (existsSync(join(dir, 'AGENTS.md')) && existsSync(join(dir, '_meta'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return resolve(process.cwd(), '../..');
    dir = parent;
  }
}

const repoRoot = findRepoRoot();
const siteDir = '_meta/site';

const isFile = (p) => existsSync(join(repoRoot, p)) && statSync(join(repoRoot, p)).isFile();
const isDir = (p) => existsSync(join(repoRoot, p)) && statSync(join(repoRoot, p)).isDirectory();

/** Turn an Astro entry.filePath (relative to the site root) into a repo path. */
export function repoPathOf(filePath) {
  return posix.normalize(posix.join(siteDir, filePath.split('\\').join('/')));
}

/** Map a repo path (no leading slash, no trailing slash) to a site route, or null. */
export function siteRouteFor(repoPath) {
  const parts = repoPath.split('/');

  for (const [dir, name] of Object.entries(fileCollections)) {
    if (repoPath === dir || repoPath === `${dir}/README.md`) return name;
    if (repoPath.startsWith(`${dir}/`)) {
      const rest = repoPath.slice(dir.length + 1);
      if (!rest.includes('/') && rest.endsWith('.md') && isFile(repoPath)) {
        return `${name}/${rest.slice(0, -3)}`;
      }
      return null;
    }
  }

  const config = folderCollections[parts[0]];
  if (!config) return null;
  const [name, id, file, ...more] = parts;
  if (!id || (id === 'README.md' && !file)) return name;
  if (more.length || !isDir(`${name}/${id}`) || !isFile(`${name}/${id}/README.md`)) return null;
  if (!file || file === 'README.md') return `${name}/${id}`;
  if (file === config.consumable && isFile(repoPath)) return `${name}/${id}/${file.slice(0, -3)}`;
  return null;
}

/** Resolve one href written in the Markdown file at `sourcePath`. Null = leave as is. */
export function resolveHref(href, base, sourcePath) {
  // Absolute URLs, protocol-relative, root-relative, fragments and mail links stay.
  if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('/') || href.startsWith('#')) {
    return null;
  }

  const cut = href.search(/[?#]/);
  const pathPart = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? '' : href.slice(cut);
  if (!pathPart) return null;

  let target;
  try {
    target = posix.normalize(posix.join(posix.dirname(sourcePath), decodeURI(pathPart)));
  } catch {
    return null;
  }
  target = target.replace(/\/+$/, '');
  if (target === '.' || target === '') target = '';
  if (target.startsWith('..')) return null; // escapes the repo; nothing sensible to point at

  const route = siteRouteFor(target);
  if (route !== null) return `${base}${route}${suffix}`;

  const encoded = encodeURI(target);
  if (target === '') return `${githubTree}${suffix}`;
  return `${isDir(target) ? githubTree : githubBlob}/${encoded}${suffix}`;
}

/**
 * Rewrite every relative href in `html`.
 * @param html rendered HTML of one Markdown file
 * @param base site base URL, e.g. "/ai-stuff/"
 * @param sourcePath repo path of the Markdown file, e.g. "docs/notes/foo.md"
 */
export function rewriteHtmlLinks(html, base, sourcePath) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return html.replace(/href=(["'])(.*?)\1/g, (match, quote, url) => {
    const decoded = url.replace(/&amp;/g, '&');
    const rewritten = resolveHref(decoded, normalizedBase, sourcePath);
    return rewritten ? `href=${quote}${rewritten.replace(/&/g, '&amp;')}${quote}` : match;
  });
}
