# Issues: billing service planning · 2026-10-08

Tracker: NOT READ. This session's repo (emb715/ai-stuff) is not the billing service; its remote is not the billing tracker. No existing issues, milestones, projects, labels or ADRs were checked, so "new" below is unverified against duplicates. Need: the billing repo / team identity.
Canonical home: tracker (assumed)

## Issues

### bug: PDF download returns an empty PDF with header for an invoice with no line items   size: unknown — the pickup plan sets it   new
## Observed
GET of an invoice's PDF returns 500 whenever the invoice has zero line items. Reproduced by: Marta, on staging, 2026-10-07. Endpoint path and error text not captured in the notes.

## Expected
Returns 200 with a valid PDF containing the header and no line-item rows.

## Reproduce
- On staging, create or find an invoice with zero line items
- Request its PDF download

## Acceptance criteria (each one mechanically checkable)
- [ ] The reproduction above returns 200, content-type application/pdf, and a PDF that parses and contains the header text
- [ ] test: PDF generation tests, "renders header with zero line items", red before the fix, green after

## Scope
Out of scope (required): PDF layout/design changes; behaviour of PDFs for invoices that have line items.

## Picking this up
(per template)

## Size
unknown — the pickup plan sets it. Not read yet: the PDF rendering code and where it assumes at least one line item.

## Governing decisions
None recorded

## Validation
The billing repo's validate command, plus the new zero-line-item test.

## Closed by
A human, after confirming on staging.

---

### spec: Create an invoice via POST /invoices   size: S (estimate, unread codebase)   new
## Outcome
A client can create an invoice and receive its id.

## Acceptance criteria (each one mechanically checkable)
- [ ] POST /invoices with a valid body returns 201 and the new invoice id in the response
- [ ] POST /invoices with amount = 0 returns 422, code INVALID_AMOUNT
- [ ] POST /invoices with amount < 0 returns 422, code INVALID_AMOUNT
- [ ] test: invoice API tests, one test per criterion above

## Scope
In: POST /invoices through route, validation, persistence.
Out of scope (required): update/delete endpoints; fields other than amount beyond what the existing invoice model requires; auth changes.

## Picking this up
(per template)

## Size
S, estimated at filing. Unknown: the request body schema and whether the invoice model already exists.

## Governing decisions
None recorded

## Validation
The billing repo's validate command, plus the three API tests.

## Closed by
A human, on review of the PR.

---

### spec: List invoices, 50 per page, newest first   size: S (estimate, unread codebase)   new
Blocked by: the p95 NFRD below is not a blocker to start, but this spec must satisfy it.
## Outcome
Invoice list returns at most 50 invoices per page, newest first.

## Acceptance criteria (each one mechanically checkable)
- [ ] With >50 invoices, the first page contains exactly 50
- [ ] Items are ordered by creation time descending
- [ ] The last page contains the remainder and no invoice appears on two pages
- [ ] test: invoice list tests, one per criterion

## Scope
In: the list-invoices path through route, query and response.
Out of scope (required): filtering, search, sorting options, page-size parameter.

## Picking this up
(per template)

## Size
S, estimated at filing. Unknown: whether a list endpoint exists today; paging mechanism (see open questions).

## Governing decisions
None recorded

## Validation
The billing repo's validate command, plus the pagination tests.

## Closed by
A human, on review of the PR.

---

### nfrd: Invoice list p95 stays under 300ms   new
## Requirement
Invoice list latency.

## Threshold
p95 < 300ms, measured by <tool unknown — open question>, on <dataset/environment unknown — open question>.

## Applies to
The list-invoices spec above.

## Enforced by
No gate exists as far as known. A spec adding one is not drafted until the measurement question is answered.

## Governing decisions
None recorded

## Closed by
Closes when the gate is in place and passing. Never implemented on its own.

## Grouped upward
- Project: Invoice API. The four issues above. Outcome: invoices can be created, listed, and downloaded reliably.
- Milestone: none. The notes name no ship-together boundary.
- Roadmap: none. Self-serve billing is a stated goal, but nothing in the notes links these issues to it, and no other projects are known.

## Still a human question
- Where is the billing tracker (repo / Linear / Jira)? Blocks: all issues.
- POST /invoices request body: which fields besides amount are required? Blocks: create spec.
- Pagination mechanism (cursor vs page number) and does the list endpoint exist yet? Blocks: list spec.
- p95: what tool measures it, on what data volume, in which environment? Blocks: NFRD's enforcement.
- Dunning rework / tie to retry schedule: undecided ("not sure"). Blocks: nothing; not an issue until decided.
- What does "empty PDF with the header" contain exactly (which header fields)? Blocks: bug criterion precision.

## Left out on purpose
- Dunning rethink: an open question, not a decision.
- Self-serve billing goal: context for a roadmap, not work. Not attached to issues without a stated link.
- "Marta" is named in the bug; if the tracker is public, replace with "a team member".
