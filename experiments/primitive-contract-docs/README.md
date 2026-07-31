---
title: "Primitive Contract Docs"
status: draft
confidence: low
last_tested: 2026-07-30
scope: personal
tooling:
  - "agnostic/any-LLM"
tags:
  - experiment
  - idea
  - docs
  - contracts
  - primitives
  - code-documentation
owner: "@emb715"
---

# Hypothesis

Generated code docs rot — they describe params and signatures that drift the moment the code changes, and nobody maintains prose that paraphrases the source. What does **not** rot is the **contract** of a primitive: what it is expected to *do* (procedure, not params), what it expects as input and what it produces as output (intent, not format), and how it is expected to communicate with the rest of the system (relationships, not exports).

If each primitive / module / "particule" of software carries a small set of contract files — `AGENTS.md` (behavioral contract for actors working on it), `DECISIONS.md` (ADRs — why it is the way it is), and possibly `HUMANS.md` (maintenance context) — then every actor (human and model) stays informed of the expectation and the relationship with the rest of the system, and the thing that gets maintained is the *intent*, which changes far less often than the *implementation*.

The unit being documented is the **primitive** (same unit `prompts/repo-primitive-audit/` maps). Exports are not enough — exports show the surface, not the expected procedure or the communication obligations.

# Setup

- Conceptual experiment. No code run yet.
- Primitive = the same unit `repo-primitive-audit` identifies in a repo (governance rules, sections, lifecycle state, enforcement). See `prompts/repo-primitive-audit/prompt.md`.
- Candidate contract files per primitive:
  - `AGENTS.md` — what the primitive is expected to do, I/O intent (not param format), communication contract with the rest of the system
  - `DECISIONS.md` — ADRs for the primitive; why it exists in this shape
  - `HUMANS.md` (optional) — maintenance context and origin, mirroring the three-file artifact structure in `docs/standards/artifact-structure.md`

# Procedure

Not yet run. Planned steps:

1. Define precisely what a "primitive" is when we say "per-primitive contract" — reuse `repo-primitive-audit`'s definition or sharpen it.
2. Specify what each contract file contains and, crucially, what it does **not** contain (the "not params, not signatures" boundary is load-bearing).
3. Decide the trigger: when is a contract written, and when is it updated. The hypothesis claims the contract changes less than the code — this must be tested against a real primitive that does change.
4. Pick one real primitive in a real repo. Write its contract files. Wait for a change. Observe whether the contract held (no edit needed) or drifted (edit needed), and whether the edit was smaller than re-generating docs would have been.

# Observations

None yet — no run performed.

# Results

None yet.

# Conclusion

Inconclusive — idea stage. The core claim (contract > generated docs because intent rots slower than implementation) is plausible and aligns with how `repo-primitive-audit` already treats primitives as the structural unit, but it is untested.

# Critical reframe (recorded before going further)

Stated plainly so the idea isn't over-credited:

**This is a content guideline applied to an existing artifact pattern, not a new artifact type.** The components are known-good:
- `DECISIONS.md` = ADRs (established practice)
- per-directory `AGENTS.md` = already a spreading pattern (this repo, kcd-skills, others)
- module documentation describing responsibility = module READMEs (exist)

The packaging feels novel; the components don't. The genuinely novel part is narrower: **document procedure / intent rather than params / signatures.** That's a *content rule*, not a new file type. Calling it what it is keeps the scope honest.

## What is actually novel — and where it lives or dies

The "communication contract with the rest of the system" piece: what a module expects from callers and owes callees. This is interface contracts + dependency direction. Most teams don't do it well because it requires thinking of the system as a graph, not files.
- **If this idea works, this is why** — it forces graph thinking onto a per-module doc.
- **If it fails, this is where** — see the rot-rate leak below.

## Load-bearing problems with the core thesis

### 1. The rot-rate claim is not uniform

The thesis: "intent rots slower than implementation, so contracts are low-maintenance."
This is true for **purpose** ("this module authenticates requests") — stable, rarely edited.
This is false for **communication** ("expects caller to pass a validated token; owes callee a retry on 429") — changes every time a new caller appears or a dependency is swapped.

So the contract is not uniformly low-maintenance. **The communication layer rots at implementation speed, not intent speed** — exactly the rot the idea claims to escape. Purpose is the low-maintenance part; communication is the part that needs edits on dependency-affecting changes. Conflating the two over-sells the idea.

### 2. "Primitive" is undefined — and granularity decides everything

- Function → contract = a docstring. Nothing new.
- Service / module / package → contract = module README. This is the only granularity where the idea is genuinely novel.
- Smaller dilutes to docstrings; larger dilutes to architecture docs.

**Pin "primitive" to module/package, or the idea dilutes.** Leaving it open is the easy way to make the idea sound broader than it is.

### 3. Insertion point is the real adoption blocker, not the file format

ADRs work because they're written **at decision time, by the decider.** A contract written *after* a primitive already exists is archaeology — describing what the code does, which is the generated-docs failure the idea rejects.

So the contract must be written **before or during** creation, by whoever defines intent. That's a workflow constraint, not a doc constraint. If a team (or a solo flow) has no "define intent before coding" step, this idea has nowhere to attach. **The format is not the blocker; the missing workflow step is.**

### 4. Three files is over-engineered until one file is proven

`AGENTS.md` + `DECISIONS.md` + `HUMANS.md` per primitive is heavy. ADRs usually live in a central `decisions/` dir rather than per-module — splitting them per primitive fragments decisions that span primitives (which is most of them).
- **MVP = one contract file per primitive.** Decide file count *after* the one-file form is tested against a real change.
- ADRs likely stay centralized; the per-primitive file references them, doesn't duplicate them.

## Verdict (stated honestly)

Could work, under three conditions:
1. "primitive" pinned to module/package
2. contracts written at creation time, not after
3. accept that the communication layer rots at code speed and will need edits on dependency-affecting changes

Under those, it's a sound refinement of existing practice (ADR + module README + AGENTS.md) unified under one content discipline ("document intent and communication, not params"). Without those, it's repackaged docstrings that rot.

## The communication-layer fork (the unsolved core)

The reframe flagged that the communication layer rots at code speed, which breaks the "intent rots slower" thesis for that part of the contract. Two ways out — and they contradict, so one must be chosen.

**Bet A — accept the rot, scope it down.** Keep communication in the contract, but only the *stable* parts: dependency direction (may call X, must not call Y), owned vs borrowed state, sync vs async expectation, entry/exit invariants. These change rarely — only on architectural shifts. Drop the volatile parts (specific retry rules, exact error shapes, param-level details) — those belong in code/tests, not the contract. The contract becomes "the rules a new caller must respect to not break the system," which is genuinely stable.
- Rescues the rot-rate claim *for the subset that stays in the contract*.
- Cost: the contract is less complete; a reader still needs the code for specifics. But that was always true — the contract was never the code.
- Honest to the original idea ("communication with the rest of the system" is the novel part).

**Bet B — move communication out of the contract entirely.** Contract = purpose + decisions only. Communication obligations live in a separate artifact (interface spec, type defs, tests-as-spec) that's allowed to rot at code speed because it's generated or checked, not hand-written.
- Cleaner fit to the rot-rate thesis — the hand-written contract only contains slow-rotting stuff.
- Cost: splits the idea back into multiple files (reframe argued against this), and concedes that "communication contract" was never the low-maintenance win — it amputates the novel part to save the thesis.

**Contradiction:** cannot have both a single hand-written low-rot contract *and* a full communication spec. Pick one.

**Current lean: Bet A.** The original idea's value is the communication piece — that's the novel part. Scoping it to *stable* communication rules keeps it hand-written and low-rot, and concedes that volatile specifics belong elsewhere (code/tests). Bet B preserves the thesis but amputates the novel part to save it. To be tested against examples before locking in.

## Stress-testing the fork against examples

Three concrete modules, run against Bet A and Bet B. The examples exposed a sharper discriminator than the fork itself — see "Obligation vs mechanism" below.

### Example 1 — auth middleware

Purpose (stable, either bet): "Validates requests before they reach protected handlers. Rejects unauthenticated or expired sessions."

Communication, volatile way (loses Bet A, fine for Bet B): "Calls `sessionStore.get(token)`, expects `{ userId, expiresAt }` or `null`. On null returns 401. On expiry returns 401 with `WWW-Authenticate: Bearer`."

Communication, Bet A way: "May read session state; must not write. Synchronous expectation — handlers assume auth is resolved before they run. Rejects by short-circuiting the request; never calls handler code on failure. Owns the 401 response shape; handlers must not redefine it."

**Change applied:** add refresh-token rotation.
- Volatile version: breaks. `get(token)` becomes `get(token, { rotating: true })`, response shape and error codes change. Contract must be rewritten. Rot at code speed — the failure Bet A predicted.
- Bet A version: holds. Still reads session state, still doesn't write, still short-circuits, still owns the 401 shape. **Contract stayed valid through an implementation change.** Bet A wins.

### Example 2 — payment processing module

Purpose: "Charges a customer for an order. Idempotent on `order_id`."

Communication, volatile: "Calls `stripe.charge({ amount, currency, customer, idempotency_key: order_id })`. On `card_declined` throws `PaymentError(code='card_declined')`. On network failure retries 3x with exponential backoff."

Communication, Bet A: "May call external payment provider. May *not* call order or inventory modules — those are upstream of payment. Owns the set of retryable failures; callers must treat non-retryable failures as terminal and must not retry themselves. Side effects: a successful charge mutates external provider state; idempotency is the contract's responsibility, not the caller's. Side effects are not transactional with local DB writes — callers must not assume local commit implies charge success."

**Change applied:** switch Stripe → different provider; add new payment method.
- Volatile version: breaks entirely — new provider, new error codes, new retry semantics. Rewrite.
- Bet A version: holds. Still calls external, still doesn't call upstream modules, still owns retryability, still not transactional with local writes. **The rules a caller must respect are unchanged.** Bet A wins.

