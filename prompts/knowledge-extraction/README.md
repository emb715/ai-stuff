---
title: "Knowledge Extraction"
status: validated
confidence: medium
last_tested: 2026-06-27
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - prompt
  - one-shot
  - extraction
  - knowledge-management
  - post-session
owner: "@ezequielbenitez"
---

# Purpose

Mines a completed work session and proposes durable, actionable knowledge writes — skills, ADRs, gotchas, security constraints, reference docs. The user reviews and approves before anything is written. Does not summarize what happened; extracts what should change how future sessions behave.

# When to use

After a substantive work session, before closing it. When the session produced decisions, failures, retries, non-obvious constraints, or recurring patterns worth carrying forward — and you want captured knowledge, not a recap.

Inject as a system prompt or paste as the first message. Works with any AI tool and any project type.

Not for: live mid-session guidance, session summaries, or sessions with no durable signal.

# Inputs

None — copy and run as-is. The agent reads whatever session context is visible (transcript, file, or in-session history). If nothing is visible, the agent should surface that as a blocker before starting.

# Prompt

See [`prompt.md`](prompt.md) — standalone copy-paste body.

# Stop signal

One-shot — complete when all four phases (Mine → Triage → Validate → Propose) are done, every proposed write is presented in the `PROPOSED WRITE` format, `DISCARDED` and `UNCATEGORIZED` summaries are shown, and the confirmation question is asked.

No writes happen without explicit user approval. If the agent begins writing to any surface before approval, the prompt's contract is broken.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome. -->
<!-- Validated externally per author; specifics not yet documented in this repo. -->
<!-- Fill before relying on this section for promotion to status: vetted. -->

_TODO: Document at least one real run — what session was mined, what the agent proposed, whether the output was correct and usable, and any proposals the user accepted or rejected. Quantitative preferred (e.g. "from a 40-turn session, proposed 6 writes: 2 skills, 1 ADR, 3 discarded; user accepted 4")._

# Failure Modes / Boundaries

- If session context is vague or not accessible, the agent may hallucinate session content rather than asking. Always provide an explicit path or confirm visibility before running.
- Triage labels assume a target knowledge system with the named surfaces (skill files, ADR sections, global rules, etc.). If the target system lacks some surfaces, the agent may force-fit or leave proposals orphaned. Map labels to actual surfaces before running, or note surface gaps in the proposal.
- "A pattern that fired once is a candidate" — single observations are weak signal. Review single-fire proposals with extra scrutiny; prefer patterns that recurred twice or more.
- The prompt proposes, never writes. If the agent starts writing without approval, re-inject and clarify the contract.
- Large sessions may produce many proposals; review fatigue is real. Consider scoping to a session segment if the session is very long.
- Sanitization is the agent's responsibility per the prompt, but verify proposed drafts do not contain private paths, credentials, or client identifiers before applying.

# Related prompts

- None yet. A natural successor would be a "knowledge-write-apply" prompt that executes approved proposals against the target surfaces — not yet authored.
