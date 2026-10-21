#!/usr/bin/env python3
"""Read-only, conservative configuration inventory; not a safety certification."""
import argparse
from collections import Counter
import json
import os
from pathlib import Path
import re
import sys


PILLARS = [
    (0, "steering", "Steering docs"),
    (0, "gates", "Validation gates"),
    (0, "commits", "Commit conventions"),
    (0, "hooks", "Hooks, not rules"),
    (0, "permissions", "Permissions & blast radius"),
    (1, "ci", "CI/CD pipeline"),
    (1, "trunk", "Trunk-based development"),
    (1, "skills", "Skills"),
    (1, "cleancode", "Clean code & comments"),
    (1, "testint", "Test integrity"),
    (1, "arch", "Architecture as a gate"),
    (1, "devcontainer", "Devcontainer"),
    (2, "adrs", "Lean docs & ADRs"),
    (2, "sessions", "Sessions & handoffs"),
    (2, "graph", "Code graph"),
    (2, "vdocs", "Versioned docs"),
    (2, "memory", "Memory bank"),
    (2, "supply", "Supply chain & untrusted input"),
    (2, "where", "Where does this fact live?"),
    (3, "agents", "Agents & orchestration"),
    (3, "bots", "PR review & autonomy"),
    (3, "tracker", "Issues to roadmap"),
    (3, "deploy", "Deploy & kill switches"),
    (3, "metrics", "Metrics & evals"),
    (3, "meta", "Meta framework & drift"),
    (3, "onboarding", "Onboarding & contributors"),
]


