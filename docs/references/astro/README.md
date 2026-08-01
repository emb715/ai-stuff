---
title: "Astro — source reference"
status: validated
confidence: high
last_tested: 2026-07-31
scope: personal
tooling:
  - "astro/5.x"
tags:
  - astro
  - ssg
  - reference
owner: "@emb715"
---

# Astro — source reference

Canonical URLs for building the vault's static publishing site with Astro. URLs come first; working notes are secondary.

## Source URLs

| Resource | URL |
|---|---|
| Official repo | https://github.com/withastro/astro |
| Docs repo | https://github.com/withastro/docs |
| Documentation | https://docs.astro.build |
| Spec / reference | https://docs.astro.build/en/reference/ |
| Quickstart | https://docs.astro.build/en/install-and-setup/ |
| Content collections guide | https://docs.astro.build/en/guides/content-collections/ |
| Glob loader reference | https://docs.astro.build/en/reference/content-loader-reference/ |
| Markdown content guide | https://docs.astro.build/en/guides/markdown-content/ |

## Scaffolding

```bash
# Minimal project, no template (we need custom structure)
npm create astro@latest _meta/site -- --template minimal --no-install --no-git --skip-houston

# Install after scaffolding
cd _meta/site && npm install
```

## Architecture decisions for this vault

- **Content collections read from source folders** (`../prompts/`, `../playbooks/`, etc.) via `glob({ base: '../<folder>' })`. No content duplication. The filesystem is authoritative; the site is a rendered view.
- **Frontmatter parsed via Zod schemas** matching the vault's metadata standard (`title`, `status`, `confidence`, `last_tested`, `scope`, `tooling`, `tags`, `owner`).
- **Three-file artifacts**: the site renders `README.md` as the artifact record. The consumable file (`prompt.md`, `playbook.md`, `SKILL.md`) is linked from the record page.
- **Zero client JS by default.** Astro's islands architecture keeps the site fast; interactivity added only where needed.

## Key APIs

- `defineCollection` + `glob` loader — reads markdown from arbitrary directories
- `getCollection('name')` — fetches all entries in a collection
- `getEntry('name', 'id')` — fetches a single entry
- Zod schema validation on frontmatter at build time

## Notes

- The `glob` loader `base` path is relative to the project root. Since the site lives at `_meta/site/`, vault content is at `../../prompts/`, `../../playbooks/`, etc.
- `retainBody: false` is available for collection listings that only need frontmatter (index pages) — saves build memory.
- Astro 5 (current) uses the Content Layer API. Older `getStaticPaths` patterns from Astro 4 are deprecated for new projects.