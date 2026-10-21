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

### Round 1 revision, 2026-10-21 — what changed and why

Four routing defects were worked, after an audit of all 14 intent assignments rather than the one that prompted it. Evidence for each claim below is in `evals/results.md`.

**1. Intent audit — four of fourteen rows were wrong, and the column itself was underpowered.**

| Playbook | Was | Now | Why |
|---|---|---|---|
| `agent-installer` | `ideate` | `implement` | Shipping an installer CLI is build work. "A new installer" reads like a blank page only if you look at the noun instead of the verb. |
| `decision-making` | `ideate` | `decide` | It starts from N options that already exist and converges them. `ideate` was defined as "starting from a rough idea, issue, or blank page" — the opposite end. |
| `request-triage` | `plan` | `decide` | Its own README says it "does not execute the chosen artifact; only routes". It produces a choice, not a spec or a plan. |
| `build-to-release` | `implement` | `implement`, with its entry corrected | Intent was defensible; the row was not. Its entry is an idea or PoC, not a validated plan, and nothing in a single Intent column could express that it spans ideate→release. |

`decide` is a new category covering two playbooks, which respects the rule below about not adding a category for one playbook.

The deeper fix: intent alone cannot route. The manifest is now indexed by **Entry** (what the user must already have) and **Exit** (what the playbook produces), with intent demoted to a coarse filter. That one change is what made the chain rule and the containment rule expressible, and it is what the `agent-installer` and `quick-spec` routes now cite as their justification in real runs.

**2. The priority rule's first tier was dead, so fit now comes first.**

The old tier 1 was `vetted > validated > draft`. The vault has zero vetted playbooks and ten of fourteen are draft, so on most routes it could not discriminate at all. Worse in principle: where it *could* discriminate, it pointed the wrong way, because the `validated` candidate is often a *phase* of the `draft` playbook that actually matches (`adversarial-code-review` inside `implementation-orchestration`). The rule is now entry-match → `Not for` exclusion → narrower scope → containment → an unconditional final tiebreak that surfaces all survivors and asks. Status is reported as a caveat on the route, never as a reason for it.

Honesty about the evidence: the predicted failure **did not occur** in testing. The `old` snapshot routed R10 correctly to `implementation-orchestration` despite its status-first rule. So this change is justified as specification hygiene — a tier that cannot discriminate on 10 of 14 rows is not a rule — not by a failure it was observed to prevent.

**3. Composite tasks now have a rule, and it earned its place.**

A `Chains` table records what `issue-to-pr`, `readiness-cycle`, `build-to-release`, `issue-to-ready-specs` and `implementation-orchestration` run internally. Four rules follow: single row if one spans entry→exit; else prefer an existing chain playbook; else name the shortest ordered sequence and route only to its first step; and never route to a playbook that the right chain already embeds.

This produced the clearest measured win. "Forty brainstormed ideas → something structured for planning" was answered as `decision-making` → `product-brief`, in order, with the reasoning that forty unranked options are not the "converged brainstorm output" `product-brief`'s entry requires. Both the baseline and the pre-revision snapshot got that case wrong, because neither had a way to express "the answer is two playbooks".

**4. Direction of flow is now part of disambiguation, and declines are explicit.**

Footgun step 3 says two playbooks can act on the same object class and run opposite ways: `issue-to-ready-specs` runs issue→specs, while a notes→issues task shares the words "break down" and "issue" while being the reverse operation. A reversed match is a wrong route, not a partial one — its first step demands an input the user does not have.

A `Known coverage gaps` section now lists the task shapes to decline outright rather than near-miss: notes→tracker issues, authoring skills/prompts/tools, and vault lifecycle operations.

Caveat worth keeping in view: **this section is untested text.** The case built to trigger it was taken by `skills/issues-to-roadmap` in all three conditions — the router never activated, so the decline never fired. It prevents a misroute that was not observed happening.

**5. The description was rewritten, because activation turned out to be the weak half.**

