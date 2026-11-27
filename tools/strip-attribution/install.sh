#!/bin/sh
# Installs the strip-attribution hook into user settings (~/.claude/settings.json).
# Use as a cloud environment setup script, or locally without the plugin.
# Idempotent: re-running replaces the hook script and keeps one settings entry.
set -eu
CLAUDE_HOME="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SRC="$(cd "$(dirname "$0")" 2>/dev/null && pwd)/hook.mjs"
if [ ! -f "$SRC" ]; then
  TMP="$(mktemp -d)"
  git clone --quiet --depth 1 https://github.com/emb715/ai-stuff "$TMP/ai-stuff"
  SRC="$TMP/ai-stuff/tools/strip-attribution/hook.mjs"
fi
mkdir -p "$CLAUDE_HOME/hooks"
cp "$SRC" "$CLAUDE_HOME/hooks/strip-attribution.mjs"
CLAUDE_HOME="$CLAUDE_HOME" node --input-type=module -e '
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const home = process.env.CLAUDE_HOME;
const file = `${home}/settings.json`;
const s = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const command = `node "${home}/hooks/strip-attribution.mjs"`;
s.hooks ??= {};
s.hooks.PreToolUse = (s.hooks.PreToolUse ?? []).filter(
  (g) => !(g.hooks ?? []).some((h) => String(h.command).includes("strip-attribution.mjs")));
s.hooks.PreToolUse.push({ matcher: "Bash|mcp__.*[Gg]it[Hh]ub.*", hooks: [{ type: "command", command, timeout: 10 }] });
s.hooks.PostToolUse = (s.hooks.PostToolUse ?? []).filter(
  (g) => !(g.hooks ?? []).some((h) => String(h.command).includes("strip-attribution.mjs")));
s.hooks.PostToolUse.push({ matcher: "mcp__.*[Gg]it[Hh]ub.*create_pull_request", hooks: [{ type: "command", command, timeout: 10 }] });
writeFileSync(file, `${JSON.stringify(s, null, 2)}\n`);
'
echo "strip-attribution hook installed in $CLAUDE_HOME/settings.json"
