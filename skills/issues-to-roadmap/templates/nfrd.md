<!-- nfrd: a non-functional requirement with a measured threshold. Enforced by a gate, not by prose. -->
## Requirement
The quality: performance, size, accessibility, i18n, availability.

## Threshold
<the number>, measured by <the tool or query>, on <what>.

## Applies to
#<spec>, #<spec>, or the surface it covers.

## Enforced by
<the gate, hook or CI check that fails when the threshold is crossed; if none exists, the spec that adds it>

## Governing decisions
<the ADR the threshold comes from, or "None recorded">

## Closed by
Closes when the gate above is in place and passing. Never implemented on its own.
