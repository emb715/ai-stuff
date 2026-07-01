Turn a rough idea or brainstorm output into a structured product brief in 15-20 minutes. Research-first: the agent researches and drafts, the user corrects. Fast, low-friction, ready to extend into a PRD in the same session if the energy is there.

## Trigger

User says "help me create a product brief", "I have an idea I want to structure", or you just closed a brainstorming session and need to commit to a direction.

## Preconditions

- A rough idea, a problem statement, or brainstorm output
- ~15-20 minutes

## Model: research-first, correct-fast

Don't interrogate the user. Research first, draft a brief hypothesis, let the user correct what's wrong. One round of questions beats five rounds of sub-questions.

The brief has four required sections: problem, users, success, scope. Constraints fold into scope unless they're non-obvious.

## Step 1 — Get the idea

One message. Ask:

"What's the idea? One or two sentences — rough is fine. If you have brainstorm output, share it."

Wait for the response. That's the only question before research begins.

## Step 2 — Research

Before drafting anything, research the problem space:

- Who has this problem? What do they currently use? What do they complain about?
- What similar products exist? Where do they fall short?
- Any obvious user segments, use cases, or constraints?
- Any market signals — communities, job postings, tools, workarounds — that ground the opportunity?

Use web search or whatever tools are available. If tools aren't available, state what assumptions you're making and ask the user to validate them.

Summarize findings to yourself silently. Don't show the research — show the draft.

## Step 3 — Draft the brief

Based on the idea and research, draft all four sections. Mark anything uncertain with `[assumption — confirm]`.

```
# Product Brief: [Name]

## Problem
**Who:** [specific person in specific context]
**What breaks:** [concrete failure or cost without a solution]
**Current workaround:** [how they solve it today]
**Why the workaround fails:** [specific gap or frustration]

## Users
**Primary:** [Name/Role] — [2 sentences: context + what success looks like for them]
**Secondary:** [Name/Role] — [1 sentence] (omit if none)

## Success
**Primary outcome:** [measurable result that proves the problem is solved]
**Leading indicator:** [early signal visible before the outcome]
**Not measuring:** [what we're explicitly ignoring to stay focused]

## Scope
**In MVP:**
- [capability]: [why essential]
- [capability]: [why essential]

**Out of MVP:**
- [idea/feature]: [why deferred]
- [idea/feature]: [why deferred]

**Constraints:** [technical, business, or regulatory — or "none identified"]
```

Present the full draft. Then ask one question:

**"What's wrong, what's missing, and what needs to change?"**

Wait for the response. Don't ask sub-questions.

## Step 4 — Correct and confirm

Apply every correction the user provides. If a correction changes one section, check whether it cascades to another (a new user type changes success metrics; a removed feature changes scope).

If the user's corrections are sparse — "looks mostly right, but X" — probe the out-list specifically: "What are we explicitly not building for MVP? Name at least two things." An empty out-list is not acceptable. Scope without exclusions is a wish.

After corrections, present the updated brief. Ask: "Confirmed?"

If yes: brief is done. One confirmation round is the default. Two at most.

## Step 5 — Decide what's next

The brief is done. Ask: "Do you want to keep going into a plan, or is this the stopping point for now?"

**If stopping:** brief lives in the conversation. User copies what they need.

**If continuing into a plan:** stay in the same session. The brief is the starting document. Run iterative rounds on it — each round resolves the highest-risk gap with the smallest change, keeps assumptions explicit, surfaces contradictions for user input, and stops when all requirements are traceable and no P0/P1 unknowns remain. Don't switch tools. Keep going.

## Verification

- Problem names a specific person, a concrete failure, and a current workaround
- Users section has at most two personas with behavioral descriptions (not demographic ones)
- Success has at least one measurable outcome with a threshold
- Scope has a non-empty out-list with rationale for each item
- User confirmed the brief in one or two rounds

## Rollback / Fallback

- If research turns up nothing relevant → state assumptions explicitly and ask the user to validate before drafting
- If the user can't name what's out of scope → ask: "If you had to cut half the features right now, what goes first?"
- If the user already has a partial plan doc → skip this playbook, route to plan refinement directly
- If the brief is confirmed and the user wants to continue → stay in the session and run plan refinement inline; no need for a separate tool
