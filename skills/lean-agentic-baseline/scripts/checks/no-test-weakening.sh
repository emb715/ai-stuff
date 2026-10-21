#!/usr/bin/env bash
# Fails if a diff skips/focuses a test, or removes more assertions than it adds.
# Usage: no-test-weakening.sh [base-ref]
set -uo pipefail
base="${1:-origin/main}"
git rev-parse --verify -q "$base" >/dev/null || { echo "SKIP: base ref $base not found. Run: git fetch origin main" >&2; exit 2; }

tests=(':(glob)**/*.test.*' ':(glob)**/*.spec.*' ':(glob)**/test/**' ':(glob)**/tests/**' ':(glob)**/*_test.*' ':(glob)**/test_*.py')
diff=$(git diff "$base"...HEAD -U0 -- "${tests[@]}")

if hit=$(grep -m1 -nE '^\+[^+].*(\.skip\(|\.only\(|\bxit\(|\bxdescribe\(|@pytest\.mark\.skip|@Disabled|t\.Skip\(|#\[ignore\])' <<<"$diff"); then
  echo "FAIL: a test was skipped or focused in this diff: $hit" >&2
  echo "Fix the test or explain in the PR." >&2
  exit 1
fi

assert='(expect\(|assert|\.should)'
removed=$(grep -cE "^-[^-].*${assert}" <<<"$diff")
added=$(grep -cE "^\+[^+].*${assert}" <<<"$diff")
if (( removed > added )); then
  echo "FAIL: assertions went down ($removed removed, $added added)." >&2
  echo "Explain it in the PR." >&2
  exit 1
fi

echo "PASS: no skipped/focused tests, assertion count did not decrease ($added added, $removed removed)"
exit 0
