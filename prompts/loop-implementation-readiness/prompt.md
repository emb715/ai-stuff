Validate {{DOC}} against {{CODEBASE}} within {{BUDGET}}.

Round 0 — Build a finite requirement list. Enumerate every requirement, decision, and acceptance criterion traceable to {{DOC}}. Each item gets: an ID, the doc section it traces to, and a risk tier (P0 / P1 / P2). Do not infer requirements that are not in the doc; doc gaps get flagged separately as items the doc itself is missing, not as codebase requirements. Record the list and the rubric (covered / partial / missing / conflict) once, here — it is the check the rest of the loop re-runs.

Each round:
1. Pick the highest-risk unresolved item — P0 before P1, conflict before missing before partial.
2. Map it to code evidence in {{CODEBASE}}: a file, a symbol, a test, or a committal absence (the search returned nothing despite the requirement existing).
3. Classify it: covered | partial | missing | conflict. Record the evidence anchor (file + symbol/line/test name). No anchor means missing — do not assert coverage without one.
4. Define the smallest action that closes the gap: a code change, a doc amendment, a test, or a decision request. One item, one action, one diff.
5. Ask before executing any destructive, production, or sensitive action — data migration, schema change, public endpoint, secret rotation, force-push, dependency bump, anything that touches production data or external callers. Otherwise execute the action.
6. Re-check the same readiness rubric on the full list: recount covered / partial / missing / conflict; list the remaining P0/P1 unknowns; confirm no item regressed.
7. Record the round delta: item ID, before/after classification, action taken or requested, evidence anchor after the change.

Repeat only while measurable progress is made — at least one item's classification strictly improved or one P0/P1 unknown was resolved this round — AND {{BUDGET}} remains. If a round produces no classification change, stop immediately: idling is not progress.

Stop:
- READY — every requirement is evidence-backed (has a real code anchor) AND no P0/P1 unknowns remain.
- READY_WITH_CONDITIONS — all P0 requirements are covered; remaining items are P1 unknowns, each paired with the exact user decision it needs.
- NOT_READY — progress stopped or budget exhausted with unresolved P0/P1. Surface, per blocker: the exact missing decision or input, the requirement ID it blocks, and the smallest action that would unblock it.

Never: invent code evidence; declare an item covered without an anchor; skip the rubric re-check; let an item silently regress; bundle multiple requirements into one action; or continue past a NOT_READY block unilaterally.

Return the verdict with the full requirement list (classification + anchor per item), any blockers with their required decisions, and the smallest next-action for each blocker.