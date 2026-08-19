---
title: "artifact-router"
status: draft
confidence: low
last_tested: 2026-08-04
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - skill
  - routing
  - meta
  - discovery
  - playbooks
owner: "@emb715"
---

# Purpose

Routes the current task to the right playbook in the ai-stuff vault. On user confirmation, reads and surfaces the playbook's `playbook.md` as the active procedure. Scope is playbooks only — does not route to prompts, skills, agents, or tools.

# When to use

- A task is described that maps to a playbook's domain, but no playbook is named.
- User asks "which playbook should I use" / "how do I do X in this repo".
- User is about to start multi-step work and the right playbook is non-obvious.

Not for:
- Tasks where the user already named a playbook — let them proceed.
- Tasks no playbook covers — say so and stop. Do not improvise.
- Routing to non-playbook artifacts (prompts, skills, agents, tools) — out of scope.
- Operating the vault itself (lifecycle, lint, audit) — those are `_meta/commands/` and `_meta/framebook/`.

# Inputs

None. The skill reads the task description from the current session and matches against the embedded manifest.

# Skill

Use [`SKILL.md`](SKILL.md) — routing procedure, intent categories, manifest, priority rule, disambiguation footgun, routing examples.

# Evidence

<!-- GATE 3 PLACEHOLDER — required: at least one documented outcome before promotion to validated. -->
<!-- No run evidence captured yet. The manifest is built from the READMEs of all vault playbooks as of 2026-08-04. -->
<!-- Fill before relying on this section: run the skill against 3-5 real tasks and record whether the routed playbook was the right one. -->

_TODO: Document at least one real run — task description, routed playbook, whether the user confirmed invocation, whether it was the right pick. The evaluation gate (per skill-authoring Step 8) is: run a task without the skill (does the LLM pick the right playbook?), run with the skill, run a different task to confirm no over-trigger._

# Failure Modes / Boundaries

- **Manifest drift.** The manifest is hand-maintained. The moment a playbook is added/renamed/deleted without updating this file, routes go stale or dead. Mitigation: treat the manifest as a cache, not a source of truth. When a route seems wrong, verify the playbook still exists before routing. The real source of truth is each playbook's `README.md`.
- **Overlapping triggers.** Playbooks share trigger verbs ("review", "plan", "implement") but act on different objects. The disambiguation rule in SKILL.md (Footgun) handles this: match the task's object against each candidate's `When to use` + `Not for`, not the verb alone. Skipping this step produces wrong routes.
- **Over-triggering.** The skill activates on "task matches a playbook's domain" — a broad condition. If the user already has the right playbook in mind and just didn't name it, the skill adds noise. Mitigation: do not activate when the user names a playbook explicitly.
- **Playbook scope only.** The skill does not route to prompts, skills, agents, or tools. A task that would benefit from a non-playbook artifact gets "no playbook covers this" even if a prompt or skill would fit. This is a deliberate boundary — the vault has other routing surfaces (`USAGE.md`, `AGENTS.md`) for the full inventory.
- **Cannot execute the playbook.** The skill surfaces `playbook.md` as the active procedure; it does not run the playbook's steps. The user (or the session agent) follows the procedure. This is a routing skill, not an execution layer.

# Related artifacts

- [`skills/skill-authoring/`](../../skills/skill-authoring/) — the process that produced this skill's structure
- [`USAGE.md`](../../USAGE.md) — full inventory for external harnesses; this skill is the playbook routing layer
- [`AGENTS.md`](../../AGENTS.md) — repo-wide agent guidance; this skill does not duplicate framebook routing
- [`docs/standards/artifact-structure.md`](../../docs/standards/artifact-structure.md) — three-file folder convention this skill follows
