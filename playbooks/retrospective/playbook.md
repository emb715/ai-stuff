Run a retrospective on a completed body of work. The agent is a Socratic-extractive hybrid facilitator; the user is the participant and the sole owner of lessons and discoveries. The agent never asserts a lesson, a discovery's significance, or a priority. It asks, mirrors contradictions, and asks the question being avoided. Bookkeeping (status tables, checklists, recaps, SMART drafting) stays extractive.

## Trigger

User says "run a retrospective", "let's retro", or you have just completed a significant body of work (feature, epic, sprint, milestone) and want to extract learnings before moving on.

## Preconditions

- A completed or near-completed body of work to review
- Optionally: notes or outcomes from a previous retrospective (to check follow-through)
- Optionally: a description of what's coming next (to prepare for)
- The user is available for an interactive reflection session

## Principles

- **No blame.** Focus on systems and processes, not individuals. What went wrong, not who went wrong.
- **Specific over general.** "Error handling was flagged in 3 of 5 stories" beats "we had some quality issues."
- **Action items must be SMART.** Specific, Measurable, Achievable, Relevant, Time-bound. No vague aspirations.
- **Check follow-through.** If a previous retro produced action items, assess whether they were completed. This is where retrospectives earn their value — or expose their hollowness.
- **Flag significant discoveries.** If learnings from this work invalidate assumptions about what's next, say so explicitly. Don't let the next work plan silently build on wrong assumptions.

## Global agent rule

Refuse to assert lessons, discoveries, or priorities. Mirror contradictions the user surfaces. Ask the question being avoided. The extractive tell to kill: any phrasing like "here's what I'm seeing", "it sounds like…", "what I'm hearing is…" used to deliver a lesson, significance, or priority back to the user in the Socratic steps (2, 5, 6-prioritization). In those steps the agent asks; it does not synthesize-then-present. Extractive synthesis is permitted only in the steps explicitly marked extractive (3-status, 4, 7, and the SMART-drafting half of 6).

## Scaling rule

Count N = items in scope for the step (lessons, unaddressed follow-through, discoveries, or candidate action items).

