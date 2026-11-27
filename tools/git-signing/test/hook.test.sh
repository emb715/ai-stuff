#!/bin/sh
# Runs hook.sh against a throwaway HOME for each key format and verifies a real signed commit.
set -eu
HOOK="$(cd "$(dirname "$0")/.." && pwd)/hook.sh"
W="$(mktemp -d)"
ssh-keygen -q -t ed25519 -N "" -C test -f "$W/k"
RAW="$(cat "$W/k")"
ESC="$(awk '{printf "%s\\n", $0}' "$W/k")"
B64="$(base64 < "$W/k" | tr -d '\n')"
pass=0; fail=0
check() { # name, env assignment
  H="$W/home-$1"; mkdir -p "$H"
  printf '[gpg "ssh"]\n\tprogram = /nonexistent/runtime-signer\n[user]\n\tname = Bot\n\temail = bot@example.com\n' > "$H/.gitconfig"
  env HOME="$H" GIT_COMMITTER_EMAIL=u@example.com "$2=$3" sh "$HOOK"
  R="$H/repo"; git init -q "$R"
  HOME="$H" git -C "$R" -c user.email=u@example.com commit -q --allow-empty -m t
  s="$(HOME="$H" git -C "$R" log -1 --format=%G?)"
  if [ "$s" = G ]; then pass=$((pass+1)); echo "ok   $1"; else fail=$((fail+1)); echo "FAIL $1 (sig=$s)"; fi
}
check raw GIT_SIGNING_KEY "$RAW"
check escaped GIT_SIGNING_KEY "$ESC"
check base64 GIT_SIGNING_KEY "$B64"
check b64var GIT_SIGNING_KEY_B64 "$B64"
# bad key: hook must exit 0 and leave config untouched
H="$W/home-bad"; mkdir -p "$H"; printf '[gpg "ssh"]\n\tprogram = /x\n' > "$H/.gitconfig"
if env HOME="$H" GIT_SIGNING_KEY=garbage sh "$HOOK" 2>/dev/null && [ "$(HOME="$H" git config --global gpg.ssh.program)" = /x ] && [ ! -e "$H/.ssh/git_signing" ]; then pass=$((pass+1)); echo "ok   bad-key"; else fail=$((fail+1)); echo "FAIL bad-key"; fi
# no key: no-op
H="$W/home-none"; mkdir -p "$H"
if env -u GIT_SIGNING_KEY -u GIT_SIGNING_KEY_B64 HOME="$H" sh "$HOOK" && [ ! -e "$H/.gitconfig" ]; then pass=$((pass+1)); echo "ok   no-key"; else fail=$((fail+1)); echo "FAIL no-key"; fi
echo "$pass passed, $fail failed"; [ "$fail" -eq 0 ]
