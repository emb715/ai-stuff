#!/usr/bin/env bash
# Fails if a diff introduces a ticket ID (e.g. JIRA-1234, ENG-42). Adjust the
# project-key pattern to your tracker.
# Usage: no-ticket-refs.sh [base-ref] [PROJECT_KEY_REGEX]
set -uo pipefail
base="${1:-origin/main}"
keys="${2:-ENG|PROJ|JIRA}"
git rev-parse --verify -q "$base" >/dev/null || { echo "SKIP: base ref $base not found. Run: git fetch origin main" >&2; exit 2; }

if hit=$(git diff "$base"...HEAD -U0 | grep -m1 -E "^\+[^+].*\b(${keys})-[0-9]+\b"); then
  echo "FAIL: ticket reference found in the diff: $hit" >&2
  echo "Move it to the PR description." >&2
  exit 1
fi

echo "PASS: no ticket references in the diff"
exit 0