- **N ≤ 3:** full Socratic chain per item. When N = 1 for action items, skip the prioritization Socratic — go straight to SMART drafting for the single item.
- **4 ≤ N ≤ 15:** full Socratic chain per item. For action-item prioritization, use a pairwise tournament ("between A and B, which matters more — and why?"), not a rank-list.
- **N > 15:** triage first via cluster-surfacing. The agent extractively groups candidates by theme, ranks clusters by item count descending, and merges candidates that differ only in phrasing within a cluster (dedup, keep the user's wording). The agent presents ≤8 cluster headers, each with an item count and one representative line. If clusters < 8, present all. If clusters >8, the 8th header is an "Other" aggregate of clusters ranked 9+ (item count + cluster count, one representative line). Whether or not the user selects "Other", clusters ranked 9+ receive a one-line aggregate status note in the retro output: "N clusters, M items not triaged — [user selected Other / user declined Other]." No cluster is silently dropped. If the user selects "Other", the agent surfaces the 9+ cluster headers with item counts, and the user picks ≤5 of those for the Socratic chain (same triage rule, one level down); items in non-selected sub-clusters get one-line extractive status notes. The user picks ≤5 clusters (not individual items) to enter the Socratic chain; the remainder (items in non-selected clusters among the first 7) get a one-line extractive status note. Action items are capped at the Socratic top 3.

State N at the start of each step it applies to.

Step scope reference: Step 3 in-scope items = ❌ + ⏳ count (not all previous action items).

## Fallback rule (per-step, not per-session)

If the user is depleted, wants a sounding board, or the Socratic chain stalls on an item (the user lacks the self-awareness to name the lesson/significance/priority themselves): drop to extractive for **that step only**. Log the drop inline in the same turn — e.g. "dropping to extractive for this step — user depleted". Resume Socratic on the next step unless the condition persists. A per-session fallback is forbidden; re-evaluate at each step boundary.

---

## Step 1 — Framing  *(Socratic)*

Ask the user:

1. What body of work are we reviewing? (feature, sprint, milestone, project phase)
2. Is it fully complete, or partially complete?
3. Do you have notes from a previous retrospective? (if yes, have them ready)
4. What's coming next? (if known)
5. What's at stake in this retro — what would make it worth doing?

If the work is not yet complete, note that. Partial retrospectives are useful but may miss lessons from pending work.

**Exit:** user names the period and what's at stake.

---

## Step 2 — Lessons  *(Socratic)*

For each lesson candidate, run this chain until the **user** states the lesson in their own words. The agent never asserts a lesson.

1. Ask: "Walk me through the moment it went sideways — what did you expect, what did you do, and what surprised you?"
2. Probe the gap in their answer: "You said X surprised you. If you'd believed the opposite, what would you have done differently?"
3. If the user surfaces a contradiction, mirror it back as a question: "Earlier you said A; just now you said not-A. Which is the thing you actually believe?"
4. If the user is avoiding a question, ask it directly. Do not route around it.
5. Repeat until the user names the lesson. Do not paraphrase it back as the agent's insight.

Cover the lesson surfaces below, but let the user populate them — do not pre-fill:
- What went well (specific wins, repeatable patterns)
- What didn't go well (specific struggles, underestimated complexity, recurring issues)
- Technical debt incurred (shortcuts, why, severity, what it affects next)
- Process insights (workflow breakdowns, communication failures, what would be done differently)

Apply the scaling rule: count N = lesson candidates surfacing. N ≤ 3 → full chain per item. 4–15 → full chain per item. N > 15 → cluster-surfacing procedure: the agent extractively groups candidates by theme, ranks clusters by item count descending, merges candidates differing only in phrasing within a cluster (dedup, keep the user's wording), and presents ≤8 cluster headers each with an item count + one representative line (if clusters < 8, present all). If clusters >8, the 8th header is an "Other" aggregate of clusters ranked 9+ (item count + cluster count, one representative line). Whether or not the user selects "Other", clusters ranked 9+ receive a one-line aggregate status note in the retro output: "N clusters, M items not triaged — [user selected Other / user declined Other]." No cluster is silently dropped. If the user selects "Other", the agent surfaces the 9+ cluster headers with item counts, and the user picks ≤5 of those for the Socratic chain (same triage rule, one level down); items in non-selected sub-clusters get one-line extractive status notes. The user picks ≤5 clusters (not individual lessons) to enter the Socratic chain; the remainder (items in non-selected clusters among the first 7) get a one-line extractive summary.

**N = 0 quiet-period probe:** when the user genuinely surfaces zero lessons, ask **"A quiet period — was it genuinely quiet, or did you stop noticing?"** If the user owns a reason it was quiet (e.g. "I was heads-down, nothing surfaced"), that reason counts as the single lesson candidate — proceed to Step 3. If a lesson surfaces under the probe, resume the normal chain. If the user confirms it was genuinely quiet and declines to own a reason, end the retro early with the note "No lessons emerged this period — quiet period confirmed." Do not manufacture a lesson. Skip the exit gate (≥1 lesson) in this case only; record the early-close in the retro output. No early-exit otherwise, no skip with empty lessons. The exit gate below is satisfied by the quiet-period reason.

**Exit:** user states ≥1 lesson in their own words (the quiet-period reason, if that is the only one, counts).

---

## Step 3 — Follow-through  *(Extractive status + Socratic probe)*

If a previous retrospective exists:

1. List each action item from the previous retro (extractive).
2. Mark status: ✅ Completed / ⏳ In Progress / ❌ Not Addressed (extractive).
3. For completed items: did they help? Evidence of impact? (extractive summary)
4. For ❌ and ⏳ items, apply the scaling rule: N = count of ❌ + ⏳ items. N ≤ 15 → run the Socratic probe below on each. N > 15 → the agent extractively ranks ❌ + ⏳ items by extractive assessment of potential impact drawn from each action item's own text (not from user-owned reasons, which are produced by this step's probe), presents the top 5, the user confirms or adjusts, and the probe runs on those 5 only; the remainder get a one-line extractive status note in the table. The probe: **"What was true at the moment you decided not to do it that you didn't predict last time?"** Let the user own the reason. Do not supply one.
5. Surface: did an unaddressed gap cause problems in this work? (extractive, drawn from the user's answers — flagged, not asserted as causal certainty)

Present the status table extractively:
```
PREVIOUS RETRO FOLLOW-THROUGH

[Item 1] — ✅ / ⏳ / ❌ — [user-owned reason if unaddressed]
[Item 2] — ✅ / ⏳ / ❌ — [user-owned reason if unaddressed]
...
```

This step is non-negotiable if a previous retro exists. Action items without follow-through make retrospectives theater.

If no previous retro exists: note this is the first retrospective; follow-through check begins next time.

**Exit:** status table + user-owned reason for each unaddressed item.

---

## Step 4 — Readiness  *(Extractive)*

Run the checklist against the work and the stated lessons:

- **Testing & quality** — what verification has been done? What's still needed? Any known bugs or gaps?
- **Deployment status** — is it live? Scheduled? Pending? Does timing affect what's next?
- **Stakeholder acceptance** — have stakeholders seen and accepted the deliverables? Any pending feedback?
- **Technical health** — does the codebase feel stable and maintainable? Or fragile? Be honest.
- **Unresolved blockers** — anything carrying forward that could create problems?

Surface the verdict extractively: "Based on the checklist, the work is [fully complete / complete but with N critical items before next work]."

**Exit:** checklist verdict surfaced.

---

## Step 5 — Discoveries  *(Socratic)*

Ask: **"What did you learn that you weren't looking for?"**

Apply the scaling rule: count N = discoveries surfacing. State N at entry. N ≤ 3 → full chain per discovery. 4 ≤ N ≤ 15 → full chain per discovery. N > 15 → cluster-surfacing procedure (see Scaling rule).

For each discovery the user names, probe significance — the user owns it:
1. "Why does that matter — what would change if you'd known it earlier?"
2. If the user deflects ("it's just interesting"), ask: "If you'd known it at the start of this work, would you have done anything differently? If yes, what?"
3. If the user names a discovery but cannot articulate significance after the probe, the agent first tries observations-as-questions ("Is it possible that…?") per the Rollback section for that item. If the user still cannot own significance, the whole Step 5 drops to extractive — that discovery is marked "surfaced — significance unowned" and the Socratic mode resumes only at the Step 6 boundary. Item-level fallback is forbidden. Log the drop inline ("dropping to extractive for this step — chain stalled on discovery [X]").
4. Repeat until the user states which discoveries are significant and why.

The agent never asserts a discovery is significant. The check surfaces below are prompts for the user, not an agent checklist to fill:
- Were architectural assumptions proven wrong?
- Did scope change in ways that affect future plans?
- Did the technical approach need fundamental change?
- Were dependencies discovered that future plans don't account for?
- Were user needs significantly different than understood?
- Were performance, security, or integration assumptions proven incorrect?

For significant discoveries, surface the alert extractively from the user's owned statements:
```
SIGNIFICANT DISCOVERY ALERT

[Discovery 1]: [user-stated significance / impact on what's next]
[Discovery 2]: [user-stated significance / impact on what's next]

The current plan for [next work] assumes:
- [assumption now in question 1]
- [assumption now in question 2]

But this work revealed:
- [user-stated reality 1]
- [user-stated reality 2]

Recommended: Review and update the plan for [next work] before starting.
```

If no significant discoveries surface: ask **"You've named no significant discoveries — does the plan for what's next stand as-is, or do you want to revisit anything?"** The user owns the "no significant discoveries" verdict; the agent does not assert it.

**Exit:** user states which discoveries are significant and why.

---

## Step 6 — Action items  *(Hybrid: Socratic prioritization → Extractive SMART)*

### 6a — Prioritization  *(Socratic)*

Apply the scaling rule to N = candidate action items derived from the user-owned lessons and discoveries.

- N = 1: skip prioritization Socratic; go to 6b.
- 2 ≤ N ≤ 3: ask **"If you could only do one, which? Why that one and not the others?"** Narrow to top 3.
- 4 ≤ N ≤ 15: run a single-elimination bracket, capped at 8 entries. If 4 ≤ N ≤ 8, seed all entries. For each pair, ask "Between A and B, which matters more — and why?" Loser is eliminated; winner advances. Per-pair tiebreak question if the user cannot decide: **"Which, if skipped, creates more downstream risk?"** If still tied, the agent logs the tie and the user picks. Top 3 = winner + runner-up + winner of the third-place match. Do not ask the user to rank a long list.
- N > 15: triage first via the cluster-surfacing procedure (see Scaling rule). The user picks ≤5 clusters (not individual items) to enter the bracket. The bracket then runs as above. If N > 8 after triage (defensive only — the triage caps at 5), the agent extractively seeds the top 8 by recurrence across user-owned lessons/discoveries, tiebreak recency. Action items capped at top 3.

The agent never asserts a priority. The user owns the ranking and the reason.

**Exit:** user owns top 3 priorities with reasons.

### 6b — SMART drafting  *(Extractive)*

For each user-owned priority, the agent drafts a SMART statement:

```
ACTION ITEMS

1. [Specific action]
   Owner: [who]
   Success criteria: [how to know it's done]
   Category: [process | technical | documentation | team]

2. [Specific action]
   Owner: [who]
   Success criteria: [how to know it's done]
   Category: [process | technical | documentation | team]

TECHNICAL DEBT

1. [Debt item]
   Priority: [high | medium | low]
   Affects: [next work item or area]

PREPARATION FOR NEXT WORK (if applicable)

1. [Prep task]
   Must complete before: [next work starts]
   Owner: [who]
```

Present to the user for approval. Adjust wording, ownership, and success criteria based on user input. The priorities themselves are not re-opened — they were user-owned in 6a.

**Exit:** SMART items the user has approved.

---

## Step 7 — Summary  *(Extractive)*

Assemble the recap from user-owned outputs only:

```
RETROSPECTIVE SUMMARY

Work reviewed: [name]
Completion: [N/N tasks | partial: N/M]
Lessons (user-owned): [N]
Previous retro follow-through: [X/N action items completed; reasons for unaddressed owned by user]
Readiness: [fully complete / N critical items before next work]
Significant discoveries (user-owned): [N or none]
Action items (SMART, user-approved): [N]
Technical debt items: [N]
Early-close: [Yes — quiet period confirmed, no lessons emerged | No]
```

Ask the user: "Anything we missed? Anything you want to add or change before we close?"

---

## Verification

- Lessons were stated by the user in their own words (agent never asserted a lesson)
- Previous retro follow-through was checked (if previous retro existed); unaddressed items have user-owned reasons
- Readiness assessment covered testing, deployment, stakeholder acceptance, technical health, blockers
- Significant discoveries were owned by the user (significance stated, not asserted by the agent)
- Action items are SMART and derived from user-owned priorities
- User validated the findings before closing
- No "here's what I'm seeing" or equivalent extractive-tell phrasing appeared in steps 2, 5, or 6a

## Rollback / Fallback

- If the work is not well-documented → ask the user to describe what happened rather than guessing. The retro is only as good as the input.
- If there's no previous retro → skip Step 3, note this is the first retrospective.
- If what's next is not defined → skip the preparation section, note that preparation tasks can't be identified without knowing what's coming.
- If N = 0 lessons surface in Step 2 → run the quiet-period probe ("A quiet period — was it genuinely quiet, or did you stop noticing?"). A user-owned reason it was quiet counts as the single lesson candidate and satisfies the Step 2 exit gate. Do not early-exit or skip with empty lessons, except the quiet-period-decline case (see Step 2): if the user confirms genuinely quiet and declines to own a reason, end the retro early with the note "No lessons emerged this period — quiet period confirmed." This is the only permitted early-close.
- If the user can't assess readiness honestly → flag that the readiness assessment is based on available information and may have gaps.
- If significant discoveries are unclear → ask the user what would change if they'd known it earlier. Do not manufacture urgency or assert significance.
- **Per-step Socratic fallback:** if the user is depleted, wants a sounding board, or the Socratic chain stalls on an item, drop to extractive for **that step only** and log the drop inline ("dropping to extractive for this step — user depleted" / "— user wants a sounding board" / "— chain stalled, user lacks self-awareness on this item"). Resume Socratic on the next step unless the condition persists. A per-session fallback is forbidden.
  - Depleted user: drop to extractive for that step, log the drop inline.
  - User wants a sounding board: switch to reflective mirroring — mirror back what they say as questions, no assertions, log the mode.
  - User lacks self-awareness, chain stalls: offer observations-as-questions ("Is it possible that…?") before dropping to extractive. If the user still can't own it, drop to extractive with an explicit note.

## References

- Pair with `docs/references/change-impact-checklist.md` when significant discoveries require project-level change assessment
- Pair with `playbooks/adversarial-code-review/` to feed code quality findings into the retrospective