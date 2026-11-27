# Classify and route

## Layer

Give every touched primitive exactly one layer. Decide from what the code does, then confirm with the path. A path alone is a guess, and shared code is classified by its callers.

| Layer | What it is | Typical signals |
|---|---|---|
| `frontend` | Code that renders or runs in the client | components, pages, routes rendered in a browser or app, styles, client state, `*.tsx`/`*.vue`/`*.svelte`, `app/`, `ui/`, `web/` |
| `backend` | Code that serves requests or runs jobs | handlers, controllers, services, auth, queues, workers, `api/`, `server/`, `functions/` |
| `data` | The shape and movement of stored data | schemas, migrations, ORM models, queries, seeds, `migrations/`, `*.sql`, `prisma/` |
| `infra` | Where and how the code runs | CI, containers, IaC, deploy and runtime config, `.github/workflows/`, `Dockerfile`, `terraform/` |
| `build` | How the code is assembled | build tooling, dependency manifests and version bumps, bundler and compiler config |
| `spec` | Text that a model or a process follows as rules | agent and prompt files, skills, system prompts, protocols, rules files, `CLAUDE.md`/`AGENTS.md`, policy configs, golden fixtures for them |
| `docs` | Text for people | markdown, docs sites, comments-only changes |
| `test` | Proof the code works | test files, fixtures, test config |

A file that serves two layers (a server-rendered page, a shared validation module) takes the layer of the riskier caller: `data` > `backend` > `spec` > `frontend` > `infra` > `build` > `test` > `docs`.

Markdown is not automatically `docs`. If a model, a script or a test reads the file and acts on what it says, it is `spec`.

## Op

Use the classification from the `change-impact-diagram` skill:

| Op | Meaning |
|---|---|
| `composes` | Uses existing primitives as they are. Only wiring and call sites change. |
| `extends` | Changes a primitive's behaviour, shape or contract. |
| `adds` | Introduces a new primitive. |
| `removes` | Deletes a primitive's code paths. |

Mark `invariant` when the change touches a rule the primitives map or the repo's instructions state as an invariant (for example per-user isolation, money handling, auth boundaries).

## Routing matrix

`ndv-review` runs on every review. A column includes everything to its left in the same row.

| Layer | composes | extends | adds / removes |
|---|---|---|---|
| frontend | review | + `ndv-accessibility` if interactive elements, forms or colour change; + `ndv-design` if layout or hierarchy changes | + `ndv-architect`, `ndv-tester` |
| backend | review | + `ndv-secure` on auth, input or permission paths; + `ndv-telemetry` on new or changed error paths | + `ndv-architect`, `ndv-tester`, `ndv-secure` always |
| data | review | + `ndv-optimize` on changed queries | + `ndv-architect`, `ndv-secure`, `ndv-tester` |
| infra / build | review | + `ndv-upgrade` on dependency or runtime version bumps | + `ndv-architect`, `ndv-secure` |
| spec | review, full file | + `ndv-architect` for internal consistency (new text against every other rule, section and example in the file and its mirrors); + `ndv-tester` when goldens or protocol tests change | + `ndv-scope` (does the new rule fit the file's stated purpose) |
| docs / test | review (light: accuracy against code only) | + `ndv-tester` when tests change | n/a |

Rules on every layer:

- `invariant` on any primitive adds `ndv-secure`.
- A diff whose primitives do not serve one intent (unrelated changes bundled together) adds `ndv-scope`.
- For `spec`, depth is always the whole file plus its mirrors (human-facing copies, decision records, generated fixtures), whatever the op. A rule contradicts another rule far from the hunk more often than inside it.
- Slow-path signals in the diff (loops over queries, unbounded reads, large bundle additions) add `ndv-optimize`.

## Merging

One specialist appears once in the plan, carrying all of its primitives. The cap is 6, or 4 when more than 10 files changed. If more specialists result, keep `ndv-review` and the specialists attached to the highest ops first, and list the rest in Deferred as `Skipped: <agent> (cap)`.
