#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]

TARGET_GLOBS = [
    "agents/**/*.md",
    "docs/**/*.md",
    "experiments/**/*.md",
    "playbooks/**/*.md",
    "prompts/**/*.md",
    "skills/**/*.md",
    "tools/**/*.md",
    "vetted/**/*.md",
]

EXCLUDE_GLOBS = [
    "templates/**/*.md",
    "archive/**/*.md",
    "_meta/**/*.md",
    "**/node_modules/**/*.md",
    "**/build/**/*.md",
    "experiments/*/server/**/*.md",
    "experiments/design-skill/**/*.md",
    "experiments/primitive-contract-docs/boundary/README.md",
    "skills/*/docs/**/*.md",
    "tools/*/docs/**/*.md",
]

# Files within three-file artifact folders that intentionally have no frontmatter.
# Pattern: any file named playbook.md or humans.md anywhere in the tree.
NO_FRONTMATTER_NAMES = {
    "playbook.md",
    "humans.md",
    "system-prompt.md",
    "SKILL.md",
    "prompt.md",
    "command.md",
    "tool.md",
}

# Directories whose non-README markdown files are artifact body files (no frontmatter by design).
NO_FRONTMATTER_DIRS = {
    "experiments/prompt-factory/templates",
    "skills/prompt-factory/templates",
    "skills/prompt-factory/templates/types",
    "skills/prompt-factory/commands",

}

# Directories whose non-README markdown files are reference captures (external content).
# Exempt from DL004 structural section checks. Still checked for frontmatter and sanitization.
REFERENCE_CAPTURE_DIRS = {
    "docs/references/loop-engineering",
}

# Directories whose markdown files are external source captures (book OCR, scraped docs).
# Exempt from DL006 PII patterns (phone/email) — content is from published books, not real PII.
# DL013 (absolute paths) still applies.
SANITIZATION_PII_SKIP_DIRS = {
    "experiments/design-skill/laws/sources",
}

# Exception: prompt-gen.md has a partial frontmatter block (description/skill fields)
# that is OpenCode command syntax, not repo frontmatter. Exclude it from DL001-DL008
# but still scan for sanitization.
OPENCODE_COMMAND_FILES = {
    "skills/prompt-factory/commands/prompt-gen.md",
}

ROOT_EXCLUDE = {
    "README.md",
    "CONTRIBUTING.md",
    "AGENTS.md",
}

REQUIRED_KEYS = {
    "title",
    "status",
    "confidence",
    "last_tested",
    "scope",
    "tooling",
    "tags",
    "owner",
}

ALLOWED_STATUS = {"draft", "validated", "vetted", "deprecated"}
ALLOWED_CONFIDENCE = {"low", "medium", "high"}

# The owner of this repo. Any other value in an artifact's `owner` frontmatter
# field fails DL012. Set here, not in AGENTS.md prose, so the linter is the
# source of truth — AGENTS.md documents the rule, this enforces it.
EXPECTED_OWNER = "@emb715"

# DL013 — absolute or machine-specific path pattern.
# Catches leaked filesystem paths. Does NOT block /tmp/ (legitimate clone target).
ABS_PATH_PATTERN = re.compile(
    r"(?:"
    r"/Users/[A-Za-z0-9._-]+"        # macOS absolute home path
    r"|/home/[A-Za-z0-9._-]+"        # Linux absolute home path
    r"|C:\\\\[A-Za-z0-9._\\-]+"      # Windows absolute path
    r")"
)

GATE_LABELS = {
    "DL001": "Gate 1",
    "DL002": "Gate 1",
    "DL003": "Gate 1",
    "DL004": "Gate 2",
    "DL005": "Gate 3",
    "DL006": "Gate 4",
    "DL007": "Gate 5",
    "DL008": "Gate 6",
    "DL009": "Gate 2",
    "DL010": "Gate 2",
    "DL011": "Gate 2",
    "DL012": "Gate 1",
    "DL013": "Gate 4",
}


@dataclass
class Finding:
    rule_id: str
    file_path: str
    message: str


def normalize_scalar(value: str) -> str:
    value = value.strip()
    if " #" in value:
        value = value.split(" #", 1)[0].strip()
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        return value[1:-1].strip()
    return value


