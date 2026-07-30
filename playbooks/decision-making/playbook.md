Take N options and produce a ranked shortlist with explicit rationale per ranking criterion, ready to feed product-brief or direct selection. The method is multi-criteria decision analysis: score each option against criteria the user defines, compute weighted totals, run a sensitivity check, and hand off a robustness-verdicted shortlist. The user controls the criteria and weights — the agent scores and explains, never decides for the user.

## Trigger

The user has a set of options (from brainstorming, a candidate feature list, or any decision with multiple choices) and needs to converge to a ranked shortlist. Input is N options; output is a ranked top 3-5 with scores, rationale per criterion, and a sensitivity verdict.

Not for: binary decisions (just pick), single-option scenarios (nothing to rank), or stakeholder-alignment decisions (use a voting/consensus process).

## Preconditions

- A set of 3+ options to choose between.
- The user is available to define/weight criteria (or accepts the defaults).

## Principles

- **Score with justification, never silently.** Every score has a one-sentence reason. A score without a stated reason is hand-waving and is rejected.
- **The user owns the criteria and weights.** The agent offers defaults; the user decides what matters and how much. The agent never sets weights unilaterally.
- **Robustness is part of the answer.** A ranking that flips under a ±20% weight shift is fragile, not conclusive. State it.
- **The matrix informs the pick; it does not make it.** The shortlist is 3-5, not 1. The user makes the final selection, not the weighted total.
- **Agent-agnostic.** Operate by role, not by fleet. Each step names a role (Analyst, Orchestrator); dispatch that role to whatever agent your fleet provides, or run it yourself in solo mode (one agent or human doing the steps sequentially).

## Step 1 — Understand the decision

Establish what is being chosen between, in what context, and what happens after the choice.

Ask the user:
- What is the decision? (one sentence)
- What is the context? (why now, what constrains it)
- What happens after the choice? (feeds product-brief? direct implementation? team vote?)

Record the answer as the decision name and downstream target. If the downstream target is unclear, assume "feed product-brief or direct selection" and state the assumption.

## Step 2 — Gather options

List all options. If from a brainstorming session, pull the captured ideas. If from the user, ask for the candidate list.

For each option, capture a one-line definition. If an option is too vague to score against any criterion, ask the user to sharpen it before proceeding. Do not score vague options — return to the user for definition.

Minimum 3 options. If fewer than 3, stop: this is not a ranking problem.

## Step 3 — Define criteria

Ask the user what matters for this decision. Let the user add, remove, or rename criteria.

Defaults if the user gives none:
- **Impact** — how much value this option delivers
- **Effort** — how much work this option requires
- **Novelty** — how different this is from what already exists
- **Risk** — how uncertain or unproven this option is

State the criteria list back to the user and confirm before weighting. Do not proceed to scoring until the user confirms the criteria set.

## Step 4 — Weight criteria

Ask the user to weight each criterion 1-5. If the user does not care about weighting, use equal weight across all criteria and state that assumption.

Normalize the weights to percentages that sum to 100%. Record the normalized weights. State any criterion that dominates (>50% of total weight) and confirm with the user that the dominance is intentional.

## Step 5 — Score options

For each option × criterion, score 1-5 with a one-sentence justification. Every score must have a stated reason — do not score silently.

Score direction:
- Impact, Novelty: higher is better (5 = highest).
- Effort, Risk: higher is worse (5 = most effort / most risk), unless the user redefines the direction. State the direction for every criterion before scoring and confirm with the user.

Present the scores to the user as the matrix fills. Do not wait until all scores are done to surface them — let the user see and react row by row if the session is interactive.

If the user disagrees with a score, ask why. If the disagreement is about the criterion's definition, redefine the criterion (return to Step 3). If it is about the option's facts, correct the score and restate the justification.

## Step 6 — Compute weighted totals

Matrix × weights = ranked list. For each option:
- weighted_total = Σ (score × normalized_weight) across all criteria.
- Rank options by weighted_total, highest first.

