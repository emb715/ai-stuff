# Agent Skills — Claude Platform Overview

Source: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview  
Captured: 2025-06

---

## What skills are

Modular capabilities that extend Claude's functionality. Each skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant.

Unlike prompts (conversation-level, one-off), skills:
- Load on demand
- Eliminate repeated guidance across conversations
- Are reusable across sessions

---

## How loading works — three levels

| Level | Trigger | Token cost | What loads |
|---|---|---|---|
| **1 — Metadata** | Always, at startup | ~100 tokens per skill | `name` + `description` from YAML frontmatter, injected into system prompt |
| **2 — Instructions** | When skill is triggered (user request matches description) | Under 5k tokens | Full SKILL.md body — Claude reads it via bash |
| **3 — Resources** | When Claude decides it needs them | Effectively unlimited (no context cost until read) | Additional files: FORMS.md, scripts, schemas, reference docs |

**Key insight:** Claude navigates skills like a filesystem. It reads SKILL.md via bash, then reads additional files only if its instructions reference them and the task requires them. Scripts execute via bash — only output enters context, not code.

---

## Architecture: what this enables

**On-demand file access:** Only files needed for the specific task are read. A skill can have 20 reference files; if the task only needs one, the other 19 cost zero tokens.

**Efficient script execution:** When Claude runs a script, the script's code never enters the context window. Only its output does. This makes scripts far more efficient than asking Claude to generate equivalent code inline.

**No practical limit on bundled content:** Because files don't consume context until accessed, skills can include comprehensive API docs, large datasets, extensive examples — no penalty for content that isn't used.

---

## Where skills work

| Surface | Pre-built skills | Custom skills | Sharing scope |
|---|---|---|---|
| **claude.ai** | Yes | Yes (zip upload, Settings > Features) | Individual user only |
| **Claude API** | Yes | Yes (via `/v1/skills` API) | Workspace-wide |
| **Claude Code** | No | Yes (filesystem directories) | Personal (`~/.claude/skills/`) or project (`.claude/skills/`) |

Custom skills **do not sync across surfaces** — must be managed separately per surface.

### Runtime environment constraints

| Surface | Network | Package install |
|---|---|---|
| **claude.ai** | Varies (user/admin settings) | npm, PyPI, GitHub |
| **Claude API** | None | None (pre-installed only) |
| **Claude Code** | Full (same as host machine) | Local only (avoid global installs) |

---

## Skill structure

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance]

## Examples
[Concrete examples]
```

**`name` field:**
- Max 64 characters
- Lowercase letters, numbers, hyphens only
- Cannot contain XML tags
- Cannot contain reserved words: `anthropic`, `claude`

**`description` field:**
- Non-empty, max 1024 characters
- Cannot contain XML tags
- Must describe both what it does and when to use it

---

## Pre-built skills (Anthropic-provided)

| Skill ID | Capability |
|---|---|
| `pptx` | Create/edit/analyze PowerPoint presentations |
| `xlsx` | Create spreadsheets, analyze data, generate charts |
| `docx` | Create/edit/format Word documents |
| `pdf` | Generate formatted PDF documents and reports |

Available on: Claude API, claude.ai, Claude Platform on AWS, Microsoft Foundry.

---

## Security model

Skills run with the same access as any other code in their environment. A malicious skill can invoke tools, execute code, and access files in harmful ways.

**Trust only:**
- Skills you created yourself
- Skills obtained from Anthropic

**Before using a third-party skill:**
- Review all files: SKILL.md, scripts, images, other resources
- Look for unexpected network calls, file access, or operations that don't match the stated purpose
- Be especially cautious of skills that fetch from external URLs — fetched content can contain malicious instructions

Treat installing a skill like installing software.

---

## Key differences from the agentskills.io spec

The spec uses `references/` for supplementary docs. Claude's platform docs use the same concept but call the pattern "progressive disclosure" explicitly, with a clearer 3-level loading model. The behavior is identical.

Claude's platform adds:
- Explicit security guidance
- Surface-specific constraints (API vs. claude.ai vs. Claude Code)
- Pre-built skills catalog
- ZDR exclusion note (skills data retained per standard policy, not ZDR)
