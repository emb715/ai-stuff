Run a retrospective on a completed body of work. Extract lessons, assess readiness, create action items, and prepare for what's next. The agent is a facilitator; the user is the participant.

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

## Step 1 — Define what's being reviewed

Ask the user:

1. What body of work are we reviewing? (feature, sprint, milestone, project phase)
2. Is it fully complete, or partially complete?
3. Do you have notes from a previous retrospective? (if yes, have them ready)
4. What's coming next? (if known)

If the work is not yet complete, note that. Partial retrospectives are useful but may miss lessons from pending work.

## Step 2 — Extract lessons

Review the completed work and extract:

### What went well
- Specific wins with evidence (not "things went smoothly" — what specifically?)
- Breakthroughs or discoveries worth repeating
- Patterns that worked and should be continued

### What didn't go well
- Specific struggles with evidence
- Where complexity was underestimated
- Recurring issues (appeared 2+ times)
- Approaches that didn't work as planned

### Technical debt incurred
- Shortcuts taken and why
- Items that affect the next body of work
- Severity and priority of each debt item

### Process insights
- Where did the workflow break down?
- Where did communication fail?
- What would be done differently?

Present these to the user for validation: "Here's what I'm seeing. What did I miss? What would you add or change?"

## Step 3 — Check previous retro follow-through

If a previous retrospective exists:

1. List each action item from the previous retro
2. Assess status: ✅ Completed / ⏳ In Progress / ❌ Not Addressed
3. For completed items: did they help? Evidence of impact?
4. For not-addressed items: did the gap cause problems this time?
5. For in-progress items: what's blocking completion?

This step is non-negotiable if a previous retro exists. Action items without follow-through make retrospectives theater. The value of a retro is in the changes it produces, not the discussion it generates.

Present to the user: "Last retro we committed to [N] action items. [X] completed, [Y] in progress, [Z] not addressed. [Z] not addressed may explain [challenge from this work]."

## Step 4 — Readiness assessment

Before declaring the work complete, assess:

- **Testing & quality** — what verification has been done? What's still needed? Any known bugs or gaps?
- **Deployment status** — is it live? Scheduled? Pending? Does timing affect what's next?
- **Stakeholder acceptance** — have stakeholders seen and accepted the deliverables? Any pending feedback?
- **Technical health** — does the codebase feel stable and maintainable? Or fragile? Be honest.
- **Unresolved blockers** — anything carrying forward that could create problems?

Present the assessment: "Based on this, the work is [fully complete / complete but with N critical items before next work]."

## Step 5 — Significant discovery detection

Check if any learnings from this work invalidate assumptions about what's next:

- Were architectural assumptions proven wrong?
- Did scope change in ways that affect future plans?
- Did the technical approach need fundamental change?
- Were dependencies discovered that future plans don't account for?
- Were user needs significantly different than understood?
- Were performance, security, or integration assumptions proven incorrect?

If significant discoveries exist:

```
SIGNIFICANT DISCOVERY ALERT

[Discovery 1]: [Impact on what's next]
[Discovery 2]: [Impact on what's next]

The current plan for [next work] assumes:
- [wrong assumption 1]
- [wrong assumption 2]

But this work revealed:
- [actual reality 1]
- [actual reality 2]

Recommended: Review and update the plan for [next work] before starting.
```

If no significant discoveries: "Nothing from this work fundamentally changes the plan for what's next."

## Step 6 — Action items

Synthesize lessons into SMART action items:

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

Present to the user for approval. Adjust priorities and ownership based on user input.

## Step 7 — Summary

```
RETROSPECTIVE SUMMARY

Work reviewed: [name]
Completion: [N/N tasks | partial: N/M]
Action items: [N]
Technical debt items: [N]
Significant discoveries: [N or none]
Readiness: [fully complete / N critical items before next work]
Previous retro follow-through: [X/N action items completed]
```

Ask the user: "Anything we missed? Anything you want to add or change before we close?"

## Verification

- Lessons are specific with evidence, not generalities
- Previous retro follow-through was checked (if previous retro existed)
- Readiness assessment covered testing, deployment, stakeholder acceptance, technical health, blockers
- Significant discoveries were explicitly checked for
- Action items are SMART (specific, measurable, achievable, relevant, time-bound)
- User validated the findings before closing

## Rollback / Fallback

- If the work is not well-documented → ask the user to describe what happened rather than guessing. The retro is only as good as the input.
- If there's no previous retro → skip Step 3, note this is the first retrospective
- If what's next is not defined → skip the preparation section, note that preparation tasks can't be identified without knowing what's coming
- If the user can't assess readiness honestly → flag that the readiness assessment is based on available information and may have gaps
- If significant discoveries are unclear → present what you see and let the user decide whether they're significant. Don't manufacture urgency.

## References

- Pair with `docs/references/change-impact-checklist.md` when significant discoveries require project-level change assessment
- Pair with `playbooks/adversarial-code-review/` to feed code quality findings into the retrospective
