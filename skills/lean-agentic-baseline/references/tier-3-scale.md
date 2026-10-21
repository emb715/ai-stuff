# Tier 3 · Scale

Once the floor holds, these pieces let a team and its agents work in parallel without losing coherence: domain agents, tiered review, a shared plan, and a check that keeps the setup itself honest.

## Dedicated agents & an orchestrator

Give each agent a domain; put an orchestrator in front that dispatches subagents. The point is protecting the main context window — exploration, test output, and search noise stay inside a subagent, only a short summary returns.

```
orchestrator — plans · dispatches · merges summaries · never edits code
  ├─ api-agent   — src/api, src/services, src/repos   (explore, tests)
  ├─ ui-agent    — src/web, design tokens, a11y        (explore, review)
  └─ infra-agent — migrations, workflows, config       (explore, plan)
```

**Do:** split by domain boundary, not task type. Give every agent an explicit file scope and a short report format (e.g. "under 200 words: files changed, gate result, open questions" — no pasted diffs or command output). Match the model to the job.

**Don't:** switch agents mid-conversation (see Tier 2 · Sessions). Create an agent per ticket. Split work so small the coordination costs more than the context it saves.

Template: `assets/templates/tier-3/api-agent.md`

## PR review & agent autonomy, by impact

Run cheap review rounds before a human looks at anything. Which rounds run, and how much autonomy the agent gets, depends on the **impact** of the change, not a blanket rule.

| Level | The agent may | The human |
|---|---|---|
| L0 Suggest | Propose changes. Nothing written. | Applies them |
| L1 Plan-approved | Post a plan on the issue, implement once approved | Approves the plan, reviews the PR |
| L2 Open PR | Implement and open a PR | Reviews and merges |
| L3 Auto-merge | Merge after every required check + bot round passes | Notified, audits afterward |

| Change | Detected by | Review rounds | Human | Max level |
|---|---|---|---|---|
| Docs only | `docs/**` | Lint bot | Auto-approve | L3 |
| UI component | `src/web/**` | Style+a11y bot, stack bot, visual diff on preview | One reviewer | L2 |
| API surface | `src/api/**` | Correctness bot, contract check | One reviewer | L2 |
| Schema/migration | `db/migrations/**` | Schema bot, reversibility check | Required, data owner | L1 |
| Auth/security | `src/auth/**` | Security scan + correctness bot | Required, security owner | L1 |
| Dependencies | `package.json`, lockfile | Licence + advisory scan | Required, ask-first | L1 |

**Promote on evidence.** Move a path up a level only while its rework rate (Tier 3 · Metrics) stays flat. Drop it a level after an incident.

**Agent-complete is not done.** The agent moves work to review; a human or a gate closes it. A named human owns every merge — the agent's own identity already provides the audit trail, so commit trailers/attribution footers add nothing.

Templates: `assets/templates/tier-3/labeler.yml`, `assets/templates/tier-3/label-impact.yml`, `assets/templates/tier-3/bot-review.yml`, `assets/templates/tier-3/CODEOWNERS`

## Lean workflow: issues to roadmap

One canonical, reviewable home for PRD/FRD/NFRD/SPEC — never two copies of the same spec. An issue tracker is the default, because it supplies canonical revision, history, ownership and authorized access for humans and agents with no setup. Versioned repo documents under review, or another authorized system, meet the same goal; what fails is a spec that lives only in private session context. An **ISSUE** is the baseline for every kind of document, and the examples below illustrate the workflow rather than a required storage format.

```
ROADMAP → PROJECT (parent of every issue, owns a key namespace) → MILESTONE (optional, a delivery boundary) → ISSUE
```

Concept mapping across trackers:

| Concept | GitHub | Linear | Any tracker |
|---|---|---|---|
| Issue | Issue | Issue | Story, task, bug |
| Milestone | Milestone | Project milestone | Epic or release slice |
| Project | Project (board) | Project | A deliverable group |
| Roadmap | Project roadmap view | Initiative | Roadmap/portfolio view |

