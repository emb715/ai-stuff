Restore service when a shipped change breaks production, then hand the causal record to the learning loop. Input: a signal that something is wrong in production. Output: service restored, a timeline with evidence anchors, and a routed follow-up list.

Every other failure path in this vault is pre-merge. This one is the only procedure that runs when the failure has users attached.

## Trigger

- An alert, error-rate spike, or failed health check on a production system.
- A user or stakeholder reports broken behavior in production.
- A deploy completes and its post-deploy verification fails.

Not for: a failing CI check (that is the fix loop in `implementation-orchestration`), a defect found before shipping (that is `acceptance-verification`), or a known-broken staging environment.

## Preconditions

- `{{SYSTEM}}` — what is affected, and how to reach it: dashboards, logs, the deploy history.
- `{{ROLLBACK_PATH}}` — the known way to undo the last change. **Identify this before you need it.** A rollback path discovered during an incident is not a rollback path.
- Authority to act, or a named human who has it. If neither exists, Step 0 is to get one.

## Principles

- **Mitigate first, diagnose second.** Understanding the bug is not the goal during an incident; stopping the harm is. A perfect diagnosis delivered after an hour of downtime is a worse outcome than an unexplained rollback delivered in five minutes.
- **The most likely cause is the most recent change.** Start there every time. Resist the more interesting hypothesis until the boring one is eliminated.
- **Announce before you act.** Every mitigation is written down before it is executed, so the timeline survives even if the responder does not stay.
- **One change at a time.** Two simultaneous mitigations mean neither can be evaluated and the rollback of a rollback becomes ambiguous.
- **Severity drives process, not the other way round.** Decide severity early; it determines whether you wake anyone.
- **The incident is not over when the graph recovers.** It is over when the follow-ups are routed.
- **Agent-agnostic.** Roles: Responder (drives), Scribe (timeline), Investigator (diagnosis). Solo mode runs them in sequence, with the timeline written as you go rather than reconstructed afterward.

## Step 0 — Confirm it is real, and declare

Before mobilizing, confirm the signal reflects user-visible harm — a broken monitor and a broken service look identical on a dashboard.

Check: is the symptom reproducible from outside the system, on a path a user takes?

Then declare severity:

| Severity | Definition | Response |
|---|---|---|
| SEV1 | Data loss, security exposure, or core function down for most users | Mitigate now. Escalate to a human immediately, regardless of confidence. |
| SEV2 | Core function degraded, or broken for a subset | Mitigate now. Notify. |
| SEV3 | Non-core function broken, workaround exists | Handle in normal flow. Do not page. |

Record the declaration time. **This timestamp starts the timeline.**

If the symptom cannot be reproduced from outside, treat it as a monitoring defect: file it, do not mitigate. Rolling back a healthy system because a probe is broken is a self-inflicted incident.

## Step 1 — Open the timeline

Start the record now, not afterward. Every subsequent step appends to it.

```
T+00:00  declared SEV2 — checkout 500s, ~12% of requests
T+00:02  last deploy: a1b2c3d at 09:41Z, 6 min before first error
T+00:04  ACTION rollback to 9f8e7d6 — announced, executing
T+00:07  error rate 12% → 0.2%, recovering
```

Each entry: timestamp, what was observed or done, and where the evidence lives. Timeline entries are the evidence anchors of this playbook — the same discipline `acceptance-verification` applies to criteria.

## Step 2 — Establish the change correlation

Answer, in this order:

1. **When did the symptom start?** From metrics or logs, not from when someone noticed.
2. **What shipped immediately before that?** Deploys, config changes, feature-flag flips, migrations, dependency updates, third-party changes. Flag flips and config changes are changes — they are the ones teams forget.
3. **Does the timing fit?** A change that landed 6 minutes before is a strong lead. One that landed 3 days before is not, unless something time-triggered fired.

If a recent change correlates, go to Step 3 immediately. **Do not read its diff first.** Reading code is diagnosis; you are still mitigating.

If nothing correlates, say so explicitly in the timeline and go to Step 4.

## Step 3 — Mitigate

Choose the fastest safe mitigation, in this order of preference:

1. **Revert the change** — flag off, config restored, deploy rolled back, OTA update rolled back. Fastest, most reversible, requires no understanding of the bug.
2. **Isolate** — disable the failing feature, shed load, fail over to a healthy region or replica.
3. **Fix forward** — only when reverting is impossible (an irreversible migration, a change already depended upon downstream) or would itself cause harm. Fix-forward under incident pressure is how a SEV2 becomes a SEV1; take it only when reverting is genuinely off the table, and say why in the timeline.

Before executing: write the action in the timeline, including the expected effect and the signal that will confirm it. Then execute. Then wait for that signal.

**One change at a time.** If the first mitigation does not work, revert it before trying the next unless leaving it in place is clearly harmless.

Special cases:

