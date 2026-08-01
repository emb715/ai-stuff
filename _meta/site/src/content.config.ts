import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Vault root is two levels up from _meta/site/
const vaultRoot = '../../';

// Shared schema — matches the repo's metadata standard (AGENTS.md).
// All fields required by Gate 1. `tooling` and `tags` are arrays.
const artifactSchema = z.object({
  title: z.string(),
  status: z.enum(['draft', 'validated', 'vetted', 'deprecated']),
  confidence: z.enum(['low', 'medium', 'high']),
  // YAML parses unquoted dates as Date objects. Accept both, normalize at render.
  last_tested: z.union([z.string(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString().split('T')[0] : String(v)
  ),
  scope: z.enum(['personal', 'team', 'global']),
  tooling: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  owner: z.string(),
});

// For three-file artifacts, the glob loader would generate IDs like
// "loop-prd-readiness/README". We override generateId to use just the
// folder name — that becomes the URL slug.
const folderId = ({ entry }: { entry: string }) =>
  entry.replace(/\/README\.md$/, '').replace(/\.md$/, '');

// Consumable files (prompt.md, playbook.md, SKILL.md, system-prompt.md) live
// inside artifact folders. glob pattern '*/prompt.md' matches entries like
// 'ai-stuff-command-installer/prompt.md'. We want just the folder name as ID
// (matches the parent README's slug), so strip the trailing filename segment.
const consumableFolderId = ({ entry }: { entry: string }) =>
  entry.split('/').slice(0, -1).join('/');

// Each collection reads README.md from artifact folders.
// Three-file artifacts (prompts/, skills/, tools/, playbooks/, agents/)
// have README.md as the repo record — that's what we render.
const prompts = defineCollection({
  loader: glob({ pattern: '*/README.md', base: `${vaultRoot}prompts`, generateId: folderId }),
  schema: artifactSchema,
});

const playbooks = defineCollection({
  loader: glob({ pattern: '*/README.md', base: `${vaultRoot}playbooks`, generateId: folderId }),
  schema: artifactSchema,
});

const skills = defineCollection({
  loader: glob({ pattern: '*/README.md', base: `${vaultRoot}skills`, generateId: folderId }),
  schema: artifactSchema,
});

const tools = defineCollection({
  loader: glob({ pattern: '*/README.md', base: `${vaultRoot}tools`, generateId: folderId }),
  schema: artifactSchema,
});

const agents = defineCollection({
  loader: glob({ pattern: '*/README.md', base: `${vaultRoot}agents`, generateId: folderId }),
  schema: artifactSchema,
});

// Notes are single-file documents (not three-file folders).
// Exclude README.md (the index) — only actual notes.
const notes = defineCollection({
  loader: glob({ pattern: '[!R]*.md', base: `${vaultRoot}docs/notes`, generateId: folderId }),
  schema: artifactSchema,
});

// Standards are single-file documents.
const standards = defineCollection({
  loader: glob({ pattern: '*.md', base: `${vaultRoot}docs/standards`, generateId: folderId }),
  schema: artifactSchema,
});

// Consumable files (prompt.md, playbook.md, SKILL.md, system-prompt.md) have
// NO frontmatter — they are pure copy-paste artifacts (per AGENTS.md, the
// three-file artifact structure). Metadata comes from the parent README entry.
// generateId produces the folder name (slug) — same slug as the parent README.
// We render them on-site via src/pages/[collection]/[id]/[file].astro.
const promptsConsumable = defineCollection({
  loader: glob({ pattern: '*/prompt.md', base: `${vaultRoot}prompts`, generateId: consumableFolderId }),
});
const playbooksConsumable = defineCollection({
  loader: glob({ pattern: '*/playbook.md', base: `${vaultRoot}playbooks`, generateId: consumableFolderId }),
});
const skillsConsumable = defineCollection({
  loader: glob({ pattern: '*/SKILL.md', base: `${vaultRoot}skills`, generateId: consumableFolderId }),
});
const agentsConsumable = defineCollection({
  loader: glob({ pattern: '*/system-prompt.md', base: `${vaultRoot}agents`, generateId: consumableFolderId }),
});

export const collections = {
  prompts,
  playbooks,
  skills,
  tools,
  agents,
  notes,
  standards,
  'prompts-consumable': promptsConsumable,
  'playbooks-consumable': playbooksConsumable,
  'skills-consumable': skillsConsumable,
  'agents-consumable': agentsConsumable,
};