#!/bin/sh
# Claude Code SessionStart hook: sign git commits with your own SSH key.
# Reads the private key from GIT_SIGNING_KEY (raw OpenSSH key, with real or "\n"-escaped
# newlines, or base64 of it) or GIT_SIGNING_KEY_B64 (base64). Writes it to
# ~/.ssh/git_signing and points git's global config at it, replacing any runtime signer.
# Silent no-op when no key is set. Never blocks the session: always exits 0.
KEY="${GIT_SIGNING_KEY:-${GIT_SIGNING_KEY_B64:-}}"
[ -n "$KEY" ] || exit 0
command -v ssh-keygen >/dev/null 2>&1 || { echo "git-signing: ssh-keygen not found; install openssh-client" >&2; exit 0; }
DIR="$HOME/.ssh"
OUT="$DIR/git_signing"
umask 077
mkdir -p "$DIR" || exit 0
case "$KEY" in
  *"-----BEGIN"*) printf '%b\n' "$KEY" > "$OUT" ;;
  *) printf '%s' "$KEY" | base64 -d > "$OUT" 2>/dev/null ;;
esac
if ! ssh-keygen -y -f "$OUT" > "$OUT.pub" 2>/dev/null; then
  rm -f "$OUT" "$OUT.pub"
  echo "git-signing: GIT_SIGNING_KEY is not a readable unencrypted OpenSSH private key; commits keep the default signer" >&2
  exit 0
fi
git config --global gpg.format ssh
git config --global user.signingkey "$OUT.pub"
git config --global gpg.ssh.program ssh-keygen
git config --global commit.gpgsign true
git config --global tag.gpgsign true
exit 0