def inventory(root):
    observations = {}

    def text(path):
        file = root / path
        return file.read_text(encoding="utf-8") if file.is_file() else ""

    def candidates(patterns):
        return sorted({str(p.relative_to(root)) for pattern in patterns
                       for p in root.glob(pattern) if p.is_file() and p.stat().st_size
                       and p.read_text(encoding="utf-8").strip() not in {"", "{}", "[]", "module.exports = {};"}})

    def put(id_, evidence, detail, paths=()):
        observations[id_] = {"evidence": evidence, "detail": detail, "paths": list(paths)}

    def detect(id_, patterns, next_test):
        paths = candidates(patterns)
        put(id_, "CONFIGURED" if paths else "MISSING",
            ("Candidate files found. " if paths else "No supported nonempty files detected. ")
            + next_test, paths)

    steering = candidates(["AGENTS.md", "CLAUDE.md"])
    if steering:
        violations = [p for p in steering if len(text(p).splitlines()) > 200]
        put("steering", "CONFIGURED",
            "Advisory: 200-line suggested budget exceeded; assess local policy and loading cost: " + ", ".join(violations) if violations else
            "Within suggested line budget; content quality and session loading untested.", steering)
    else:
        put("steering", "MISSING", "No supported steering file detected.")

    package = None
    if (root / "package.json").is_file():
        try:
            package = json.loads(text("package.json"))
            if not isinstance(package, dict):
                raise ValueError("expected an object")
        except (ValueError, json.JSONDecodeError):
            package = None
            put("gates", "FAILED", "Invalid package.json; cannot inspect scripts.", ["package.json"])
    gate_paths = candidates(["scripts/validate.sh"])
    scripts = package.get("scripts", {}) if package is not None else {}
    if isinstance(scripts, dict) and isinstance(scripts.get("validate"), str) and scripts["validate"].strip():
        gate_paths.append("package.json")
        if scripts["validate"].strip() in {"true", ":", "exit 0"}:
            put("gates", "FAILED", "validate is a known no-op, not validation.", ["package.json"])
    if re.search(r"^validate\s*:", text("Makefile"), re.M):
        gate_paths.append("Makefile")
    if "gates" not in observations:
        recognized = any((root / p).is_file() for p in ["package.json", "pyproject.toml", "go.mod", "Cargo.toml", "Makefile"])
        put("gates", "CONFIGURED" if gate_paths else "MISSING" if recognized else "UNKNOWN",
            "Entrypoint detected; gates were NOT run. Test a deliberate violation and compare CI."
            if gate_paths else "No supported validate entrypoint detected; inspect stack before deciding applicability.", gate_paths)

    detect("commits", ["commitlint.config.*", ".commitlintrc*", "lefthook.yml", ".husky/commit-msg"],
           "Confirm convention enforcement by rejecting an invalid commit; a config alone is insufficient.")
    settings = {}
    settings_present = (root / ".claude/settings.json").is_file()
    if settings_present:
        try:
            settings = json.loads(text(".claude/settings.json"))
            if not isinstance(settings, dict):
                raise ValueError("expected an object")
        except (ValueError, json.JSONDecodeError):
            settings = {}
            put("hooks", "FAILED", "Invalid .claude/settings.json.", [".claude/settings.json"])
    if "hooks" not in observations:
        hooks = settings.get("hooks")
        has_command = isinstance(hooks, dict) and any(
            isinstance(event, list) and any(
                isinstance(group, dict) and isinstance(group.get("hooks"), list) and any(
                    isinstance(h, dict) and isinstance(h.get("command"), str) and h["command"].strip()
                    for h in group["hooks"])
                for group in event)
            for event in hooks.values())
        put("hooks", "CONFIGURED" if has_command else "MISSING",
            "Hook command detected; fire its event with a safe violation to prove enforcement."
            if has_command else "No hook command detected in supported settings; inspect other harnesses separately.",
            [".claude/settings.json"] if settings_present else [])
    detect("permissions", ["docs/PERMISSIONS.md", ".claude/settings.json", ".claude/managed-settings.json"],
           "Inspect ask/deny semantics, independent ownership, scoped identity, host secrets and egress; authorized APIs/probes may supply evidence.")
    detect("ci", [".github/workflows/*.yml", ".github/workflows/*.yaml", ".gitlab-ci.yml"],
           "Confirm the same validate command runs and an intentionally failing PR cannot merge.")
    put("trunk", "UNKNOWN", "Inspect branch age/size in git and hosting APIs; confirm team workflow and feature-flag policy.")
    detect("skills", [".claude/skills/*/SKILL.md", ".agents/skills/*/SKILL.md", ".opencode/skills/*/SKILL.md"],
           "Exercise repo conventions; empty directories are not skills and number of skills is not quality.")
    put("cleancode", "UNKNOWN", "Review a real diff: explanation quality needs judgment; run ticket-reference checks separately.")
    detect("testint", ["scripts/no-test-weakening.sh", ".github/workflows/*test*.*", "stryker.conf*", ".mutmut*"],
           "Diff heuristics are not semantic integrity; try a weakened assertion and use mutation tests or review.")
    detect("arch", [".dependency-cruiser.*", ".importlinter", "import-linter.toml", "*ArchUnit*", ".golangci.y*ml"],
           "Prove a forbidden dependency fails validate; a linter file may contain no boundary rules.")
    detect("devcontainer", [".devcontainer/devcontainer.json", ".devcontainer.json"],
           "Rebuild cleanly and probe denied egress/secret access safely; a container alone proves no security boundary.")
    detect("adrs", ["docs/decisions/INDEX.md", "docs/adr/*.md", "docs/decisions/*[0-9]*.md"],
           "Check index/records and governed paths, then test task-scoped retrieval and supersession.")
    detect("sessions", ["docs/handoff-template.md", "docs/HANDOFF.md"],
           "Have a fresh session resume correctly, including reasons and do-not-redo decisions.")
    put("graph", "UNKNOWN", "Probe configured indexer, freshness and representative definition/caller queries; measure effort and correctness.")
    docs_mentions = [p for p in steering if re.search(r"context7|llms\.txt|installed version|lockfile", text(p), re.I)]
    put("vdocs", "CONFIGURED" if docs_mentions else "UNKNOWN",
        "Retrieval guidance detected; verify a query matches the installed version." if docs_mentions else
        "Inspect docs retrieval tools and test installed-version matching; no supported guidance detected.", docs_mentions)
    put("memory", "UNKNOWN", "Probe authorized store for dated/sourced recall, expiry and separation from instructions; avoid sensitive contents.")
    detect("supply", [".github/workflows/dependency-review.y*ml", ".mcp.json"],
           "Dependency review is only one control; verify dependency approval, untrusted-input handling and egress separately.")
    put("where", "UNKNOWN", "Sample facts and trace their authoritative home, scope and retrieval cost; detect conflicting copies.")
    detect("agents", [".claude/agents/*.md", ".opencode/agents/*.md", ".opencode/agent/*.md"],
           "Run a bounded delegation; prove tool scope, ownership and summary-only handback, not merely agent count.")
    detect("bots", [".github/labeler.yml", ".github/workflows/label-impact.y*ml", ".github/CODEOWNERS"],
           "Test an impactful PR's required reviews and autonomy; labels alone enforce neither.")
    detect("tracker", [".github/ISSUE_TEMPLATE/*.md", ".github/ISSUE_TEMPLATE/*.yml", ".github/ISSUE_TEMPLATE/*.yaml"],
           "Verify a real work item is accessible and agent-ready; another shared, versioned specification home can be equivalent.")
    detect("deploy", [".github/workflows/deploy.y*ml"],
           "Query production reviewer/bypass rules and rehearse change rollback plus agent credential revocation; owner authorizes tests.")
    put("metrics", "UNKNOWN", "Inspect attributed follow-up fix-rate cohorts, observation window, review effort and delivery outcomes; validate data definitions.")
    detect("meta", [".github/workflows/drift.y*ml", "scripts/steering-drift.sh"],
           "A script is not a schedule: inject harmless drift and confirm detection, assignment and resolution.")
    detect("onboarding", ["ONBOARDING.md", "CONTRIBUTORS.md", "CONTRIBUTING.md"],
           "Check onboarding and contribution coverage; have a newcomer complete the first task without undocumented help.")

    return [{"tier": tier, "id": id_, "pillar": name, "applicability": "UNASSESSED", **observations[id_]}
            for tier, id_, name in PILLARS]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="emit structured inventory")
    parser.add_argument("--strict", action="store_true", help="exit 1 unless every pillar is VERIFIED (static inventory cannot certify this)")
    args = parser.parse_args()
    root = Path(os.environ.get("TARGET_REPO", ".")).resolve()
    if not root.is_dir():
        parser.error(f"target directory does not exist: {root}")
    try:
        rows = inventory(root)
    except (OSError, UnicodeError) as error:
        print(f"ERROR: could not inspect target: {error}", file=sys.stderr)
        return 2
    counts = dict(Counter(r["evidence"] for r in rows))
    note = "Static inventory only. CONFIGURED is not VERIFIED; MISSING is not NOT_APPLICABLE. Assess fit, authority and behavioral evidence before adoption."
    if args.json:
        print(json.dumps({"schema_version": 2, "pillar_count": len(rows), "counts": counts, "note": note, "pillars": rows}, indent=2))
    else:
        print(f"{'TIER':<6} {'PILLAR':<34} {'EVIDENCE':<12} DETAIL")
        for row in rows:
            print(f"{row['tier']:<6} {row['pillar']:<34} {row['evidence']:<12} {row['detail']}")
        print("\n" + " ".join(f"{k}={v}" for k, v in sorted(counts.items())))
        print(note)
    return int(counts.get("FAILED", 0) > 0 or args.strict and any(r["evidence"] != "VERIFIED" for r in rows))


if __name__ == "__main__":
    sys.exit(main())