Make an issue agent-ready:
- **One issue, one session, one PR.** Size against the reviewer as well as the context window, and take the smaller — a session writes more than a person reviews carefully. Split before starting, not halfway through.
- **Mechanically checkable criteria.** Not ready: "orders endpoint works correctly." Ready: "POST /orders with amount <= 0 returns 422, code INVALID_AMOUNT." If you can't state it mechanically, it's still a design question for a human.
- **Out of scope is required.** Stops scope creep and answers "why didn't this also handle X".
- **Slice vertically.** One thin path through every layer that does one thing end to end, not a layer at a time. One criterion per issue, or a small group, so it merges and is checked on its own. An unfinished slice ships behind a feature flag.
- **Plan on the issue, then stop.** Files touched, interfaces changed, tests named against the criteria, what is deliberately not being done. Wait for approval.
- **Agent-complete is not done.** Same rule as PR review — the agent moves to review, a human or gate closes it.

Template: `assets/templates/tier-3/spec-issue-template.md`

## Deploy approval & kill switches

Merging is not deploying, and neither should be something an agent does alone in production.

**Human-approved deploys.** CI publishes from a tagged release; agents don't deploy by hand. Use deployment environments so production waits for a person.

Required on the `production` environment (set in platform settings, not YAML):
- Required reviewers (up to 6, one approval releases the job) — a human is in the loop
- Prevent self-review — whoever triggered the deploy can't also approve it, and the agent identity is never a reviewer
- Deployment branches/tags limited to `v*` — only a release reaches production
- Production credentials as environment secrets — exist only for jobs referencing the environment, off the agent's filesystem

Every PR states its rollback in the PR template. For anything irreversible, say how it's undone; otherwise "low risk, internal only" is a legitimate, deliberately short answer.

**Two kinds of kill switch:**

| Kind | Stops | How |
|---|---|---|
| Product | The change | A flag off by default around high-impact changes. Test with the flag off; remove the flag once proven. |
| Agent | The actor | Because agents have their own identity: revoke the token, lock the branch, disable the workflow — without touching anyone else's credentials. |

Rehearse the stop sequence before an incident, not during one:
```
1. Revoke the agent identity's token (human credentials untouched)
2. Lock the default branch, remove agent from any bypass list
3. gh workflow disable "<agent workflow>"
4. Push a managed-settings deny rule for Bash/Edit/Write, fleet-wide
5. Turn the flag off, or follow the PR's Rollback section
6. Record what happened on the issue; write an ADR if a control has to change
```

Anyone on the team may pull it, no approval needed to start — an unnecessary stop costs an afternoon of re-running work; a late one costs the incident.

Templates: `assets/templates/tier-3/deploy.yml`, addition to `assets/templates/tier-0/PERMISSIONS.md` under "Stopping agents"

## Metrics & evals

The table below retains v3.2 examples, not current universal definitions or thresholds. For the refined attributed follow-up fix-rate definition, observation windows, exclusions and countermetrics, use `assessment.md` § Measure whether adoption earns its cost. Same-file edits alone do not prove corrective rework.

Without measurement you can't tell which parts of this setup earn their keep. Key everything by **actor** — agents need their own identity partly so "the agent's PRs" is a query, not a guess.

| Metric | What it tells you | Starting alarm |
|---|---|---|
| Rework rate | Reverts, reopens, or a fix to the same files within 7 days | Trending up |
| Approval latency vs diff size | Whether the review layer still works or just looks like it | Large diff approved in under 2 min |
| Gate failures by gate | A gate that never fails is either perfect or not running | Any gate at 0% or above 60% |
| Flake rate per test | Agents "fix" flakes by changing correct code | Any test above 1% |
| Loop detection | Repeated editing / repeated gate failure in one session | Edit >5x, or gate fail >3x in a row |
| Bot comment resolution | Dismissed comments train everyone to ignore the bot | Below 40% |
| PR open→merge, by review wait | Locates the real bottleneck | Review wait trending up |
| Cost per merged PR | The only number that makes the tradeoff legible | None — compare over time |