In the pre-revision snapshot the skill activated in only one of four runs, losing to `issues-to-roadmap` on anything shaped like "break work down". The description now lists the playbook domains by name and states all three non-activation conditions. It improved things but did not solve them: two of three remaining routing failures are still activation losses, and one discovery probe missed because the task described `retrospective`'s situation without saying "retro". The next round of work on this skill belongs in the description, not the manifest.

### Why an embedded manifest, not a generated index

A generated index (scan `playbooks/*/README.md`, parse frontmatter, build the table at runtime) would stay fresh automatically. Rejected for three reasons:

1. **Platform variance.** Not every harness that loads this skill can run filesystem scans at activation time. An embedded manifest works everywhere.
2. **Trigger summarization.** Frontmatter tags don't capture "when to use this vs the adjacent playbook." The manifest's `Trigger` column is hand-written to disambiguate. Auto-generation would produce a tag list, not a disambiguation.
3. **Drift is cheap to fix.** Adding a playbook is a one-line manifest edit. The maintenance cost is lower than the complexity cost of a generator.

The tradeoff: the manifest drifts if someone adds a playbook and forgets to update this file. Mitigation: treat the manifest as a cache; verify the playbook still exists before routing if a route seems wrong.

#### Re-tested 2026-10-21 — reason 3 was never exercised

Reason 3 ("drift is cheap to fix") was the one that looked testable once the vault had grown. Checked against git rather than argued:

- Playbook folders added since 2026-08-04: **0**
- Playbook `status:` values changed since 2026-08-04: **0**
- Commits touching `playbooks/` since then: 3, all to `playbook.md` bodies or one cross-link line
- Manifest rows matching reality on 2026-10-21: **14 of 14**

So the manifest is accurate 78 days on because **nothing in its scope changed**, not because drift occurred and was repaired cheaply. Zero drift events means zero evidence about repair cost. Reason 3 neither held nor failed — it was never put to the test, and "the manifest stayed accurate for 78 days" is not support for the design. It is the absence of a test being mistaken for a passed one.

What the vault's growth did produce is more interesting. All four artifacts added in that window were skills, outside the manifest's scope, and one of them (`issues-to-roadmap`) now contests activation on two of eleven routing cases. The risk that materialised in 78 days was not staleness inside the boundary; it was **competition outside it**. Reason 3 is still plausible — it is just unevidenced, and it was aimed at the wrong risk.

Reasons 1 (platform variance) and 2 (trigger summarisation) remain untested: only OpenCode discovery has ever been exercised, and no generated alternative exists to compare trigger text against.

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
1. Move the folder to `skills/ai-stuff-artifact-router/` — **not** `skills/artifact-router/`, which an earlier version of this file suggested. The folder name must keep matching the `name:` in SKILL.md frontmatter and the `.opencode/skills/` symlink, and skill-authoring requires preserving the skill name across revisions.
2. Re-point `.opencode/skills/ai-stuff-artifact-router` at the new location (it is a tracked symlink, currently `../../experiments/ai-stuff-artifact-router`).
3. Add a row to the `skills/README.md` index, in its `| [name](dir/) | tags | status |` format.
4. Add a row to the root `README.md` Skills table.
5. Remove the row from `experiments/README.md`, which is where it is indexed today.
6. Manifest paths in `SKILL.md` need no change — they are `playbooks/...` relative to repo root and work from either location.
7. Move `evals/` with the folder. `scripts/doc_lint.py` excludes `skills/*/evals/**` and `experiments/*/evals/**`, so the exclusion holds on both sides of the move.
8. Run `python3 scripts/doc_lint.py` and log the promotion in `changelog/week-YYYY-WW.md`.

## Open decision — does the scope stay playbooks-only?

Pending the owner's call. The current boundary was an explicit instruction ("is for allowing automatic selection on playbooks so remove the rest") and **stays in force until that changes**. Round 1 produced the first concrete cost of it, and also a reason the cost is smaller than it looked.

