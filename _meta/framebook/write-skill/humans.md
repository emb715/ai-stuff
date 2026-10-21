# humans.md — Write a Skill

## Origin

Created 2026-06-24 as an execution wrapper for the skill-authoring process. Revised 2026-10-07 after duplicated rules drifted from the canonical skill. Historical line-count descriptions are not current acceptance criteria.

## Design decisions

- The executable delegates authoring to `skills/skill-authoring/SKILL.md` and adds only vault integration. It no longer keeps a second detailed copy of the authoring rules.
- Body and description are finalized before canonical Step 10 evaluation. Static authoring, matched behavior, actual discovery, and cost are reported separately; missing measurements do not become successful tests.
- Essential safeguards are prioritized by consequence and common-path relevance, not by a single-warning quota. Runtime depth uses `references/` and requires delivery checks.
- The vault's maintainer record is separate from executable loading. Installed-package requirements are not automatically the same as vault record requirements.

## Maintenance notes

- If the canonical authoring process changes, review delegation, scope, evaluation dimensions, resource delivery, and vault integration rather than copying all its steps again.
- Keep README and maintenance records consistent with the executable. After a real wrapper run, record results and use the separate promotion procedure; successful tests do not automatically promote it.
- The 2026-10-07 authoring fixture comparisons are evidence about the authoring skill, not a standalone run of this framebook. Its lifecycle/date are not advanced on that basis.
