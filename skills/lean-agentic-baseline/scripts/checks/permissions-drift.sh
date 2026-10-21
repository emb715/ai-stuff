#!/usr/bin/env bash
# Check documented path strings against ask/deny rules, never allow rules.
set -euo pipefail
python3 - "${1:-docs/PERMISSIONS.md}" "${2:-.claude/settings.json}" <<'PY'
import json
from pathlib import Path
import re
import sys

policy, settings = map(Path, sys.argv[1:])
for path in (policy, settings):
    if not path.is_file():
        print(f"SKIP: {path} not found", file=sys.stderr)
        sys.exit(2)
try:
    config = json.loads(settings.read_text())
    permissions = config.get("permissions", {})
    if not isinstance(permissions, dict):
        raise ValueError("permissions must be an object")
    rules = []
    for key in ("ask", "deny"):
        values = permissions.get(key, [])
        if not isinstance(values, list) or any(not isinstance(v, str) for v in values):
            raise ValueError(f"permissions.{key} must be a list of strings")
        rules.extend(values)
except (ValueError, AttributeError, OSError) as error:
    print(f"FAIL: invalid permission settings: {error}", file=sys.stderr)
    sys.exit(1)
match = re.search(r"^## Ask first\s*\n(.*?)(?=^## |\Z)", policy.read_text(), re.M | re.S)
paths = sorted(set(re.findall(r"`([^`]+)`", match.group(1)))) if match else []
if not paths:
    print("SKIP: no documented ask-first paths to compare", file=sys.stderr)
    sys.exit(2)
missing = [path for path in paths if not any(
    (match := re.fullmatch(r"(?:Edit|Write)\(([^)]*)\)", rule)) and match.group(1) == path
    for rule in rules)]
if missing:
    print("FAIL: no exact Edit/Write ask/deny path rule for: " + ", ".join(missing) + "; broader or Bash rules require separate semantic review", file=sys.stderr)
    sys.exit(1)
print("PASS: documented path strings occur in ask/deny rules; tool coverage, effective precedence and independent ownership remain unverified")
PY