The case for widening to `skills/` and `prompts/`:

- `skills/issues-to-roadmap` covers notes→tracker issues; no playbook does. R4 is currently answered by a `no playbook covers this` decline that is strictly less useful than naming the artifact that fits.
- Two playbook READMEs already cross-link non-playbook artifacts as the next step: `readiness-cycle` chains `prompts/review-release-candidate/`, `raa` hands off to `prompts/loop-implementation-readiness/`. The router can describe those chains but cannot route into them, so a chain's last leg is unroutable.
- `build-to-release` likewise names two prompts as internal phases.

The case against:

- Skills already self-activate. Measured in round 1: `issues-to-roadmap` won activation over the router in R3 and R4, in all three conditions, without any help. Routing to a skill duplicates a mechanism the harness already runs, and risks double-loading — the exact objection that killed option B at the start.
- Prompts are copy-paste artifacts with no activation mechanism, so they are the only class that would genuinely gain. That is a narrower change than "widen to skills and prompts".
- The manifest roughly doubles in size, and every added row is one more thing to keep accurate in a file whose drift cost is still unmeasured.

Routes that change if the scope widens, concretely: R4 becomes `skills/issues-to-roadmap` instead of a decline; R2's chain could name `prompts/review-release-candidate/` as its verification leg; a "is this plan actually implemented?" task becomes routable to `prompts/loop-implementation-readiness/` rather than declined. Nothing that currently routes correctly changes.

A narrower option worth considering instead of the binary: keep routing playbooks-only, but let a decline **name** the covering artifact without surfacing it ("no playbook covers this; `skills/issues-to-roadmap` does, outside this router's scope"). That recovers most of R4's value, adds no new routing surface, and keeps the manifest playbook-sized. Not implemented — it is still a scope change and needs the owner's say-so.

## Known gaps

- **Round 1 evidence exists; it is one round, n=1 per cell.** 23 live sessions across three conditions on 2026-10-21 — see `evals/` and the README Evidence section. Variance is untested; the same prompt produced different baseline behaviour in R7 across two conditions, so within-condition variance is real and unmeasured.
- **Activation, not routing, is the weak half.** Every routing failure in round 1 was a case where the skill never engaged. Two were lost to `skills/issues-to-roadmap`. Work the description next; the manifest is not the bottleneck.
- **The decline path has never fired.** `Known coverage gaps` in `SKILL.md` is specified and unverified.
- **Activation was measured by self-report plus fingerprints.** Three candidate runs reported `SKILLS_USED: none` while reasoning in the manifest's Entry/Exit vocabulary, so activation counts are a floor, not a figure.
- **No lint enforcement for manifest drift.** Adding a playbook without updating the manifest produces no lint failure. A future lint rule could check that every playbook folder has a manifest row — not implemented.
- **Entry/Exit cells were written from READMEs read on 2026-10-21.** If a playbook's `When to use` changes after that date, its row may be stale. The fix is re-reading the README.
- **Only OpenCode discovery has ever been exercised.** Every claim about other harnesses, including the embedded manifest's portability rationale, is untested.

## Maintenance note — how not to run these evals

Round 1's first baseline batch dispatched open-ended task prompts, with write permissions, into this live repo. One of them read "this internal template repo" as *this* repo and committed a 141,148-line deletion (`7a67eaf`, preserved as tag `eval-accident-7a67eaf`; tree restored to `ae9343d` and verified identical). Six runs were discarded.

Every eval prompt now carries a read-only constraint, identical across conditions, and condition integrity (`git status`, symlink state) is verified after each batch. The constraint has a cost, recorded in `evals/plan.md`: a session told not to act describes procedures more readily than one told to act, which flatters the baseline and compresses the measured gap.

Incidental and unresolved, found by that accident: `experiments/design-skill/laws/sources/` holds full-text captures of nine copyrighted books, in git history, in a directory the lint exempts from sanitization checks. That is a redistribution problem if this repo is ever made public, and deleting the files will not fix the history.
