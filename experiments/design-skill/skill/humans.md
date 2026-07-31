# design-laws — humans.md

## Why this skill exists

98 design laws extracted from 9 canonical design books, packaged into a single skill that an AI agent loads when doing UI/UX review, design critique, or interface building. The laws are the knowledge layer — what the books actually say, traceable to verbatim source quotes. The patterns (39), heuristics (29), and antipatterns (30) are the actionable layer — concrete solutions, checkable questions, and named mistakes that implement or violate the laws.

One skill, not five. A UI review needs all clusters simultaneously: perception (what users see), cognition (what they process), composition (how it's organized), interaction (how it flows), and decision (what it's for). The cross-cluster failure patterns — the invisible primary action, the working memory bomb, the feedbackless void — depend on seeing the whole map. Splitting by cluster forces the model to reassemble context that belongs together.

## Source of truth

- **Law catalogue:** `experiments/design-skill/design-laws-research.md` — D-1..D-34 (26 ratified + 8 proposed)
- **Triage pass 2:** `experiments/design-skill/laws/triage-pass-2.md` — D-35..D-98 (64 promoted) + final cluster assignment
- **Verbatim source quotes:** `experiments/design-skill/laws/sources/B*/extract.md` — per-book structured extracts
- **Pattern / heuristic / antipattern aggregates:** `experiments/design-skill/laws/sources/_aggregate/` — copied verbatim into `refs/`
- **Original PDFs:** `~/Documents/design-books/`

Extraction pipeline: pymupdf text extraction from PDFs → per-book `extract.md` (structured per-chapter) → per-book `candidates.md` (candidate law discovery) → two-pass triage (dedup against existing 34 laws, then cluster assignment) → cross-book consolidation → aggregate files. All 125 raw candidates were triaged; 64 promoted, 45 merged into existing or promoted laws, 16 rejected as process/rhetoric/factoid.

## Structure rationale

8 refs files: 5 cluster refs (laws grouped by cluster) + 3 actionable refs (patterns, heuristics, antipatterns) + 1 generative ref (build-moves).

**Why cluster refs, not one big law file:** 98 laws × 6 lines each ≈ 600 lines. Loading all of them for every review wastes tokens. Cluster refs let the model load only what the task needs — a layout review loads composition; a flow review loads interaction. SKILL.md's 98-law quick reference is the routing layer that tells the model which ref to load.

**Why one skill, not three:** see triage-pass-2.md §"Skill Structure Recommendation" — the math works for one skill (SKILL.md at the 180-line ceiling + refs loaded on demand), and the failure-cluster patterns depend on cross-cluster visibility.

**Why a build-moves ref, not just patterns:** patterns are solutions to known problems (review-first thinking). Build mode starts from intent, not from a problem. The intent→laws mappings, law tensions, deliberate breaks, and compositions are generative — they drive creative application, not just correct application. The skill was review-heavy before; build-moves rebalances it.

**Why SKILL.md is a routing layer:** 98 laws × 1 line = ~100 lines + intro/routing/failure-patterns/build-moves-section = ~190 lines, slightly over the write-skill playbook ceiling. The build-moves section earns its 14 lines because build mode is a distinct entry point the skill must surface — without it, the skill defaults to review mode even when the task is creation.

**Why D-27..D-34 are treated as ratified:** the original research marked them "proposed" pending cross-reference. They have source anchors, survived two-pass triage against D-1..D-26 and the 64 newly promoted laws, and no duplicates or contradictions surfaced. The "proposed" label is dropped for this skill — they are treated as full laws.

## What's in each file

- **SKILL.md** — 98 laws as one-line checks grouped by cluster, cluster routing table, 7 cross-cluster failure patterns, trigger description, source corpus list. 180 lines.
- **refs/perception.md** — 20 perception laws with checkable statements, concrete examples, source anchors.
- **refs/cognition.md** — 24 cognition laws, same format.
- **refs/composition.md** — 23 composition laws, same format.
- **refs/interaction.md** — 13 interaction laws, same format.
- **refs/decision.md** — 11 decision laws, same format. Note: 5 laws (D-58, D-60, D-64, D-65, D-72, D-92) are cross-listed with other clusters per triage-pass-2.md — they appear in their primary cluster ref AND here, with a "(Cross-listed with X)" note in this file.
- **refs/patterns.md** — 39 concrete UI/UX solutions grouped by cluster, each with verbatim source quote and law cross-refs. Copied verbatim from the aggregate.
- **refs/heuristics.md** — 29 checkable review questions grouped by review stage, each with verbatim source quote and law cross-refs. Copied verbatim.
- **refs/antipatterns.md** — 30 named mistakes with failure mode, verbatim source quote, law cross-refs, and correct alternative. Copied verbatim.
- **refs/build-moves.md** — generative application of the laws for build mode. Covers intent→laws mappings (calm, premium, trustworthy, urgent, playful, authoritative, intimate, learnable, delightful, scalable), law tensions with resolution principles, deliberate breaks with named costs, 10 named compositions combining laws for emergent effects, and 15 generative prompts. The creative counterpart to the review-mode refs.

