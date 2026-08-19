# artifact-router — humans.md

## Why this skill exists

`AGENTS.md` and `USAGE.md` both list the vault's playbooks. Neither picks one for the task at hand. A user (or an LLM session) staring at 14 playbooks has to read every README to choose. This skill collapses that decision into a routing table indexed by intent.

## Origin

Session 2026-08-04. User asked for "a skill that knows the artifacts in the repo and can make the LLM invoke them when necessary." Two options were scoped:

- **A — routing skill (built this).** Maintains a manifest of playbooks with intent + trigger + status. Routes to the right one for the current task. On confirmation, surfaces `playbook.md` as the active procedure. Platform-agnostic.
- **B — active injection across all artifact types (not built).** Skill loads and applies any artifact type at runtime. Harder, platform-dependent (only works where a skill loader exists), risks double-loading if `AGENTS.md` or the platform already loaded the artifact, can't execute `tools/` (only point), and the manifest drifts the moment an artifact changes.

A was chosen and narrowed to playbooks only per user direction: "is for allowing automatic selection on playbooks so remove the rest." The vault has other routing surfaces (`USAGE.md`, `AGENTS.md`) for non-playbook artifacts.

## Design decisions

### Why playbooks only

The user explicitly scoped this to playbook routing. The vault's playbooks are the most complex artifacts (multi-step procedures with decision points, defined outputs, failure paths) and the hardest to pick blind — 14 playbooks with overlapping trigger language. Prompts are copy-paste; skills auto-load on trigger; agents load at session start. Playbooks are the artifact type where a routing skill earns its place.

### Why an embedded manifest, not a generated index

A generated index (scan `playbooks/*/README.md`, parse frontmatter, build the table at runtime) would stay fresh automatically. Rejected for three reasons:

1. **Platform variance.** Not every harness that loads this skill can run filesystem scans at activation time. An embedded manifest works everywhere.
2. **Trigger summarization.** Frontmatter tags don't capture "when to use this vs the adjacent playbook." The manifest's `Trigger` column is hand-written to disambiguate. Auto-generation would produce a tag list, not a disambiguation.
3. **Drift is cheap to fix.** Adding a playbook is a one-line manifest edit. The maintenance cost is lower than the complexity cost of a generator.

The tradeoff: the manifest drifts if someone adds a playbook and forgets to update this file. Mitigation: treat the manifest as a cache; verify the playbook still exists before routing if a route seems wrong.

### Why intent categories, not tag matching

The vault's playbooks use heterogeneous tags (`loop`, `one-shot`, `review`, `codebase-review`, `release`, ...). Tag matching would need a mapping from task to tags, which is the same problem as intent classification but with more indirection. Intent categories are a small fixed vocabulary (`ideate`, `plan`, `implement`, `review`, `capture`, `release`) that maps directly to the task verbs a user types.

### Why one footgun, not two

skill-authoring Step 2 says "one footgun per skill." The original draft had two: "overlapping triggers" and "recommending outside scope." The second is the same problem restated — if you disambiguate overlaps correctly, you don't recommend outside scope. Collapsed to one: overlapping triggers, with the disambiguation rule as the correct version.

### Why no `humans.md` reference in SKILL.md

Per `docs/standards/artifact-structure.md` Gate 7: the consumable file must not reference `humans.md`. A maintainer who needs this file finds it by convention (it is the maintenance file in the three-file folder).

## What was intentionally left out

- **Auto-injection (option B).** Documented in the session, not built. See "Origin" above.
- **A generator script.** See "Why an embedded manifest" above.
- **Framebook procedure routing.** `AGENTS.md` already routes vault operations (`save-artifact`, `promote-artifact`, `audit-experiments`, ...) to `_meta/framebook/`. This skill does not duplicate that routing.
- **Non-playbook artifact routing.** Prompts, skills, agents, tools are out of scope. `USAGE.md` and `AGENTS.md` cover the full inventory.
- **Confidence scoring.** The skill routes; it does not score. A "87% match" number would be theater — the route is either right or wrong, and the user is the judge.
- **State tracking.** No record of which playbook was routed and whether it was used. Adding this would cross into agent-territory and require a persistence layer. Out of scope for a routing skill.
- **Maintenance instructions in SKILL.md.** The manifest is hand-maintained; the rule is stated in SKILL.md ("treat the manifest as a cache, not a live index"). The lint command and maintenance cadence belong here, not in the model-facing file.

## Maintenance notes

When a playbook is added, renamed, or its status changes:
1. Update the manifest row in `SKILL.md`.
2. Verify the trigger description still disambiguates from adjacent playbooks. If not, rewrite the `Trigger` cell.
3. Run `python3 scripts/doc_lint.py`.
4. If the playbook's intent is not in the category list, add the category to the table in `SKILL.md`. The vocabulary is intentionally small — do not add a category for one playbook.

When the skill itself is promoted out of `experiments/`:
1. Move the folder to `skills/artifact-router/`.
2. Update `skills/README.md` index.
3. Update the manifest paths in `SKILL.md` (they are relative to repo root; they still work from `skills/` because they use `playbooks/...` paths).
4. Fill the Evidence section with at least one real run before promotion to `validated`.

## Known gaps

- **No run evidence.** The skill has never been used to route a real task. The manifest is built from READMEs, not from routing outcomes. Before promoting to `validated`, run the skill-authoring Step 8 evaluation: 3 tasks (one without skill, one with, one cross-task to check over-trigger).
- **No lint enforcement for manifest drift.** Adding a playbook without updating the manifest produces no lint failure. A future lint rule could check that every playbook folder has a manifest row — not implemented.
- **The manifest was built from READMEs read on 2026-08-04.** If a playbook's `When to use` section was updated after that date, the manifest row may be stale. The fix is re-reading the README, not re-running anything.