Caller-relevance check: a handler author needs to know — "if `charge()` fails, do I retry? Do I surface to the user? Is my local DB write safe?" Bet A answers all three (don't retry; surface terminal failures; local write not co-committed). **That's exactly the knowledge a caller needs, and it survived a provider swap.** The volatile specifics (Stripe error codes) were not what the caller needed — they needed the obligations.

### Example 3 — the stress case: logging/telemetry module

Purpose: "Records structured events for observability."

Communication, Bet A (first attempt): "May be called from anywhere, including modules that must not call anything else (error handlers, shutdown paths). Must not itself call back into business logic. **Sync interface**, but writes are fire-and-forget — callers must not depend on flush completing before they proceed."

**Change applied:** sync file writes → async batched network sends.
- Bet A first attempt: **breaks.** "Sync interface" flips. Caller code relying on "log line written before next statement" now has a different guarantee.

Was Bet A wrong, or was the contract wrong? **The contract was too specific.** "Sync interface" is an implementation mechanism, not a communication obligation. The actual obligation — "callers must not depend on flush before proceeding" — survived. The contract *should have been* "loggers are fire-and-forget; ordering across calls is not guaranteed," which survives the sync→async swap.

So Bet A still holds, but **only if the contract is written at the obligation level, not the mechanism level.** This is a skill discipline, not a format rule.

### What the examples exposed: obligation vs mechanism

The fork (Bet A vs Bet B) turned out to be the wrong axis. Both bets break at the mechanism level; both hold at the obligation level. The real discriminator is:

- **Obligation** — what a caller must respect, what the module owns, what invariants hold across calls. Rotates slowly. Survives implementation swaps.
- **Mechanism** — how the module does it: specific providers, sync/async, exact call signatures, error codes, retry counts. Rotates at code speed.

The rot-rate thesis is now precise: **obligations rot slower than mechanisms, because mechanisms are what changes.** The original "intent rots slower than implementation" claim was right but underspecified — it's not purpose vs communication (both have obligations and mechanisms). It's obligation vs mechanism, everywhere in the contract.

Implication for the content rule: **document caller obligations, not implementation mechanisms.** "Must not depend on flush ordering" is an obligation (survives async swap). "Sync interface" is a mechanism (rots on async swap). "Owns the set of retryable failures" is an obligation (survives provider swap). "Retries 3x with exponential backoff" is a mechanism (rots on retry-policy change).

This subsumes the Bet A / Bet B fork. Bet B (move communication out) doesn't solve the obligation/mechanism problem — a separate interface spec at mechanism level rots just as fast. The fix is the content discipline, not the file split. **Lean updated: Bet A, with the obligation/mechanism rule as the load-bearing content discipline.** Bet B is not rejected, just unnecessary — it solves a problem the content rule already solves.

## Tooling note (parked, not in scope)

The tool is deliberately not a generator. A generator that produces the contract from the implementation just regenerates param-docs with extra steps — the contract will mirror the code and rot with it. The contract has to come from the person who decided the intent, captured at decision time. Tooling earns its keep at drift detection and missing-contract detection, both *after* the hand-author test passes.

# Open questions

- What exactly lives in `AGENTS.md` for a primitive vs the repo-root `AGENTS.md`? Naming collision needs resolution (rename one, or scope by directory).
- Does `HUMANS.md` per-primitive duplicate the three-file artifact convention, or is it a different thing? `docs/standards/artifact-structure.md` defines `humans.md` for consumable artifacts — a code primitive is not an artifact in that sense.
- What is the minimum viable contract — one file or three? (Reframe says: one, until proven otherwise.)
- How does this relate to `experiments/change-impact-diagram/`? That experiment diagrams impact *on* primitives; this documents the primitive's *own* contract. Likely complementary: the impact diagram's "plan vs actual" needs a contract to compare against.
- Does the contract get written by a human, generated by `repo-primitive-audit`, or both? (Reframe says: human, at creation time. Audit produces a map; contract is a different artifact.)
- **New from reframe:** what is the "define intent before coding" step that this idea attaches to? If there isn't one in the target workflow, the idea has no insertion point.
- **New from reframe:** how to keep the communication layer honest without making it as rot-prone as the param-docs it replaces? This is the unsolved core. (See "The communication-layer fork" — Bet A vs Bet B, current lean A, untested.)
- **New from examples:** the obligation/mechanism rule is load-bearing — how is it enforced? A contract author writing "sync interface" thinks they're writing an obligation. The discipline is non-trivial. Open: is this a lint rule, a review step, or just a skill that authors internalize?
- **New from examples:** is there a known name for this content discipline in existing software practice? (Surveyed in the next section — closest are DbC, ADRs, C4, AGENTS.md pattern; none combine co-located + obligation-only + living + creation-time + maintained-on-obligation-change.)
- **New from survey:** since this is a curation of existing concepts (not new), adoption framing matters — pitch as "obligation layer of DbC, co-located like AGENTS.md, maintained like ADRs," not as a new doc type.
- **New from Cut A (WHO):** the contract serves three readers (caller, modifier, newcomer) with different needs. Which reader wins when their needs conflict? Obligation/mechanism doesn't resolve this — it's the same multi-audience problem module READMEs already have unsolved.
- **New from Cut B (WHERE):** which obligations are per-module vs system-level? System obligations (trace context, auth propagation, error-handling policy) forced into per-module contracts either duplicate (rot risk × N) or reference a central doc (Bet B sneaking back in). Where do system-level obligations live?
- **New from Cut C (WHEN):** the idea silently assumes Trust model A (contract authoritative, code suspect). If the enforcement discipline (open question above) isn't real, the contract degrades to Trust model B (advisory README) and the idea collapses to "module READMEs with better content guidelines." The trust model must be explicit, not assumed.

# Existing names for intent-over-mechanism docs

Before claiming novelty, survey what already exists for communicating software intent to LLMs (and humans). The obligation/mechanism distinction maps onto several established concepts — none are identical, all overlap.

**Design by Contract (Meyer, Eiffel).** Closest match. Preconditions, postconditions, invariants — these are obligations, not mechanisms. Preconditions = caller obligations; postconditions = module obligations; invariants = system-level rules. The contract is asserted and checked at runtime, not documented in a side file. **Gap from this idea:** DbC is code-level (per-method, executable), not module-level (prose, non-executable). DbC also historically focused on correctness predicates, not communication direction/ownership/side-effect rules. But the *philosophy* is the same: obligations over mechanisms.

**Module interface documentation / API docs (OpenAPI, gRPC .proto, TypeDoc, rustdoc).** These describe the surface — signatures, types, error codes. All mechanism. They rot at code speed because they're generated from or tightly coupled to the code. **This is the thing the idea rejects.** OpenAPI specs are the canonical example of mechanism-level docs that drift the moment an endpoint changes.

**Architecture Decision Records (ADRs).** Capture *why* a decision was made, at decision time, by the decider. Pure intent. Low rot. But scoped to decisions, not to ongoing module behavior — an ADR records "we chose async over sync because X," it doesn't record "callers must not depend on flush ordering." **The idea's `DECISIONS.md` is literally ADRs.** The novel part is the *behavioral contract*, not the decisions.

**RFCs / design docs (Rust, Python, internal tech specs).** Capture intent at design time. Often rot because they're written once and not maintained as the module evolves. Closest in spirit to the idea, but typically one-shot (written before implementation) and not co-located with the module. **The idea's difference:** the contract is living and co-located, updated when obligations change (which is rare).

**C4 model (context, containers, components, code).** Architecture documentation framework. The "container" and "component" levels describe module responsibilities and dependencies — obligations, not mechanisms. **Closest structural analog** to what the idea proposes, but C4 is diagram-first and maintained separately from code; it doesn't co-locate a prose contract with each module.

**AGENTS.md / CLAUDE.md / cursor rules / .cursorrules / copilot-instructions.** Emerging pattern: per-directory instruction files that tell an LLM how to behave when working in that scope. **This is the artifact pattern the idea rides on.** Current usage is mostly behavioral ("use these conventions, run these tests"), not contractual ("here are the obligations this module's callers must respect"). The idea extends the *pattern* with *contractual content*.

**`README.md` per module.** The baseline. Most module READMEs mix mechanism and obligation unevenly. The idea's content rule (obligation-only) is a discipline that could be applied to a module README without inventing a new file type — which loops back to the reframe: this is a content guideline on an existing artifact.

**Self-contained systems / microservice interface contracts.** In distributed systems, services publish contracts (often via schema registries, OpenAPI, or protobuf). These are mechanism-heavy and rot fast. The obligation layer (SLAs, ownership boundaries, call-direction rules) is usually in a separate architecture doc, not co-located. **The idea merges these two layers into one co-located file, keeping only the obligation layer.**

### What's actually novel after the survey

Not the artifact pattern (AGENTS.md / README exists). Not ADRs (established). Not DbC philosophy (decades old). Not C4 (exists).

The novel combination: **a co-located, obligation-only, living contract for a module's communication rules, written at creation time, maintained only when obligations change.** No single existing practice does all five. The closest (C4 component docs) is separate-from-code and diagram-first; the closest (DbC) is code-level and mechanism-checkable; the closest (ADRs) is decision-scoped not behavior-scoped.

The idea is a *curation* of existing concepts into a specific artifact, not a new concept. That's still worth doing — curation is how practice spreads — but it should be pitched as "the obligation layer of DbC, co-located like AGENTS.md, maintained like ADRs," not as a new kind of doc.

## Three more cuts at the problem (obligation/mechanism is necessary, not sufficient)

The obligation/mechanism rule is one cut and it holds, but three more expose failure modes it doesn't catch. The real idea has **four** load-bearing rules, not one — see "Updated load-bearing rules" at the end.

### Cut A — WHO is the reader

Obligation/mechanism assumes a single reader: "a caller who needs to know the rules." But there are at least three distinct readers, and they need different things:
- A **caller** needs obligations (what to respect).
- A **modifier** needs intent + decisions (why it's this way, what it's for) — so they don't break the purpose when changing the mechanism.
- A **newcomer** needs purpose + map (what this is, where it sits) — so they can orient at all.

A contract optimized for callers ("don't depend on flush ordering") tells a modifier almost nothing about *why* flush ordering was ever a question. A contract optimized for modifiers (full ADR history) buries the one line a caller needs. **The obligation/mechanism rule doesn't resolve which reader wins when their needs conflict.** This is a real gap — the contract is serving multiple audiences with one document, and that's the same problem module READMEs already have unsolved. Naming it as an open question, not pretending obligation/mechanism covers it.

### Cut B — WHERE the contract lives relative to the mechanism change

Co-location ("co-located with the module") has a hidden cost: when a cross-cutting obligation changes (say, "all modules must propagate trace context"), you have to edit N co-located contracts in N places. A centralized doc edits one. Co-location optimizes for the *local* reader at the cost of the *system-level* obligation. **Some obligations are system-level and don't belong in any one module's contract.** Trace context, auth propagation, error-handling policy: these are system obligations, and forcing them into per-module contracts either duplicates them (rot risk × N) or references a central doc (which is just Bet B sneaking back in). Open: which obligations are per-module vs system-level, and where do the system-level ones live?

### Cut C — WHEN the contract is allowed to lie

Hard truth: in real codebases, the contract will sometimes be wrong — a refactor changed an obligation, the contract wasn't updated, now it's a lie. Two trust models:
- **Trust model A — contract authoritative, code suspect.** A diff that contradicts the contract is a bug in the code (or a flagged contract update needed). This is what the idea assumes.
- **Trust model B — code authoritative, contract advisory.** When they conflict, the code wins; the contract is stale. This is what actually happens in practice with module READMEs today.

The idea silently assumes Trust model A. But model A is only safe if contract updates are cheap and reliable — which loops straight back to the obligation/mechanism discipline, which is unsolved (open question: lint rule, review step, or internalized skill?). **If the discipline isn't enforced, the contract degrades to Trust model B (advisory README), and the idea collapses to "module READMEs but with better content guidelines."** That's still something, but it's not the contract claim. The trust model needs to be explicit, not assumed.

### Updated load-bearing rules (four, not one)

1. **Obligation over mechanism** (content discipline)
2. **Pinned to module/package** (granularity)
3. **Written at creation time** (insertion point)
4. **Explicit trust model + enforcement discipline** (otherwise it degrades to advisory README)

Rule 4 is the new one from the cuts. Without it, rules 1-3 are aspirational. The pitch is now "obligation layer of DbC, co-located like AGENTS.md, maintained like ADRs, with an explicit trust model and enforcement" — four pieces, not one.

## Additional LLM-era names for intent-over-mechanism docs

The first survey covered DbC, ADRs, C4, AGENTS.md, RFCs, module READMEs, microservice contracts. Five more that are actually LLM-era or under-covered:

**`.windsurfrules` / `.aiderignore` / repomack-included files.** The "feed the LLM the right context" pattern. These are *inclusion* artifacts, not *intent* artifacts — they say "read this" not "this means X." Different problem. Worth noting: the LLM-tooling world is currently solving *context selection*, not *intent encoding* — which is exactly the gap this idea sits in.

**`spec.md` / Gherkin `.feature` files (BDD).** "Given/When/Then" specs are obligation-level — they describe behavior expectations, not implementation. Gherkin is the closest *executable* form of obligation-level docs. **Gap from this idea:** Gherkin is per-scenario, not per-module; it captures specific behaviors, not the module's role in the system. But the content discipline (behavior, not mechanism) is the same. A per-module contract could be seen as "Gherkin for the module's *role*, not its *scenarios*." Clean analogy for pitching.

**Arc42 / C4 + ADR templates.** Structured architecture doc templates. Arc42 explicitly separates "building block view" (obligations) from "runtime view" (mechanisms). **This is the formalized version of the obligation/mechanism cut, already standardized.** The idea is essentially: "take the arc42 building-block-view section, shrink it to one module, co-locate it." Sharper pitch than "obligation layer of DbC" — arc42 is the closer analog than DbC for the *structural* piece. DbC is the closer analog for the *content discipline*. Both belong in the pitch.

**TLA+ / Alloy / formal specs.** Pure intent, machine-checked, obligation-level. Overkill for 99% of modules. But they prove the ceiling: obligation-only specs *can* be rigorous. The idea is "TLA+ but prose and co-located" — trading rigor for adoption. Honest framing: dropping the checkability of formal specs to get co-location and low-effort. That trade is the whole reason it might actually get used.

**`.cursor/rules/*.mdc` (Cursor's per-rule context files).** Newest entrant. Per-file context rules with frontmatter (description, globs, alwaysApply). **Current state-of-the-art of the AGENTS.md pattern.** Still behavioral/convention, not contractual — but the *infrastructure* (per-scope, glob-targeted, metadata-fronted) is exactly what a per-module contract would ride on. The idea could be pitched as "`.cursor/rules` but for module *contracts* instead of editor *conventions*." Concrete and current.

## Updated pitch framings (audience-dependent)

- **For architecture folks:** "arc42 building-block view, shrunk to one module and co-located." They know arc42.
- **For LLM-tooling folks:** "`.cursor/rules` but for contracts, not conventions." They know Cursor rules.
- **For explaining the content discipline (any audience):** "Gherkin for a module's role, not its scenarios."

## Test bed: snapberry.ai

Survey of an existing repo surfaced that snapberry already implements a large chunk of this idea — and has solved three of the four open questions in ways the experiment hadn't. This makes it the first real test bed, not a blank target.

### What snapberry already does (mapped to the four load-bearing rules)

| Experiment rule | Snapberry's existing answer | Status |
|---|---|---|
| 1. Obligation over mechanism | `docs/contributing-boundaries.md` AGENTS.md format: "Does / Does NOT / Key entry point / To touch / Decisions". Does NOT is mandatory. | Partial. Obligation framing is in the structure; existing files still lean mechanism (list exported symbols, file paths, test names). |
| 2. Module/package granularity | `docs/architecture.md` module map — one row per `src/<module>/`: Purpose / Owns / Does NOT own / Key entry point / Allowed imports. 12 boundaries + `mcp/tools` sub-boundary. | Done. |
| 3. Written at creation time | `contributing-boundaries.md` Step 5: ADR at decision time, by decider. AGENTS.md via test-first workflow (Step 3 before Step 4). | Done for ADRs. |
| 4. Explicit trust model + enforcement | Boundary enforcement tests assert surface completeness + containment + ADR existence + ADR status. Contract is authoritative (Trust model A) *because the test fails on drift*. | Done — and this is the part the experiment had unsolved. |

### What snapberry already does that the experiment hadn't named yet

- **System-vs-per-module obligation split (Cut B):** handled via the module map's "Allowed imports / dependencies" column. Directional rules (`shared` at base; orchestration above domain) live in centralized `architecture.md`, referenced per-boundary. Not Bet B sneaking back in — it's the explicit right tool for system obligations.
- **Rot via drift (Cut C):** `contributing-boundaries.md` documents a real case study — the `routing-table.md` drift (3 sources of truth, no enforcement, 3 missing tools, 3 hidden tools advertised). The fix was the enforcement-test pattern. Real evidence, not speculation.
- **"AGENTS.md before enforcement test" anti-pattern:** explicitly called out in the boundary protocol. Quote: "Produces accurate docs for one sprint, then drift. The test is what keeps the doc honest, not the intention to keep it honest."

### What snapberry does NOT do (the experiment's remaining value)

Three real gaps, in order of importance:

**Gap 1 — obligation purity.** Existing AGENTS.md files mix obligation and mechanism. `indexer/AGENTS.md` "Does": "Symbol extraction via tree-sitter adapters — TypeScript, Python, Rust, Go (`parsers/`)". That's mechanism (tree-sitter, parsers, file path). The obligation is "extracts symbols so other boundaries don't parse source." `shared/AGENTS.md` "Does" is the worst offender — lists SSRF DNS pinning, IPv4-mapped IPv6 detection, redirect re-validation. Those are mechanism. The obligation is "makes outbound fetches safe from SSRF; callers may use `safeFetch` without re-implementing protection." Move mechanism to ADRs or code comments; keep obligation in the contract. Enforcement test should check the obligation holds (SSRF guard rejects reserved ranges), not that the doc lists every check.

**Gap 2 — communication rules between boundaries.** AGENTS.md says what a boundary owns/doesn't own, not the communication contract — what callers must respect, what the boundary owes callees. `indexer/AGENTS.md`: "Does NOT decide when to reindex — `watcher/change-handler.ts` owns trigger policy" is an ownership claim, not a communication obligation. The experiment's novel part (caller obligations: "callers must not depend on X", "owns retryability", "side effects are not transactional with local DB writes") is largely absent. Snapberry documents *what each module is*; the experiment documents *how they're allowed to talk to each other*. Different axis.

**Gap 3 — cross-boundary contract as a first-class artifact.** `docs/tool-contracts.md` does this for the MCP tool surface (routing rules, forwarding behavior, reachability matrix). But it's tool-level, not module-level. No per-module "communication contract" file exists. The module map's "Allowed imports" column is the closest, but it's a dependency-direction rule, not a full communication contract (no retry ownership, no side-effect rules, no invariant obligations).

### Specific suggestions for snapberry

1. **Tighten the existing AGENTS.md content rule — obligation, not mechanism.** Strip mechanism out of "Does" across `indexer/`, `shared/`, etc. Move implementation detail to ADRs or code comments; keep obligation in the contract. Highest-value, lowest-risk — content pass on existing files, no new artifacts.

2. **Add a "Communication" section to the AGENTS.md format.** Currently: Does / Does NOT / Key entry point / To touch / Decisions. Proposed addition: a **Communication** section capturing caller obligations + owed invariants.
   - `indexer/`: "Callers may read symbols/imports/text via `IndexDb` but must not hold references across reindex events — the graph is invalidated on file change. Callers must not call `IndexEngine.indexRepository` concurrently — `watcher/` owns the trigger."
   - `shared/`: "Callers may use `safeFetch` without adding their own SSRF checks; callers must not bypass it for outbound HTTP."
   Enforce by extending the boundary test to assert the section exists and is non-empty.

3. **Do not add a separate contract file.** Snapberry already has `AGENTS.md` per boundary, `decisions/` per boundary, `architecture.md` repo-level, `tool-contracts.md` tool-level. A fifth artifact per boundary (`CONTRACT.md`) would fragment. Fold the communication contract into the existing `AGENTS.md` as a section. The experiment's "one file MVP" conclusion (reframe §4) maps onto snapberry's existing one-file AGENTS.md.

4. **Use snapberry as the experiment's first real test bed.** The Procedure step 4 candidate: pick one boundary that recently changed (the `routing-table` drift case is documented), write the obligation-only version of its AGENTS.md (Gap 1 fix + Gap 2 addition), wait for the next change, observe whether the obligation-only version held (no edit) or drifted (edit needed) and whether the edit was smaller than re-listing mechanism would have been. Converts the experiment from `confidence: low` to evidence-backed — or falsifies the rot-rate claim. Either outcome is useful.

## Where the experiment goes next, and what it should produce

### Destination

Given snapberry already implements three of four rules and the unsolved fourth (enforcement) is exactly what snapberry solved, the experiment's path forward is not "build the idea from scratch" — it's "apply the missing content discipline to an existing, enforced scaffold and observe." Two concrete outputs:

**Output A — content rule, not a new artifact.** The deliverable is a content guideline ("obligation, not mechanism") applied to snapberry's existing AGENTS.md format, plus a "Communication" section added to that format. No new file type. This is the honest framing established in the reframe: this is a content guideline on an existing artifact, not a new artifact. The experiment validates the guideline, then the guideline is what gets promoted (to `docs/standards/` or `prompts/`), not a file template.

**Output B — one rewritten AGENTS.md as evidence.** Pick one snapberry boundary. Rewrite it under the obligation-only rule with the Communication section added. Commit it. Wait for a real change to that boundary. Record whether the contract held or drifted, and whether the drift was smaller than mechanism-docs drift would have been. This is the evidence Gate 3 requires before any promotion out of `experiments/`.

### Naming

Given snapberry already uses `AGENTS.md` per boundary and the experiment's conclusion is "don't add a fifth file," the artifact already has a name in the only test bed that matters: **`AGENTS.md`**. The experiment does not produce a new named artifact; it produces a content discipline that goes *into* the existing `AGENTS.md`. Any new name (`CONTRACT.md`, `module-contract.md`, `particule.md`) competes with an established, enforced pattern and loses on adoption grounds.

The deliverable that *does* need a name is the content guideline itself, when it's promoted out of `experiments/`. Candidates, by destination:
- If promoted to `docs/standards/`: `obligation-contract-spec.md` or `module-contract-content-rule.md` — a standard describing the content discipline.
- If promoted to `prompts/`: a one-shot prompt that rewrites a module's AGENTS.md under the obligation-only rule — name TBD by `prompts/` conventions at promotion time.
- If it stays as a procedure: `playbooks/obligation-contract-authoring/` — a recurring procedure for rewriting AGENTS.md files under the discipline.

Don't name any of these now. Naming before evidence is premature. The experiment produces the evidence first; the promoted artifact's name follows its destination's convention.

### Would this improve system understanding and reduce hallucination / missed capabilities?

Honest answer, split by failure mode:

**Hallucination (model asserts something false about the system).** Partial win. An obligation-only contract reduces hallucination *about responsibility* — "the indexer decides when to reindex" is a hallucination the current `indexer/AGENTS.md` "Does NOT" section already prevents. The Communication section would extend this: "callers must not hold references across reindex" prevents a model from generating code that caches an `IndexDb` handle. But obligation-only contracts do *not* reduce hallucination about mechanism — a model that needs to know "does `safeFetch` follow redirects?" gets no answer from the obligation ("makes outbound fetches SSRF-safe") and must read the code. That's by design (mechanism rots), but it means the contract reduces *architectural* hallucination, not *implementation* hallucination. Don't oversell this.

**Misrepresentation (model describes the system as doing something it doesn't, or claims a capability that isn't there).** Direct win, and this is the strongest case for the experiment. The "Does NOT" section is the canonical misrepresentation guard — it preempts the most likely wrong assumptions ("indexer owns reindex triggers" → no, watcher does). The Communication section extends this to interaction-level misrepresentation: a model that assumes local DB write + charge are co-committed (Example 2) is misrepresenting the system's guarantees. An obligation that says "side effects are not transactional with local DB writes" prevents exactly that. This is where the contract earns its keep — not in telling the model what the system does, but in telling it what the system *does not* guarantee.

**Missed capabilities (model fails to use a capability the system has).** Mixed. Obligation-only contracts are deliberately incomplete about mechanism, so a model that reads only the contract will miss *available mechanisms* — it won't know `safeFetch` does DNS pinning, so it won't suggest using it for a DNS-rebinding-sensitive path. This is a real cost. Mitigation: the "Key entry point" section in snapberry's format already points to the code; a model that needs mechanism reads the code. The contract is the *first* read, not the *only* read. But if a workflow uses the contract as the *only* context (common in token-constrained settings), missed capabilities is the failure mode. The contract optimizes for "don't do the wrong thing" over "know every right thing." That's a deliberate trade, and it should be stated as such, not hidden.

**Net assessment.** The contract improves system understanding for *architectural* questions (who owns what, what's guaranteed, what's forbidden) and reduces misrepresentation directly. It does not improve, and may slightly worsen, *implementation* questions (how to do X, what params to pass). The honest pitch: the contract makes the model *safer* (less likely to violate an invariant) but not *more capable* (not more likely to find the right API). If the goal is reducing harmful hallucinations and misrepresentations, the contract helps. If the goal is surfacing all capabilities, the contract is the wrong tool — that's what `repo-primitive-audit` and symbol search are for. They're complementary, not substitutes.

This also sharpens the relationship to snapberry itself: snapberry's *tool surface* (the 23 MCP tools) is the capability-discovery layer; the *contract layer* (AGENTS.md + Communication section) is the safety layer. A model using snapberry gets capabilities from the tools and safety from the contracts. The experiment is improving the safety layer, not competing with the capability layer.

# Next step

The three resolution questions (insertion point, system-vs-per-module obligations, multi-reader conflict) are now partially answered by snapberry's existence:
- Insertion point: snapberry's test-first workflow is the insertion point. Confirmed by existence.
- System-vs-per-module obligations: snapberry's "Allowed imports" column in the module map is the system-level home. Confirmed by existence.
- Multi-reader conflict: unresolved by snapberry — the AGENTS.md still serves all three readers in one file. Open.

Concrete next step: run Output B (rewrite one snapberry boundary's AGENTS.md under the obligation-only rule + Communication section; commit; wait for a change; observe). This is the single action that moves the experiment from `confidence: low` to evidence-backed. Until that run is observed: stay `draft`, `confidence: low`.

## First run — `src/shared/` boundary rewrite (2026-07-30)

### What changed

Rewrote `src/shared/AGENTS.md` under the obligation-only content rule and added a `## Communication` section. Extended `src/shared/__tests__/shared-boundary.test.ts` with an assertion that the Communication section exists, is non-empty, contains obligation language (may/must/must not/owed), and does not leak mechanism (no `.ts` file paths in the Communication body). All 15 tests pass.

### What was stripped (mechanism → obligation)

| Before (mechanism) | After (obligation) |
|---|---|
| "SSRF guard (`url-safety.ts`): `assertFetchSafe` + `safeFetch` with DNS pinning, per-hop redirect re-validation (max 5), DNS timeout (5s), IPv4-mapped IPv6 detection, reserved-range checks (RFC1918, loopback, link-local, ULA, fe80::/10), blocked local hostnames" | "Makes outbound fetches SSRF-safe — callers use `safeFetch` without re-implementing network protection" |
| "Path containment (`path-safety.ts`): `assertPathContained` realpath-based traversal/symlink-escape guard used by filesystem mutation tools (`invalidate_cache`, `index_file`)" | "Makes filesystem mutations path-traversal-safe — callers use `assertPathContained` before writing outside a root" |
| "do not regress DNS pinning, redirect re-validation, DNS timeout, or IPv4-mapped IPv6 detection" | "Obligation: 'reject unsafe fetches' — don't regress that" |

The mechanism (DNS pinning, redirect counts, reserved ranges, specific tool names) moved out of the contract. The obligation ("makes fetches safe", "reject unsafe fetches") stayed. A caller reading the new AGENTS.md knows what they may rely on and what they must respect — they don't know *how* the guard works, and they don't need to.

### What was added (Communication section)

Five obligation-level rules:
- Callers **may** use `safeFetch` and trust SSRF protection — must not add their own network-level checks
- Callers **may** use `assertPathContained` — must not bypass for "trusted" paths
- Callers **must** pass user-supplied regex through `checkRegexComplexity` — this boundary does not intercept compilation elsewhere
- Callers **must not** depend on internal ordering of `safeFetch` checks — the obligation is "rejected if unsafe," not "rejected in a specific order"
- **Owed to callers:** guards reject by throwing, never return unsafe values silently; errors carry `ErrorCode` for branching

None of these reference file paths, param shapes, or implementation detail. All survive implementation swaps (changing the SSRF check list, swapping the regex engine, reorganizing internal files).

### What the enforcement test now asserts

The boundary test gained one new assertion block:
1. `## Communication` section exists in AGENTS.md
2. Section body is non-empty
3. Body contains obligation language (`may`/`must`/`must not`/`owed`)
4. Body does not contain mechanism leakage (no `` `[a-z-]+\.ts` `` file-path patterns)

This is the obligation/mechanism content rule enforced as a test — the exact thing the experiment's Cut C ("when is the contract allowed to lie") needed. The contract stays authoritative because the test fails if mechanism creeps back in or the Communication section is deleted.

### Observations (immediate)

- **40-line limit is tight but workable.** The Communication section added 7 lines; mechanism stripping saved ~9. Net: 33→36 lines. The format holds, but boundaries with larger surfaces will struggle to fit obligation + Communication + Key entry point under 40. Open: does the line limit need to scale with surface size, or does it force useful compression?
- **Obligation writing is harder than mechanism listing.** The original AGENTS.md was easy to write — list what the files do. The rewrite required asking "what does a caller need to *rely on*?" and "what must a caller *not assume*?" That's a different cognitive task. The discipline is real and non-trivial — confirms open question about enforcement (lint rule vs review step vs internalized skill). The test enforces *presence* of obligation language, but not *quality* of obligations. A weak obligation ("callers must use the thing") passes the test. Quality is still a review step.
- **The mechanism-leakage regex is crude.** It catches `` `url-safety.ts` `` but not `tree-sitter adapters` or `RFC1918`. A stronger check would be harder to write and risk false positives. The current check is a tripwire, not a full mechanism detector. Good enough for now; noted as a limitation.
- **"Key entry point" is still mechanism.** It lists file paths and exported symbol names. This is deliberate — it's the surface-containment contract the test checks against. The obligation/mechanism split applies to "Does" and "Communication," not to "Key entry point." Key entry point is the *index* into the code, not the *contract*. This distinction should be explicit in the content rule when promoted.

### What this run does NOT prove yet

- **Rot-rate claim untested.** The rewrite is 30 minutes old. The thesis ("obligations rot slower than mechanisms") requires waiting for a real change to `shared/` and observing whether the contract held or drifted. The experiment is now in observation phase, not conclusion phase.
- **One boundary is not a sample.** `shared/` is the most mechanism-heavy boundary and the one where stripping mechanism gave the most visible win. Boundaries with less mechanism (`stats/`, `utils/`) may show less benefit. Need 2-3 boundaries rewritten before generalizing.
- **Multi-reader conflict unresolved.** The rewritten AGENTS.md still serves caller, modifier, and newcomer in one file. The Communication section helps callers; "To touch" helps modifiers; "Does" helps newcomers. No conflict yet, but `shared/` is small. A larger boundary might force a choice.

### Status after this run

- `confidence` stays `low` — one rewrite, no change observation yet.
- The content rule (obligation-only + Communication section) is now *testable* in snapberry, not just theoretical.
- Next observation: wait for the next change to `src/shared/` and record whether the contract held or drifted.
- After 2-3 changes observed: decide whether to rewrite 2 more boundaries and whether the evidence supports promotion out of `experiments/`.

## Cold-start problem (the next phase)

The snapberry run proved the content rule works on a boundary that *already exists* — the boundary was already drawn, the AGENTS.md already existed, the enforcement test already ran. That's the warm-start case. The experiment has not addressed the **cold-start**: take a project with no boundaries, no AGENTS.md, no enforcement tests, and bootstrap the whole pattern from zero. This is the adoption problem — the thing that determines whether the idea works outside snapberry.

### What cold-start requires that warm-start didn't

Three steps that snapberry already had done, and a cold project has not:

1. **Boundary identification** — which directories are boundaries and which are just folders? Snapberry's `architecture.md` module map is the output of this step, but the *procedure* for drawing boundaries (one reason to change, stable public surface, owner/ADR) lives in `contributing-boundaries.md`. A cold project has neither the map nor the procedure applied. **This is the hardest step and the one most likely to go wrong.** Draw boundaries wrong and every downstream artifact (AGENTS.md, enforcement test, Communication section) encodes a wrong model. The `repo-primitive-audit` prompt already maps a repo's primitives from source — that's the candidate tool for step 1, but it produces a *map*, not a *boundary decision*. The gap: a map says "here are the modules"; a boundary decision says "this is a capability unit with one reason to change." Those are different judgments.

2. **Surface definition** — for each boundary, what's the public surface? Snapberry's workflow says "list every symbol other modules import from this boundary." A cold project's modules may not have clean import boundaries — internal imports crossing what should be a boundary, leaks, circular deps. The surface must be *defined* before it can be documented, and defining it may require refactoring. **This is where cold-start touches real code, not just docs.** If a boundary's surface is a mess, you either refactor or document the mess. The content rule (obligation-only) can't be applied until the surface is coherent enough to express obligations about.

3. **Enforcement scaffolding** — the boundary test. Snapberry's test asserts AGENTS.md presence, surface containment, ADR status, Communication section. A cold project has none of this. The test skeleton in `contributing-boundaries.md` is portable (it's just file reads + regex), but writing the surface-containment assertions requires knowing the surface (step 2). **This is mechanical once steps 1-2 are done, but it's the thing that makes the contract authoritative vs advisory.** Without it, the whole thing degrades to Trust model B (advisory README).

### The cold-start procedure (proposed, untested)

Draft procedure for a project with nothing:

```
Step 0 — Map the repo
  Run repo-primitive-audit (prompts/repo-primitive-audit/prompt.md)
  Output: a map of modules from source. This is the candidate boundary list.
  NOTE: map ≠ boundaries. A map says "here are modules"; a boundary says
  "this is a capability unit with one reason to change." The human/agent
  must make the boundary decision, not the map.

Step 1 — Draw boundaries
  For each mapped module, ask:
  - One reason to change? (state in one sentence — if you need two, it's two boundaries)
  - Stable public surface? (list what other modules import from it)
  - Owner/decision? (is there an ADR-worthy decision, or is it obvious?)
  Output: a boundary list with one-sentence purposes and surface lists.
  This becomes the repo's architecture.md module map.
  BLOCKER: if a module's surface is incoherent (leaks, circular deps,
  internal-only exports mixed with public), this step surfaces it.
  You either refactor or document the mess. Refactoring is out of scope
  for this experiment — document the mess honestly and flag it.

Step 2 — Write the enforcement test skeleton (per boundary)
  Copy the skeleton from contributing-boundaries.md.
  Fill in surface-containment assertions from step 1's surface list.
  Run the test — it should FAIL because AGENTS.md doesn't exist yet.
  This is snapberry's "test before doc" rule — the test tells you the
  ground truth before you write the contract.

Step 3 — Write AGENTS.md (per boundary, under the obligation-only rule)
  Sections: Does / Does NOT / Communication / Key entry point / To touch
  Content rule: obligation, not mechanism. Strip file paths, param shapes,
  implementation detail from Does and Communication. Key entry point is
  the index (mechanism allowed there). Communication is the contract
  (obligation only — may/must/must not/owed).
  Run the test — must pass.

Step 4 — Write ADRs (only if real decisions exist)
  For each boundary where a genuine fork-in-the-road decision was made
  (alternatives considered, rejected for reasons), write ADR-001.
  If the boundary is obvious, skip. Do not cargo-cult ADRs.

Step 5 — Observe
  Wait for changes to each boundary. Record:
  - Did the contract hold (no edit) or drift (edit needed)?
  - Was the edit in Does/Does NOT (obligation changed) or in Communication
    (caller obligation changed)?
  - Was the edit smaller than re-generating mechanism docs would have been?
  After 2-3 changes per boundary across 2-3 boundaries: evaluate the
  rot-rate claim.
```

### What's untested in this procedure

- **Step 0 → Step 1 gap.** `repo-primitive-audit` produces a map; the boundary decision is a human/agent judgment. How much guidance does the procedure need to give for making that judgment? Too little → wrong boundaries. Too much → rigid checklist that over/under-shoots (the `repo-primitive-audit` evidence notes the same failure mode for the map itself).
- **Step 1 surface mess.** Most real projects have incoherent surfaces at some boundaries. The procedure says "document the mess honestly" but doesn't specify what that looks like. An AGENTS.md that says "surface is incoherent, see refactor ticket X" is honest but not a contract. Is that acceptable as an intermediate state, or does it undermine the whole pattern?
- **Step 2 test-first on a cold project.** Snapberry's test-first worked because the surface was already clean. On a cold project, the test will fail for the *right* reasons (AGENTS.md missing) and the *wrong* reasons (surface assertions don't match code because the surface is messy). How much noise does that produce, and does it help (forces surface cleanup) or hurt (too many failures, agent gives up)?
- **Cold-start is N×work.** Snapberry had 12 boundaries done over time. Cold-start does all of them at once. Is that feasible, or does cold-start need to target 2-3 boundaries first and expand? The procedure doesn't specify scope — probably should.

### What this procedure would produce (the artifacts)

For a cold project that runs this procedure end-to-end:
- `docs/architecture.md` — repo-level module map (boundaries + purposes + allowed imports)
- `src/<boundary>/AGENTS.md` per boundary — obligation-level contract (Does / Does NOT / Communication / Key entry point / To touch)
- `src/<boundary>/decisions/NNN-<slug>.md` per boundary with real decisions — ADRs
- `src/<boundary>/__tests__/<boundary>-boundary.test.ts` per boundary — enforcement
- `docs/contributing-boundaries.md` — the boundary protocol (cold-start procedure, once stabilized)

That's the full pattern. The deliverable from *this experiment* is the **cold-start procedure itself** — a `playbooks/` or `prompts/` artifact that takes a project from zero to the full pattern. The individual files (AGENTS.md, tests, ADRs) are outputs of running the procedure, not the experiment's deliverable.

### Next experiment step

The snapberry warm-start run is in observation phase (waiting for change data). The cold-start procedure is drafted but untested. The next step that would move confidence:

**Pick a real project with no boundaries. Run the cold-start procedure on 2-3 boundaries. Observe:**
- Did `repo-primitive-audit` produce a usable candidate boundary list?
- Was the Step 0 → Step 1 gap (map → boundary decision) navigable?
- Did the test-first step work or produce too much noise?
- Did the obligation-only AGENTS.md come out coherent, or did the cold surface force mechanism back in?
- How long did the whole thing take per boundary?

This is a second run, independent of the snapberry warm-start observation. It tests a different claim: not "does the content rule hold over time?" (warm-start) but "can the pattern be bootstrapped from zero?" (cold-start). Both need to pass before promotion.

## Tool assessment — is this a tool, and what's missing?

### Is this a tool?

Partly. The procedure has mechanical steps (file creation, test scaffolding, running tests) and judgment steps (drawing boundaries, writing obligations). A tool can automate the mechanical parts and *scaffold* the judgment parts, but it cannot replace the judgment — that's the whole point of the experiment (contracts encode intent, which comes from the decider, not from the code).

Honest framing: **this is a scaffolding tool + a content prompt, not a generator.** The tool creates the structure (files, tests, dirs); a human/agent fills the content (obligations, boundaries). Calling it a "generator" is the exact trap the experiment already rejected — a generator that produces the contract from the implementation just regenerates param-docs that rot.

### What's missing (six gaps)

In order of how badly they block the "point at a repo and set it up" vision:

**Gap 1 — Boundary identification is a judgment step with no tooling.** Step 0 says "run repo-primitive-audit" to get a candidate list. But repo-primitive-audit produces a *map* (here are the modules), not a *boundary decision* (this is a capability unit with one reason to change). The map→boundary step is human/agent judgment, and the procedure gives no tooling for it. A tool needs either an interactive step (propose boundaries, human confirms/edits) or a prompt that does the boundary decision with strong guardrails (one-reason-to-change test, surface stability test). Without this, "point at a repo" stops at "here's a map, now you decide." That's not a tool, that's a report. **This is the biggest gap.** Everything downstream depends on the boundary decision being right.

**Gap 2 — The enforcement test is hand-written, not generated.** Snapberry's `shared-boundary.test.ts` was written by hand — read the exports, write the assertion list. For a tool, this is the most automatable step and the one that should *not* be manual. A tool should read the package's `package.json` + entry exports, generate the surface-containment assertions automatically, and emit the template assertions (AGENTS.md integrity, Communication section) which are identical across boundaries. The surface-containment part is the only boundary-specific bit, and it's readable from the code. **This is the clearest tool opportunity in the whole procedure.**

**Gap 3 — The architecture map is hand-maintained, will drift.** Snapberry's `docs/architecture.md` module map is a hand-written table. Two problems: (a) drift — the map is a second source of truth alongside the per-boundary AGENTS.md files, and "update both" is exactly the drift vector the experiment was built to prevent; (b) name — `architecture.md` is generic, implies hand-authored architecture doc, doesn't signal "derived from per-boundary AGENTS.md files." **Fix: the map should be *generated* from the per-boundary AGENTS.md files, not hand-maintained.** A tool aggregates boundary name + one-line purpose + allowed imports from each AGENTS.md and produces the map. Single source of truth (the AGENTS.md files), derived view (the map). Same principle as snapberry's auto-generated `docs/tools.md` from `annotations.ts`. Name: `docs/boundaries.md` or `docs/module-map.md` — something that signals "derived from per-boundary AGENTS.md." Not `architecture.md`.

**Gap 4 — No drift trigger (when does the contract get re-checked?).** The procedure says "observe changes." A tool needs a trigger. Without one, the contract drifts silently — the exact failure the enforcement test was built to prevent. Options: pre-commit hook (run boundary tests on commit, catches drift before it lands), CI check (run on PR, catches drift that slipped past the hook), watcher (overkill for docs). The trigger is what makes the contract *stay* authoritative (Trust model A). Without it, the tool produces contracts that are honest on day one and rot by day thirty. **This is the missing piece that makes the tool a tool, not a one-shot scaffolder.**

**Gap 5 — No content-rule enforcer beyond the crude regex.** The current test checks for obligation language presence (`may`/`must`/`must not`/`owed`) and no `.ts` file paths in the Communication body. That's a tripwire, not an enforcer. It catches the worst mechanism leakage (file paths) but misses everything else (specific lib names, param shapes, retry counts, error codes). A real content-rule enforcer needs either a stronger lint spec (list of mechanism signals to reject — library names, version numbers, param signatures, file extensions, specific counts) or an LLM-based check (classify each line in Communication as obligation or mechanism, reject if mechanism). This is the "lint rule vs review step vs internalized skill" open question — and a tool answers it: it's a lint rule, and the LLM is the linter. **This is the gap that decides whether the content rule scales.** The regex works for one boundary. It won't work for 50.

**Gap 6 — No discovery mechanism (how does the LLM find the contract?).** Snapberry solves this via MCP tools — an agent reads AGENTS.md when working in a boundary. Other projects use `.cursor/rules`, root `AGENTS.md`, etc. A tool that creates per-boundary contracts needs to ensure those contracts are *loaded* by the LLMs working on the code, not just present on disk. Otherwise the contract is honest but invisible. This is an integration gap: the tool emits contracts in the format the target project's LLM tooling expects (AGENTS.md for Claude/Cursor, `.cursor/rules/*.mdc` for Cursor, etc.). The contract format is portable; the discovery mechanism is project-specific. Don't build a discovery layer — ride the existing pattern.

### What the tool is (after the gaps)

Not a generator. A **boundary contract scaffolder + enforcer** with four commands:

1. **`init`** — point at a repo, run boundary identification (Gap 1), create the file structure (AGENTS.md template + test skeleton + decisions/ dir), generate the enforcement test from exports (Gap 2), generate the module map from the AGENTS.md files (Gap 3). Output: structure, not content. Human/agent fills the obligations.
2. **`check`** — run the enforcement tests + the content-rule enforcer (Gap 5). Fails on drift, mechanism leakage, missing Communication section. This is the trigger (Gap 4) — run on commit/CI.
3. **`map`** — regenerate the module map from the per-boundary AGENTS.md files (Gap 3, single source of truth).
4. **`lint`** — the content-rule enforcer (Gap 5). Classify each line in Communication as obligation or mechanism. Reject mechanism. The thing that makes the content rule real at scale.

Two exist in some form (init scaffolding, check via tests). Two are missing (map generation, lint as a real enforcer).

### Build order

**Build first (unblocks "point at a repo"):**
- Enforcement test generator (Gap 2) — most automatable, most valuable, clearest scope. Reads a package's exports, emits the test.
- Module map generator (Gap 3) — derives the map from AGENTS.md files. Single source of truth. Kills the drift vector.
- `init` scaffolder — wraps the above + creates the file structure. The "point at a repo" command.

**Build second (after cold-start run validates the procedure):**
- Content-rule linter (Gap 5) — needs the cold-start run to calibrate what mechanism leakage actually looks like across different boundaries. The regex is a placeholder.
- Drift trigger (Gap 4) — pre-commit hook installer. Needs the tests to exist first.

**Skip for now:**
- Boundary identification as automation (Gap 1) — judgment, not tooling. Keep as a prompt step (run repo-primitive-audit, human/agent decides). Automating it risks the "generator produces wrong boundaries" failure, which is worse than manual.
- Discovery integration (Gap 6) — project-specific. The tool emits AGENTS.md; the project's LLM tooling finds it. Don't build a discovery layer — ride the existing pattern.

## Tool scope — "boundary" (working name)

Working name: **`boundary`**. Subject to change. The tool is a scaffolder + enforcer for per-module obligation contracts, not a generator.

The tool implementation is at `boundary/` in this experiment directory. Run it with `npx tsx src/cli.ts <command>` from inside `boundary/`. See `boundary/README.md` for self-contained orientation.

### What it is

A CLI with four commands. Two create structure (`init`, `map`), two enforce it (`check`, `lint`). The tool never writes obligation content — that's human/agent judgment. The tool creates files, generates tests from exports, derives the map from contracts, and enforces the content rule.

### What it is not

- Not a doc generator. It does not produce AGENTS.md content from code.
- Not a boundary detector. It does not decide which directories are boundaries (Gap 1 — judgment, kept as a prompt step).
- Not a discovery layer. It emits AGENTS.md; the project's LLM tooling finds it (Gap 6 — project-specific).

### Commands

#### `boundary init <path>` — scaffold the pattern on a repo

**Input:**
- Repo root path
- A boundary list (from the user or from `repo-primitive-audit` run as a prompt step). Each boundary has: directory path, one-line purpose, public surface (list of exported symbols).

**What it does:**
1. For each boundary directory:
   - Create `AGENTS.md` from template with the five sections (Does / Does NOT / Communication / Key entry point / To touch). Template only — placeholders, no content. The human/agent fills obligations.
   - Create `decisions/` dir (empty — ADRs only on real decisions).
   - Create `__tests__/<boundary>-boundary.test.ts` from the generator (see below).
2. Generate `docs/boundaries.md` (the module map) from the boundary list. Derived view — name + purpose + allowed imports. Not hand-maintained.
3. Print next steps: "fill AGENTS.md obligations for each boundary, run `boundary check`."

**What it does NOT do:**
- Write obligation content (Does, Does NOT, Communication). Template placeholders only.
- Decide boundaries. The user provides the list; `repo-primitive-audit` is the recommended prompt step to produce it.
- Create ADRs. Empty `decisions/` dir only.

**Output per boundary:**
```
src/<boundary>/
  AGENTS.md                          ← template, unfilled
  decisions/                         ← empty
  __tests__/
    <boundary>-boundary.test.ts      ← generated from exports
```
**Output at repo root:**
```
docs/
  boundaries.md                      ← generated module map
```

**Acceptance:**
- Every boundary has AGENTS.md, decisions/, and a test file.
- `boundary check` runs and fails (AGENTS.md is template, not filled). This is correct — the test enforces that obligations exist.
- `docs/boundaries.md` lists every boundary with its one-line purpose.

---

#### `boundary check` — run enforcement tests

**Input:** repo root (inferred from cwd).

**What it does:**
1. Discover all `*-boundary.test.ts` files under the repo.
2. Run them (delegate to the project's test runner — vitest, jest, bun test — detected from `package.json`).
3. Report pass/fail per boundary.

**What it enforces (per the generated test):**
- AGENTS.md exists, non-empty, ≤40 lines.
- ADR refs (if any) resolve to files and are not terminal without replacement.
- Communication section exists, non-empty, contains obligation language (`may`/`must`/`must not`/`owed`), no mechanism leakage (no file-path patterns in Communication body).
- Surface containment: every symbol declared in "Key entry point" is exported from the named file.

**What it does NOT do:**
- Run the content-rule linter (that's `lint`). `check` is the structural + surface test only.

**Acceptance:**
- Exit 0 if all boundary tests pass.
- Exit non-zero with per-boundary failure list if any fail.

---

#### `boundary map` — regenerate the module map

**Input:** repo root (inferred from cwd).

**What it does:**
1. Discover all `AGENTS.md` files under `src/`, `packages/`, `apps/` (configurable glob).
2. Parse each AGENTS.md: extract boundary name (H1), one-line purpose, Does NOT (for ownership boundaries), Key entry point (for surface).
3. Write `docs/boundaries.md` — one row per boundary: name, purpose, key entry point, allowed imports (if declared in AGENTS.md).

**Single source of truth:** the per-boundary AGENTS.md files. The map is derived. Never hand-edit `docs/boundaries.md` — regenerate it.

**Acceptance:**
- `docs/boundaries.md` matches the current set of AGENTS.md files.
- No drift between map and contracts.

---

#### `boundary lint` — content-rule enforcer

**Input:** repo root (inferred from cwd), or a single AGENTS.md path.

**What it does:**
1. Parse the Communication section of each AGENTS.md.
2. Classify each line as obligation or mechanism. (See "Classification engine" below.)
3. Fail if any line in Communication is classified as mechanism.

**Classification engine (two phases):**

Phase 1 — rule-based (fast, deterministic):
- Reject: file extensions (`.ts`, `.tsx`, `.py`, `.go`, `.rs`, `.js`), file paths with extensions, library names with versions (`zod@3.21`, `stripe@14`), specific numeric counts (`3x`, `5 retries`, `max 5`), param shapes (`{ userId, expiresAt }`), error code enums (`ECONNREFUSED`, `card_declined`).
- Allow: obligation language (`may`, `must`, `must not`, `owed`, `owns`, `guarantees`, `rejects`, `never`, `always`), capability verbs (`makes`, `provides`, `owns`), boundary names without file extensions.

Phase 2 — LLM-based (for lines that pass Phase 1 but are ambiguous):
- Prompt: "Classify this line as obligation (what a caller must respect / what the module guarantees) or mechanism (how it does it: specific tools, counts, params, file paths). Respond obligation|mechanism|ambiguous. Line: '<line>'"
- If `mechanism` or `ambiguous`: fail with the line and the classification.

Phase 2 is optional (configurable). On a cold project with no LLM access, Phase 1 runs alone. The regex from the snapberry run is Phase 1's baseline.

**What it does NOT do:**
- Check structure (that's `check`).
- Check surface containment (that's `check`).
- Run tests. It only reads AGENTS.md files.

**Acceptance:**
- Exit 0 if all Communication sections are obligation-only.
- Exit non-zero with per-line failures and classifications if mechanism is detected.

---

### Enforcement test generator (the `init` subcomponent)

This is the most automatable piece and the one that makes `init` useful vs just handing someone a template.

**Input:** boundary directory path.

**What it does:**
1. Read `package.json` in the boundary dir (if monorepo package) or infer entry from `index.ts`/`index.js`.
2. Resolve the public surface: follow the exports from the entry file. For TypeScript: read `export` statements. For JS: read `module.exports`. For Python: read `__all__` or `__init__.py`. (Multi-language support is a later concern — start with TS/JS, the snapberry case.)
3. Emit `__tests__/<boundary>-boundary.test.ts` with:
   - AGENTS.md integrity assertions (template — identical across boundaries).
   - Communication section assertions (template — identical across boundaries).
   - Surface containment assertions (generated from the exports found in step 2).
4. The test uses the project's test runner (detect vitest/jest/buntest from `package.json`).

**The generated test is the contract enforcer.** It fails until AGENTS.md is filled with real obligations and the declared surface matches the code. This is what makes the contract authoritative (Trust model A) rather than advisory (Trust model B).

**Limitation:** surface detection from exports is shallow. It catches `export function foo` and `export const bar`, not re-exports through barrel files or dynamic exports. For boundaries with complex export structures, the generated test is a starting point that the human/agent adjusts. The test is editable — it's not locked.

---

## Tool scope refinement — resolved questions and dry-run model

### Resolution 1 — `check` does not delegate to a test runner

Original question: how does `check` detect and invoke the project's test runner (vitest/jest/buntest/node:test)? Answer: **it doesn't.**

The real problem isn't detection, it's delegation. Three reasons `check` should not run the project's test runner:
- Detecting the runner from `package.json` is unreliable — monorepos mix runners, devDependencies vary, some projects use `node:test`.
- Running the runner means the tool depends on the project's installed deps — a tool that crashes because vitest isn't installed is a tool that doesn't run.
- The project already knows how to run its tests. The tool's job is to ensure the *right tests exist*, not to invoke them.

**Reframe:** the boundary test is a *contract document* read by `check`, not a *test file* run by vitest. `check` reads the boundary test file and the AGENTS.md directly and asserts the contract in-process — no test runner invocation. The tool re-implements the four assertions (AGENTS.md integrity, Communication section, surface containment, ADR status) in itself, reading files directly. Runner-independent.

The generated `*-boundary.test.ts` becomes optional output for projects that want CI integration, not the primary enforcement path. The tool is the enforcer; the test file is a convenience for projects that want their existing CI to catch drift without installing `boundary` as a CI dependency.

**Implication:** the enforcement test generator (Gap 2) is optional output, not the core. The core is `check` reading AGENTS.md + package exports directly. This is simpler and more portable — the tool works on a project with no test runner configured at all.

### Resolution 2 — manifest file, not CLI args

Original question: one `init` with a list, or per-package? Answer: **one `init` with a boundary manifest.**

A 16-boundary monorepo on the CLI is unworkable. The manifest is the input — a single file at repo root listing boundaries with dir + purpose + surface. The user (or `repo-primitive-audit` + judgment) produces the manifest; `init` reads it and scaffolds all boundaries. Re-runs and partial runs are trivial (`init --only auth,database`).

**Manifest format:** `boundaries.yaml` at repo root. Human-readable (user reviews before running `init`), machine-parseable (`init` reads it), single file. Schema:
```yaml
# boundaries.yaml — input to `boundary init`
# Produced by: repo-primitive-audit + human/agent boundary judgment
maxLines: 40              # default; per-boundary override allowed
boundaries:
  - dir: packages/auth
    name: auth
    purpose: "Authentication and authorization for the platform"
    surface: [index.ts]   # entry files to extract exports from
  - dir: packages/database
    name: database
    purpose: "Database schema, client, migrations"
    surface: [index.ts]
    maxLines: 60          # override for larger surface
```

The manifest is the handoff between judgment (drawing boundaries) and mechanical (scaffolding). It's the input the user produces once; the tool consumes it repeatedly.

### Resolution 3 — `docs/boundaries.md` format and name

**Format:** YAML frontmatter (machine-readable, for `map` to consume its own output on re-runs) + markdown table below it (human-readable). The user never hand-edits it. If they do, `map` overwrites it — that's the point.

**Name:** `docs/boundaries.md`, with a generated header comment: `<!-- Generated by `boundary map`. Do not edit — regenerate with 'boundary map'. -->`. The comment is the signal; the name is the label. Not `architecture.md` (too generic, implies hand-authored).

### Resolution 4 — idempotent `init`, no clobber

If `init` finds an existing AGENTS.md, it does NOT overwrite. It reports "exists, skipped." If the user wants to update the *test* (because the surface changed), they run `boundary check` which reports surface drift, then `boundary init --regen-test <boundary>` to regenerate just the test. The AGENTS.md is never clobbered — it's the human-authored contract.

### Resolution 5 — 40-line limit is configurable, declared in the manifest

Default 40 (snapberry-validated). The manifest can set `maxLines` per boundary or globally. The tool reads it; `check` enforces it. Some boundaries with large surfaces need 60; some need 30. Don't hardcode.

### Resolution 6 — dry-run is the default execution mode

**New requirement:** the tool must run the full analysis and report the outcome without writing files. This changes the execution model. Two modes:

**`--dry-run` (default):** the tool runs the full analysis (boundary detection via manifest, surface extraction, contract generation from template, content-rule lint, surface-containment check) and reports what it would do and whether the contracts pass — without writing any files. Output is a report: per-boundary, what would be created, what the extracted surface is, whether the template would pass `check`, what `lint` would flag.

**`--write` (opt-in):** the tool writes the files. Default is dry-run because the experiment is in validation — see the outcome before committing files to a target repo.

Every command has a dry-run path:
- `init --dry-run` → reports "would create AGENTS.md at X, would create test at Y, extracted surface: [a, b, c]"
- `check --dry-run` → reads existing AGENTS.md (if any), reports pass/fail without assuming files exist. If no AGENTS.md exists yet, reports "would fail: no contract" — this is the pre-validation signal.
- `map --dry-run` → reports what `boundaries.md` would contain
- `lint --dry-run` → reports what it would flag in existing AGENTS.md files (or in would-be templates if none exist yet)

**Why dry-run as default matters for the experiment:** if `check` doesn't depend on a test runner (Resolution 1) and `init` can run in dry-run, then the tool can validate a project *before any files are created*. The cold-start procedure's Step 2 ("write the enforcement test first, watch it fail") becomes: run `boundary init --dry-run`, see the would-be surface and the would-be failures, decide if the boundaries are right *before* committing to the structure. The tool becomes a *pre-validation* step, not just a scaffolder. This catches wrong boundaries before files exist — genuinely better than the procedure as drafted.

For the target repo validation: run everything in `--dry-run`, inspect the report, decide whether the extracted surfaces and the would-be contracts are correct. No files written to the target repo until explicitly requested.

### Updated command surface (after refinements)

```
boundary init [--dry-run] [--write] [--only <names>] [--regen-test <name>]
  Reads: boundaries.yaml
  Creates (write mode): per-boundary AGENTS.md (template), decisions/, optional *-boundary.test.ts
  Creates (write mode): docs/boundaries.md
  Reports (dry-run mode): per-boundary would-create, extracted surface, would-pass/fail

boundary check [--dry-run]
  Reads: AGENTS.md files + package exports (no test runner invocation)
  Asserts: AGENTS.md integrity, Communication section, surface containment, ADR status, maxLines
  Reports: pass/fail per boundary

boundary map [--dry-run] [--write]
  Reads: all AGENTS.md files
  Creates (write mode): docs/boundaries.md (YAML frontmatter + table)
  Reports (dry-run mode): would-contents

boundary lint [--dry-run] [--phase 1|2] [--file <path>]
  Reads: Communication sections of AGENTS.md files
  Phase 1: rule-based (regex + mechanism signals)
  Phase 2: optional LLM-based classification
  Reports: per-line obligation/mechanism classification, pass/fail
```

### What was removed from the original scope

- **Test runner invocation.** `check` no longer delegates to vitest/jest/etc. It reads files directly. The generated test file is optional output for CI integration, not the enforcement path.
- **CLI args for boundary lists.** Replaced by `boundaries.yaml` manifest.
- **Hardcoded 40-line limit.** Now configurable via manifest.
- **`init` as a file writer only.** Now defaults to dry-run — analysis and reporting come first, writing is opt-in.

### What's still parked (not in scope for v1)

- Boundary identification automation (Gap 1) — partially resolved. `boundary discover` now handles package-based discovery (scans the repo for packages and proposes a `boundaries.yaml`). Dir-based (app) discovery — where a boundary is a directory that isn't a package — remains the open gap being addressed.
- Discovery integration (Gap 6) — tool emits AGENTS.md, project's LLM tooling finds it.
- ADR generation — empty `decisions/` dir only.
- Multi-language surface detection beyond TS/JS — v1 is TS/JS.
- Lint Phase 2 as a hard requirement — optional, configurable.

---

### Relationship to existing repo artifacts

This tool, if built, would be a `tools/` artifact in this repo (the ai-stuff vault). The experiment produces the evidence; the tool is the deployable artifact that operationalizes the evidence. Promotion path: experiment → validated → tool (if the cold-start run passes).

The tool's own `humans.md` would record: origin (this experiment), relationship to snapberry's `contributing-boundaries.md` (the warm-start instance), relationship to `repo-primitive-audit` (the boundary-list prompt step), and the obligation/mechanism content rule (the core discipline the tool enforces but does not replace).

### Build order (refined)

**Phase 1 — core engine (unblocks dry-run validation on a target repo):** ✅ done
1. ✅ **Surface extractor** — read `boundaries.yaml` manifest, read each boundary's entry file, extract exported symbols. TS/JS only for v1. This is the input to everything else.
2. ✅ **`check` engine** — read AGENTS.md files + extracted surfaces, assert the four contracts (integrity, Communication, surface containment, ADR status, maxLines). No test runner — reads files directly. Works in dry-run (reports pass/fail without files existing).
3. ✅ **`init` dry-run** — read manifest, report what would be created per boundary, extracted surface, would-pass/fail. No file writing.
4. ✅ **`map` dry-run** — read AGENTS.md files (or would-be templates), report what `boundaries.md` would contain.

**Phase 2 — write mode + content enforcement:** ✅ done
5. ✅ **`init --write`** — create AGENTS.md templates, decisions/ dirs, optional test files. Idempotent (skip existing).
6. ✅ **`map --write`** — write `docs/boundaries.md` (YAML frontmatter + table).
7. ✅ **`lint` Phase 1** — rule-based content enforcer (regex + mechanism signals).
8. ✅ **Pre-commit hook installer** — install a hook that runs `boundary check` on commit. (`boundary install-hook` / `boundary uninstall-hook`)

**Phase 3 — LLM-assisted enforcement (after cold-start run calibrates):** ⏳ pending
9. ⏳ **`lint` Phase 2** — LLM-based classification of obligation vs mechanism. Optional, configurable. Needs the cold-start run on a real monorepo to calibrate what mechanism leakage looks like across different boundaries.

**Phase 4 — cold-start validation on a target monorepo:** 🔄 in progress
10. ✅ Run `boundary init --dry-run` on a target monorepo with a 2-3 boundary manifest. Inspect: extracted surfaces, would-be contracts, would-pass/fail. Validate the procedure before any files are written. (dry-run done)
11. ⏳ If dry-run validates: run `boundary init --write` on 2-3 boundaries in the target repo. Wait for changes. Observe rot-rate. This is the evidence that moves the experiment from `confidence: low` to evidence-backed. (write pending)

---

## Final command surface (v1)

The `boundary` tool shipped with 8 commands. Dry-run is the default execution mode for every command that reports; `--write` is opt-in where files are produced. The command surface below mirrors the USAGE block in `boundary/src/cli.ts`.

### `boundary discover [--dry-run|--write]`

Scan the repo and propose a `boundaries.yaml` manifest.

- **Reads:** repo tree — `package.json` files (package-based discovery for v1), directory structure.
- **Writes (`--write`):** `boundaries.yaml` at repo root, populated with one entry per detected package: `dir`, `name`, `purpose` (placeholder), `surface` (entry files). Refuses to overwrite an existing `boundaries.yaml`.
- **Reports (`--dry-run`, default):** the proposed manifest — per detected package, dir/name/surface, and a preview of the would-be `boundaries.yaml`. No file written.
- **Enforces/checks:** nothing. This is a proposal step, not a contract step. The human/agent reviews and edits the manifest before passing it to `init`.

### `boundary init [--dry-run|--write] [--only <names>]`

Scaffold the boundary pattern from a manifest.

- **Reads:** `boundaries.yaml` at repo root. Each entry: `dir`, `name`, `purpose`, `surface` (entry files), optional `maxLines` override.
- **Writes (`--write`):** per boundary — `AGENTS.md` (template with the five sections: Does / Does NOT / Communication / Key entry point / To touch), `decisions/` dir (empty), optional `*-boundary.test.ts`. At repo root — `docs/boundaries.md` (derived module map). Idempotent: existing AGENTS.md files are skipped, not clobbered. `--only` restricts to a subset of boundaries by name.
- **Reports (`--dry-run`, default):** per boundary — what would be created, the extracted surface (symbols found from the entry file), and whether the would-be template would pass `check`. No files written.
- **Enforces/checks:** nothing structurally — this is the scaffolder. The would-pass/fail report is a pre-validation signal: it tells you whether the boundaries are right *before* files exist.

### `boundary generate [--emit-prompt] [--apply <file>] [--dry-run --apply <file>] [--force]`  *(NEW)*

Draft obligation-level content by emitting an LLM prompt, then applying the returned JSON. Same emit-prompt + apply pattern as `lint --phase 2`. The tool never calls an LLM API directly — no anthropic/openai deps at build time. The human is the trust anchor.

- **Reads:** `boundaries.yaml` manifest + each boundary's entry file (surface extraction) + a source sample per boundary (for the prompt's context window).
- **`--emit-prompt` (default):** emits a structured prompt to stdout. Paste it into an LLM; the LLM returns JSON with drafted `does` / `doesNot` / `communication` bullets per boundary. No files written.
- **`--apply <file>` (write mode, default):** reads the JSON file, fills each boundary's AGENTS.md (creating from template if absent), then runs `boundary check` to verify the result. `--force` overwrites sections that already contain human-authored content; without `--force`, populated sections are skipped and reported as `skipped`.
- **`--dry-run --apply <file>`:** reads the JSON and reports what would be filled and whether the would-be contracts would pass `check` — no writes. Pre-validation before committing drafts to the target repo.
- **Enforces/checks:** after `--apply` (write mode), runs `check` against the filled AGENTS.md files and reports pass/fail per boundary. A boundary that fails `check` after filling is reported but does not block the others.

### `boundary check [--dry-run]`

Enforce the four contracts per boundary.

- **Reads:** `boundaries.yaml` manifest (for surface extraction config) + each boundary's `AGENTS.md` + the boundary's package exports (read directly from the entry file, no test runner invocation) + any `decisions/` ADRs.
- **Writes:** nothing. `check` never writes files.
- **Reports:** pass/fail per boundary, with the specific assertion that failed.
- **Enforces (the four contracts):**
  1. **Integrity** — AGENTS.md exists, non-empty, within `maxLines` (default 40, manifest-configurable).
  2. **Communication** — `## Communication` section exists, non-empty, contains obligation language (`may`/`must`/`must not`/`owed`), and contains no mechanism leakage (no `.ts`/`.tsx`/etc. file-path patterns in the body).
  3. **Surface** — every symbol declared in the AGENTS.md "Key entry point" section is actually exported from the named file. (Surface containment: the declared surface matches the code's surface.)
  4. **ADR** — any ADR references in AGENTS.md resolve to files in `decisions/`, and no referenced ADR is in `terminal` status without a replacement path.

### `boundary map [--dry-run|--write]`

Regenerate the module map from the per-boundary AGENTS.md files.

- **Reads:** all `AGENTS.md` files under the repo (configurable glob). From each: boundary name (H1), one-line purpose, Does NOT (ownership boundaries), Key entry point (surface), allowed imports if declared.
- **Writes (`--write`):** `docs/boundaries.md` — YAML frontmatter (machine-readable, for re-runs) + markdown table (human-readable). Includes a generated header comment: `<!-- Generated by 'boundary map'. Do not edit — regenerate with 'boundary map'. -->`.
- **Reports (`--dry-run`, default):** what `docs/boundaries.md` would contain. No file written.
- **Enforces/checks:** single source of truth. The map is derived from AGENTS.md files, never hand-edited. Detects drift between the map and the contracts on re-run.

### `boundary lint [--dry-run] [--phase 1]`

Content-rule enforcer — mechanism leakage detection in the Communication section.

- **Reads:** the `## Communication` section of each AGENTS.md (or a single file via `--file <path>`).
- **Writes:** nothing. `lint` reports only.
- **Reports (`--dry-run`, default):** per line in each Communication section — classification as obligation or mechanism, and pass/fail. Failures list the offending line and the matched mechanism signal.
- **Enforces/checks (Phase 1, rule-based):**
  - **Reject (mechanism):** file extensions (`.ts`, `.tsx`, `.py`, `.go`, `.rs`, `.js`), file paths with extensions, library names with versions (`zod@3.21`), specific numeric counts (`3x`, `5 retries`, `max 5`), param shapes (`{ userId, expiresAt }`), error code enums (`ECONNREFUSED`, `card_declined`).
  - **Allow (obligation):** obligation language (`may`, `must`, `must not`, `owed`, `owns`, `guarantees`, `rejects`, `never`, `always`), capability verbs (`makes`, `provides`), boundary names without file extensions.
  - **Phase 2** (LLM-based classification of ambiguous lines) — see below. Phase 1 runs alone on a cold project with no LLM access.

### `boundary lint --phase 2 --emit-prompt`

Phase 2 LLM-based content enforcer — emit a classification prompt.

- **Reads:** `boundaries.yaml` manifest + each AGENTS.md's Communication section lines that passed Phase 1 but need judgement.
- **Writes:** nothing. Emits the classification prompt to stdout.
- **Reports:** a structured prompt the user pastes into an LLM. The LLM returns JSON classifying each candidate line as `obligation` / `mechanism` / `ambiguous`. With no API key and no explicit sub-flag, this is the default `--phase 2` behavior (a short header is printed first so stdout isn't a bare prompt).

### `boundary lint --phase 2 --apply <file>`

Phase 2 LLM-based content enforcer — apply the returned classification JSON.

- **Reads:** the classification JSON file produced by an LLM from the `--emit-prompt` output.
- **Writes:** nothing. Reports only.
- **Reports:** per line — final classification and pass/fail. Any line classified as `mechanism` or `ambiguous` fails. Exits non-zero if any line failed.
- **Enforces/checks:** the LLM is the linter for the lines Phase 1 couldn't resolve. This is what makes the content rule scale beyond the regex tripwire.

### `boundary install-hook`

Install a pre-commit hook that runs `boundary check` on commit.

- **Reads:** repo root (inferred from cwd), the target hook file path (e.g. `.git/hooks/pre-commit`).
- **Writes:** the pre-commit hook script. Idempotent: if a `boundary check` hook already exists, reports "already installed" and does not duplicate.
- **Reports:** confirmation of the installed hook path, or "already installed."
- **Enforces/checks:** nothing directly. The installed hook enforces `check` on every commit — this is the drift trigger (Gap 4) that keeps contracts authoritative (Trust model A) by catching drift before it lands.

### `boundary uninstall-hook`

Remove the `boundary check` pre-commit hook.

- **Reads:** repo root (inferred from cwd), the existing hook file.
- **Writes:** removes the `boundary check` block from the hook (or deletes the hook file if `boundary check` was its only content).
- **Reports:** confirmation of removal, or "no boundary hook found."
- **Enforces/checks:** nothing. This is the inverse of `install-hook` — it disables the drift trigger.

## How to run the tool

All commands run from inside the `boundary/` directory using `npx tsx src/cli.ts <command>`. Pass `--repo /path/to/target/repo` to point at a repo other than the current working directory.

```bash
# From inside boundary/ directory:

# Discover candidate boundaries in a target repo (no files written):
npx tsx src/cli.ts discover --dry-run --repo /path/to/repo

# Write the proposed boundaries.yaml to the target repo:
npx tsx src/cli.ts discover --write --repo /path/to/repo

# Scaffold the boundary pattern (dry-run first — pre-validate before files exist):
npx tsx src/cli.ts init --dry-run --repo /path/to/repo
npx tsx src/cli.ts init --write --repo /path/to/repo
npx tsx src/cli.ts init --write --only auth,database --repo /path/to/repo   # subset

# Enforce the four contracts:
npx tsx src/cli.ts check --repo /path/to/repo

# Draft obligation content via an LLM (emit prompt, paste into LLM, apply JSON):
npx tsx src/cli.ts generate --emit-prompt --repo /path/to/repo
npx tsx src/cli.ts generate --dry-run --apply drafts.json --repo /path/to/repo   # pre-validate
npx tsx src/cli.ts generate --apply drafts.json --repo /path/to/repo            # write
npx tsx src/cli.ts generate --apply drafts.json --force --repo /path/to/repo    # overwrite existing

# Regenerate the module map:
npx tsx src/cli.ts map --dry-run --repo /path/to/repo
npx tsx src/cli.ts map --write --repo /path/to/repo

# Content-rule enforcer (Phase 1 rule-based, Phase 2 LLM-assisted):
npx tsx src/cli.ts lint --repo /path/to/repo
npx tsx src/cli.ts lint --phase 2 --emit-prompt --repo /path/to/repo
npx tsx src/cli.ts lint --phase 2 --apply classification.json --repo /path/to/repo

# Drift trigger (pre-commit hook that runs 'boundary check'):
npx tsx src/cli.ts install-hook --repo /path/to/repo
npx tsx src/cli.ts uninstall-hook --repo /path/to/repo

# Type check the tool itself:
npx tsc --noEmit

# Run the tool's own test suite:
npx vitest run
```