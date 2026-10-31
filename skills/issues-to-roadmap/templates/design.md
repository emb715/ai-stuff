<!-- design: the decisions, contracts, audits and migration steps the specs build against. Cited by id, never implemented on its own. -->
## Covers
The area this design governs, one sentence. Part <n> of <m> when an area was split to fit the body limit; the other parts: #<n>, #<n>.

## Design
Each entry has a stable id. Specs cite it as `#<this issue> D<n>`. Ids are never renumbered or reused; a withdrawn entry stays, marked `Withdrawn: <why>, <date>`.

### D1 · <short name>
<kind: decision | contract | audit | migration step>
<the content: the decision and its reason, the contract's shape, the audit's findings, or the step's preconditions and order>

### D2 · <short name>
<kind>
<content>

## Artifacts
Material that cannot live in this body. Every link pinned so it never moves: a commit permalink (`/blob/<sha>/<path>`) or a release asset URL, never a branch link.
- <what it is> — <pinned link> — <which D entries depend on it>

## Still open
- <question that must be answered before a spec citing this design can be planned>. Blocks: <D id or spec>.

## Answered
- <question> — <the answer>. Decided by <name>, <date>, in <where: meeting, thread, issue comment>.

## Cited by
#<spec>, #<spec>, #<prd>

## Out of scope (required)
<what this design deliberately does not decide>

## Governing decisions
<ADR numbers and titles, or "None recorded">

## Closed by
Closes when every issue under Cited by is closed. Never implemented on its own.
