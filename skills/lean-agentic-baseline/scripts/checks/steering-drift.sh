#!/usr/bin/env bash
# Checks the steering doc: under budget, and every backticked path it names exists.
# Usage: steering-drift.sh [path-to-AGENTS.md] [line-budget]
set -uo pipefail
f="${1:-AGENTS.md}"
budget="${2:-200}"
[[ -f "$f" ]] || { echo "SKIP: $f not found" >&2; exit 2; }

lines=$(wc -l <"$f" | tr -d " ")
if (( lines > budget )); then
  echo "FAIL: $f is $lines lines (budget: $budget)" >&2
  exit 1
fi

for p in $(grep -oE '`[A-Za-z0-9_./-]+/[A-Za-z0-9_./-]*`' "$f" | tr -d '`' | sort -u); do
  if [[ ! -e "$p" ]]; then
    echo "FAIL: dangling reference in $f: $p" >&2
    exit 1
  fi
done

echo "PASS: $f is $lines / $budget lines, no dangling references"
exit 0
