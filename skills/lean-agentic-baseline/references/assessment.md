# Assess goals, not files

This is the skill's proposed assessment protocol. Pillar goals come from the guide; the acceptance examples below are safe-test starting points to adapt, not observed proof for a target project.

## Context intake

Use supplied context before asking anything. Identify the actual pain, stack/harness, existing controls, team/agent concurrency, production exposure, authority/access, risk tolerance and upkeep capacity. Unavailable context is a blocker or assumption, not a fact.

For each relevant pillar separate:
- **Applicability:** applicable / deferred with revisit trigger / not applicable with reason.
- **Feasibility:** achievable now / achievable with prerequisites / blocked, with access/dependency gaps.
- **Evidence:** missing / configured / verified / failed / unknown, scoped to named tests.

An equivalent implementation may satisfy the goal without using the guide's named tool or file. Propose neither wholesale adoption nor arbitrary tier waiting periods. Control authority stays with its independent owner.

## Assessment record, not the default response

Use these dimensions to assess candidates: goal/problem; applicability and revisit trigger; feasibility and prerequisites; existing equivalents; human/agent authority and upkeep owner; scoped evidence with date/source; residual limits; outcome baseline and cost; smallest next step. They are analysis coverage, not nine mandatory headings per pillar.

Use the developer-facing decision card in `SKILL.md`. Expand this record only for a requested detailed assessment. Check bypass requirements, gate reliability and hosting availability before selecting a control; a blocked prerequisite usually makes investigation the next action.

For an overall audit, inventory all 26 topics but expand only material gaps. A behavioral test can verify a bounded control without proving the entire pillar or the setup's security. Report failures and unknowns alongside successful tests.

## Acceptance and ownership matrix

“Human” below means the accountable decision or authority owner, not a requirement to perform every check manually. Authorized platform APIs, git queries and tool probes can supply evidence. Negative probes must be harmless even when enforcement fails; destructive probes belong only in explicitly authorized disposable environments, never the real default branch. An observed block must be attributable to the intended policy, not another restriction such as a draft PR.

