---
title: "design-laws — evaluation plan, round 2"
status: draft
confidence: medium
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

# design-laws — evaluation plan, round 2

## Context / Problem

Round 1 (`results.md`, n = 1) suggested the taste layer makes builds more consistent and makes the skill trigger on build work, while adding nothing to review. One run per cell cannot separate that from noise. Round 2 decides whether the experiment continues or fails. This plan was written before any round 2 run and is not changed after.

## Scope

Conditions: **none** (no skill) and **new** (skill on `main` after the taste layer). The old skill is dropped because round 1 showed it does not trigger on build tasks.

| Id | Kind | Fixture | Runs per condition |
|---|---|---|---|
| T1 | build | `t1-build-landing.txt` (calm, premium landing page) | 3 |
| T3 | build | `t3-build-dashboard.txt` (dense dashboard) | 3 |
| T4 | review | `t4-review-subtle.txt` + `subtle.html` (10 subtle planted defects) | 3 |
| N1 | negative | `n1-backend-bug.txt` + `neg/stats.py` | 1 (new only) |
| N2 | negative | `n2-docs-edit.txt` + `neg/NOTES.md` | 1 (new only) |

The planted defects in `subtle.html` are: a 1.1 type scale (16 / 17.6 / 19.4 / 21.3), off-grid spacing drift (13 / 15 / 17 / 23px), secondary text at about 4:1 contrast, a warm page behind cool panels, two filled primary buttons side by side, a label-to-input gap larger than the gap between fields, an equal 12px radius on nested elements with 4px padding, 32px icon targets, a help paragraph with no max width, and member status shown by colored dot only. A twelfth smell, the removed focus outline, also counts if named.

## Procedure / Steps

1. Each run is a fresh directory via `fixtures/run.sh`, model `claude-sonnet-5-5`, with tools limited to Read/Write/Edit/Glob/Grep/Skill.
2. Build outputs are measured with `fixtures/measure.js`: distinct font sizes, radii, shadows and spacing values, share of off-grid spacing, minimum contrast of text under 24px, centered long paragraphs, and gradients.
3. **Blind pairwise judge.** For each build task, every none run is paired with a new run (3 pairs per task, 6 in total). The screenshots are renamed A and B, with the order randomized and recorded. A separate `claude -p` session with no skill judges each pair with `judge.txt`.
4. T4 answers are scored against the 11 defects by one grader, using the defect list above.
5. Discovery comes from the `SKILLS_USED:` line, checked against the transcript where they disagree.

## Pass / fail criteria (pre-registered)

| # | Property | Pass |
|---|---|---|
| P1 | Discovery on build | new triggers in at least 5 of 6 build runs |
| P2 | No over-trigger | 0 of 2 negative runs load the skill |
| P3 | Build consistency | the new median beats the none median on at least 3 of 4 metrics (font sizes, radii, spacing values, off-grid %), pooled over T1 and T3 |
| P4 | No accessibility regression | the new minimum small-text contrast is at least 4.5 in every run |
| P5 | Taste | the blind judge prefers new in at least 4 of 6 pairs (ties count as half) |
| P6 | Review | the new mean of defects found beats none by at least 1.5 on T4 |

**Verdict rules**

- **Continue (validated path):** P1, P2, P3, P4 and P5 pass. If P6 also passes, the skill is useful for build and review. If P6 fails, narrow the skill to build and make review a secondary mode.
- **Continue as a lint, not a skill:** P3 passes but P5 fails. Consistency improves but nobody prefers the result, so the value is in `taste.csv` as checks for an audit script, not in prompting.
- **Fail the experiment:** P3 and P5 both fail, or P2 fails and narrowing the description cannot fix it in one revision. In that case, record the result and stop investing in the skill.

## Failure Modes / Boundaries

- n = 3 is still small. A pass is evidence, not proof.
- The judge is the same model family as the builder and may share its taste. This is mitigated by blinding and order randomization, not removed.
- Metrics measure consistency, a proxy for taste, not taste itself.
- The grader of T4 knows the planted list. Scoring counts only defects named with a concrete location or value.
