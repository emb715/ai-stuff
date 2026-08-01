// Rewrite relative links in rendered HTML to include the site base path.
// Called per-entry in the detail page template where collectionName and entrySlug are known.
// Links to files without a site page (USAGE.md, _meta/..., playbook.md, prompt.md, etc.) point to GitHub.

const collections = ['prompts', 'playbooks', 'skills', 'tools', 'agents', 'notes', 'standards'];
const githubBase = 'https://github.com/emb715/ai-stuff/blob/main';

// Consumable file names inside three-file artifact folders — no site page for these
const consumableFiles = ['prompt.md', 'playbook.md', 'SKILL.md', 'tool.md', 'command.md', 'system-prompt.md', 'humans.md'];

export function rewriteHtmlLinks(html, base, collectionName, entrySlug = '') {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  // Match href="..." or href='...' with relative paths or bare consumable filenames
  return html.replace(/href=(["'])((?:\.\.?\/[^"']*)|(?:[A-Za-z]+\.md))\1/g, (match, quote, url) => {
    const rewritten = resolveRelative(url, normalizedBase, collectionName, entrySlug);
    return rewritten ? `href=${quote}${rewritten}${quote}` : match;
  });
}

function resolveRelative(url, base, collectionName, entrySlug) {
  let path = url;
  const upCount = (path.match(/^\.\.\//g) || []).length;
  path = path.replace(/^(\.\.\/)+/, '');

  let targetCollection = null;
  let slug = null;

  // prompts/foo/ or prompts/foo
  for (const c of collections) {
    if (path.startsWith(`${c}/`)) {
      targetCollection = c;
      slug = path.slice(c.length + 1);
      break;
    }
  }

  // docs/notes/foo.md or docs/standards/foo.md
  if (!targetCollection && path.startsWith('docs/')) {
    for (const c of ['notes', 'standards']) {
      if (path.startsWith(`docs/${c}/`)) {
        targetCollection = c;
        slug = path.slice(`docs/${c}/`.length);
        break;
      }
    }
  }

  // _meta/... — no site page, point to GitHub
  if (!targetCollection && path.startsWith('_meta/')) {
    return `${githubBase}/${path}`;
  }

  // Same-folder consumable file: SKILL.md, playbook.md, prompt.md (no ../, no collection prefix)
  // This is a file inside the current artifact's folder — render on-site.
  // Keep original case for the URL slug (e.g. SKILL.md → 'SKILL').
  if (!targetCollection && upCount === 0 && consumableFiles.includes(path) && collectionName && entrySlug) {
    const fileSlug = path.replace(/\.md$/, '');
    return `${base}${collectionName}/${entrySlug}/${fileSlug}`;
  }

  // Root files (USAGE.md, CONTRIBUTING.md) — no site page, point to GitHub
  if (!targetCollection && !path.includes('/')) {
    return `${githubBase}/${path}`;
  }

  // Relative within same collection: ../foo/ (upCount=1, no collection prefix)
  if (!targetCollection && upCount >= 1 && collectionName) {
    targetCollection = collectionName;
    slug = path;
  }

  if (!targetCollection || !slug) return null;

  // If slug points to a specific consumable file in a sibling folder
  // e.g. ../raa/playbook.md → site page at playbooks/raa/playbook
  const lastSegment = slug.split('/').pop();
  if (consumableFiles.includes(lastSegment)) {
    const cleanSlug = slug.replace(/\/+$/, '');
    const folderName = cleanSlug.split('/')[0];
    const fileSlug = lastSegment.replace(/\.md$/, '');
    return `${base}${targetCollection}/${folderName}/${fileSlug}`;
  }

  // non-md file (e.g. image) — leave as-is
  if (slug.includes('.') && !slug.endsWith('.md')) {
    return null;
  }

  slug = slug.replace(/\/+$/, '');
  slug = slug.replace(/\.md$/, '');
  if (slug === 'README') slug = '';
  if (slug.endsWith('/README')) slug = slug.replace(/\/README$/, '');

  return slug ? `${base}${targetCollection}/${slug}` : `${base}${targetCollection}`;
}