---
title: "Git Signing Hook"
status: draft
confidence: medium
last_tested: 2026-11-26
scope: personal
tooling:
  - "claude-code/2.1"
  - "openssh/9+"
tags:
  - experiment
  - hooks
  - git
  - signing
owner: "@emb715"
---

# Git Signing Hook

## Context / Problem

Claude Code cloud sessions sign commits with the runtime's own signer and identity, so GitHub shows the session as the committer, not you. An environment variable holding your key does nothing by itself: git has no built-in variable for a signing key.

Hypothesis: a `SessionStart` hook that writes the key from an environment variable to disk and points git at it makes cloud commits signed with your key and marked Verified.

## Scope

- `hook.sh`: reads `GIT_SIGNING_KEY` (raw OpenSSH private key, with real or `\n`-escaped newlines, or base64 of it) or `GIT_SIGNING_KEY_B64`. Writes `~/.ssh/git_signing` and its `.pub`, then sets global `gpg.format ssh`, `user.signingkey`, `gpg.ssh.program ssh-keygen`, `commit.gpgsign` and `tag.gpgsign`.
- Does nothing when no key is set. If the key can't be read, it removes what it wrote, warns, and leaves git config untouched. It always exits 0.
- Covers signing only. For author identity, set `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME` and `GIT_COMMITTER_EMAIL` in the environment. See [commit-as-yourself](../../docs/notes/commit-as-yourself.md).

## Procedure / Steps

1. Create a signing-only key with no passphrase and register it on GitHub as a Signing Key.
2. Put the key in the cloud environment's variables as `GIT_SIGNING_KEY`. Raw or base64 both work.
3. Set the environment's setup script:

```sh
rm -rf /tmp/ai-stuff
git clone --depth 1 https://github.com/emb715/ai-stuff /tmp/ai-stuff \
  && sh /tmp/ai-stuff/experiments/git-signing/install.sh \
  || echo "git-signing install failed; continuing"
```

`install.sh` installs `openssh-client` when `ssh-keygen` is missing. It copies `hook.sh` to `~/.claude/hooks/git-signing.sh` and adds one `SessionStart` entry to `~/.claude/settings.json`. Running it again changes nothing.

Tests: `sh experiments/git-signing/test/hook.test.sh`.

## Results

- 2026-11-26, unit level: 6/6 pass. Raw, `\n`-escaped and base64 keys in `GIT_SIGNING_KEY`, and a base64 key in `GIT_SIGNING_KEY_B64`, each produce a real commit that git verifies as `G`. A bad key leaves config untouched; no key is a no-op. `install.sh` run twice keeps other hooks and adds one entry.
- 2026-11-26: a cloud container had no `ssh-keygen`; its runtime signs through its own program. `install.sh` installs `openssh-client` for that reason.
- Not yet run: a live cloud session committing and pushing with the hook installed.

## Failure Modes / Boundaries

- The runtime may rewrite global git config after `SessionStart`, which restores its own signer. Untested.
- The cloud git proxy may refuse commits not signed by the runtime. Untested.
- Passphrase-protected keys are not supported.
- The key is readable by any command in the session. Use a dedicated key you can revoke.

## Related artifacts

- [commit-as-yourself](../../docs/notes/commit-as-yourself.md) — the guide this implements.
- [strip-attribution](../../tools/strip-attribution/) — installed the same way.
