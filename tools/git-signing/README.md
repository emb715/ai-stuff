---
title: "Git Signing Hook"
status: validated
confidence: high
last_tested: 2026-11-27
scope: personal
tooling:
  - "claude-code/2.1"
  - "openssh/9+"
tags:
  - tool
  - hooks
  - git
  - signing
owner: "@emb715"
---

# Git Signing Hook

## Context / Problem

Claude Code cloud sessions sign commits with the runtime's own signer and identity, so GitHub shows the session as the committer, not you. An environment variable holding your key does nothing by itself: git has no built-in variable for a signing key.

A `SessionStart` hook writes the key from an environment variable to disk and points git at it, so cloud commits are signed with your key and marked Verified.

## Scope

- `hook.sh`: reads `GIT_SIGNING_KEY` (raw OpenSSH private key, with real or `\n`-escaped newlines, or base64 of it) or `GIT_SIGNING_KEY_B64`. Writes `~/.ssh/git_signing` and its `.pub`, then sets global `gpg.format ssh`, `user.signingkey`, `gpg.ssh.program ssh-keygen`, `commit.gpgsign` and `tag.gpgsign`. It also writes `~/.ssh/allowed_signers` for the committer email, so `git log --format=%G?` verifies locally.
- Does nothing when no key is set. If the key can't be read, it removes what it wrote, warns, and leaves git config untouched. It always exits 0.
- Covers signing only. For author identity, set `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME` and `GIT_COMMITTER_EMAIL` in the environment. See [commit-as-yourself](../../docs/notes/commit-as-yourself.md).

## Procedure / Steps

1. Create a signing-only key with no passphrase and register it on GitHub as a Signing Key.
2. Put the key in the cloud environment's variables as `GIT_SIGNING_KEY`. Raw or base64 both work.
3. Set the environment's setup script:

```sh
rm -rf /tmp/ai-stuff
git clone --depth 1 https://github.com/emb715/ai-stuff /tmp/ai-stuff \
  && sh /tmp/ai-stuff/tools/git-signing/install.sh \
  || echo "git-signing install failed; continuing"
```

`install.sh` installs `openssh-client` when `ssh-keygen` is missing. It copies `hook.sh` to `~/.claude/hooks/git-signing.sh` and adds one `SessionStart` entry to `~/.claude/settings.json`. Running it again changes nothing.

Tests: `sh tools/git-signing/test/hook.test.sh`.

## Results

- 2026-11-26, unit level: 6/6 pass. Raw, `\n`-escaped and base64 keys in `GIT_SIGNING_KEY`, and a base64 key in `GIT_SIGNING_KEY_B64`, each produce a real commit that git verifies as `G`. A bad key leaves config untouched; no key is a no-op. `install.sh` run twice keeps other hooks and adds one entry.
- 2026-11-26: a cloud container had no `ssh-keygen`; its runtime signs through its own program. `install.sh` installs `openssh-client` for that reason.
- 2026-11-27, cloud: a claude.ai/code environment with `GIT_SIGNING_KEY`, the four `GIT_AUTHOR_*`/`GIT_COMMITTER_*` variables and this install in its setup script. A new session made an empty commit and pushed it. GitHub reported `verified: true`, `reason: valid`, with the owner as author and committer. The runtime did not restore its signer after `SessionStart`, and the git proxy accepted the push.
- 2026-11-27: added `allowed_signers` after the cloud run showed `%G?` = `N` locally, which meant git could not check the signature. Unit tests now check `G` using the file the hook writes.

## Failure Modes / Boundaries

- If a future runtime rewrites global git config after `SessionStart`, its own signer comes back. Not seen on 2026-11-27.
- Repos that require signed commits reject pushes when the hook fails, for example on a bad key.
- Passphrase-protected keys are not supported.
- The key is readable by any command in the session. Use a dedicated key you can revoke.

## Related artifacts

- [commit-as-yourself](../../docs/notes/commit-as-yourself.md) — the guide this implements.
- [strip-attribution](../strip-attribution/) — installed the same way.
