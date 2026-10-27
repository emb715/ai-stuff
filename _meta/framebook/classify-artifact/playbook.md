# Classify an Artifact

## Trigger

You have something to add to the repo and need a placement decision.

## Preconditions

- You have a clear description of what the artifact is and what it does

## Procedure / Steps

### Question 1 — Is this ready or experimental?

- Known to work, tested at least once with a documented result → continue to Q2
- Untested, uncertain, early idea, or "I think this works" → **`experiments/`** — done

### Question 2 — What is the primary value?

Ask: if you removed the core of this artifact, what would be lost?

| If removing this destroys value... | Destination |
|---|---|
| The exact wording / instruction text | → `prompts/` |
| The execution procedure / steps | → `playbooks/` |
| The packaged behavior or tooling | → `skills/` (harness-activated) or `tools/` (deployable) |
| The explanatory policy or reference | → `docs/` |

There is no destination for "proven and reusable". Trust level is frontmatter (`status: vetted`), not a folder — a vetted artifact stays in its type folder. See `docs/standards/artifact-classification.md`.

If two answers apply equally → the artifact is hybrid. Go to step "Handle hybrid artifacts" below.

### Question 3 — Confirm placement criteria

**`prompts/`** — all must be true:
- [ ] Copy-paste reusable with minimal editing
- [ ] Has a clear bounded purpose (one job)
- [ ] Tested at least once with documented outcome
- [ ] Sanitized (no private identifiers, no secrets)

**`playbooks/`** — all must be true:
- [ ] Recurring task (not one-off)
- [ ] Has an explicit trigger
- [ ] Has ordered steps with decision points
- [ ] Has defined outputs
- [ ] Has failure/rollback paths

**`skills/`** — harness-activated behavior package, all must be true:
- [ ] Packaged as a `SKILL.md` whose `description` the harness matches to activate it, with no human loading it
- [ ] Gives the agent a capability — how to build, author, use or decide something
- [ ] Not a deployable artifact (that is `tools/`)
- [ ] Not something a human opens and walks

Ordered steps do **not** disqualify a skill. Every skill in this vault is procedural inside — what separates it from a playbook is *who loads it*: a skill activates itself from its description, a playbook is opened and followed. Judge the activation path, not the shape of the body.

**`tools/`** — deployable artifact, all must be true:
- [ ] Ready to deploy directly (copy-paste or symlink into a project)
- [ ] Validated — tested in at least one real session
- [ ] Distinct from knowledge about building tools (that goes to `skills/`)

**`docs/`** — all must be true:
- [ ] Standards, ADRs, principles, or reference material
- [ ] No standalone consumable form (no copy-paste artifact)
- [ ] Policy or explanatory value, not execution value

**`status: vetted`** — not a placement, a frontmatter value. All must be true:
- [ ] Passes vetting rubric (≥ 12/14, no zero axes)
- [ ] Proven, repeatable, sanitized
- [ ] Already `validated`, in its own type folder — `draft -> vetted` is forbidden

The artifact does not move when it reaches `vetted`. Promotion is `_meta/framebook/promote-artifact/`, not a classification decision.

If any criterion fails → `experiments/` with a note on which criterion failed.

### Handle hybrid artifacts

If the artifact contains both:
- Reusable prompt text + operating procedure → split: `prompts/<name>/` + `playbooks/<name>/`, cross-link both
- Knowledge reference + deployable tool → split: `skills/<name>/` + `tools/<name>/`, cross-link both
- Anything + "I'm not sure" → `experiments/` with a classification note in the README

If splitting is too costly right now: `experiments/` with a `## Classification note` section.

### Question 4 — Does it need the 3-file structure?

Applies to: prompts, tools, skills, commands — anything with a standalone consumable form.

- Yes → create `<name>/README.md`, `<name>/<thing>.md`, `<name>/humans.md`
- No (standards, ADRs, references) → single file is fine

See `docs/standards/artifact-structure.md` for the exact structure.

### Final step — Link it

The artifact is orphaned until it appears in an index:
- Add to section README (e.g., `prompts/README.md`)
- Add to root `README.md` artifact inventory table

## Workflow

```
is it ready? → no → experiments/
  → what's the primary value? → pick destination
  → confirm all placement criteria → any fail → experiments/
  → hybrid? → split or experiments/
  → needs 3-file structure? → yes → create folder
  → link from section README + root README
```

## Rollback / Fallback

Wrong placement is not catastrophic — artifacts can be moved. If you realize later the classification was wrong: move the folder, update all index links, log the reclassification in the next changelog entry.
