<!-- bug: something that works wrong today. The fix is done when the reproduction passes. -->
## Observed
What happens, where, since when. Paste the error or the wrong output. Reproduced by: <who, or "not yet">.

## Expected
What should happen instead, one sentence.

## Reproduce
- <step or command>
- <step or command>

## Acceptance criteria (each one mechanically checkable)
- [ ] The reproduction above <observable result>
- [ ] test: <where it lives>, <its name>, red before the fix, green after

## Scope
Out of scope (required): <the neighbouring behaviour this fix will not touch>

## Picking this up
Write the plan — files touched, interfaces changed, the test that goes red before the fix — and state the size that plan implies, before reading the Size section below. Then compare the two numbers out loud. If they disagree, the plan wins.

## Size
<XS | S | M | unknown — the pickup plan sets it>, estimated at filing. If unknown: <what has not been read yet>.

## Governing decisions
<ADR numbers and titles, or "None recorded">

## Validation
<the repo's validate command>, plus <the check that fails on the reproduction above>

## Closed by
<the human or the gate that closes this. The implementing agent moves it to review and stops.>
