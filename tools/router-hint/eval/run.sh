#!/usr/bin/env bash
# One headless Claude Code run of one eval cell in one condition worktree.
# usage: run.sh <condition> <worktree> <cell> <run-number>
# Output: out/<condition>/<cell>-<n>.jsonl (stream-json), plus .hint.json when the hint hook ran.
set -u
HERE=$(cd "$(dirname "$0")" && pwd); cond=$1; wt=$2; cell=$3; n=$4
out=$HERE/out/$cond/$cell-$n.jsonl; mkdir -p "$(dirname "$out")"
[ -s "$out" ] && grep -q '"type":"result"' "$out" && exit 0
prompt=$(python3 -c "import json;print(json.load(open('$HERE/cells.json'))['cells']['$cell']['prompt'])")
cd "$wt" && ROUTER_HINT_LOG=$out.hint.json CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 \
  timeout 600 claude -p "$prompt" --output-format stream-json --verbose > "$out" 2> "$out.err"
