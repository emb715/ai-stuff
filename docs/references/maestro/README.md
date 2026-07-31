---
title: "Maestro References Index"
status: draft
confidence: low
last_tested: 2026-07-31
scope: personal
tooling:
  - "repo-process/v1"
  - "maestro"
tags:
  - references
  - maestro
  - react-native
  - qa
  - testing
owner: "@emb715"
---

# Maestro References

Canonical source URLs for Maestro, the mobile UI testing tool used by the React Native adapter in [`skills/test-authoring/`](../../../skills/test-authoring/). Satisfies the pre-flight gate in `docs/standards/artifact-structure.md` for any future React Native flow tooling under `tools/`.

**Read the Verification status section before relying on anything here.** Unlike the Playwright reference, almost none of this could be verified from this session.

## Sources

| Resource | URL |
|---|---|
| Official repo | https://github.com/mobile-dev-inc/maestro |
| SDK repo | n/a — Maestro is a CLI and YAML format, not a library |
| Specification | https://github.com/mobile-dev-inc/maestro (the commands reference in-repo is the de facto spec) |
| Docs | https://docs.maestro.dev |
| Docs (legacy host) | https://maestro.mobile.dev |
| Quickstart | https://docs.maestro.dev/getting-started/installing-maestro |

## Scaffolding reference

```bash
# install (macOS / Linux)
curl -fsSL "https://get.maestro.mobile.dev" | bash

# or via Homebrew
brew tap mobile-dev-inc/tap
brew install maestro

# verify
maestro -v

# run a flow
maestro test .maestro/checkout.yaml

# run all flows in a folder
maestro test .maestro/

# interactive selector explorer
maestro studio
```

Expected layout in a React Native project:

```
.maestro/
├── checkout.yaml
├── sign-in.yaml
└── subflows/
    └── sign-in.yaml
```

## Why Maestro over Detox for this vault

Recorded here so the decision is auditable rather than re-argued:

- Single binary, no native build integration, no test-runner wiring.
- YAML flows with tolerant selectors that survive minor UI churn — the failure mode that kills flow suites is brittleness, not imprecision.
- Works against Expo dev builds.
- A hosted runner exists if simulator infrastructure is not worth maintaining.

Detox is faster and more precise, and is the better choice for a team that already has it working. For a `draft` artifact trying to earn a `vetted` rating through a handful of real runs, Maestro's lower setup and upgrade cost dominates.

## Verification status

**None of the URLs above were reachable from this session.** The egress policy returned 403 on CONNECT for `github.com`, `docs.maestro.dev`, and `maestro.mobile.dev`. They are recorded from prior knowledge, not confirmed.

Additional caution specific to Maestro:

- Its documentation host **moved** from `maestro.mobile.dev` to `docs.maestro.dev`. Both are listed; confirm which is current before deep-linking.
- The CLI surface changes faster than the rest of this stack. The React Native adapter in `skills/test-authoring/` already carries an instruction to verify command syntax against this reference before wiring CI — that instruction is only useful if this file is kept current.
- `maestro-cli` exists on the npm registry (v1.1.10) but was **not** confirmed to be published by mobile-dev-inc. Do not install Maestro from npm on the strength of this file; use the shell installer or Homebrew above.

Priority when someone next has unrestricted network access: confirm the docs host, the installer URL, and the current `maestro test` flag surface, then promote this file's `confidence` to `medium` and record the date. Until then, treat every command here as needing a `maestro --help` check before use.
