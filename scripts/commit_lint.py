#!/usr/bin/env python3
"""Check commit messages and PR titles against Conventional Commits.

Header format:  type(scope)!: subject
  - type:    one of TYPES below
  - scope:   optional, lowercase kebab-case (e.g. issues-to-roadmap)
  - !:       optional, marks a breaking change
  - subject: imperative, no trailing period, header at most MAX_HEADER chars

Usage:
  python3 scripts/commit_lint.py --title "feat(x): add y"   # one header (PR title)
  python3 scripts/commit_lint.py --file .git/COMMIT_EDITMSG # commit-msg hook
  python3 scripts/commit_lint.py --range origin/main..HEAD  # every non-merge commit

Exit code 0 when all messages pass, 1 otherwise. Standard library only.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys

TYPES = (
    "feat",
    "fix",
    "docs",
    "refactor",
    "test",
    "ci",
    "build",
    "perf",
    "style",
    "chore",
    "revert",
)
MAX_HEADER = 72

HEADER_RE = re.compile(
    r"^(?P<type>[a-z]+)"
    r"(?:\((?P<scope>[^()]*)\))?"
    r"(?P<breaking>!)?"
    r": (?P<subject>\S.*)$"
)
SCOPE_RE = re.compile(r"^[a-z0-9]+(?:[-/.][a-z0-9]+)*$")
# Squash merges append " (#123)"; it does not count toward the limit.
PR_SUFFIX_RE = re.compile(r" \(#\d+\)$")
# Messages git or GitHub write on their own; skipped, not judged.
AUTO_RE = re.compile(r'^(Merge |Revert "|fixup! |squash! |amend! )')


def check_header(header: str) -> list[str]:
    """Return a list of problems with one header line (empty when valid)."""
    if AUTO_RE.match(header):
        return []
    match = HEADER_RE.match(header)
    if not match:
        return [
            "header must look like 'type(scope): subject' "
            f"(types: {', '.join(TYPES)})"
        ]
    problems = []
    if match["type"] not in TYPES:
        problems.append(f"unknown type '{match['type']}' (use one of: {', '.join(TYPES)})")
    scope = match["scope"]
    if scope is not None and not SCOPE_RE.match(scope):
        problems.append(f"scope '{scope}' must be lowercase kebab-case")
    subject = match["subject"].rstrip()
    if subject.endswith("."):
        problems.append("subject must not end with a period")
    length = len(PR_SUFFIX_RE.sub("", header))
    if length > MAX_HEADER:
        problems.append(f"header is {length} chars, limit is {MAX_HEADER}")
    return problems


def first_line(message: str) -> str:
    for line in message.splitlines():
        if line.strip() and not line.startswith("#"):
            return line.rstrip()
    return ""


def commits_in_range(rev_range: str) -> list[tuple[str, str]]:
    out = subprocess.run(
        ["git", "log", "--no-merges", "--format=%h%x00%s", rev_range],
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return [tuple(line.split("\x00", 1)) for line in out.splitlines() if line]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--title", help="check one header, e.g. a PR title")
    group.add_argument("--file", help="check the first line of a commit message file")
    group.add_argument("--range", help="check every non-merge commit in a git range")
    args = parser.parse_args()

    if args.title is not None:
        items = [("title", args.title.strip())]
    elif args.file is not None:
        with open(args.file, encoding="utf-8") as fh:
            items = [("message", first_line(fh.read()))]
    else:
        items = commits_in_range(args.range)

    failed = 0
    for label, header in items:
        problems = check_header(header)
        if problems:
            failed += 1
            print(f"FAIL {label}: {header}")
            for problem in problems:
                print(f"  - {problem}")
    if failed:
        print(f"\n{failed} of {len(items)} failed. See CONTRIBUTING.md#commit-messages.")
        return 1
    print(f"OK: {len(items)} checked")
    return 0


if __name__ == "__main__":
    sys.exit(main())
