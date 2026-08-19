# humans.md — Fix Compliance Failures

## Origin

Created 2026-06-24. AGENTS.md defines the BLOCKED output format and the 6 gates but says nothing about how to resolve a failure. The enforcement existed; the procedure to respond to enforcement did not.

## Design decisions

- Gate ordering (4→1→2→6→3→5) is intentional. Sanitization first because a dirty artifact shouldn't be structurally analyzed. Frontmatter second because missing keys break downstream checks. Index linkage before evidence because you can have evidence and still be an orphan. Evidence last because it may require a real test run.
- Gate 3 explicitly blocks fabricated evidence. The temptation when something is "almost ready" is to write a plausible-sounding outcome. This playbook calls that out and redirects to "stay at draft."
- "Accept with reason" is a legitimate path for Gate 3 when real testing is blocked. The key is that the acceptance must be documented — not silently skipped.
- The lint code table maps DL codes to meaning because the linter output is not always self-explanatory, especially for new users.

## Maintenance notes

- The lint codes (DL001–DL014) are based on the current state of `doc_lint.py`. If new codes are added, update the reference table in the playbook.
- Currently Gate 3 and Gate 5 are only partially covered by the linter. When the linter is expanded, the "manually verify" note in step 4 can be updated or removed.
- If AGENTS.md adds a Gate 7 or changes gate definitions, update the gate reference table in step 1.
