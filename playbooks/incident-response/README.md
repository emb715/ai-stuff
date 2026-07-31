---
title: "incident-response"
status: draft
confidence: low
last_tested: 2026-07-31
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - playbook
  - runbook
  - operations
  - incident
  - production
owner: "@emb715"
---

# Purpose

Restores service when a shipped change breaks production, then hands the causal record to the learning loop. Mitigate-first, diagnose-second, with a timeline written during the incident as its evidence anchor. The only procedure in this vault that runs when the failure has users attached.

# When to use

- An alert, error-rate spike, or failed health check on a production system.
- A user or stakeholder reports broken behavior in production.
- A deploy completes and its post-deploy verification fails.

Not for: a failing CI check (use the fix loop in [`implementation-orchestration`](../implementation-orchestration/)), a defect found before shipping (use [`acceptance-verification`](../acceptance-verification/)), or a known-broken staging environment.

# Inputs

- `{{SYSTEM}}` — what is affected and how to reach it: dashboards, logs, deploy history.
- `{{ROLLBACK_PATH}}` — the known way to undo the last change, identified *before* it is needed.
- Authority to act, or a named human who has it.

# Playbook

Use [`playbook.md`](playbook.md) — declaration and severity, timeline, change correlation, mitigation ladder, recovery confirmation, diagnosis, follow-up routing.

# Stop signal

- `RESOLVED` — recovery confirmed from two independent signals, timeline complete, every follow-up owned, retrospective scheduled for SEV1/SEV2.
- `MITIGATED` — harm stopped, cause unknown or fix outstanding. Incident stays open with the unknowns named.
- `ESCALATED` — no rollback path, no authority, or blast radius beyond the responder's scope. A correct outcome, not a failure.

# Evidence

**No runs yet.** Authored 2026-07-31 to close a documented gap: `build-to-release` carries a genuinely good rollback table, and every entry in it is pre-merge (proof fails, specs stall, readiness returns NOT_READY). Nothing in the vault covered *it shipped and it broke*. A grep for incident, on-call, or rollout language across `playbooks/`, `skills/`, and `prompts/` returned no stage definitions.

Classified as a playbook tagged `runbook` per `docs/standards/artifact-classification.md`, which defines runbooks as an incident/ops subtype of playbook and forbids a top-level `runbooks/` folder. That subtype was defined in the standard and never used until now.

`status: draft`, `confidence: low`. Unlike the other artifacts here, this one is hard to promote honestly — it can only be exercised by a real incident, and manufacturing one to earn a `vetted` rating is not sensible. Expect it to sit at `draft` until a real incident tests it, and record that incident here when it happens.

# Failure Modes / Boundaries

- **Diagnosis before mitigation.** The dominant failure in real incidents and the one an LLM is most prone to, because reading the diff is the interesting part and the model is good at it. Step 2 explicitly forbids reading the diff before mitigating.
- **Reconstructed timelines.** A timeline written after the fact is a story, not evidence, and it systematically omits the failed attempts that are the most useful part. If the output has no failed mitigation in it, be suspicious.
- **Rollback across a migration.** The most common way a rollback makes things worse. Called out in Step 3, but it depends on someone knowing whether the migration is backward compatible — which this playbook cannot determine for you.
- **No rollback path.** The playbook assumes one exists and tells you to identify it in advance. On a system with no rollback path, this degrades to isolate-or-escalate, which is much weaker.
- **Monitoring defects mistaken for outages.** Step 0 guards against it, but the pressure to act on a red dashboard is real.
- **Depends on production access this vault does not grant.** Every other artifact here works on text; this one needs dashboards, logs, and deploy authority. An agent running it without that access can only reach `ESCALATED`.
- **No blameless-postmortem facilitation.** Handed to `retrospective`, which was not written for incidents specifically.

# Related artifacts

- Consumes the frozen-target and evidence-anchor discipline established by [`acceptance-verification`](../acceptance-verification/); an incident on a build that playbook passed is a direct signal about what its ledger missed.
- Routes the real fix through [`raa`](../raa/) → [`implementation-orchestration`](../implementation-orchestration/).
- Routes missing coverage to [`skills/test-authoring/`](../../skills/test-authoring/) and unverified criteria back to [`acceptance-verification`](../acceptance-verification/).
- Hands its timeline to [`retrospective`](../retrospective/) → [`prompts/knowledge-extraction/`](../../prompts/knowledge-extraction/) for SEV1/SEV2. This is the handoff that closes the learning loop rather than leaving it dangling.
