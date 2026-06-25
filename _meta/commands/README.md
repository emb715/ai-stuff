# _meta/commands/

OpenCode commands that operate this vault. Each command is a three-file folder:

```
<command-name>/
├── README.md     ← record: what it does, when to use it
├── command.md    ← the command itself (no frontmatter, paste-ready)
└── humans.md     ← design decisions, maintenance notes
```

## Command Index

| Command | Trigger | What it does |
|---|---|---|
| [init/](init/) | Start of any session | Orients LLM to vault, classifies session, routes to framebook |
| [vault-start/](vault-start/) | Beginning of a work session | Interactive session routing via framebook |
| [vault-lint/](vault-lint/) | After editing any structured doc | Runs doc_lint.py and surfaces failures |
| [vault-save/](vault-save/) | Importing an artifact from another project | Interactive save-artifact walkthrough |
| [vault-promote/](vault-promote/) | Promoting or deprecating an artifact | Interactive promote-artifact walkthrough |
| [vault-audit/](vault-audit/) | Experiment triage | Lists and classifies all experiments |
| [vault-weekly/](vault-weekly/) | Weekly cadence | Full weekly maintenance sequence |

## How to install

See `_meta/install.md`.

## Design rules

- `command.md` has no frontmatter — it is the raw instruction text the LLM receives
- Commands are framework infrastructure — do not put user prompts here
- Commands invoke framebook procedures — they do not duplicate procedure steps
