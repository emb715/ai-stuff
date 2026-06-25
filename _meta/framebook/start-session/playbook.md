# Start a Working Session

## Trigger

Opening this repo to do work — creating something new, researching a topic, continuing an experiment, or reviewing what exists.

## Preconditions

- You know roughly what kind of session this is (see Step 1).

## Procedure / Steps

### 1. Identify the session type

**Creating something new**
You have an idea, a working artifact from another project, or a prompt to capture.
→ Go to `_meta/framebook/save-artifact/`

**Researching a topic**
You want to understand something (loop prompting, agent patterns, a new tool) and save the findings.
→ Create `experiments/<topic>/README.md` using `templates/experiment-template.md`
→ Save reference material in `docs/references/<topic>/`
→ Capture findings as you go — do not wait until the end

**Continuing an experiment**
You have something in `experiments/` that is partially done.
→ Read the experiment README for current state and next step
→ Update the README as you go
→ When done: run `_meta/framebook/promote-artifact/` or leave as draft with updated notes

**Auditing / reviewing**
You want to see what is in experiments, what is ready to promote, what is stale.
→ Go to `_meta/framebook/audit-experiments/`

**Adding to an existing artifact**
You have new evidence, a failure mode to add, or a correction.
→ Edit the artifact directly
→ Update `last_tested` and `status` if the new evidence changes the assessment
→ Re-run `python scripts/doc_lint.py`

### 2. Orient yourself (first session or after a gap)

Read in this order — stop when you have enough context:
1. This file (done)
2. `README.md` — directory map and lifecycle rules
3. `experiments/` — what is currently in progress
4. `prompts/README.md` — what is available to use now

Skip standards and docs unless you are authoring or promoting.

### 3. Check what exists before building

Before creating something new, scan for prior work:
- `prompts/` — usable prompts
- `experiments/` — may have a related draft
- `skills/` — knowledge that might apply
- `docs/references/` — relevant research already captured

If something close exists: extend it, do not duplicate.

### 4. Work

Create files in the right place. For anything with a consumable form, use the three-file folder structure (`docs/standards/artifact-structure.md`). Use templates from `templates/`.

Commit incrementally. One logical change per commit.

### 5. Close the session

Before leaving:
- Update any README or index you touched
- If you created something new, link it from the section index
- If an experiment is ready to promote, note it or run `_meta/framebook/promote-artifact/`
- Run `python scripts/doc_lint.py` if you authored or edited structured docs

## Workflow

```
session opens
  → classify intent (new / research / continue / audit / patch)
  → check for existing prior work
  → execute task in correct location
  → link and lint before closing
```

- Unclear intent → classify first → do not write files yet
- Untested/ambiguous output → route to `experiments/`
- Tested, reusable output → route through `_meta/framebook/promote-artifact/`

## Rollback / Fallback

If unsure where something belongs: put it in `experiments/` with a clear hypothesis. It can be moved later.
