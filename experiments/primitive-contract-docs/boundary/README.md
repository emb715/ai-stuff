# boundary

A scaffolder + enforcer for per-module obligation contracts. You point it at a repo, it proposes module boundaries, scaffolds an `AGENTS.md` contract per boundary, derives a module map from those contracts, and enforces that the contracts stay obligation-only and match the code's actual surface. It never writes obligation content — that's human/agent judgment. It creates structure, derives views, and enforces the content rule.

The experiment context lives in `../README.md`. This file is self-contained orientation for someone who just landed in the `boundary/` directory.

## The four load-bearing rules the tool enforces

1. **Obligation over mechanism** — the contract records what a caller must respect and what the module guarantees, not how the module does it (no file paths, param shapes, retry counts, library versions in the contract body).
2. **Module/package granularity** — one contract per boundary, where a boundary is a capability unit with one reason to change. Not per-function, not per-repo.
3. **Creation-time authoring** — the contract is written when the boundary is defined, not reverse-engineered from code afterward. The tool scaffolds the template; the decider fills the obligations.
4. **Trust model + enforcement** — the contract is authoritative (Trust model A), not advisory. `check` fails on drift; `install-hook` makes that failure block commits. Without enforcement the contract degrades to a stale README.

## Command surface

Eight commands. Default mode is dry-run (report without writing); `--write` is opt-in.

| Command | One line |
|---|---|
| `discover` | Scan the repo, propose a `boundaries.yaml` manifest. |
| `init` | Scaffold the boundary pattern (AGENTS.md templates, decisions/ dirs, test files, module map) from the manifest. |
| `generate` | Draft obligation content: emit an LLM prompt, then apply the returned JSON to fill AGENTS.md (with `check` verification). |
| `check` | Enforce the four contracts per boundary — integrity, Communication section, surface containment, ADR status. |
| `map` | Regenerate `docs/boundaries.md` from the per-boundary AGENTS.md files (single source of truth). |
| `lint` | Content-rule enforcer. Phase 1: rule-based mechanism-leakage detection. Phase 2: LLM-assisted classification of ambiguous lines. |
| `install-hook` | Install a pre-commit hook that runs `boundary check` on every commit. |
| `uninstall-hook` | Remove the `boundary check` pre-commit hook. |

## How to run it

```bash
# From inside boundary/ directory:
npx tsx src/cli.ts <command> [flags]

# Point at a target repo other than cwd:
npx tsx src/cli.ts discover --dry-run --repo /path/to/repo
npx tsx src/cli.ts init --dry-run --repo /path/to/repo
npx tsx src/cli.ts init --write --repo /path/to/repo
npx tsx src/cli.ts check --repo /path/to/repo
npx tsx src/cli.ts generate --emit-prompt --repo /path/to/repo
npx tsx src/cli.ts generate --apply drafts.json --repo /path/to/repo
npx tsx src/cli.ts map --write --repo /path/to/repo
npx tsx src/cli.ts lint --repo /path/to/repo
npx tsx src/cli.ts lint --phase 2 --emit-prompt --repo /path/to/repo
npx tsx src/cli.ts lint --phase 2 --apply classification.json --repo /path/to/repo
npx tsx src/cli.ts install-hook --repo /path/to/repo
```

## How to test it

```bash
# Type check:
npx tsc --noEmit

# Run the test suite:
npx vitest run
```

## File structure

```
boundary/
├── README.md            ← this file (tool orientation)
├── humans.md            ← maintenance context, design decisions, origin
├── package.json
├── tsconfig.json
└── src/
    ├── cli.ts           ← arg parsing, command routing, USAGE block
    ├── manifest.ts      ← reads + validates boundaries.yaml
    ├── discover.ts      ← scans repo, proposes boundaries.yaml (package-based)
    ├── init.ts          ← scaffolds AGENTS.md templates, decisions/ dirs, module map
    ├── check.ts         ← enforces the four contracts (integrity, Communication, surface, ADR)
    ├── generate.ts      ← drafts obligation content: emit LLM prompt + apply JSON
    ├── lint-phase1.ts   ← rule-based mechanism-leakage detector (regex rules)
    ├── llm-lint.ts      ← Phase 2 LLM-assisted lint: emit classification prompt + apply JSON
    ├── phase1-rules.ts  ← single source of truth for Phase 1 regex rules (shared by lint + llm-lint)
    ├── markdown.ts      ← parses AGENTS.md: sections, Key entry point declarations, ADR refs
    ├── surface.ts       ← reads entry files, extracts exported symbols (follows barrel re-exports one hop)
    ├── template.ts      ← AGENTS.md template scaffold (placeholders that fail check until filled)
    ├── hook.ts          ← install/uninstall pre-commit hook that runs boundary check
    ├── json-apply.ts    ← shared read+parse+error-wrap preamble for every --apply path
    ├── errors.ts        ← unified error model (BoundaryError + ManifestError subclass)
    ├── report.ts        ← pure output formatters for each command's report struct
    └── __tests__/       ← vitest test suite
```

## Relationship to the experiment

This tool is the operational artifact from the `primitive-contract-docs` experiment. The experiment produced the content rule (obligation over mechanism), the four load-bearing rules, the cold-start procedure, and the snapberry warm-start evidence. The tool operationalizes those: it scaffolds the structure, derives the views, and enforces the rule — but it does not replace the human judgment that draws boundaries and writes obligations.

For the full experiment context — hypothesis, critical reframe, snapberry test bed, cold-start procedure, build order — see `../README.md`.