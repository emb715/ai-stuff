# Sanitize Before Publish

## Trigger

Before promoting any artifact, or before saving any artifact imported from a real project session.

## Preconditions

- You have the artifact file(s) open and readable

## Procedure / Steps

### 1. Run automated pattern search

Search the artifact files for known sensitive patterns:

```bash
# Secrets and credentials
# Patterns to search for (run as a single grep command, combine with \|):
# sk-           — OpenAI / Anthropic keys
# xox[baprs]-   — Slack tokens
# AKIA          — AWS access keys
# ghp_          — GitHub personal access tokens (prefix: gh + p/o/u/s/r + underscore)
# glpat-        — GitLab tokens
# -----BEGIN    — private keys
# password\s*=  — inline password assignments
# secret\s*=    — inline secret assignments
# token\s*=     — inline token assignments
# api_key\s*=   — inline API key assignments
grep -rn "sk-\|xox[baprs]-\|AKIA\|glpat-\|-----BEGIN\|password\s*=\|secret\s*=\|token\s*=\|api_key\s*=" <artifact-path> --include="*.md"

# Private hostnames and internal URLs
grep -rn "\.internal\|\.corp\|\.local\|10\.\|192\.168\.\|172\.\(1[6-9]\|2[0-9]\|3[01]\)\." <artifact-path> --include="*.md"

# Private identifiers (adjust patterns to your context)
grep -rn "client_\|account_\|org_\|team_\|proj_" <artifact-path> --include="*.md"
```

Flag every match for manual review. Do not auto-delete — some matches are safe (public examples, generic variable names).

### 2. Manual read — high-sensitivity scan

Read the full artifact body looking for:

| Category | Examples |
|---|---|
| API keys / tokens | Any string matching `sk-...`, `xox...`, UUIDs used as credentials |
| Passwords / secrets | Literal passwords, env var values, private keys |
| Private client identifiers | Client names, account IDs, project slugs from real engagements |
| Internal hostnames / URLs | `api.company-internal.com`, `10.0.0.x`, VPN addresses |
| Personal data | Email addresses, names, phone numbers not intended to be public |
| Confidential config | Internal feature flags, unreleased product names, private endpoint paths |

For each found item: mark it for replacement, not deletion.

### 3. Replace with synthetic equivalents

Do not delete sensitive values — replace with clearly synthetic ones:

| Type | Replace with |
|---|---|
| API key | `sk-example-1234567890abcdef` |
| Token | `TOKEN_REPLACE_THIS_github_pat` |
| Internal URL | `https://api.example-internal.com` |
| Client name | `acme-corp` or `example-client` |
| Account/org ID | `org_example123` |
| Email | `user@example.com` |
| IP address | `192.0.2.1` (documentation range, RFC 5737) |

The artifact must remain usable after replacement. If a value is central to an example, the synthetic version should be structurally identical (same format, same length class).

### 4. Check for indirect references

Review:
- Paths that reveal internal repo structure (e.g., `/home/username/client-project/...`)
- Variable names that encode client/project identity (e.g., `acme_api_key`)
- Comments referencing internal tickets, Jira IDs, or internal system names
- Session logs or output snippets copied verbatim from real work

Replace or generalize any that reveal private context.

### 5. Verify the artifact still works

After redaction:
- Re-read the full artifact — does it still make sense?
- If it's a prompt: are all `{{VARIABLES}}` still declared and usable?
- If it's a playbook: do all steps still apply generically?
- If it's a skill: do examples still show the correct pattern?

If redaction broke the artifact's usability, it needs rewriting, not just redaction.

### 6. Record the sanitization pass

Add a one-line note to the artifact's `humans.md` or Evidence section:

```
Sanitization: passed YYYY-MM-DD — no secrets, private IDs, or sensitive data found / redacted <N> items.
```

This makes Gate 4 verifiable in future audits.

## Workflow

```
run automated grep patterns
  → manual read for sensitive values
  → replace found items with synthetic equivalents
  → check indirect references (paths, comments, variable names)
  → verify artifact still works after redaction
  → record sanitization pass in humans.md or Evidence
```

- If a value is unclear (secret or public example?) → redact it. False positives are safe; false negatives are not.
- If redaction breaks the artifact → rewrite the section with a clean synthetic example from scratch

## Rollback / Fallback

If a sensitive value was missed and the artifact is already published: redact immediately, log the incident in the changelog, and note what was exposed and when. Do not attempt to hide the miss.
