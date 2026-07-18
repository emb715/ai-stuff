---
title: "Repo Primitive Audit"
status: validated
confidence: medium
last_tested: 2026-07-18
scope: personal
tooling:
  - "agnostic/multi-model"
tags:
  - prompt
  - one-shot
  - review
  - audit
  - codebase-review
  - repo-mapping
owner: "@ezequielbenitez"
---

# Purpose

Maps a repository's primitives from its source code, breaks down each section, then runs an adversarial review against a named review playbook. Forces a complete map before any review begins, so the review operates against the actual structure rather than an assumed one. One-shot, model-agnostic.

# When to use

You are about to review a repo (or a section of it) and need the review grounded in what the source actually declares — governance rules, section membership conventions, lifecycle state, enforcement — rather than a guess at its structure. Use this when you suspect drift between what a repo's docs claim and what its source enforces, or before adding an artifact to confirm the section you're targeting actually accepts it.

Not for: reviewing a single file or diff (use `playbooks/adversarial-code-review/` directly), reviewing non-code repos, or one-off exploration with no review goal.

# Inputs

- `{{REVIEW_PLAYBOOK}}` — path to the review procedure the agent should run after the map is complete. Default for this repo: `/playbooks/adversarial-code-review/playbook.md`. Replace with any review playbook the target repo exposes.

# Prompt

See [`prompt.md`](prompt.md) — standalone copy-paste body.

# Stop signal

One-shot. Done when the agent has produced (1) a map of the repo's primitives from source and (2) a breakdown of each section, then executed the referenced review playbook against that map and reported findings. If the review playbook has its own stop condition (e.g. minimum-3-findings pass/block verdict), that governs the review phase.

# Evidence

Tested across several weeks in multiple repositories and sessions with a high success rate. Compared against longer, more explicit multi-step versions of the same prompt — this compressed two-paragraph form produced better outcomes regardless of the LLM model used. Longer versions with more steps did not outperform this form; the terse framing left the agent room to adapt the map depth to the repo instead of following a rigid checklist that over- or under-shot.

Specific observed strengths:
- Agent reads source files before asserting structure, rather than narrating from the directory tree alone.
- The "if is not the same" clause reliably surfaces inconsistencies between indexes and artifact frontmatter.
- Two-phase ordering (map before review) holds across models — the agent does not jump to findings before completing the breakdown.

# Failure Modes / Boundaries

- **Requires readable source.** Won't work on binary/minified repos or repos where source files aren't accessible to the agent. The map phase needs real files, not just a directory listing.
- **Thin on flat repos.** The "primitives" framing assumes a repo with identifiable conventions (governance, lifecycle, structure). A flat repo with no governance layer produces a shallow map and the review has little to check against.
- **Playbook path must resolve.** `{{REVIEW_PLAYBOOK}}` must point to a real, loadable review procedure. If the path is wrong or the playbook doesn't exist, the review phase fails or degrades silently — the agent may improvise a review rather than report the missing reference.
- **Ordering is load-bearing.** The map-before-review sequence is the core mechanic. If the agent starts reviewing before the map is complete, it reviews against an incomplete picture. Weaker models may drift here; if findings appear before a full breakdown, re-run.
- **Map size on large repos.** On very large repos the map can exceed the agent's output budget and sections get truncated. Scope to the sections you care about, or accept a high-level map with drill-downs.
- **"If is not the same" is open-ended.** The agent decides what counts as a discrepancy. Weaker models may over-flag cosmetic differences or under-flag real inconsistencies. Review the findings critically.

# Related artifacts

- [`playbooks/adversarial-code-review/`](../../playbooks/adversarial-code-review/) — the default `{{REVIEW_PLAYBOOK}}` target in this repo. Adversarial review with minimum-3-findings rule.
- [`prompts/knowledge-extraction/`](../knowledge-extraction/) — sibling one-shot. Mines a session for durable knowledge; complementary post-review use.