def parse_frontmatter(text: str) -> Tuple[Optional[Dict[str, object]], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text

    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break

    if end is None:
        return None, text

    fm_lines = lines[1:end]
    body = "\n".join(lines[end + 1 :])
    data: Dict[str, object] = {}
    current_list_key: Optional[str] = None

    for raw in fm_lines:
        line = raw.rstrip()
        if not line.strip():
            continue

        if re.match(r"^\s*-\s+", line):
            if current_list_key is None:
                continue
            item = re.sub(r"^\s*-\s+", "", line)
            item = normalize_scalar(item)
            if isinstance(data.get(current_list_key), list):
                data[current_list_key].append(item)
            continue

        current_list_key = None
        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()

        if not value:
            data[key] = []
            current_list_key = key
            continue

        if value.startswith("[") and value.endswith("]"):
            items = [normalize_scalar(v) for v in value[1:-1].split(",") if v.strip()]
            data[key] = items
            continue

        data[key] = normalize_scalar(value)

    return data, body


def collect_target_files() -> List[Path]:
    files = set()
    for pattern in TARGET_GLOBS:
        files.update(ROOT.glob(pattern))

    excluded = set()
    for pattern in EXCLUDE_GLOBS:
        excluded.update(ROOT.glob(pattern))

    results = []
    for path in files:
        if path in excluded:
            continue
        rel = path.relative_to(ROOT).as_posix()
        if rel in ROOT_EXCLUDE:
            continue
        if path.is_file():
            results.append(path)

    return sorted(results)


def collect_all_markdown_files() -> List[Path]:
    """Every .md file in the repo, excluding only node_modules and .git.
    Used for sanitization scans (DL006, DL013) which apply regardless of
    lint exclusion status — excluded files are still public on GitHub.
    """
    skip_dirs = {".git", "node_modules", "__pycache__"}
    results = []
    for path in ROOT.rglob("*.md"):
        if any(part in skip_dirs for part in path.parts):
            continue
        if path.is_file():
            results.append(path)
    return sorted(results)


def markdown_headings(body: str) -> List[str]:
    headings: List[str] = []
    for line in body.splitlines():
        m = re.match(r"^\s{0,3}#{1,6}\s+(.+?)\s*$", line)
        if m:
            headings.append(m.group(1).strip().lower())
    return headings


def heading_present(headings: List[str], patterns: List[str]) -> bool:
    for h in headings:
        for p in patterns:
            if p in h:
                return True
    return False


def is_valid_date(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def old_status_from_head(rel_path: str) -> Optional[str]:
    try:
        result = subprocess.run(
            ["git", "show", f"HEAD:{rel_path}"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            return None
        fm, _ = parse_frontmatter(result.stdout)
        if not fm:
            return None
        val = fm.get("status")
        return str(val).strip().lower() if val is not None else None
    except Exception:
        return None


def has_evidence_signal(body: str) -> bool:
    metric_pattern = re.compile(
        r"\b\d+(?:\.\d+)?\s?(?:%|ms|s|sec|seconds|minutes|hours|x|tokens|requests|errors)\b",
        re.IGNORECASE,
    )
    if metric_pattern.search(body):
        return True

    lower = body.lower()
    if "before" in lower and "after" in lower:
        return True

    if "```" in body and re.search(r"\b(output|observed|result)\b", lower):
        return True

    return False


def sanitization_hits(text: str) -> List[str]:
    patterns = {
        "aws_access_key": r"\bAKIA[0-9A-Z]{16}\b",
        "google_api_key": r"\bAIza[0-9A-Za-z\-_]{35}\b",
        "github_pat": r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b",
        "openai_like_key": r"\bsk-[A-Za-z0-9]{20,}\b",
        "credential_assignment": r"(?i)\b(api[_-]?key|token|secret|password)\b[ \t]*[:=][ \t]*['\"]?[A-Za-z0-9_\-\/=+]{8,}",
        "private_host": r"https?://[A-Za-z0-9.-]+\.(?:internal|corp|local|lan)\b",
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        "phone": r"\b(?:\+?\d{1,2}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b",
    }

    hits: List[str] = []
    found_email = False
    found_phone = False
    for label, pattern in patterns.items():
        if re.search(pattern, text):
            if label == "email":
                found_email = True
            elif label == "phone":
                found_phone = True
            else:
                hits.append(label)

    # PII heuristic: require both email and phone before blocking to reduce noise.
    if found_email and found_phone:
        hits.append("potential_pii_email_and_phone")

    return hits


def linked_from_index(rel_path: str, root_readme: str, section_readmes: Dict[str, str]) -> bool:
    if rel_path.endswith("/README.md") or rel_path == "README.md":
        return True

    # Check full path in root README.
    if rel_path in root_readme:
        return True

    section = rel_path.split("/", 1)[0]
    section_index = f"{section}/README.md"
    section_text = section_readmes.get(section_index, "")

    # Check full path in section README.
    if rel_path in section_text:
        return True

    # Check section-relative path (e.g. standards/artifact-structure.md inside docs/README.md).
    section_relative = rel_path.split("/", 1)[-1] if "/" in rel_path else rel_path
    if section_relative in section_text:
        return True

    # Check all other loaded READMEs (nested subsection indexes).
    filename = rel_path.split("/")[-1]
    for idx_text in section_readmes.values():
        if rel_path in idx_text or filename in idx_text:
            return True

    return False


def sanitization_scan(file_path: Path) -> List[Finding]:
    """Run DL006 + DL013 on a single file. Applies to every markdown file
    in the repo regardless of lint exclusion status — excluded files are
    still public on GitHub.
    """
    rel_path = file_path.relative_to(ROOT).as_posix()
    rel_dir = "/".join(rel_path.split("/")[:-1])
    text = file_path.read_text(encoding="utf-8")
    findings: List[Finding] = []

    # DL006 — skip PII patterns for known external source captures (book OCR, etc.)
    skip_pii = any(rel_dir.startswith(d) for d in SANITIZATION_PII_SKIP_DIRS)
    if skip_pii:
        # Still check for credential/key patterns, just not email+phone PII
        hits = [h for h in sanitization_hits(text) if h != "potential_pii_email_and_phone"]
    else:
        hits = sanitization_hits(text)
    if hits:
        findings.append(
            Finding("DL006", rel_path, f"Sanitization risk patterns detected: {', '.join(sorted(set(hits)))}")
        )

    abs_match = ABS_PATH_PATTERN.search(text)
    if abs_match:
        findings.append(
            Finding(
                "DL013",
                rel_path,
                f"Absolute or machine-specific path detected: {abs_match.group(0)}. Use repo-relative paths only.",
            )
        )

    return findings


def lint() -> Tuple[List[Finding], int]:
    findings: List[Finding] = []

    # --- Pass 1: sanitization on every markdown file in the repo ---
    all_files = collect_all_markdown_files()
    for file_path in all_files:
        findings.extend(sanitization_scan(file_path))

    # --- Pass 2: structural checks on non-excluded files only ---
    files = collect_target_files()

    root_readme_path = ROOT / "README.md"
    root_readme = root_readme_path.read_text(encoding="utf-8") if root_readme_path.exists() else ""

    section_readmes: Dict[str, str] = {}
    for top in ["agents", "docs", "experiments", "playbooks", "prompts", "skills", "tools"]:
        # Index the top-level section README.
        p = ROOT / top / "README.md"
        if p.exists():
            section_readmes[f"{top}/README.md"] = p.read_text(encoding="utf-8")
        # Also index any nested READMEs (subsection indexes, e.g. docs/references/loop-engineering/README.md).
        for nested in (ROOT / top).rglob("README.md"):
            nested_rel = nested.relative_to(ROOT).as_posix()
            if nested_rel not in section_readmes:
                section_readmes[nested_rel] = nested.read_text(encoding="utf-8")

    for file_path in files:
        rel_path = file_path.relative_to(ROOT).as_posix()
        text = file_path.read_text(encoding="utf-8")

        # Skip frontmatter and structural checks for intentionally bare files:
        # - playbook.md and humans.md in three-file artifact folders
        # - artifact body files in known bare directories
        rel_dir = "/".join(rel_path.split("/")[:-1])
        sibling_readme_exists = (file_path.parent / "README.md").exists()
        is_artifact_body_with_local_readme = (
            file_path.name != "README.md" and sibling_readme_exists
        )
        # DL011 — non-experiment runtime self-containment
        # Runtime-consumable files outside experiments must not depend on files
        # under experiments/ for execution.
        is_non_experiment = not rel_path.startswith("experiments/")
        is_artifact_runtime_area = rel_path.startswith(("skills/", "prompts/", "tools/", "agents/", "playbooks/"))
        is_runtime_file = (
            file_path.name in {"SKILL.md", "prompt.md", "command.md", "tool.md", "system-prompt.md", "playbook.md"}
            or "/commands/" in rel_path
            or "/templates/" in rel_path
            or rel_path.startswith("skills/") and file_path.name != "README.md" and file_path.name != "humans.md"
        )
        if is_non_experiment and is_artifact_runtime_area and is_runtime_file and "experiments/" in text:
            findings.append(
                Finding(
                    "DL011",
                    rel_path,
                    "Non-experiment runtime artifact references experiments/ path; move dependency to canonical artifact location",
                )
            )

        is_bare = (
            file_path.name in NO_FRONTMATTER_NAMES
            or rel_dir in NO_FRONTMATTER_DIRS
            or rel_path in OPENCODE_COMMAND_FILES
            or is_artifact_body_with_local_readme
        )
        if is_bare:
            continue

        fm, body = parse_frontmatter(text)

        if fm is None:
            findings.append(Finding("DL001", rel_path, "Missing YAML frontmatter block"))
            continue

        # DL002
        missing = sorted(REQUIRED_KEYS - set(fm.keys()))
        if missing:
            findings.append(
                Finding("DL002", rel_path, f"Missing frontmatter keys: {', '.join(missing)}")
            )

        # DL003
        status = str(fm.get("status", "")).strip().lower()
        if status not in ALLOWED_STATUS:
            findings.append(Finding("DL003", rel_path, f"Invalid status: {status or '<empty>'}"))

        confidence = str(fm.get("confidence", "")).strip().lower()
        if confidence not in ALLOWED_CONFIDENCE:
            findings.append(
                Finding("DL003", rel_path, f"Invalid confidence: {confidence or '<empty>'}")
            )

        date_val = str(fm.get("last_tested", "")).strip()
        if not is_valid_date(date_val):
            findings.append(
                Finding("DL003", rel_path, f"Invalid last_tested date format: {date_val or '<empty>'}")
            )

        # DL012 — owner value must match the repo owner exactly.
        # Prevents OS-username / git-config-user drift. The expected value is
        # defined once in EXPECTED_OWNER at the top of this file.
        owner_val = normalize_scalar(str(fm.get("owner", "")))
        if owner_val and owner_val != EXPECTED_OWNER:
            findings.append(
                Finding(
                    "DL012",
                    rel_path,
                    f"Invalid owner value: {owner_val!r} (expected {EXPECTED_OWNER!r})",
                )
            )

        # DL004
        # Index READMEs (section-level, e.g. docs/README.md, docs/references/README.md)
        # are navigation/index files — they are exempt from structural section requirements.
        is_index_readme = (
            file_path.name == "README.md"
            and file_path.parent != ROOT  # not root README
        )

        # Reference capture files (external content captures in docs/references/**)
        # are exempt from structural section requirements — they follow source structure.
        is_reference_capture = (
            rel_dir in REFERENCE_CAPTURE_DIRS
            and file_path.name != "README.md"
        )

        # If this README lives alongside a playbook.md, procedure steps are in
        # that file by design — skip the procedure section requirement here.
        sibling_playbook = file_path.parent / "playbook.md"
        readme_delegates_to_playbook = file_path.name == "README.md" and sibling_playbook.exists()

        h = markdown_headings(body)
        has_context = heading_present(h, ["context", "problem", "background", "objective"])
        has_scope = heading_present(h, ["scope"])
        has_procedure = heading_present(h, ["procedure", "steps", "method", "workflow", "process"])
        has_evidence = heading_present(h, ["evidence", "results", "result", "outcome", "observations", "metrics"])
        has_failure = heading_present(h, ["failure", "limitations", "boundary", "edge case", "fallback", "rollback"])
        missing_sections = []
        if not is_index_readme and not is_reference_capture:
            if not has_context:
                missing_sections.append("context/problem")
            if not has_scope:
                missing_sections.append("scope")
            if not has_procedure and not readme_delegates_to_playbook:
                missing_sections.append("procedure/steps")
            if not has_evidence:
                missing_sections.append("evidence/results")
            if not has_failure:
                missing_sections.append("failure modes/boundaries")
        if missing_sections:
            findings.append(
                Finding("DL004", rel_path, f"Missing required sections: {', '.join(missing_sections)}")
            )

        # DL005 — prescriptive language check.
        # Match "best practice", "recommended", "always", and imperative "never"
        # (at sentence start or after bullet/list marker).
        # Avoid triggering on mid-sentence descriptive uses of "never" (e.g. "was never tested").
        prescriptive_pattern = re.compile(
            r"(?:"
            r"best practice"
            r"|recommended"
            r"|(?:^|\.\s+|\n[-*]\s+|\n\d+\.\s+)always\b"
            r"|(?:^|\.\s+|\n[-*]\s+|\n\d+\.\s+)never\b"
            r")",
            re.IGNORECASE | re.MULTILINE,
        )
        if prescriptive_pattern.search(body):
            if not has_evidence_signal(body):
                findings.append(
                    Finding(
                        "DL005",
                        rel_path,
                        "Prescriptive language found without measurable/comparative/repro evidence",
                    )
                )

        # DL007
        previous = old_status_from_head(rel_path)
        if previous and previous != status:
            allowed = (
                (previous == "draft" and status == "validated")
                or (previous == "validated" and status == "vetted")
                or (status == "deprecated")
            )
            if not allowed:
                findings.append(
                    Finding("DL007", rel_path, f"Invalid status transition: {previous} -> {status}")
                )

        # DL008
        if not linked_from_index(rel_path, root_readme, section_readmes):
            findings.append(
                Finding(
                    "DL008",
                    rel_path,
                    "Artifact is not linked from root README.md or relevant section README.md",
                )
            )

        # DL010 (agent-specific structure)
        # Every agent folder README must have a sibling system-prompt.md.
        # External agents (tagged `external`) use the two-file variant —
        # no system-prompt.md by design (consumable lives outside the repo).
        is_agent_readme = (
            rel_path.startswith("agents/")
            and file_path.name == "README.md"
            and file_path.parent != ROOT / "agents"  # skip agents/README.md index
        )
        if is_agent_readme:
            tags_val = fm.get("tags", []) if fm else []
            tag_list = tags_val if isinstance(tags_val, list) else ([tags_val] if isinstance(tags_val, str) else [])
            tag_lower = [str(t).strip().lower() for t in tag_list]
            is_external = "external" in tag_lower
            sibling_system_prompt = file_path.parent / "system-prompt.md"
            if not is_external and not sibling_system_prompt.exists():
                findings.append(
                    Finding(
                        "DL010",
                        rel_path,
                        "Agent folder is missing required system-prompt.md",
                    )
                )

        # DL009 (playbook-specific structure)
        is_playbook = rel_path.startswith("playbooks/") and not rel_path.endswith("/README.md")
        if is_playbook:
            headings = markdown_headings(body)
            has_trigger = heading_present(headings, ["trigger"])
            has_workflow = heading_present(headings, ["workflow"])
            has_outputs = heading_present(headings, ["output", "outputs"])
            has_verification = heading_present(headings, ["verification"])
            has_failure_path = heading_present(headings, ["failure", "rollback", "fallback"])
            has_proc = heading_present(headings, ["procedure", "steps", "workflow", "process"])
            has_numbered_steps = bool(re.search(r"^\s*##\s+\d+\.\s+", body, re.MULTILINE)) or bool(
                re.search(r"^\s*\d+\.\s+", body, re.MULTILINE)
            )

            missing_playbook = []
            if not has_trigger:
                missing_playbook.append("trigger")
            if not has_proc:
                missing_playbook.append("procedure/steps")
            if not has_numbered_steps:
                missing_playbook.append("ordered step sequence")
            if not has_workflow:
                missing_playbook.append("workflow")
            if not has_outputs:
                missing_playbook.append("outputs")
            if not has_verification:
                missing_playbook.append("verification")
            if not has_failure_path:
                missing_playbook.append("failure/rollback path")

            tags = fm.get("tags", [])
            tag_values = []
            if isinstance(tags, list):
                tag_values = [str(t).strip().lower() for t in tags]
            elif isinstance(tags, str):
                tag_values = [tags.strip().lower()]
            if "playbook" not in tag_values:
                missing_playbook.append("tag: playbook")

            if missing_playbook:
                findings.append(
                    Finding(
                        "DL009",
                        rel_path,
                        f"Invalid playbook candidate. Missing: {', '.join(missing_playbook)}",
                    )
                )

    blocked = 1 if findings else 0
    return findings, blocked


def print_report(findings: List[Finding]) -> None:
    if not findings:
        print("COMPLIANCE: PASS")
        print("FAILED_GATES: []")
        print("EVIDENCE:")
        print("- all-target-files: all checks passed")
        print("FIXES_REQUIRED:")
        print("- none")
        print("PROMOTION_DECISION: allowed")
        return

    failed_gates = sorted({GATE_LABELS.get(f.rule_id, f.rule_id) for f in findings})
    print("COMPLIANCE: BLOCKED")
    print(f"FAILED_GATES: [{', '.join(failed_gates)}]")
    print("EVIDENCE:")
    for f in findings:
        print(f"- {f.file_path}: {f.rule_id} {f.message}")
    print("FIXES_REQUIRED:")
    for f in findings:
        print(f"- {f.file_path}: fix {f.rule_id} ({f.message})")
    print("PROMOTION_DECISION: not allowed")


def main() -> int:
    findings, blocked = lint()
    print_report(findings)
    return blocked


if __name__ == "__main__":
    sys.exit(main())