- **Data loss in progress** → stop the writes first. Availability is recoverable; data is often not. Accept downtime to stop corruption.
- **Security exposure** → revoke and rotate before restoring function, and escalate to a human immediately regardless of severity confidence.
- **Migration involved** → do not roll back a deploy across a schema change without checking the migration is backward compatible. This is the single most common way a rollback makes things worse.

## Step 4 — Confirm recovery

Recovery is an observation, not an assumption. Confirm from the same signal that showed the problem, plus one independent check — ideally a real user path exercised from outside.

Record in the timeline: metric before, metric after, time to recovery, and the independent check.

If the signal does not recover within the window you predicted, the mitigation was wrong. Revert it and return to Step 2 with that eliminated — a failed mitigation is information, and belongs in the timeline as such.

Only after recovery is confirmed: downgrade severity, and say so.

## Step 5 — Diagnose

Now the pressure is off, understanding is worth having.

- What was the mechanism? Not "the deploy broke it" — what specifically, with an anchor: file and symbol, config key, query plan, third-party response.
- Why did it reach production? Which gate should have caught it: a missing test, a criterion never verified, an environment-parity difference, an unreviewed config path.
- Why was it not caught faster? What signal was missing or too slow.

That second question is the valuable one, and it maps directly onto the vault's gates. If the answer is "no test covered it," that is `skills/test-authoring/`. If it is "the criterion was never verified at runtime," that is `playbooks/acceptance-verification/`. If it is "nothing verifies after deploy," that is a standing gap.

## Step 6 — Route the follow-ups

Every incident produces at least one follow-up. An incident with none was not understood.

| Follow-up type | Destination |
|---|---|
| The real fix (if mitigation was a revert) | `raa` → `implementation-orchestration` |
| A missing test | `skills/test-authoring/` |
| A criterion never verified at runtime | `playbooks/acceptance-verification/` |
| A missing or too-slow signal | monitoring change, filed as its own work |
| A missing or broken rollback path | fix before the next deploy — this is a P0 |
| Process or knowledge gap | `playbooks/retrospective/` → `prompts/knowledge-extraction/` |

Each follow-up: a named owner and a severity. Unowned follow-ups do not exist.

For SEV1 and SEV2, run `playbooks/retrospective/` on the incident within a few days, with this playbook's timeline as its input. That is the handoff that makes the learning loop close instead of dangling.

## Stop conditions

- **RESOLVED** — service confirmed recovered from two independent signals, severity downgraded, timeline complete, every follow-up owned, and a retrospective scheduled for SEV1/SEV2.
- **MITIGATED** — harm stopped but the underlying cause is unknown or the fix is outstanding. Legitimate and common. State exactly what remains unknown and what would close it; keep the incident open.
- **ESCALATED** — the responder cannot mitigate: no rollback path, no authority, or the blast radius exceeds their scope. Hand off with the timeline as-is. Escalation is a correct outcome, not a failure.

## Never

- Diagnose before mitigating on a SEV1 or SEV2.
- Execute a mitigation that is not written in the timeline first.
- Apply two mitigations at once.
- Roll back across a schema migration without checking backward compatibility.
- Declare recovery from a single signal.
- Reconstruct the timeline afterward from memory.
- Close an incident with unowned follow-ups.
- Continue past an unmitigated SEV1 without escalating to a human.

## Verification checklist

Before declaring RESOLVED:

- [ ] Symptom was reproducible from outside the system at declaration
- [ ] Severity declared and timestamped
- [ ] Timeline written during the incident, not after
- [ ] Change correlation established, or its absence explicitly recorded
- [ ] Every mitigation announced before execution, one at a time
- [ ] Recovery confirmed from two independent signals
- [ ] Mechanism identified with an anchor, or `MITIGATED` declared instead
- [ ] "Which gate should have caught this" answered
- [ ] Every follow-up has an owner and a severity
- [ ] Rollback path confirmed working, or its repair filed as P0
- [ ] Retrospective scheduled (SEV1/SEV2)

## Rollback / Fallback

- **No rollback path exists** → escalate immediately and mitigate by isolation instead. File the missing rollback path as a P0 follow-up; it will recur at the next incident.
- **The rollback makes it worse** → roll the rollback back if reversible, then escalate. Record both attempts. This is usually a migration compatibility problem.
- **Cannot reproduce the symptom** → do not mitigate a system you cannot show is broken. File as a monitoring defect and keep watching.
- **The change correlation is ambiguous** (several changes in the window) → revert the whole window if it is safe to do so. Bisecting under incident pressure costs more downtime than it saves.
- **Recovery does not hold** — the symptom returns after mitigation → re-escalate severity, treat the original diagnosis as wrong, and return to Step 2 with the failed mitigation eliminated.
- **The incident exceeds one responder's context** → hand off explicitly, with the timeline as the handoff document. An incident handed off without a timeline restarts from zero.
