# Git Signing Hook — maintenance notes

## Why this exists

The owner put a signing key in a cloud environment variable and commits still came out signed by the runtime. Nothing reads such a variable: git has no built-in one, and Claude Code documents none. This hook is the missing reader.

## Design decisions

- SessionStart, not the setup script: setup scripts can't read environment variables; hooks run inside the session and can.
- Accept several key formats because environment variable UIs differ in how they keep newlines.
- `gpg.ssh.program` is set explicitly to `ssh-keygen` rather than unset, so a runtime default in a system config can't win.
- Fail open: a bad or missing key must never block a session.
- `install.sh` installs openssh-client because the cloud image checked on 2026-11-26 shipped without `ssh-keygen`.

## Known gaps

- No live cloud run yet: whether the runtime rewrites git config after SessionStart, and whether its git proxy accepts foreign signatures, are open.
