#!/bin/sh
# Installs the git-signing SessionStart hook into user settings (~/.claude/settings.json).
# Use as a cloud environment setup script, or locally. Idempotent.
set -eu
CLAUDE_HOME="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SRC="$(cd "$(dirname "$0")" 2>/dev/null && pwd)/hook.sh"
if [ ! -f "$SRC" ]; then
  TMP="$(mktemp -d)"
  git clone --quiet --depth 1 https://github.com/emb715/ai-stuff "$TMP/ai-stuff"
  SRC="$TMP/ai-stuff/experiments/git-signing/hook.sh"
fi
if ! command -v ssh-keygen >/dev/null 2>&1 && command -v apt-get >/dev/null 2>&1; then
  { apt-get install -y -qq openssh-client || { apt-get update -qq && apt-get install -y -qq openssh-client; }; } >/dev/null 2>&1 \
    || echo "git-signing: could not install openssh-client; SSH signing needs ssh-keygen" >&2
fi
mkdir -p "$CLAUDE_HOME/hooks"
cp "$SRC" "$CLAUDE_HOME/hooks/git-signing.sh"
CLAUDE_HOME="$CLAUDE_HOME" node --input-type=module -e '
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const home = process.env.CLAUDE_HOME;
const file = `${home}/settings.json`;
const s = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
s.hooks ??= {};
s.hooks.SessionStart = (s.hooks.SessionStart ?? []).filter(
  (g) => !(g.hooks ?? []).some((h) => String(h.command).includes("git-signing.sh")));
s.hooks.SessionStart.push({ hooks: [{ type: "command", command: `sh "${home}/hooks/git-signing.sh"`, timeout: 10 }] });
writeFileSync(file, `${JSON.stringify(s, null, 2)}\n`);
'
echo "git-signing hook installed in $CLAUDE_HOME/settings.json"
