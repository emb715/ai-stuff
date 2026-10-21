---
name: Spec
about: A unit of work for a human or an agent
labels: spec
---
## Outcome
One sentence, user-visible.

## Acceptance criteria (each one mechanically checkable)
- [ ] POST /invoices returns 201 with the new invoice id
- [ ] amount <= 0 returns 422, code INVALID_AMOUNT
- [ ] test: invoices.create.rejects_negative_amount

## Scope
In:  src/api/invoices/**
Out of scope (required): billing UI

## Governing decisions
ADR 0007 (tenancy), 0012 (jobs)

## Validation
`pnpm validate`, plus the route-specific check.
