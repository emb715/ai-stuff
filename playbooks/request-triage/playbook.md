Route a raw request to the correct planning artifact — spec paradigm (quick-spec, issue-to-ready-specs) or plan paradigm (raa, build-to-release) — based on execution model and scope. Produce a routing decision, not a plan or spec. Do not execute the chosen artifact.

## Trigger

A raw request arrives (feature idea, issue, change request, bug report) and the consumer doesn't know which planning playbook to run. The input is `{{REQUEST}}`. The output is a routing decision naming the target artifact and what to feed it.

If the consumer already knows which playbook to use, skip triage and run it directly.

## Preconditions

- A raw request (`{{REQUEST}}`) — text or issue number
- The user is available to answer 2-3 routing questions (execution model, scope)

## Step 1 — Parse the request

Identify what kind of request this is. Read `{{REQUEST}}` and classify:

- **Feature** — a new capability to build
- **Bug** — broken behavior to fix
- **Change** — a modification to existing behavior
- **Issue** — a tracked item (issue number or link, possibly multi-story)
- **Idea** — early-stage, needs full lifecycle
- **Too many options** — convergence needed before planning

State the classification in one line: `Request type: [type] — [one-sentence summary]`.

If the request is too vague to classify (no actionable content, ambiguous subject), emit BLOCKED — ask for clarification, do not guess.

## Step 2 — Determine execution model

Ask the user:

> Will this be implemented by a single agent/human in one session, or by a fleet of agents in parallel?

- Single agent/human → **spec paradigm** (quick-spec, issue-to-ready-specs)
- Fleet → **plan paradigm** (raa, build-to-release)

If the user cannot answer or is unsure, default to **spec paradigm** — single agent is the safer default. Record the default in the routing decision's rationale.

## Step 3 — Determine scope

Ask the user:

> Is this a single feature, a multi-story issue, or something needing phased execution across a fleet?

- Single feature, rough description → **quick-spec** (spec paradigm)
- GitHub issue, multi-story → **issue-to-ready-specs** (spec paradigm)
- Feature request needing phased execution → **raa** (plan paradigm)
- Idea needing full lifecycle → **build-to-release** (plan paradigm)

## Step 4 — Check composability

If the user has a validated design doc set at `docs/design/<feature-slug>/` (PRD+RFD+NRFD+Tech Spec), the design docs are the authoritative input — do not fall through to the specs check. Route per the Step 2/3 paradigm decision: spec paradigm → quick-spec with the Tech Spec as input; plan paradigm → raa with Tech Spec + RFD as input. The existing specs check (below) fires only if no design doc set exists.

If no design doc set exists, and the user already has specs (from quick-spec or issue-to-ready-specs) and wants fleet execution, route to **raa**. The specs become raa's feature description input — specs feed plans, not the reverse.

If no design doc set exists, and the user has specs and wants single-agent execution, no re-routing needed — the specs are already implementation-ready.

## Step 5 — Check for convergence need

If the request is "I have too many options", "I need to decide between X and Y", or otherwise expresses unresolved choice rather than a buildable request, route to **decision-making** first. The decision-making output becomes the input to the planning artifact chosen in the next triage pass.

Convergence precedes planning. Do not route a convergence request to a planning artifact.

## Step 6 — Produce the routing decision

Synthesize Steps 1-5 into a single routing decision. Emit the contract below, filling every field. Do not leave placeholders.

```
## Routing Decision — [request summary]
**Target artifact:** [playbook name]
**Paradigm:** [spec | plan | convergence]
**Why:** [one sentence — which routing rule fired]
**Input to feed:** [what the target artifact needs as input]
**Next:** [run the target artifact]
```

## Stop conditions

- **ROUTED:** Routing decision produced. Target artifact named, paradigm declared, rationale given, input specified.
- **BLOCKED:** Request too vague to route. Ask for clarification; do not guess. Do not produce a routing decision with a guessed target.
- **AMBIGUOUS:** Both paradigms apply and the user cannot disambiguate. Default to **spec paradigm** — specs compose into plans (run raa on the specs), plans don't decompose into specs. Record the default in the rationale.

## Verification checklist

Before declaring ROUTED:

- [ ] Request parsed and typed (feature, bug, change, issue, idea, too many options)
- [ ] Execution model determined (single agent/human vs fleet)
- [ ] Scope determined (single feature, multi-story, phased, full lifecycle)
- [ ] Composability checked (existing specs + fleet → raa)
- [ ] Convergence need checked (too many options → decision-making first)
- [ ] Routing decision produced with target, paradigm, rationale, and input