# humans.md — change-impact

## Why this file exists

The three-file artifact structure requires it, and this folder shipped without it. It was found on 2026-10-07 by DL015, a lint rule added that day to check artifact folders for completeness rather than checking only the files that happen to exist. This folder and `skills/issues-to-roadmap/` were the only two violations in the vault.

Written after the fact, from the artifact itself (`README.md`, `action.yml`, `package.json`, `src/`, `test/`) rather than from the session that produced it. Where a design decision is readable from the code it is stated as such; where the original reasoning is not recoverable, it says so instead of guessing.

## Structure, and why

```
src/core/       diff, llm selection, prompt assembly, marker parse, PR-body upsert
src/providers/  anthropic, openai (+ compatible baseURLs), cli (claude), ollama, fallback
src/action/     GitHub Action entry point
src/cli/        npx entry point
dist/           ncc-bundled single files, one per entry point
test/           46 cases: parse (18), upsert (19), diff (9)
```

The split that matters is **core versus providers**. Everything provider-specific is one file behind one interface, so adding a provider means adding a file in `src/providers/` and a row to the detection order — not touching diffing, prompting, or upsert. The OpenAI-compatible providers (Fuelix, Omniroute, custom `OPENAI_BASE_URL`) reuse one file with a different `baseURL`, which is why the provider list is longer than the provider count.

Two entry points, one core. The Action and the CLI do the same five things in the same order (diff → load skill → assemble prompt → call provider → deliver block) and differ only in where the PR context comes from and how the block is delivered. That is deliberate: a behaviour change belongs in `src/core/`, where both inherit it.

`dist/` is committed because a GitHub composite action using `runs: node20` loads a built file at `dist/action/index.js` — there is no install step in an Action run. The consequence: **a source change is invisible to the Action until `npm run build:all` is re-run and the bundle committed.** That is the easiest way to ship a silently stale tool from this folder.

## Design decisions readable from the code

- **The skill is the prompt; the tool is the runner.** `src/skill-fallback.ts` holds a byte copy of `skills/change-impact-diagram/SKILL.md`, used only when neither the explicit `--skill-path` nor the default path resolves. The copy drifts the moment the skill is edited, and nothing detects that today. If the skill changes, regenerate the fallback.
- **No LLM is a supported outcome, not an error.** With no provider, the tool writes a self-contained prompt bundle (skill + diff + instructions) and the human pastes it into any chat. This is why the tool has no hard dependency on any vendor, and why `--llm none` is a first-class flag rather than a debug option.
- **Upsert is marker-delimited and idempotent.** The block is bounded by `<!-- change-impact:start -->` / `<!-- change-impact:end -->`, and a re-run on `synchronize` splices over the existing block rather than appending. 19 of the 46 tests cover this one behaviour, which is a fair signal of where the bugs were.
- **Shelling out is done with `execFileSync` and array arguments,** with `validateRef` / `validateRepo` on anything that reaches a git or `gh` invocation. Refs and repo names arrive from PR event payloads and CLI flags, so they are untrusted input into a subprocess.
- **Large diffs are truncated, not rejected,** at `max-tokens * 4` characters, down to `--stat` plus files with more than 50 changed lines, with a note in the prompt saying so. The number is a budget chosen to fit a context window, not a measurement.
- **Progress goes to stderr, the block to stdout or a file**, so the CLI composes in a pipeline.

## Maintenance notes

- `npm test` (vitest) runs 46 cases; the count is verified (`parse` 18, `upsert` 19, `diff` 9). `prepublishOnly` chains `tsc --noEmit`, the tests, and both bundles — use it rather than publishing by hand.
- `node_modules/` is committed in this folder. It makes the directory large and the vault's lint and search noisier. Leaving it is the status quo, not a decision anyone recorded.
- When adding a provider: one file in `src/providers/`, one row in the detection order in `src/core/llm.ts`, one row in the README's priority table, and a rebuild of both bundles.
- The Fuelix provider accepts both `FUELX_API_KEY` and `FUELIX_API_KEY`. That is a typo tolerated on purpose; do not "fix" it by dropping one without checking what consumers set.
- `last_tested` in the README frontmatter is 2026-07-30 and the vault's DL014 threshold is 180 days. Re-verify end to end before that lapses, or the artifact starts failing lint on staleness.

## Known gaps

- **No provenance.** The session that built this tool is not recorded anywhere, so the alternatives considered (why a composite Action rather than a reusable workflow, why ncc rather than publishing a package, why these four diagram types) are unknown. Reconstructing them from the code would be a guess.
- **No drift check between the skill and the bundled fallback.** The README calls this out and suggests a build step; none exists.
- **Only Fuelix was exercised end to end.** Anthropic, OpenAI, the `claude` CLI and Ollama providers are implemented and unit-tested in isolation; the README's evidence section does not claim a live run for them, and neither does this file.
- **The published-Action install path is documented but not available.** The README's "Install from a published Action (when available)" block describes something that has not been published.