| Pillar | Fit / equivalent adaptation | Acceptance example | Ownership / limit |
|---|---|---|---|
| Steering | Session guidance not enforced elsewhere; any supported harness file | Fresh session finds applicable guidance; remove duplication and confirm named paths resolve | Agent drafts/tests; maintainer approves guidance; line count alone proves no quality |
| Validation | Every delivery repo; stack-native command | Known violation fails, valid fixture passes, same entrypoint is used in CI | Agent wires/tests; owner chooses required gates |
| Commits | Shared history/release automation; server checks may replace local hooks | Invalid message is rejected through actual supported commit/merge path | Agent configures; owner chooses convention; local hook bypass remains separate |
| Hooks | Event-based invariants; declarative permissions first | Trigger safe violation at actual event, observe block, verify permitted action works | Agent tests within scope; independent owner protects critical definitions |
| Permissions | Any unattended authority; managed policies/identity isolation | Agent cannot alter protected gate or exceed token scope; safe denied egress probe | Owner grants/revokes scope; agent cannot approve its own boundary |
| CI | Remote delivery checks; any CI provider | Deliberately failing PR cannot merge; local/remote gate definitions agree | Agent prepares fixture; owner verifies branch/bypass settings |
| Trunk | Integration delay or stale context; appropriate small-change workflow | Inspect branch lifetime, reviewable diffs and releasable trunk; exercise flag rollback | Agent gathers history; team sets limits/flag ownership |
| Skills | Repeated repo conventions; fewer skills if model already handles work | Representative commit/PR follows actual conventions without corrections | Agent implements; maintainer measures usefulness and upkeep |
| Comments | Code explanation problems; ADR for durable decision | Reviewer can recover why a surprising choice exists; diff check rejects known ticket leakage | Agent screens; human judges explanatory sufficiency; ticket regex is partial |
| Test integrity | Risk of reaching green by weakening checks | Intentionally weaken a meaningful assertion in an isolated fixture; mutation/review catches it | Agent generates fixtures; independent reviewer approves legitimate test changes |
| Architecture | Stable enforceable boundaries; stack-native boundary checker | Forbidden import fails validate while allowed dependency passes | Architect chooses boundaries; agent implements; config presence insufficient |
| Devcontainer | Reproducibility/isolation need; equivalent sandbox/VM | Clean rebuild works; harmless host-secret and denied-network probes fail as intended | Platform owner controls isolation; container alone proves no egress/secrets policy |
| ADRs | Repeated design decisions; equivalent indexed decision records | Fresh task retrieves relevant decision and superseded status; stale governed path flagged | Agent indexes/tests; decision owner approves rationale |
| Handoffs | Work crosses sessions; shared issue may suffice | Fresh session resumes without repeating decisions or needing old transcript | Agent writes; owner checks reasons and task authority |
| Code graph | Retrieval cost/correctness bottleneck; LSP or repository map | Known definition/callers match source, index refreshes after change; compare task effort | Agent probes; maintainer selects tool; dynamic relationships may be incomplete |
| Versioned docs | External API use; installed types/help may suffice | Retrieved API evidence matches lockfile/binary version | Agent retrieves; maintainer resolves incompatible versions; mention of Context7 is not proof |
| Memory | Facts without repo home; local memory may suffice for solo work | Dated/sourced fact recalls across required users, expired fact is flagged, recall is treated as data | Owner sets sharing/retention; agent saves sanitized evidence |
| Supply chain | Dependencies/untrusted input/egress; existing controls may suffice | Unapproved dependency blocked; unsafe input cannot enlarge permissions or reach denied endpoint | Security owner controls registry/egress/identity; injection cannot be fully excluded |
| Fact homes | Conflicting or overloaded context | Sample facts have one authoritative home and load only when relevant; conflicting copies identified | Agent maps/proposes; owner resolves authority; retrieval cost needs measurement |
| Agents | Parallel domains justify isolation; single agent is valid alternative | Delegation respects file/tool ownership and returns bounded findings; compare overhead | Agent delegates within authority; maintainer defines domains; count is no benefit metric |
| Impact review | Different risks need different scrutiny | Representative high-impact PR requires right independent review; low-impact path remains cheap | Agent labels/tests; reviewer/policy owner sets autonomy; self-label downgrade risk remains |
| Issues/workflow | Shared actionable specs; equivalent versioned accessible home | Another authorized agent finds criteria, executes bounded work and links evidence to request | Agent drafts/splits; product owner decides acceptance/priority; tracker presence insufficient |
| Deploy/kill | Production exposure; equivalent protected release system | Unauthorized production attempt is blocked; authorized staging rehearsal restores change and revokes test identity | Human approves production/authorizes drill; platform owns independent stop controls |
| Metrics/evals | Claims of improvement; small matched replay set first | Recompute attributed follow-up fix rate from a matured cohort; compare quality, review effort and cost | Agent collects; owner interprets; attribution and window bias require disclosure |
| Drift | Adopted setup has ongoing upkeep | Harmless drift produces actionable alert, named owner resolves it within locally agreed window | Agent detects; owner decides corrections/removal; script presence is not schedule |
| Onboarding | New people/teams; equivalent short human docs | Newcomer runs project and submits valid first change without undocumented assistance | Agent drafts; actual newcomer supplies usability evidence |

## Measure whether adoption earns its cost

Choose one problem-specific outcome and a countermeasure for harm. Compare similar tasks before/after; record model/tool versions, task mix, sample size, observation window and uncertainty. Proposed examples:
- Enforcement: safe violations rejected without blocking legitimate changes; monitor false positives and upkeep.
- Context: retrieval effort/tokens decrease with equal task correctness; monitor stale or omitted evidence.
- Delivery: attributed follow-up fix rate falls without longer review waits or higher reviewer effort.
- Handoffs: fewer repeated decisions without growing always-loaded context.

For follow-up fix rate, choose a fixed window first (seven days is an example, not a standard). Denominator: all eligible merged PRs in a defined cohort whose full window has elapsed, with stable actor attribution. Numerator: those PRs with at least one independently classified corrective change attributed to that PR inside the window. Count each originating PR once; exclude unrelated features/refactors and report excluded/unknown attribution separately. Same-file edits alone do not establish causation. Preserve original actor identity without treating an agent as autonomous merely because it authored code.

If a control produces no observable benefit, duplicates a stronger control, or costs more than it saves, propose reducing or removing it with the owner. Never remove a required security/regulatory boundary solely because it rarely fires; agree an equivalent control first.
