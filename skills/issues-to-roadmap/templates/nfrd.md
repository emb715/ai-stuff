<!-- nfrd: a non-functional requirement with a measured threshold. Enforced by a gate, not by prose. -->
## Requirement
The quality: performance, size, accessibility, i18n, availability.

## Threshold
<the number>, measured by <the tool or query>, on <what>.
<or, when the owner decided to measure first:>
Provisional: <the number in force until re-decided>, measured by <the tool or query>, on <what>.
Baseline: measured by #<spec>.
Re-decide when: <the trigger — the baseline spec closes, a date, a sample size>. Decided by <name>.

## Applies to
#<spec>, #<spec>, or the surface it covers.

## Enforced by
<the gate, hook or CI check that fails when the threshold is crossed; if none exists, the spec that adds it>

## Governing decisions
<the ADR the threshold comes from, or "None recorded">

## Closed by
Closes when the gate above is in place and passing against a final threshold. A provisional threshold keeps this open until it is re-decided. Never implemented on its own.
