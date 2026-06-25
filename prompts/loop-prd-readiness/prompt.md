Prepare project for implementation readiness from {{DOC}}.

Build an atomic requirement list with traceability to source sections, design targets, acceptance criteria, and test cases. Each round, resolve the highest-risk missing | conflict | partial item with the smallest doc change that reduces build ambiguity. Keep assumptions explicit, log contradictions, and ask before any product fork. Recheck cross-doc consistency each round.

Then run two independent reviews; each must summarize components, data model, dependencies/contracts, and definition of done.

Stop when both materially agree and no P0/P1 unknowns remain and every requirement is testable; otherwise stop blocked with the exact user decision needed.
