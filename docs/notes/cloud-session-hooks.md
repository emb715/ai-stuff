---
title: "Install Session Hooks in a Cloud Environment"
status: validated
confidence: high
last_tested: 2026-11-27
scope: global
tooling:
  - "claude-code/2.1"
  - "git/2.34+"
  - "openssh/9+"
  - "node/18+"
tags:
  - hooks
  - cloud
  - git
  - signing
  - guidance
---

# Install Session Hooks in a Cloud Environment

How to set up a Claude Code cloud environment so every session signs commits with your own key ([git-signing](../../tools/git-signing/)), removes Claude attribution from GitHub text ([strip-attribution](../../tools/strip-attribution/)), or both.

## Context / Problem

A cloud session starts from a fresh container each time, so anything installed by hand is lost when the session ends. Hooks have to be installed by the environment's setup script, which runs before Claude starts in each new session.

The two hooks do different jobs and can be installed separately:

| Hook | Event | What it does | Needs |
| --- | --- | --- | --- |
| git-signing | `SessionStart` | Writes your key from an environment variable to disk and points git at it, so commits are signed by you and GitHub marks them Verified | A signing key in an environment variable, plus `ssh-keygen` (installed by the script if missing) |
| strip-attribution | `PreToolUse` | Removes attribution comments, footers and commit trailers from `gh`, `git commit` and GitHub MCP calls before they run | `node` |

## Scope

- Claude Code cloud environments (claude.ai/code and project threads), where the environment has a setup script and environment variables.
- For local machines, see each tool's README. On a local machine your own git config already sets identity and signing, so git-signing is usually not needed there.

## Procedure / Steps

### 1. Prepare a signing key (git-signing only)

Create a signing-only key with no passphrase. Use a separate key from your local one, so you can revoke it alone.

```bash
ssh-keygen -t ed25519 -C "cloud git signing" -N "" -f ~/.ssh/cloud_signing
```

Register `~/.ssh/cloud_signing.pub` on GitHub as a **Signing Key** (Settings, SSH and GPG keys, New SSH key, Key type: Signing Key).

### 2. Set environment variables (git-signing only)

Add these to the cloud environment's variables. Type the key yourself; never paste it into a chat.

| Variable | Value |
| --- | --- |
| `GIT_SIGNING_KEY` | Contents of `~/.ssh/cloud_signing`, raw or base64 (`base64 < ~/.ssh/cloud_signing \| tr -d '\n'`) |
| `GIT_AUTHOR_NAME` | `<Your Name>` |
| `GIT_AUTHOR_EMAIL` | `<id>+<login>@users.noreply.github.com` |
| `GIT_COMMITTER_NAME` | `<Your Name>` |
| `GIT_COMMITTER_EMAIL` | `<id>+<login>@users.noreply.github.com` |

The hook covers signing only. The four identity variables make you the author; without them, commits are signed by your key under the runtime's identity and GitHub won't mark them Verified.

### 3. Set the setup script

`<vault-repo-url>` is the clone URL of the repository holding these tools. Keep the lines for the hooks you want.

```sh
rm -rf /tmp/vault
git clone --depth 1 <vault-repo-url> /tmp/vault || { echo "hook repo clone failed; continuing"; exit 0; }
sh /tmp/vault/tools/strip-attribution/install.sh || echo "strip-attribution install failed; continuing"
sh /tmp/vault/tools/git-signing/install.sh || echo "git-signing install failed; continuing"
```

Each `install.sh` copies its hook to `~/.claude/hooks/` and adds one entry to `~/.claude/settings.json`, keeping entries already there. Running them again changes nothing. Every line falls through on failure, so a broken install starts the session without the hook instead of blocking it.

### 4. Start a new session

The setup script runs only when a session starts. Sessions already running keep their old setup.

## Verification

In a new session:

```bash
grep -E 'git-signing|strip-attribution' ~/.claude/settings.json      # both hooks registered
git config --global --get user.signingkey                           # ~/.ssh/git_signing.pub
git commit --allow-empty -m "test: signing" && git log -1 --format='%an <%ae> | %G?'
```

`%G?` prints `G` for a good signature. Push the commit to a test branch: GitHub should show Verified with your avatar. To check strip-attribution, open a test issue whose body contains a `Generated with [Claude Code](...)` line; the stored body should not contain it.

## Evidence

- 2026-11-25: a cloud environment with the strip-attribution setup line; a new session created an issue through the GitHub MCP tool with attribution lines in its body, and the stored body held only the test text.
- 2026-11-27: a cloud environment with both install lines, `GIT_SIGNING_KEY` and the four identity variables. A new session showed both hooks in `settings.json` and `user.signingkey` pointing at `~/.ssh/git_signing.pub`. An empty commit pushed to a test branch came back from the GitHub API as `verified: true`, `reason: valid`, with the owner as author and committer.

## Failure Modes / Boundaries

- **Sessions started before the change don't have the hooks.** A PR opened from such a session still carries attribution. Start a new session after editing the setup script.
- **The setup script can't read environment variables.** That is why signing runs as a `SessionStart` hook and not in the script.
- **The runtime may rewrite git config after `SessionStart`.** Its own signer would come back. Not seen as of the last test date; check one commit after platform updates.
- **Your key is readable by any command in the session.** Keep it signing-only and separate. If it leaks, revoke it on GitHub; commits it signed then show Unverified.
- **Passphrase-protected keys are not supported.**
- **strip-attribution covers fixed patterns.** If the attribution wording changes, it passes through until the hook's patterns are updated. See its README for what it doesn't catch.
- **A failed clone means no hooks.** The session still starts. With branch protection that requires signed commits, pushes are then rejected.

## Related

- [commit-as-yourself](commit-as-yourself.md): why identity and signing are set separately, and the local setup.
- [tools/git-signing](../../tools/git-signing/) and [tools/strip-attribution](../../tools/strip-attribution/): the hooks, their tests and details.
