# Save Artifact from Another Project

## Trigger

You have something from another project — a working skill, a prompt that ran well, a pattern, a research finding — and want to save it here for reuse.

## Preconditions

- The artifact has been used at least once (otherwise it is speculation, not evidence).
- Sensitive content has been identified and can be sanitized.
- You know roughly what type it is: prompt / skill / tool / playbook / experiment.

## Procedure / Steps

### 1. Classify the artifact type

| What you have | Where it goes |
|---|---|
| Reusable instruction text to copy/paste | `prompts/` (if validated) or `experiments/` (if first capture) |
| Working OpenCode skill or command | `experiments/` first, `tools/` after validation |
| Repeatable procedure with trigger/steps/outputs | `playbooks/` |
| Pattern or research finding | `docs/references/` or `experiments/` |
| Something untested or unclear | `experiments/` always |

When in doubt: `experiments/`.

### 2. Apply the routing rule

Strict distinction — ask "what is the primary value?":

- **Prompt** (`prompts/`): value is the reusable instruction text itself.
- **Skill / Tool** (`skills/` or `tools/`): value is packaged capability or behavior.
- **Playbook** (`playbooks/`): value is the recurring procedure coordinating assets and producing defined output.
- **Docs** (`docs/`): value is policy, reference, or standards explanation.

If the artifact is "run these steps when X happens and produce Y," it is a playbook.

### 3. Sanitize

Before writing anything, strip:
- Project-specific file paths, names, identifiers → replace with `<placeholder>`
- Client names, internal domain names, private endpoints
- API keys, tokens, credentials
- Personal data

Keep: the pattern, the logic, the shape. Lose: the specific context.

### 4. Determine the structure

**Has a standalone consumable form** (something you copy-paste and use directly)?
→ Use the three-file folder structure:

```
<name>/
├── README.md    ← frontmatter + artifact record
├── <thing>.md   ← copy-paste clean artifact (no frontmatter)
└── humans.md    ← origin, decisions, maintenance notes
```

**Document only** (reference, standard, pattern description)?
→ Single file with frontmatter.

### 5. Write the artifact

Use the appropriate template from `templates/`. Fill in what you know.
For anything uncertain, use `confidence: low` and note it explicitly. Do not invent evidence.

Minimum required in README:
- What it does and when to use it
- At least one documented outcome (Evidence) — even brief
- At least one failure mode or boundary

### 6. Set status correctly

| Situation | Status |
|---|---|
| Used once, outcome documented | `validated` |
| Used multiple times, well understood | consider `vetted` after rubric check |
| Not yet tested here, just captured | `draft` |

### 7. Link it

- Add to section README (`prompts/README.md`, `playbooks/README.md`, etc.)
- Add to root `README.md` index if it is a prompt or notable artifact
- Run `python scripts/doc_lint.py`

## Workflow

```
receive artifact
  → classify primary value (prompt / skill / playbook / docs / experiment)
  → sanitize
  → determine structure (three-file folder or single file)
  → write artifact
  → set correct status
  → link from index
  → run lint
```

- Uncertain classification at any step → route to `experiments/` as `draft`
- Mixed prompt + procedure → split into two artifacts, cross-link

## Rollback / Fallback

If the artifact does not fit any category cleanly: put it in `experiments/` with a hypothesis note explaining what it is and what would need to be true to promote it.
