#!/bin/bash
# Run one round 3 cell in a fresh directory.
# usage: run.sh <single|loop> <brief-file> <out-dir>
# single: no skills installed. loop: taste-loop and design-laws installed under .claude/skills/.
set -e
HERE=$(dirname "$(readlink -f "$0")"); ROOT=$(readlink -f "$HERE/../..")
BRIEF=$(readlink -f "$2"); OUT=$3
rm -rf "$OUT"; mkdir -p "$OUT"; cd "$OUT"; git init -q
if [ "$1" = loop ]; then mkdir -p .claude/skills
  cp -r "$ROOT/taste-loop/skill" .claude/skills/taste-loop
  cp -r "$ROOT/design-skill/skill" .claude/skills/design-laws; fi
timeout 1500 claude -p "$(cat "$BRIEF")" --model "${MODEL:-claude-sonnet-5-5}" --output-format json \
  --permission-mode acceptEdits --allowedTools "Read,Write,Edit,Glob,Grep,Skill,Bash(node:*)" \
  > result.json 2> err.log || echo "exit $?" >> err.log
