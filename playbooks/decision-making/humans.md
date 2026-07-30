# humans.md — Decision-Making (Convergence)

## What this is

A convergence playbook using multi-criteria decision analysis to rank a set of options down to a shortlist with rationale. It sits between brainstorming (which diverges to produce options) and product-brief (which converges on a single direction). The playbook is the bridge: take N, return a ranked 3-5 with a robustness verdict.

## Why it works

- **Forced scoring with justification prevents hand-waving.** Every score carries a one-sentence reason. A score that cannot be justified in one sentence is a score the scorer does not actually understand — and the user should not trust it.
- **Sensitivity check prevents false confidence in fragile rankings.** A weighted-total ranking that flips under a ±20% weight shift is not a conclusion; it is an artifact of the weights the user happened to pick. Stating "fragile" stops the user from treating a coincidence of weights as a decision.
- **User-controlled criteria and weights keep the decision theirs, not the agent's.** The agent offers defaults and scores; the user defines what matters and how much. The matrix informs; it does not decide.

## Design decisions

- **Default criteria (impact / effort / novelty / risk)** were chosen as the minimal set covering the four axes most decisions actually depend on: value (impact), cost (effort), differentiation (novelty), and uncertainty (risk). Fewer misses a dimension; more risks overcomplicating a process meant to converge, not diverge.
- **±20% sensitivity threshold** was chosen as the point where weight assumptions start mattering more than the scores themselves. Below that, weight choices are quibbles; above that, the ranking is genuinely weight-dependent and the user should know. The number is a judgment call, not a derivation — if real use shows it is too tight or too loose, adjust and note it here.
- **Shortlist is 3-5, not 1**, because the user makes the final pick, not the matrix. Producing a single "winner" overstates what a weighted score can support and hides the second and third options the user might legitimately prefer on grounds the criteria did not capture.
- **Score direction is stated per criterion, not assumed.** Impact and novelty score higher-is-better; effort and risk score higher-is-worse by default. Stating this explicitly prevents the most common scoring error (treating a high effort score as a good thing) and lets the user redefine direction without ambiguity.
- **No voting or consensus mechanism.** This playbook serves a single decision-maker (or a single agent acting for one). Multi-stakeholder decisions need a different process; bolting one on here would dilute the convergence job.

## Origin

Created to fill the gap brainstorming explicitly flagged in its Related artifacts section: "A natural companion would be a 'decision-making' playbook for when brainstorming produces too many options and the user needs structured selection — not yet authored." This playbook is that companion.

## Fleet role mapping (reference)

This playbook was authored under the ndv fleet; the role names below are functions, not fleet members. **Solo mode (one agent or human) is the default — no fleet needed.** The role mapping is here for fleets that want to dispatch.

- **Analyst** (Step 5, scoring) → `ndv-review` — review-capable agent that scores options against criteria with justification. It scores; it does not weigh or rank.
- **Orchestrator** (Step 6, matrix computation) → `ndv-flow` — flow-capable agent that computes weighted totals and ranks. Pure computation; no judgment.

Steps 1-4 and 7-9 are conversational and do not benefit from fleet dispatch.

## Known gaps

- **Doesn't handle multi-stakeholder decisions.** No voting, consensus, or preference-aggregation mechanism. A team decision needs a different process.
- **Doesn't handle interdependent options** (A enables B, or A and B only make sense together). The playbook scores options independently. Dependencies should be flagged in the shortlist rationale, but the scoring itself is blind to them.
- **Doesn't handle criteria that can't be known until implementation** (e.g., "will users adopt this"). The playbook asks the user to flag such criteria as "unknowable pre-implementation" and exclude them from scoring, but this is a workaround — the real answer is unknown, and the matrix should not pretend otherwise.
- **±20% sensitivity threshold is a judgment call, not derived.** If real use shows it is too tight (ranks declared fragile that are actually stable) or too loose (ranks declared robust that flip easily), the threshold should be revised and noted here with the evidence.
- **Default criteria may not fit every domain.** A hiring decision, a vendor selection, and a technical architecture choice all have different natural criteria. The defaults are a starting point; the playbook expects the user to override them, but does not yet provide domain-specific default sets.