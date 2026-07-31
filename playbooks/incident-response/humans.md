# incident-response — maintenance context

## Origin

Built 2026-07-31 from the same floor survey that produced `skills/test-authoring/` and `playbooks/acceptance-verification/`. It closes dead end 05.

The finding: `build-to-release` has a genuinely well-constructed rollback table — proof fails, specs stall, readiness returns NOT_READY, a handoff pile-up means the spec investigation was too shallow. Every single entry is pre-merge. There was no path anywhere in the vault for *it shipped and it broke*. The one failure mode with real users attached was the one with no artifact.

## Why a playbook tagged `runbook`, not a new folder

`docs/standards/artifact-classification.md` defines "Runbook: incident/ops subtype of playbook (tag: `runbook`)" and states a hard repository rule against creating top-level `runbooks/`. The subtype had been defined in the standard and never instantiated. This is its first use — so the tag is doing real work now, and the standard's routing rule got its first test.

## Design decisions

**Mitigate first is the whole spine.** Everything else is arrangement. The ordering is stated as a Principle, enforced in Step 2 ("do not read its diff first"), and repeated in the Never list, because it is the instruction most likely to be overridden in the moment — by a human under pressure and by an LLM for a different reason. A model handed a production incident will want to read the diff, because diagnosis is the part it is good at and the part that feels like progress. Reading code is the highest-status activity available and the wrong one for the first ten minutes.

**The mitigation ladder is ordered by reversibility, not by quality.** Revert, isolate, fix forward. Fix-forward is listed last with an explicit warning because it is how a SEV2 becomes a SEV1, and because it is the option that feels most competent.

**The timeline is written during, not after.** This is the evidence-anchor discipline `acceptance-verification` uses, applied to time instead of criteria. Its most important property is that it records *failed* mitigations. A reconstructed timeline drops them — nobody writes down the thing that did not work — and failed attempts are the highest-information part of the record for whoever gets the next incident.

**"Which gate should have caught this?" (Step 5) is the deliberate hook into the rest of the vault.** It is the question that turns an incident into an artifact-level improvement rather than a one-off patch, and its answers map onto the existing gates by construction: no test → `test-authoring`, criterion never verified at runtime → `acceptance-verification`, nothing verifies after deploy → the standing deploy gap.

**Follow-up routing is a table, and unowned follow-ups do not exist.** Same enforcement pattern as the unowned-condition rule in `acceptance-verification`. Consistent across both new artifacts on purpose.

**Three stop conditions, and `MITIGATED` is not a failure.** Most real incidents end there — harm stopped, cause not yet understood. A two-state model (resolved / not resolved) pushes responders to either overclaim understanding or leave the incident feeling unfinished. Naming the honest middle state is the same move as making `unverified` first-class in `acceptance-verification`.

**`ESCALATED` is explicitly a correct outcome.** An agent running this playbook without production access can *only* reach `ESCALATED`, and it should reach it cleanly rather than improvising authority it does not have.

## What was left out

- **Communications.** Status pages, customer messaging, stakeholder updates. Real incident process has a communications track and it is genuinely important; it is also organization-specific in a way the rest of this vault is not. Left out rather than written generically.
- **On-call rotation, paging policy, incident commander roles.** Organizational structure, not procedure. The severity table implies who gets woken without prescribing how.
- **Blameless postmortem facilitation.** Handed to `retrospective`, which was not written for incidents. This is a real seam — see Known gaps.
- **Anything platform-specific.** No Kubernetes, no Vercel, no EAS. `{{ROLLBACK_PATH}}` is a declared input precisely so the playbook stays agnostic. The cost is that it cannot tell you whether your rollback actually works.

## Maintenance notes

This artifact ages differently from the rest of the vault. The others age when their tooling changes; this one ages when the *system* changes — a new deploy mechanism, a new data store, a new third-party dependency each invalidate assumptions in `{{ROLLBACK_PATH}}` and in the migration warning.

Check after any real incident:

1. **Did the timeline get written during, or reconstructed?** If reconstructed, the Scribe role is not being dispatched and the fix is process, not prose.
2. **Did Step 5's "which gate should have caught this" produce an answer that mapped onto an existing artifact?** If incidents keep pointing at gates that do not exist, that is the vault's next build order, and it is better evidence than any survey.
3. **Was the rollback path actually working?** If it was not, the P0 follow-up rule fired — confirm it was closed before the next deploy, because it will recur.
4. **Does the severity table match how the team actually responds?** A SEV table nobody follows is worse than none, because it launders the decision.

To extend it: add steps, not tracks — the sequence declare → timeline → correlate → mitigate → confirm → diagnose → route is ordered by urgency and reordering it breaks the mitigate-first spine.

## Known gaps

- **No real runs, and no honest way to manufacture one.** Unlike the other new artifacts, this cannot be exercised on demand. Expect it to sit at `draft` for a long time. That is the correct status, not a to-do.
- **Nothing upstream deploys.** The vault still has no deploy artifact, so the "post-deploy verification fails" trigger has no producer inside this repo. This playbook covers the failure path of a step the factory cannot yet perform — worth having anyway, since production breaks regardless of who deployed.
- **`retrospective` is not incident-shaped.** It was written for completed work, not for outages: no contributing-factors analysis, no blameless framing, no timeline input format. The handoff in Step 6 works but is lossy. Either extend `retrospective` with an incident mode or accept the loss — do not write a second retrospective playbook.
- **Requires production access the vault cannot grant.** An agent without dashboards, logs, and deploy authority reaches `ESCALATED` and stops. That is correct behavior and also a hard ceiling on how much of this is automatable.
- **No guidance on when to stop mitigating and accept degraded service.** Real incidents sometimes end in "we are running at 80% and that is where we stay until Monday." The playbook has no vocabulary for a deliberate partial recovery.
