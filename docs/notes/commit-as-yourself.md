---
title: "Commit as Yourself from Claude Code Sessions"
status: draft
confidence: medium
last_tested: 2026-11-25
scope: global
tooling:
  - "claude-code"
  - "git/2.34+"
  - "github"
tags:
  - git
  - signing
  - claude-code
  - guidance
owner: "@emb715"
---

# Commit as Yourself from Claude Code Sessions

Claude Code commits with whatever git identity and signing key its environment provides. This note shows how to make those commits carry your name and a signature GitHub marks Verified, on your own machine and in cloud sessions.

## Context / Problem

GitHub sets the author and the Verified badge separately. A setup that changes only one of them leaves the commit half fixed.

| What GitHub shows | Comes from | Your setting |
| --- | --- | --- |
| Author name and avatar | Commit author email | `user.name` / `user.email`, or the `GIT_AUTHOR_*` and `GIT_COMMITTER_*` environment variables |
| Verified badge | Signature made by a key registered on the account that owns the commit email | `gpg.format`, `user.signingkey`, `commit.gpgsign` |
| Unverified badge | A signature from a key that isn't registered on that account | A signer you didn't set up |

If you squash or merge on GitHub's web UI, the resulting commit on the target branch is authored by you and signed by GitHub, so it shows Verified. Only the commits on the feature branch keep the session's identity.

Use your GitHub noreply address, `<id>+<login>@users.noreply.github.com`, to keep your real email out of history. Your id is shown at `https://api.github.com/users/<login>`.

## Scope

- Local Claude Code (CLI, IDE, Claude Desktop local sessions): your machine's git config.
- Cloud sessions: a container whose runtime writes its own git config.
- Out of scope: GPG keys and S/MIME; this note uses SSH signing.

## Procedure / Steps

### Local setup

Claude Code running on your machine uses your global git config. Set the config once, and every commit from you or from Claude is authored and signed as you.

1. Create a signing-only key:

   ```bash
   ssh-keygen -t ed25519 -C "git signing" -f ~/.ssh/git_signing
   ```

2. Register it on GitHub as a signing key. Use Settings, SSH and GPG keys, New SSH key, with Key type set to Signing Key. Or use `gh`; it may first need `gh auth refresh -s admin:ssh_signing_key`.

   ```bash
   gh ssh-key add ~/.ssh/git_signing.pub --type signing --title "git signing"
   ```

3. Configure git:

   ```bash
   git config --global user.name "<Your Name>"
   git config --global user.email "<id>+<login>@users.noreply.github.com"
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/git_signing.pub
   git config --global commit.gpgsign true
   git config --global tag.gpgsign true
   ```

4. Optional: let git verify signatures locally.

   ```bash
   echo "<id>+<login>@users.noreply.github.com $(cat ~/.ssh/git_signing.pub)" >> ~/.ssh/allowed_signers
   git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
   ```

### Cloud sessions: identity

A cloud session runs in a container whose runtime writes its own global git config. To see what it uses, run `git config --show-origin --get-regexp 'user\.|gpg|commit\.gpgsign'`. If it shows a default identity and a signer program you didn't set, the runtime may overwrite edits to `~/.gitconfig` that a setup script makes.

Set the identity through environment variables instead, because git gives them priority over config files. Add them to the cloud environment's settings:

| Variable | Value |
| --- | --- |
| `GIT_AUTHOR_NAME` | `<Your Name>` |
| `GIT_AUTHOR_EMAIL` | `<id>+<login>@users.noreply.github.com` |
| `GIT_COMMITTER_NAME` | `<Your Name>` |
| `GIT_COMMITTER_EMAIL` | `<id>+<login>@users.noreply.github.com` |

With only this step, commits show your name. If the runtime still signs them with its own key, GitHub marks them Unverified.

### Cloud sessions: signing with your key

A setup script can't read the environment's variables, but a Claude Code `SessionStart` hook runs inside the session and can. The hook writes your key from a variable to disk and points git at it.

1. Create a separate key for cloud use only, so revoking it leaves your local key untouched. Register it on GitHub as a signing key, as in the local setup.

   ```bash
   ssh-keygen -t ed25519 -C "cloud git signing" -N "" -f ~/.ssh/cloud_signing
   base64 < ~/.ssh/cloud_signing | tr -d '\n'   # the value for GIT_SIGNING_KEY_B64
   ```

2. Add `GIT_SIGNING_KEY_B64` in the cloud environment's settings, typing the value yourself. Never paste a key into a chat with Claude.
3. Add the hook script as `~/.claude/hooks/git-signing.sh`:

   ```sh
   #!/bin/sh
   [ -n "${GIT_SIGNING_KEY_B64:-}" ] || exit 0
   umask 077 && mkdir -p ~/.ssh
   printf '%s' "$GIT_SIGNING_KEY_B64" | base64 -d > ~/.ssh/cloud_signing
   ssh-keygen -y -f ~/.ssh/cloud_signing > ~/.ssh/cloud_signing.pub
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/cloud_signing.pub
   git config --global --unset gpg.ssh.program || true
   git config --global commit.gpgsign true
   ```

4. Register the hook in `~/.claude/settings.json`:

   ```json
   {
     "hooks": {
       "SessionStart": [
         { "hooks": [ { "type": "command", "command": "sh ~/.claude/hooks/git-signing.sh" } ] }
       ]
     }
   }
   ```

5. Make it reach every session: have the environment's setup script write the script and the settings entry before Claude starts. Merge into an existing `settings.json`; don't overwrite it.

## Evidence

- 2026-11-25: the owner confirmed the setup produced commits authored and signed as themselves.
- 2026-11-25: Anthropic's [cloud environments](https://code.claude.com/docs/en/cloud-environments) and [Claude Desktop](https://code.claude.com/docs/en/desktop) docs were checked. Neither documents a built-in `GIT_SIGNING_KEY` variable or any commit identity or signing setting, so the variable name here is a convention the hook script defines. Cloud variables are plain `.env` `KEY=value` pairs that any command in the session can read. Desktop local environment variables are stored encrypted on the machine. Cloud commits get a `Claude-Session:` trailer, which the `attribution.sessionUrl` setting controls.

To verify a setup, make a commit and run `git log -1 --format='%an <%ae> | %G?'`. `G` means a good signature, which needs the `allowed_signers` step. After pushing, GitHub should show Verified next to your avatar.

## Failure Modes / Boundaries

- **The runtime may reapply its config.** If the cloud runtime rewrites the global git config after `SessionStart`, its own signer comes back. Test one commit before relying on it.
- **The git proxy may reject your commits.** Some cloud git proxies accept only their own identity or signer. Test one push.
- **Your key is readable in the session.** Environment variables are stored in plain text and readable by any command in the session. Keep the cloud key separate and signing-only. If it leaks, revoke it on GitHub; past commits it signed then show Unverified.
- **A failed hook means unsigned commits.** Branch protection that requires signed commits will reject the push.
- **Authorship becomes yours.** Commits Claude writes will show you as author. Decide whether that fits your team's review practice.
