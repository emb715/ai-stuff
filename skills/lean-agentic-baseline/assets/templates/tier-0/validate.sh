#!/usr/bin/env bash
# Runs every gate, cheapest first, and stops at the first failure.
set -uo pipefail
MAX_LINES="${MAX_LINES:-20}"

gate() {
  local name=$1; shift
  local out
  if out=$("$@" 2>&1); then return 0; fi
  echo "validate: '$name' failed. Stopped here; later gates did not run." >&2
  printf '%s\n' "$out" | head -n "$MAX_LINES" >&2
  exit 1
}

gate steering  bash scripts/steering-drift.sh
gate adr       bash scripts/adr-drift.sh
gate tickets   bash scripts/no-ticket-refs.sh
# gate tests-kept bash scripts/no-test-weakening.sh
# gate permsdrift bash scripts/permissions-drift.sh
# gate arch       pnpm --silent check:arch
gate lint      pnpm --silent lint
gate typecheck pnpm --silent typecheck
gate test      pnpm --silent test
