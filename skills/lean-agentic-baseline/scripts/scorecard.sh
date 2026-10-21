#!/usr/bin/env bash
# Static inventory only; never executes target-repo code.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
command -v python3 >/dev/null || { echo "ERROR: python3 is required" >&2; exit 2; }
exec python3 "$SCRIPT_DIR/scorecard.py" "$@"
