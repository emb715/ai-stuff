# humans.md — Sanitize Before Publish

## Origin

Created 2026-06-24. Gate 4 in AGENTS.md blocks on sanitization failures but provides no execution procedure. "Check for secrets" is not actionable without knowing what patterns to look for, how to search, and what to do when something is found.

## Design decisions

- Automated grep first, then manual read. Grep is fast but misses prose-embedded secrets; manual read catches context the grep misses. Neither alone is sufficient.
- Replace, don't delete. Deleting a secret often breaks the example it was part of. A synthetic equivalent preserves the example's instructional value.
- RFC 5737 IP range (`192.0.2.x`) is the correct choice for documentation examples — it's reserved and unroutable, so it can never be accidentally valid.
- Recording the sanitization pass is not bureaucracy — it makes Gate 4 auditable in the future without re-running the full check.
- "When in doubt, redact" is the explicit stance. The cost of an unnecessary redaction is editing one value; the cost of a missed secret is trust and potentially security.

## Maintenance notes

- The grep patterns are examples, not exhaustive. Add patterns specific to the tools and platforms you use (e.g., Vercel tokens, Anthropic API keys, AWS access keys).
- If a secret scanning tool is added to the toolchain (e.g., `trufflehog`, `git-secrets`), this playbook should delegate step 1 to that tool and use manual read as the secondary pass only.