Record the totals and ranks. Present the full ranked list to the user, not just the shortlist.

## Step 7 — Sensitivity check

Would the ranking change if weights shifted ±20%?

Procedure:
- For each criterion, recompute the ranking with that criterion's weight shifted +20% (and the others rescaled to keep the total at 100%).
- Repeat for −20%.
- Compare the resulting top-3 order to the original. If the order changes, the ranking is fragile with respect to that criterion.

Verdict:
- **Robust** — top option unchanged across all ±20% shifts.
- **Fragile** — top option changes under any ±20% shift. Name which criterion's shift flips it.

If every option is fragile (no stable winner under any shift), stop: the criteria need redefinition, not the weights. Return to Step 3.

## Step 8 — Produce the shortlist

Top 3-5 options (user chooses how many; default 3). For each shortlist item:
- option name
- weighted total
- one-line rationale per criterion (the score justifications, condensed)
- the sensitivity verdict applies to the whole shortlist, stated once

Output contract — fill exactly this template:

```
## Decision Matrix — [decision name]

### Criteria and weights
| Criterion | Weight | Why it matters |
|---|---|---|
| [criterion] | [X%] | [one sentence] |

### Scores
| Option | [crit1] | [crit2] | ... | Weighted total | Rank |
|---|---|---|---|---|---|
| [option] | [1-5 + reason] | ... | [X] | [N] |

### Sensitivity
[robust|fragile] — [reasoning; if fragile, name which criterion's ±20% shift flips the top option]

### Shortlist
1. [option] — [weighted total] — [one-line rationale]
2. ...
```

## Step 9 — Present and hand off

Present the shortlist to the user. State, verbatim:

> Top option is [X]. It is [robust|fragile] to weight changes. Feed to product-brief or pick directly.

Then route:
- If downstream target is product-brief — hand the shortlist off for product-brief consumption.
- If downstream target is direct implementation — the user picks from the shortlist.
- If downstream target is team vote — hand the shortlist off as the voting slate.

Do not pick for the user. The matrix informs; the user decides.

## Stop conditions

- **DECISION READY:** Shortlist produced, sensitivity checked, presented to user with the verdict sentence.
- **BLOCKED — options too vague:** One or more options cannot be scored against any criterion without guessing. Ask the user to sharpen each vague option to a one-line definition. Resume at Step 2.
- **BLOCKED — criteria conflict irreconcilably:** Two criteria are inverse proxies for the same dimension (e.g., impact vs effort where effort is defined as inverse impact) and the user cannot reconcile them. Flag the conflict, name the two criteria, and stop. Do not score against a contradictory set.
- **SINGLE OPTION:** Only one viable option survives scoring (the rest score below a defensible threshold or the user eliminates them). Declare it the winner, skip ranking, state the one-line rationale, and hand off.

## Agent fleet mapping

Dispatch per step; solo mode runs steps sequentially. The steps dispatch by role.

- **Analyst** (Step 5 — scoring): if a fleet is available, dispatch a review-capable agent to score options against criteria, with each option definition and the criteria set as context. The agent returns scores with one-sentence justifications. It does not set weights or ranks.
- **Orchestrator** (Step 6 — matrix computation): if a fleet is available, dispatch a flow-capable agent to compute weighted totals and ranks from the scores and normalized weights. Pure computation — no judgment.

Solo mode: one agent or human performs Steps 1-9 sequentially. No fleet required.

## Verification checklist

Before declaring DECISION READY:

- [ ] All options scored against all criteria
- [ ] Every score has a one-sentence justification
- [ ] Weights normalized to percentages (sum to 100%)
- [ ] Weighted totals computed and correct
- [ ] Sensitivity check performed (±20% weight shift)
- [ ] Sensitivity verdict stated (robust or fragile, with reasoning)
- [ ] Shortlist is top 3-5 (or single winner if applicable)
- [ ] Each shortlist item has a one-line rationale
- [ ] Shortlist presented to user with the verdict sentence