#!/usr/bin/env bash
# Checks that every accepted ADR's governed-path globs still match a tracked file.
# Usage: adr-drift.sh [path-to-INDEX.md]
set -uo pipefail
set -f   # keep globs like src/db/** from expanding in the shell
index="${1:-docs/decisions/INDEX.md}"
[[ -f "$index" ]] || { echo "SKIP: $index not found" >&2; exit 2; }

stale=0
while IFS='|' read -r num _title state globs; do
  [[ "$num" =~ ^[[:space:]]*[0-9]{4} ]] || continue
  [[ "$state" == *accepted* ]] || continue
  for g in ${globs//,/ }; do
    g="$(echo "$g" | xargs)"
    [[ -z "$g" ]] && continue
    if [[ -z "$(git ls-files ":(glob)$g" 2>/dev/null)" ]]; then
      echo "FAIL: stale ADR ${num// /}: nothing matches $g" >&2
      stale=1
    fi
  done
done < "$index"

if (( stale )); then
  exit 1
fi
echo "PASS: every accepted ADR's governed paths match at least one tracked file"
exit 0