**These starting alarms are assumptions, not findings** — reasonable defaults nobody has measured on your codebase yet. Record the method and date when you replace one with a real number.

Evals for the setup itself (emerging practice): keep a small replay set — 5-10 real, closed issues with mechanically checkable criteria. Re-run when AGENTS.md/a skill/a hook/the model changes, compare first-pass gate results, rework, tokens/cost. No standard tooling yet — a script and a spreadsheet are enough to start.

`CLAUDE_CODE_ENABLE_TELEMETRY=1` exports OpenTelemetry metrics including `claude_code.cost.usage` and `claude_code.token.usage`.

## Meta framework & drift checks

Configuration rots silently, and prose can't tell you it has. A checker, a schedule, and a template are the antidote.

A checker should verify:

| Check | What it catches |
|---|---|
| Steering doc under budget, every named path exists | Bloat, dangling references |
| ADR index and records agree, governed paths still exist | Stale decisions |
| `validate` is what CI runs, in both directions | Local/remote quietly diverging |
| Gate paths are human-owned, agent identity absent from CODEOWNERS | An agent editing its own gates |
| No secrets in tracked files; no spec duplicated outside its canonical home | Leaks, and two revisions of one spec drifting apart |

**Original four-outcome proposal:** `pass` / `fail` / `skip` / `unverifiable`. Current inventory schema v2 separates applicability from evidence and distinguishes configured from behaviorally verified; see SKILL.md. A check that did not run is not a pass, and a missing configuration is not automatically inapplicable.

The same idea applies to the templates this guide ships as advice, not just to gates: a repo that copied `AGENTS.md`'s skeleton six months ago has no way to know the skeleton changed since, unless something records what version it copied and checks it against the current one. This skill's own `scripts/adopt.sh` + `scripts/check-pinned-versions.sh` (see SKILL.md) apply the drift-check pattern to itself — a `DRIFT` outcome there means "the source template moved since you adopted it," the same flaggable-staleness idea as an ADR's governed-path glob, just applied to advice instead of to decisions.

Templates: `assets/templates/tier-3/drift-workflow.yml`, `assets/templates/tier-3/baseline-check-output.md`

**Scheduled upkeep that resolves, not just reports** — a dependency bot can fix a class of rot with nobody in the loop, as long as it's treated as one more actor under the rules already in this guide, not a special case:

| Scheduled job | Cadence | What it opens | Who closes it |
|---|---|---|---|
| Drift check | Weekly | A failing run, or an issue | A human — drift is usually a decision, not a fix |
| Dependency bot | Weekly, off-hours, grouped | One PR per group | Itself, inside a promoted band. Otherwise a human. |
| Security advisory | On advisory, ungrouped | One PR, immediately | A human, ask-first — never inside the auto-merge band |
| Preview QA round | Per PR on UI paths | A preview URL + visual diff | A human, when pixels changed |

Promote one *narrow* band to L3 auto-merge on purpose — dev-only deps, patch/minor, after a minimum release age, grouped into one PR — worth its own ADR, since it's the one place code reaches `main` with no human in the path. Leave production deps, majors, and lockfile-rewriting updates where they are.

Template: `assets/templates/tier-3/renovate.json`

## Onboarding & contributors

Two small files that make the codebase legible to everyone who arrives later, human or agent — and don't load into every agent session, since they're for people.

| File | Contains |
|---|---|
| `CONTRIBUTORS.md` | Rules of engagement: how to propose a change, branch, commit, test, get reviewed. What agents may and may not do on their own. |
| `ONBOARDING.md` | How to run the app, an architecture map, where decisions/specs live, who owns what, a short glossary |

They double as a test: if a new joiner can't get productive from them, the steering doc and ADRs are missing something too.
