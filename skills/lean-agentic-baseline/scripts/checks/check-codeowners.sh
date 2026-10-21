#!/usr/bin/env bash
# Inspect explicit path owner tokens; do not infer platform review enforcement.
set -euo pipefail
python3 - "${1:-.github/CODEOWNERS}" <<'PY'
import os
from pathlib import Path
import sys

agent = os.environ.get("AGENT_LOGIN", "").lstrip("@").lower()
if not agent:
    print("SKIP: set AGENT_LOGIN to the agent account name", file=sys.stderr)
    sys.exit(2)
path = Path(sys.argv[1])
if not path.is_file():
    print(f"SKIP: {path} not found", file=sys.stderr)
    sys.exit(2)
rules = []
for line in path.read_text().splitlines():
    tokens = line.split("#", 1)[0].split()
    if tokens:
        rules.append((tokens[0], tokens[1:]))
if any(owner.lower() == "@" + agent for _, owners in rules for owner in owners):
    print(f"FAIL: {path} assigns ownership to agent @{agent}", file=sys.stderr)
    sys.exit(1)
failed = False
for gate in ("/package.json", "/.github/workflows/", "/.claude/", "/lefthook.yml", "/AGENTS.md"):
    matches = [owners for pattern, owners in rules if pattern == gate]
    if not matches or not any(owner.startswith("@") and len(owner) > 1 for owner in matches[-1]):
        print(f"FAIL: no owner token on the last explicit rule for {gate}; broader patterns need separate review", file=sys.stderr)
        failed = True
if failed:
    sys.exit(1)
print("PASS: agent absent from owner tokens and explicit paths have owners; broader overriding patterns, human membership and enforced review remain unverified")
PY
