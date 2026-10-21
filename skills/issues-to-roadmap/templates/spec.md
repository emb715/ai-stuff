<!-- spec: one vertical slice of new behaviour. The guide's tracker pillar is the origin; Size and Closed by are additions. -->
## Outcome
One sentence, user-visible.

## Acceptance criteria (each one mechanically checkable)
- [ ] <action> returns <observable result>
- [ ] <edge case> returns <observable result>
- [ ] test: <where it lives>, <its name>

## Scope
In: <the surface this slice touches, one line — one path through every layer, not one layer>
Out of scope (required): <what a reviewer might expect and will not find, one line>

## Picking this up
Write the plan — files touched, interfaces changed, a test named against every criterion, the criteria deliberately deferred — and state the size that plan implies, before reading the Size section below. Then compare the two numbers out loud. If they disagree, the plan wins and the issue gets re-sized or split.

## Size
<XS | S | M | unknown — the pickup plan sets it>, estimated at filing. If unknown: <what has not been read yet>.
If over the ~400-line ceiling: <the exemption claimed, and the number of decisions a reviewer must check>.

## Governing decisions
<ADR numbers and titles, or "None recorded">

## Validation
<the repo's validate command>, plus <the check specific to this slice>.

## Closed by
<the human or the gate that closes this. The implementing agent moves it to review and stops.>
