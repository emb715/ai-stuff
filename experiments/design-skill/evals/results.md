---
title: "design-laws — taste layer evaluation, round 1"
status: draft
confidence: low
last_tested: 2026-11-01
scope: personal
tooling:
  - "claude-code"
tags:
  - experiment
  - evals
  - design
owner: "@emb715"
---

# design-laws — taste layer evaluation, round 1

## Context / Problem

The skill had never been evaluated. Before adding the taste layer (`refs/taste.csv`, `refs/presets.csv`, `refs/examples.md`, and a tokens-first build mode in `SKILL.md`), the same tasks were run without the skill and with the unchanged skill, to get a baseline that the rework has to beat.

## Scope

Three tasks, three conditions, one run per cell. The tasks never name a skill, so the with-skill runs also act as should-trigger probes.

| Task | Kind | Prompt |
|---|---|---|
| T1 | build | calm and premium landing page with pricing (`fixtures/t1-build-landing.txt`) |
| T2 | review | critique a signup page with 10 planted defects (`fixtures/t2-review.txt`, `fixtures/flawed.html`) |
| T3 | build | dense operations dashboard (`fixtures/t3-build-dashboard.txt`) |

Conditions: **none** (no skill), **old** (skill as on `main` before this change), **new** (skill with the taste layer).

## Procedure / Steps

1. Each cell runs in a fresh git directory with `claude -p` headless, model `claude-sonnet-5-5`, tools limited to Read/Write/Edit/Glob/Grep/Skill (`fixtures/run.sh`).
2. The skill is delivered as `.claude/skills/design-laws` in that directory. It is never named in the prompt.
3. Build outputs are rendered at 1280px with Playwright and measured with `fixtures/measure.js`, which reports distinct font sizes, families, radii, shadows, centered long paragraphs and gradients. Screenshots were also inspected by eye.
4. Review outputs are scored on how many of the 10 planted defects they name.

## Evidence / Results

### Discovery

| Cell | Triggered |
|---|---|
| T1 old | **no** (the skill sat unused on a build task) |
| T1 new | yes |
| T2 old / new | yes / yes |
| T3 old | **no** (a different, unrelated skill fired instead) |
| T3 new | yes |

The old description only triggered on review work. The new description, which leads with "before writing any interface", triggered on both build tasks.

### Build: T1 landing page

| Metric | none | old | new |
|---|---|---|---|
| distinct font sizes | 15 | 14 | **8** |
| distinct border radii | 4 | 3 | **1** |
| distinct shadows | 2 | 2 | **1** |
| centered paragraphs over 120 chars | 0 | 1 | 0 |
| uses of CSS variables | 35 | 41 | **58** |

By eye: all three are competent. The baseline already chose a serif and sans pairing, a warm neutral background, one accent and generous spacing, which means the model has good default taste. The new run was more disciplined: a left-aligned editorial hero, rules in place of feature cards, one radius and one shadow throughout. The none and old runs used a centered layout with uniform icon cards (taste row L-03).

### Build: T3 dashboard

| Metric | none | old | new |
|---|---|---|---|
| distinct font sizes | 4 | 6 | 4 |
| distinct text colors | 7 | 7 | 6 |
| distinct border radii | 3 | 3 | **1** |

By eye: nearly identical. The new run added visible labels on the filter controls (K-02) where the baseline used placeholder-only search. Both used right-aligned weights and status pills.

### Review: T2

| | none | old | new |
|---|---|---|---|
| problems listed | 15 | 14 | 12 |
| planted defects found | 10/10 | 10/10 | 10/10 |
| D-number citations | no | yes | yes |

The skill adds no measurable value to review. The baseline already finds every planted defect, so the skill only adds citations. The review task needs harder, subtler defects before it can tell conditions apart.

## Failure Modes / Boundaries

- **n = 1 per cell. Variance is untested, so no reliability claim follows.** The T1 gains could be run-to-run noise.
- The metrics count consistency, not beauty. Fewer sizes and radii are a proxy for "looks decided", and taste still needs human judgement on the screenshots.
- The baseline model already has strong taste. Most of the gain here comes from the skill **triggering on build work at all** and from the tokens-first discipline, not from new knowledge.
- No negative trigger probe was run (a non-UI task) to check that the broader description does not over-fire.
- T2 has a ceiling effect, so it cannot show review gains.

## Next round

1. Three repeats per build cell to measure variance.
2. A harder review fixture with subtle defects (spacing drift, a 1.1 type scale, mixed gray temperatures, a 3.9:1 secondary text).
3. Two negative trigger probes (a backend bug and a docs edit).
4. Turn `measure.js` into an audit script that reads the `check` column of `taste.csv` directly.
