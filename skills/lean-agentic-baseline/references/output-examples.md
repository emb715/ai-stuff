# Decision-card examples

Synthetic fixtures for output calibration, not observed results or platform documentation. Adapt the structure rather than copying recommendations. Source labels refer to hypothetical supplied evidence.

## Investigation before adoption

**Decision:** Investigate first; defer local hooks and hosting enforcement.

**Evidence:** Supplied validation log fails on ignored tool files; supplied hosting snapshot has no required checks. Failed-run and merge totals alone do not establish bypassed merges.

**System impact:** Required checks would block merges while CI is red. Local hooks are bypassable and cannot satisfy your no-bypass requirement. No current policy changes.

**Next:** 1. Diagnose CI and confirm the local test's intended boundary → trustworthy gates. 2. Confirm private-repo feature support and actor/bypass policy → feasible enforcement. 3. Propose required checks only after prerequisites pass.

**Acceptance:** In a disposable equivalent repository, passing checks permit merge; failing required checks block a non-bypass actor. Repeat against the intended deployment path only after approval, without destructive pushes.

**Owner / effort:** Maintainer owns policy and exceptions; diagnosis and upkeep cost remain unknown. Revisit after gate reliability is established.

**Approval:** May I investigate the failing gate without changing files?

## No change

**Decision:** No new control. Your existing CLI validation already addresses the supplied problem.

**Evidence:** Supplied fixture logs show valid input passing and invalid input rejected. They do not prove every command path.

**System impact:** Preserve the current workflow; no files, tools or hosting settings added. Shared memory and production approval add no justified benefit for this local, single-maintainer use.

**Next:** Continue the existing gate; revisit if concurrent agents or production access appear.

**Acceptance:** Existing positive/negative fixtures cover the stated path; untested paths remain open.

**Owner / effort:** Maintainer keeps existing upkeep; no new setup cost.

**Approval:** None needed; no changes proposed.

## Unsafe probe rejected

**Decision:** Defer verification on the real default branch; use a disposable repository.

**Evidence:** The supplied ruleset is configured, not behaviorally verified. Effective actor permissions and bypasses remain unknown.

**System impact:** A force-push probe could rewrite real history if protection fails. The replacement test affects only disposable history and does not prove production enforcement by itself.

**Next:** Obtain authorized policy/actor evidence → reproduce the relevant rules in a disposable repository → test allowed and denied paths there.

**Acceptance:** A permitted update succeeds; a forbidden update from the specified non-bypass actor is rejected. If it succeeds, only disposable state changes. Do not use draft-PR merge unavailability as proof of a required check.

**Owner / effort:** Repository administrator approves test scope and controls policy; feature availability and setup effort are unresolved.

**Approval:** Approve a disposable test environment, not a force push to the real default branch.
