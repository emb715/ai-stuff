#!/bin/bash
# Run one eval cell in a fresh directory.
# usage: run.sh <cond: none|old|new> <prompt-file> <skill-dir|-> <out-dir>
# Then render and measure build outputs: node measure.js <out-dir> [...]
set -e
HERE=$(dirname "$(readlink -f "$0")")
PROMPT=$(readlink -f "$2"); OUT=$4
rm -rf "$OUT"; mkdir -p "$OUT"; cd "$OUT"; git init -q
cp "$HERE/flawed.html" "$HERE/subtle.html" "$HERE"/neg/* .
if [ "$1" != none ]; then mkdir -p .claude/skills; cp -r "$3" .claude/skills/design-laws; fi
timeout 900 claude -p "$(cat "$PROMPT")" --model "${MODEL:-claude-sonnet-5-5}" \
  --permission-mode acceptEdits --allowedTools "Read,Write,Edit,Glob,Grep,Skill" \
  > answer.md 2> err.log || echo "exit $?" >> err.log
