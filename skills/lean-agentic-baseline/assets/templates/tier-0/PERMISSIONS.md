# Permissions and blast radius

What can an agent do unattended, and what is the worst outcome if it is wrong?
Enforcement lives below the agent. Hooks and prose are advisory.

## Autonomous
- Read source, docs, tests. Run `pnpm validate`.
- Write to a feature branch. Open a PR. Comment on issues.

## Ask first (human approves before it lands)
- Dependencies. CI config. Migrations. Auth, session, crypto.
- Deploy and infrastructure config.
- Gate definitions: `package.json` scripts, lint/type/test config, `.github/workflows/**`, `.claude/**`.

## Never
- Force-push protected branches. Delete branches or tags. Publish releases.
- Migrate a non-local database. Read or write production credentials.

## Structural controls (confirm by hand; the repo can't prove them)
- [ ] Branch protection: required status check, code-owner review, no admin bypass
- [ ] Agent commits under its own identity with a scoped token
- [ ] Egress is default-deny with an allowlist
- [ ] No plaintext production credentials on a filesystem the agent can read

## Stopping agents
Owner: your platform team. Rehearse it before you need it.

Pull it when any of these is true, without waiting for a second opinion:
- a loop or runaway alarm fires (see Metrics), or the on-call is paged by one
- a gate, branch protection or review requirement was bypassed
- an agent reached credentials, production or customer data
- nobody can say what a running agent is doing

1. Stop new work: revoke the agent identity's token. Human credentials are untouched.
2. Stop merges: lock the default branch, and remove the agent from any bypass list.
3. Stop automation: `gh workflow disable "<agent workflow>"` for agent-triggered workflows.
4. Stop sessions fleet-wide: push a managed-settings deny rule for Bash, Edit and Write.
5. Undo the product change: turn the flag off, or follow the PR's Rollback section.
6. Record what happened on the issue. Write an ADR if a control has to change.
