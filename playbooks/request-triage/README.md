---
title: "Request Triage"
status: draft
confidence: medium
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - operations
  - router
  - triage
  - routing
  - paradigm-selection
owner: "@emb715"
---

# Purpose

Takes a raw request (feature idea, issue, change request, bug report) and routes it to the correct planning artifact — spec paradigm (quick-spec, issue-to-ready-specs) or plan paradigm (raa, build-to-release) — based on execution model and scope. Does not execute the chosen artifact; only routes.

# When to use

When a request arrives and the consumer doesn't know which playbook to run. When the vault's two planning paradigms (spec vs plan) need disambiguation before work can begin.

Not for: when the consumer already knows which playbook to use. Skip triage and run the target artifact directly.

# Preconditions

- A raw request (feature, issue, change, idea) — text or issue number
- The user is available to answer 2-3 routing questions (execution model, scope)

# Inputs

- `{{REQUEST}}` — the raw request text or issue number

# Playbook

See [`playbook.md`](playbook.md) — standalone copy-paste procedure.

# Evidence

<!-- GATE 3 PLACEHOLDER — draft, not yet tested in this repo. -->

_TODO: Document at least one real run — what request was triaged, which routing rule fired, whether the target artifact was the right choice, and whether the user agreed with the routing decision. Quantitative preferred (e.g. "triaged [request], routed to [artifact] via rule [N], user confirmed routing, target artifact produced usable output")._

# Failure Modes / Boundaries

- **User doesn't know their execution model:** default to spec paradigm — single agent is the safer default. The router names this in the routing decision's rationale.
- **Request too vague to route:** ask for clarification; do not guess. Emit BLOCKED. Do not invent a target.
- **Both paradigms apply:** route to spec first. Specs compose into plans (run raa on the specs); plans don't decompose into specs. The composition direction is one-way.
- **User changes their mind mid-execution:** the router does not re-route. If execution model or scope shifts after the target artifact has started, re-run triage from the start.
- **Router does not execute.** It produces a routing decision, not a plan or spec. Running the target is the consumer's job.

# Related artifacts

Routing targets:
- [quick-spec](../quick-spec/) — spec paradigm, single feature
- [issue-to-ready-specs](../issue-to-ready-specs/) — spec paradigm, multi-story issue
- [raa](../raa/) — plan paradigm, feature needing phased execution
- [build-to-release](../build-to-release/) — plan paradigm, idea needing full lifecycle
- [decision-making](../decision-making/) — convergence, too many options
- [implementation-orchestration](../implementation-orchestration/) — fleet execution of a plan produced by raa