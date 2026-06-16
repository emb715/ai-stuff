# Agent Skills — Format Specification

Source: https://agentskills.io/specification  
Captured: 2025-06

---

## Directory structure

```
skill-name/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files
```

> **Note:** The official spec uses `references/` for documentation files. The library-skill-builder convention uses `refs/` (shortened) for the same purpose. Both are valid — pick one and stay consistent within a skill.

---

## SKILL.md frontmatter fields

| Field | Required | Constraints |
|---|---|---|
| `name` | Yes | Max 64 chars. Lowercase letters, numbers, hyphens only. No leading/trailing/consecutive hyphens. Must match directory name. |
| `description` | Yes | Max 1024 chars. Non-empty. What the skill does + when to use it. |
| `license` | No | License name or reference to bundled file. |
| `compatibility` | No | Max 500 chars. Environment requirements (product, packages, network). |
| `metadata` | No | Arbitrary key-value map for additional properties. |
| `allowed-tools` | No | Space-separated string of pre-approved tools. Experimental. |

### `name` rules

- 1–64 characters
- `a-z`, `0-9`, `-` only
- No leading, trailing, or consecutive hyphens (`--`)
- Must match the parent directory name exactly

```yaml
# Valid
name: pdf-processing
name: data-analysis

# Invalid
name: PDF-Processing   # uppercase
name: -pdf             # leading hyphen
name: pdf--processing  # consecutive hyphens
```

### `description` rules

- 1–1024 characters
- Must describe **what** the skill does and **when** to use it
- Include specific keywords that help agents identify relevant tasks

```yaml
# Good
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Poor
description: Helps with PDFs.
```

### `metadata` field

```yaml
metadata:
  author: example-org
  version: "1.0"
```

Use reasonably unique key names to avoid accidental conflicts between skills.

### `allowed-tools` field (experimental)

```yaml
allowed-tools: Bash(git:*) Bash(jq:*) Read
```

Space-separated. Support varies between agent implementations.

---

## Body content

No format restrictions. Recommended sections:

- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases

The agent loads the entire SKILL.md once the skill is activated. Split longer content into referenced files.

---

## Progressive disclosure — three levels

| Level | When loaded | Token cost | Content |
|---|---|---|---|
| **1 — Metadata** | Always (startup) | ~100 tokens per skill | `name` + `description` from frontmatter |
| **2 — Instructions** | When skill is triggered | < 5000 tokens recommended | Full SKILL.md body |
| **3 — Resources** | As needed | Effectively unlimited | Scripts, references, assets — loaded on demand |

Keep SKILL.md under 500 lines. Move detailed reference material to separate files.

---

## Optional directories

### `scripts/`

Executable code. Scripts should:
- Be self-contained or clearly document dependencies
- Include helpful error messages
- Handle edge cases gracefully

### `references/` (or `refs/`)

Additional documentation loaded on demand:
- `REFERENCE.md` — technical reference
- Domain-specific files (`finance.md`, `legal.md`, etc.)

Keep individual reference files focused. Agents load on demand — smaller files = less context consumed per load.

### `assets/`

Static resources:
- Templates (document, configuration)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

---

## File references

Use relative paths from the skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py
```

**Keep references one level deep from SKILL.md.** Avoid nested reference chains — agents may partially read deeply nested files using `head -100` rather than reading them fully.

---

## Validation

```bash
skills-ref validate ./my-skill
```

Checks frontmatter validity and naming conventions.
Source: https://github.com/agentskills/agentskills/tree/main/skills-ref

---

## Key constraints vs. library-skill-builder conventions

| Spec says | library-skill-builder uses | Notes |
|---|---|---|
| `references/` for docs | `refs/` | Shortened, same purpose |
| No format restriction on body | Affirmative, token-efficient prose | Stricter than spec for quality |
| 500 lines max SKILL.md | 100–180 lines target | Much stricter — enforces concision |
| Any file structure | `SKILL.md` + `refs/` + `humans.md` | Opinionated for consistency |
