---
title: "Brainstorming Facilitation"
status: validated
confidence: medium
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - brainstorming
  - ideation
  - facilitation
owner: "@emb715"
---

# Purpose

Facilitates interactive brainstorming sessions using a library of 61 structured creativity techniques across 10 categories. Keeps the user in generative exploration mode, aims for 100+ ideas before organizing, and produces themed, prioritized action plans. Standalone — no framework dependencies.

# When to use

When the user says "help me brainstorm" or "help me ideate", or when a topic needs divergent idea generation before convergence. Requires an interactive session (30-60+ minutes) and a user ready for generative exploration.

Not for: quick ideation (<15 min), single-answer questions, or sessions where the user already knows what they want.

# Preconditions

- A topic or challenge to brainstorm about
- Time for an interactive session
- User is ready for generative exploration, not seeking a quick answer

# Inputs

None — copy and run as-is. The agent reads `brain-techniques.csv` from the same folder as this playbook at Step 2.

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Based on bmad workflow, validated externally in that framework. -->
<!-- Standalone rewrite not yet tested in this repo. -->

_TODO: Document at least one real run — what topic, how many ideas generated, which techniques used, whether the output was usable, how long it took. Quantitative preferred (e.g. "45-min session on [topic], generated 87 ideas across 3 techniques, 12 prioritized, 5 action plans produced")._

# Failure Modes / Boundaries

- If `brain-techniques.csv` is not in the same folder as this playbook, Step 2 (technique selection) fails. The CSV is a runtime dependency — must travel with the playbook.
- The 100-ideas goal is aspirational. Real sessions may produce 40-80 ideas in 45 minutes. Don't force quantity past user energy — the energy check exists to catch this.
- Anti-bias pivot quality depends on the model's ability to genuinely shift domains. Weaker models may pivot superficially (same domain, different words) rather than orthogonally.
- The progressive flow (Mode 4) assumes 60+ minutes. With less time, it compresses poorly — use Modes 1-3 instead.
- Output lives in the conversation, not a file. If the user needs a persistent document, they must save the conversation. This is by design (standalone = no file system dependency) but is a tradeoff.
- Single-technique sessions rarely produce breakthroughs. The playbook encourages 2+ techniques, but the user controls pacing and may insist on one. Respect it.

# Related artifacts

- None yet. A natural companion would be a "decision-making" playbook for when brainstorming produces too many options and the user needs structured selection — not yet authored.