## Maintenance

### Adding a new law
1. Extract from a new book → add to `experiments/design-skill/laws/sources/BXX/`
2. Run triage: is it distinct from D-1..D-98? Does it merge into an existing law?
3. If promoted: assign a D-99+ number, add to the appropriate cluster ref (checkable statement + example + source anchor), add one-line to SKILL.md's quick reference in the correct cluster, update the cluster routing table counts.
4. Update `triage-pass-2.md` summary statistics if you want to keep the audit trail current.

### Re-extracting from a new book
1. PDF → pymupdf → `raw.txt`
2. Create `extract.md` (per-chapter structured extract)
3. Create `candidates.md` (candidate law discovery — one row per candidate)
4. Create patterns / heuristics / antipatterns extraction for that book
5. Run triage against the existing 98 laws — PROMOTE / MERGE / REJECT per candidate
6. Update the aggregate files (`patterns.md`, `heuristics.md`, `antipatterns.md`) with any new entries
7. Copy updated aggregates verbatim into `refs/`
8. Update the relevant cluster ref + SKILL.md's quick reference

### Known gaps
- **D-27..D-34 were "proposed" in the original research** — for this skill they are treated as ratified (source anchors present, survived triage). If a future audit finds one weak, demote it from the cluster ref and the SKILL.md quick reference together.
- **B3 Maeda contributed 0 new laws** — all six of his candidates fold into existing laws (REDUCE → D-17, AWAY → D-29, CONTEXT → D-30, DIFFERENCES → D-13/D-4, OPEN → D-27/D-28, POWER → D-17, TIME → D-17/D-20). His poetic phrasings remain as supporting evidence in the source extracts, not as standalone laws.
- **B4 Gothelf and B8 Greever contributed mostly process/rhetoric laws** — only the UI-relevant items (D-24 Outcome Over Aesthetic from B4, D-23 Principled Decision from B8) survived. The rest are rejected in triage-pass-2.md and belong in a future `design-process-laws` or `design-advocacy-laws` skill if either is ever built.
- **The patterns/heuristics/antipatterns are compressed from 534 raw extractions** — some specific applications from individual books were dropped in favor of the general pattern. If a review needs a specific application not in the aggregate, fall back to the per-book `extract.md` files.
- **Cross-cluster laws** — D-58, D-60, D-64, D-65, D-72, D-92 appear in both their primary cluster ref and `refs/decision.md`. This is intentional: decision-cluster reviews need the decision-relevant framing even when the law's primary home is elsewhere. If you move one, update both files.
- **D-34 Natural Mapping** — triage-pass-2.md lists it under Cluster D Interaction "(already proposed)" but the user instruction placed it in Perception for this skill. The skill follows the user instruction. If a future re-triage moves it, update `refs/perception.md` and `refs/interaction.md` together and update the routing table.

## Evaluation status

**NOT YET EVALUATED.** Per the `write-skill` playbook step 8, this skill requires evaluation on 3 tasks before promotion out of `experiments/`:

1. Run a UI review task *without* the skill — note failures and missing context.
2. Run the same task *with* the skill — confirm the gaps close.
3. Run a different task in the same domain — confirm the skill does not over-trigger or inject irrelevant context.

Until those three pass, status is `draft` and the skill stays in `experiments/design-skill/skill/`. Do not link from `skills/README.md` or the root `README.md` until evaluation passes and the promote-artifact framebook procedure has been run.

A skill that passes tasks 1 and 2 but adds noise to task 3 needs its trigger description narrowed. The current trigger names UI/UX review, design critique, layout/hierarchy/flow evaluation, interface building, usability auditing, and principled design decisions — broad on purpose because UI review is the skill's primary job. If over-triggering appears, narrow to "UI/UX review, design critique, or interface building" and drop "principled design decisions" (which may fire on non-UI decisions).

## Last updated

2026-07