---
title: "Retrospective"
status: validated
confidence: medium
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
owner: "@ezequielbenitez"
---

# Purpose

Runs a retrospective on a completed body of work. Extracts lessons, checks follow-through on previous action items, assesses readiness, detects significant discoveries that may invalidate future plans, and produces SMART action items. The agent facilitates; the user participates.

# When to use

When the user says "run a retrospective" or "let's retro", or after completing a significant body of work (feature, sprint, milestone, project phase) and before starting the next. Extracts learnings while they're fresh and turns them into actionable changes.

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

# Failure Modes / Boundaries

- The retrospective is only as good as the input. If the user can't articulate what went well and what didn't, the lessons will be thin. The agent should ask probing questions, not accept "it went fine" as an answer.
- Previous retro follow-through (Step 3) is non-negotiable if a previous retro exists. Skipping it makes the retro theater. If the user doesn't have previous retro notes, note that this is the first retrospective and the follow-through check will begin next time.
- The significant discovery detection (Step 5) requires knowing what's next. Without a description of future work, this step can't assess whether assumptions are invalidated. Flag this as a gap.
- Action items without ownership and success criteria are aspirations, not actions. The SMART check in Step 6 exists to prevent this. Review action items for specificity before closing.
- The "no blame" principle is critical. If the discussion drifts toward blaming individuals, redirect to systems and processes. This is facilitation 101 but bears repeating.
- The role-play theater from the original workflow (multiple agent personas having scripted disagreements) is deliberately cut. A retrospective is a conversation between the facilitator and the participant, not a performance.

# Related artifacts

- [`docs/references/change-impact-checklist.md`](../../docs/references/change-impact-checklist.md) — use when significant discoveries require project-level change assessment
- [`playbooks/adversarial-code-review/`](../adversarial-code-review/) — feed code quality findings into the retrospective's lessons
