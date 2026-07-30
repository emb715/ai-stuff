---
title: "Retrospective"
status: draft
confidence: low
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - retrospective
  - continuous-improvement
  - facilitation
owner: "@emb715"
---

# Purpose

Runs a retrospective on a completed body of work. A Socratic-extractive hybrid: the agent facilitates Socratic ownership of lessons and significant discoveries (the user states them, the agent asks), and extractively handles bookkeeping — follow-through status, readiness, recap. Produces SMART action items.

# When to use

When the user says "run a retrospective" or "let's retro", or after completing a significant body of work (feature, sprint, milestone, project phase) and before starting the next. Surfaces lessons while they're fresh — Socratic for ownership, extractive for bookkeeping — and turns them into actionable changes.

Not for: live progress tracking, sprint planning, or post-mortems on failures (those need root-cause analysis, not retrospective facilitation).

# Preconditions

- A completed or near-completed body of work to review
- Optionally: notes from a previous retrospective (to check follow-through)
- Optionally: a description of what's coming next (to prepare for)
- The user is available for an interactive reflection session

# Inputs

None — copy and run as-is. The agent asks the user what's being reviewed and facilitates the session interactively.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Based on retrospective workflow, validated externally in that framework. -->
<!-- Standalone rewrite not yet tested in this repo. -->

_TODO: Document at least one real run — what was reviewed, how many lessons extracted, how many action items produced, whether follow-through was checked, whether significant discoveries were found. Quantitative preferred (e.g. "retro on 5-story feature, extracted 8 lessons, 4 action items, 2 tech debt items, 1 significant discovery flagged, 2/3 previous action items completed")._

# Failure Modes

- The retrospective is only as good as the input. If the user can't articulate what went well and what didn't, the lessons will be thin. The agent should ask probing questions, not accept "it went fine" as an answer.
- Previous retro follow-through (Step 3) is non-negotiable if a previous retro exists. Skipping it makes the retro theater. If the user doesn't have previous retro notes, note that this is the first retrospective and the follow-through check will begin next time.
- The significant discovery detection (Step 5) requires knowing what's next. Without a description of future work, this step can't assess whether assumptions are invalidated. Flag this as a gap.
- Action items without ownership and success criteria are aspirations, not actions. The SMART check in Step 6 exists to prevent this. Review action items for specificity before closing.
- The "no blame" principle is critical. If the discussion drifts toward blaming individuals, redirect to systems and processes. This is facilitation 101 but bears repeating.
- The role-play theater from the original workflow (multiple agent personas having scripted disagreements) is deliberately cut. A retrospective is a conversation between the facilitator and the participant, not a performance.
- **Depleted user — can't sustain forcing questions:** drop to extractive for that step, log the drop inline ("dropping to extractive for this step — user depleted"). Resume Socratic on the next step unless the condition persists. Fallback is per-step, not per-session.
- **User wants a sounding board, not probing:** switch to reflective mirroring — mirror what they say back as questions, make no assertions, log the mode inline. Still per-step.
- **User lacks self-awareness, Socratic chain stalls:** agent offers observations-as-questions ("Is it possible that…?") before dropping to extractive. If the user still can't own the lesson/significance, drop to extractive for that step with an explicit note. Do not assert on the user's behalf.

# Boundaries

- The agent never asserts lessons, discoveries, or priorities. The user owns all of those. The agent asks, mirrors contradictions, and asks the question being avoided.
- Bookkeeping stays extractive: status tables (Step 3), readiness checklist (Step 4), SMART drafting (Step 6b), recap (Step 7). Socratic steps are 2, 5, and 6a-prioritization.
- Per-step Socratic/extractive mapping:

| Step | Mode |
|---|---|
| 1 Framing | Socratic |
| 2 Lessons | Socratic |
| 3 Follow-through | Extractive (status) + Socratic probe (why-not) |
| 4 Readiness | Extractive |
| 5 Discoveries | Socratic |
| 6 Action items | Hybrid: Socratic prioritization (6a) → Extractive SMART (6b) |
| 7 Summary | Extractive |

- **N > 15 triage rule:** when items in scope exceed 15 (lessons, discoveries, or candidate action items), the agent extractively surfaces candidates and the user selects ≤5 that receive the full Socratic chain; the remainder get a one-line extractive summary. Action items are capped at the Socratic top 3.
- **Fallback rule is per-step, not per-session.** A depleted/stalling/sounding-board condition triggers an extractive drop for the current step only, logged inline. Re-evaluate at each step boundary. A session-wide fallback is forbidden.
- The "here's what I'm seeing" extractive tell (and equivalent synthesis-then-present phrasing) is forbidden in the Socratic steps (2, 5, 6a). The agent asks; it does not deliver the user's insight back to them as the agent's own.

# Related artifacts

- [`docs/references/change-impact-checklist.md`](../../docs/references/change-impact-checklist.md) — use when significant discoveries require project-level change assessment
- [`playbooks/adversarial-code-review/`](../adversarial-code-review/) — feed code quality findings into the retrospective's lessons
