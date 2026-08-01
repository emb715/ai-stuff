# humans.md — neurodiveragents Fleet

## Origin

The fleet was built to solve a specific problem: monolithic agent sessions accumulate dead context. Every file read, every explored-but-rejected path, every tangent stays in the conversation forever. Token costs grow, attention degrades, and the session gets worse over time.

The neurodiveragent framing — each agent has a distinct cognitive profile tied to a neurotype — emerged from observing that different task types genuinely need different processing styles. A code reviewer needs to register everything (sensory processing sensitivity). A debugger needs to assume nothing and confirm causes (skeptical processing). A security auditor needs to treat every input as hostile (hypervigilance). The fleet encodes these as specialized agents rather than trying to make one agent do everything.

## Why this is an external artifact

The fleet's system prompts, routing table, and configuration logic live in https://github.com/emb715/neurodiveragents. Copying the system prompts here would create a stale duplicate — the source repo updates independently, and a copy would drift. This entry documents the fleet's purpose, usage, and evidence without duplicating the consumable.

## Design decisions

- Two-file structure (README.md + humans.md) instead of the standard three-file. No `system-prompt.md` because the consumable is external.
- `external` tag added to the vault's artifact-classification standard to support this pattern. The tag is the detection signal for tools and the site.
- `scope: global` because the fleet works across any project, not just this repo.
- The README includes the full fleet member table for discoverability — the site renders it, so users can see what's available without leaving the vault.

## Maintenance notes

- Check the source repo when the fleet adds new agents or changes routing rules. Update the fleet member table and routing section if they drift.
- The evidence section references a "representative 18-turn session" — if more rigorous benchmarks are run, update with specific numbers.
- If the fleet is ever deprecated or superseded, update status to `deprecated` and add a replacement pointer.