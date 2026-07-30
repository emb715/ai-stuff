# humans.md

## What this is

A router that disambiguates the vault's two planning paradigms (spec vs plan) for a raw request. Given a feature idea, issue, change request, or bug report, it asks two questions — execution model (single agent/human vs fleet) and scope (single feature vs multi-story vs phased) — and names which planning playbook to run. It does not execute; it routes.

## Why it works

The vault has two routes from a raw request to implementation-ready work:

- **Spec paradigm** (quick-spec, issue-to-ready-specs) — produces a spec describing WHAT to build. Consumer: a single agent or human implementing in one session.
- **Plan paradigm** (raa, build-to-release) — produces a plan describing HOW to build (phased, file-scoped, handoff ledger). Consumer: a fleet orchestrating parallel agents.

Without a router, the consumer must know which paradigm to use by reading each artifact's README. The router replaces that read with two questions that determine the route directly.

Defaulting to spec paradigm when ambiguous is safe because the composition direction is one-way: specs compose into plans (run raa on the specs), but plans don't decompose into specs. A spec-first decision is recoverable; a plan-first decision when the work was actually single-agent is wasted overhead.

## Design decisions

- **The router does NOT execute.** It only routes. This keeps it a thin dispatcher, not a heavy orchestrator. Execution belongs to the target playbook.
- **The two-paradigm fork is preserved, not unified.** The paradigms serve genuinely different execution models (single agent vs fleet). Unifying them would force one model to pay the other's overhead. The router chooses between them; it does not collapse them.
- **Default-to-spec on ambiguity.** Specs compose into plans; plans don't decompose into specs. The recoverable direction is the safe default.
- **Convergence precedes planning.** "I have too many options" routes to decision-making first, then re-triages. A convergence request is not a buildable request and must not reach a planning artifact.
- **Option C, not Option B.** This router is Option C from the parallel-planning resolution: a convenience dispatcher for when the consumer doesn't want to read the READMEs. Option B — explicit differentiation in each paradigm's README — is the primary structural fix and is being applied separately. This router is the secondary UX convenience layer.

## Origin

Created to resolve the vault's two parallel planning paradigms (spec vs plan) that weren't explicitly differentiated. The README differentiation (Option B) is the structural fix; this router is the UX convenience for consumers who arrive with a raw request and don't want to read both paradigm READMEs to decide which applies.

## Fleet role mapping

Authored under the ndv fleet. Solo mode is the default — the router is a single-agent decision, no fleet needed. The fleet becomes relevant only downstream, when the routed target (raa, build-to-release, implementation-orchestration) executes.

## Known gaps

- **Relies on user answers.** The router asks the user 2-3 questions (execution model, scope, composability). It could be made fully automatic if the request carries enough metadata (issue labels, story count, fleet flag). Currently it depends on user input.
- **No re-routing mid-execution.** If the user changes their mind about execution model or scope after the target artifact has started, the router does not detect this. The consumer must re-run triage from the start.
- **No persistence.** The routing decision lives in the conversation. If the consumer needs a record, they must save it manually.
- **Convergence detection is keyword-based.** "Too many options", "decide between X and Y" trigger decision-making. Subtler convergence signals (implicit indecision, conflicting requirements) may not be caught.