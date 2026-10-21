#!/usr/bin/env python3
"""Track upstream templates separately from the adapted files actually adopted."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile


SKILL = Path(__file__).resolve().parent.parent
GUIDE_VERSION = "v3.2"
SKILL_REVISION = "2026-10-08.2"
REVIEWED_GUIDE_REVISION = "23d61dbe16dd38d38169a0f0b472f5bbc0da0235"


def sha(path):
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path.name}: expected an object")
    return data


def contained(root, relative):
    path = Path(relative)
    if path.is_absolute() or ".." in path.parts:
        raise ValueError("paths must be relative, without '..'")
    result = (root / path).resolve()
    if not result.is_relative_to(root.resolve()):
        raise ValueError("path escapes its repository through a symlink")
    return result


def write_atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, delete=False) as file:
        temporary = Path(file.name)
        json.dump(data, file, indent=2, ensure_ascii=False)
        file.write("\n")
    try:
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def version():
    data = load(SKILL / "VERSION.json")
    if not isinstance(data.get("files"), dict) or not isinstance(data.get("guide_version"), str):
        raise ValueError("invalid VERSION.json; regenerate it")
    return data


def manifest_entries(data):
    entries = data.get("adopted")
    if not isinstance(entries, list) or any(
        not isinstance(e, dict) or not all(isinstance(e.get(k), str) and e[k]
                                         for k in ("template", "target_path", "template_sha256", "guide_version"))
        or ("adopted_sha256" in e and not isinstance(e["adopted_sha256"], str))
        for e in entries):
        raise ValueError("invalid adoption manifest; expected complete adopted entries")
    if len({e["target_path"] for e in entries}) != len(entries):
        raise ValueError("invalid adoption manifest: duplicate target paths")
    return entries


def adopt(template, target):
    root = Path(os.environ.get("TARGET_REPO", ".")).resolve()
    if not root.is_dir():
        raise ValueError("target repository directory does not exist")
    source = contained(SKILL, template)
    destination = contained(root, target)
    if not destination.is_file():
        raise ValueError("target file must exist before adoption is recorded")
    data = version()
    upstream_hash = data["files"].get(template)
    if not upstream_hash or not source.is_file():
        raise ValueError("template not tracked in VERSION.json")
    if sha(source) != upstream_hash:
        raise ValueError("template differs from VERSION.json; regenerate the manifest before adoption")
    manifest = contained(root, ".lean-agentic-baseline/manifest.json")
    record = load(manifest) if manifest.exists() else {"schema_version": 2, "adopted": []}
    entries = manifest_entries(record)
    entry = {"template": template, "template_sha256": upstream_hash,
             "target_path": target, "adopted_sha256": sha(destination),
             "guide_version": data["guide_version"], "skill_revision": data.get("skill_revision"),
             "adopted_at": datetime.now(timezone.utc).isoformat()}
    record.update(schema_version=2, adopted=[e for e in entries if e["target_path"] != target] + [entry])
    write_atomic(manifest, record)
    print(f"PASS: recorded upstream AND adapted file hashes for {target}")
    return 0


def check(root):
    root = Path(root).resolve()
    manifest = contained(root, ".lean-agentic-baseline/manifest.json")
    if not manifest.is_file():
        print("SKIP: no adoption manifest; nothing recorded")
        return 2
    entries = manifest_entries(load(manifest))
    if not entries:
        print("SKIP: adoption manifest has no entries")
        return 2
    data = version()
    failed = False
    print(f"{'TARGET':<40} {'STATUS':<23} DETAIL")
    for entry in entries:
        source = contained(SKILL, entry["template"])
        target = contained(root, entry["target_path"])
        current = data["files"].get(entry["template"])
        if not target.is_file():
            state, detail, failed = "GONE", "adopted target is missing", True
        elif not current or not source.is_file():
            state, detail, failed = "TEMPLATE_GONE", "upstream template no longer available; review replacement", True
        elif sha(source) != current:
            state, detail, failed = "MANIFEST_STALE", "live template differs from VERSION.json; regenerate it", True
        else:
            upstream_changed = current != entry["template_sha256"]
            baseline = entry.get("adopted_sha256")
            if baseline is None:
                # Legacy manifests did not record adaptations; do not invent a baseline.
                baseline = entry["template_sha256"] if sha(target) == entry["template_sha256"] else None
            if baseline is None:
                state = "DRIFT_BASELINE_UNKNOWN" if upstream_changed else "BASELINE_UNKNOWN"
                detail = "legacy manifest lacks adapted-file hash; review and re-adopt; upstream changed" if upstream_changed else "legacy manifest lacks adapted-file hash; review and re-adopt"
            else:
                edited = sha(target) != baseline
                state = "DRIFT_EDITED" if upstream_changed and edited else "DRIFT" if upstream_changed else "EDITED" if edited else "PASS"
                detail = "upstream changed; local file edited since adoption" if state == "DRIFT_EDITED" else "upstream changed; preserve adaptation while reviewing" if upstream_changed else "local file edited since adoption" if edited else "adapted file unchanged; upstream template unchanged"
        print(f"{entry['target_path']:<40} {state:<23} {detail}")
    print("No files overwritten. Hashes detect change, not semantic correctness; review both upstream and local changes.")
    return int(failed)


def generate():
    paths = sorted(set(
        [p for p in (SKILL / "assets/templates").rglob("*") if p.is_file()]
        + [p for p in (SKILL / "scripts").rglob("*") if p.is_file() and p.suffix in {".sh", ".py"}]
        + [SKILL / "SKILL.md", SKILL / "README.md"]
        + list((SKILL / "references").glob("*.md"))
        + list((SKILL / "evals").rglob("*.json"))))
    files = {str(p.relative_to(SKILL)): sha(p) for p in paths}
    key = f"{GUIDE_VERSION}-{SKILL_REVISION}"
    snapshot = contained(SKILL, f"references/version-history/{key}.contents.json")
    contents = {str(p.relative_to(SKILL)): p.read_text(encoding="utf-8") for p in paths}
    if snapshot.exists() and load(snapshot) != contents:
        raise ValueError("content snapshot already exists; bump SKILL_REVISION rather than overwriting history")
    out = SKILL / "VERSION.json"
    if out.exists():
        old = version()
        if old["files"] != files or old.get("skill_revision") != SKILL_REVISION or old["guide_version"] != GUIDE_VERSION:
            key = old["guide_version"] + ("-" + old["skill_revision"] if old.get("skill_revision") else "")
            archive = contained(SKILL, f"references/version-history/{key}.json")
            if archive.exists() and load(archive) != old:
                raise ValueError("history key already exists with different content; bump SKILL_REVISION")
            if not archive.exists():
                write_atomic(archive, old)
    data = {"guide_title": "Lean Agentic Baseline", "guide_version": GUIDE_VERSION,
            "guide_assessed_date": "2026-09-20", "source_file": "lean-agentic-baseline.html",
            "skill_revision": SKILL_REVISION,
            "reviewed_guide": {"repository": "https://github.com/emb715/lean-agile-agentic",
                               "revision": REVIEWED_GUIDE_REVISION, "assessed_date": "2026-10-07",
                               "scope": "26-pillar inventory and goal-based assessment; templates retain their v3.2 origin"},
            "generated_at": datetime.now(timezone.utc).isoformat(), "files": files}
    write_atomic(out, data)
    # Content snapshots permit actual before/after diffs; legacy archives remain hash-only.
    if not snapshot.exists():
        write_atomic(snapshot, contents)
    print(f"PASS: generated {len(files)} hashes; guide {GUIDE_VERSION}, skill {SKILL_REVISION}; retained content snapshot")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    adoption = commands.add_parser("adopt")
    adoption.add_argument("template")
    adoption.add_argument("target")
    checking = commands.add_parser("check")
    checking.add_argument("root", nargs="?", default=os.environ.get("TARGET_REPO", "."))
    commands.add_parser("generate")
    args = parser.parse_args()
    try:
        return adopt(args.template, args.target) if args.command == "adopt" else check(args.root) if args.command == "check" else generate()
    except (OSError, ValueError, UnicodeError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
