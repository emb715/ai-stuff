#!/usr/bin/env python3
"""Adversarial regression fixtures; no hosting access or target-code execution."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


SOURCE = Path(__file__).resolve().parents[2]
TEMPLATE = "assets/templates/tier-0/AGENTS.md"


class BaselineTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="lean-test-", dir=os.environ.get("BASELINE_TEST_TMPDIR"))
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.repo = self.root / "target"
        self.repo.mkdir()

    def file(self, path, content):
        target = self.repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
        return target

    def run_script(self, name, *args, skill=None):
        return subprocess.run(["bash", str((skill or SOURCE) / "scripts" / name), *args],
                              cwd=self.repo, env={**os.environ, "TARGET_REPO": str(self.repo)},
                              text=True, capture_output=True)

    def score(self):
        result = self.run_script("scorecard.sh", "--json")
        self.assertNotEqual(result.returncode, 2, result.stderr)
        data = json.loads(result.stdout)
        return result, {row["id"]: row for row in data["pillars"]}, data

    def pin_skill(self):
        skill = self.root / "skill"
        shutil.copytree(SOURCE, skill, ignore=shutil.ignore_patterns("__pycache__", "version-history"))
        result = self.run_script("generate-version-manifest.sh", skill=skill)
        self.assertEqual(result.returncode, 0, result.stderr)
        return skill

    def adopt(self, skill, content="Adapted steering for this project\n"):
        self.file("AGENTS.md", content)
        result = self.run_script("adopt.sh", TEMPLATE, "AGENTS.md", skill=skill)
        self.assertEqual(result.returncode, 0, result.stderr)

    def upstream_change(self, skill):
        source = skill / TEMPLATE
        source.write_text(source.read_text() + "\nUpstream change\n")
        data = json.loads((skill / "VERSION.json").read_text())
        data["files"][TEMPLATE] = "sha256:" + hashlib.sha256(source.read_bytes()).hexdigest()
        (skill / "VERSION.json").write_text(json.dumps(data))

    def test_all_26_pillars_once_and_unassessed(self):
        result, rows, data = self.score()
        self.assertEqual(result.returncode, 0)
        self.assertEqual(data["pillar_count"], 26)
        self.assertEqual(len(rows), 26)
        self.assertIn("where", rows)
        self.assertTrue(all(row["applicability"] == "UNASSESSED" for row in rows.values()))
        self.assertTrue(all(row["evidence"] != "VERIFIED" for row in rows.values()))

    def test_empty_directories_and_configs_do_not_pass(self):
        for path in [".github/workflows", ".claude/skills", ".claude/agents", ".github/ISSUE_TEMPLATE"]:
            (self.repo / path).mkdir(parents=True, exist_ok=True)
        self.file(".claude/settings.json", "{}")
        self.file(".devcontainer.json", "{}")
        self.file(".dependency-cruiser.js", "module.exports = {};")
        _, rows, _ = self.score()
        for id_ in ["ci", "skills", "agents", "tracker", "hooks", "devcontainer", "arch"]:
            self.assertEqual(rows[id_]["evidence"], "MISSING", id_)

    def test_noop_validate_is_failed(self):
        self.file("package.json", '{"scripts":{"validate":"true"}}')
        result, rows, _ = self.score()
        self.assertEqual(result.returncode, 1)
        self.assertEqual(rows["gates"]["evidence"], "FAILED")

    def test_candidates_are_not_verified_and_never_execute(self):
        self.file("package.json", '{"scripts":{"validate":"touch executed"}}')
        self.file(".github/workflows/ci.yml", "name: CI\n")
        self.file(".claude/agents/api.md", "API domain agent\n")
        _, rows, _ = self.score()
        for id_ in ["gates", "ci", "agents"]:
            self.assertEqual(rows[id_]["evidence"], "CONFIGURED", id_)
        self.assertFalse((self.repo / "executed").exists())

    def test_invalid_package_json_fails_without_crash(self):
        for bad in ["{", "[]"]:
            self.file("package.json", bad)
            result, rows, _ = self.score()
            self.assertEqual(result.returncode, 1)
            self.assertEqual(rows["gates"]["evidence"], "FAILED")

    def test_invalid_hook_settings_fails_without_crash(self):
        self.file(".claude/settings.json", "[]")
        result, rows, _ = self.score()
        self.assertEqual(result.returncode, 1)
        self.assertEqual(rows["hooks"]["evidence"], "FAILED")

    def test_actual_hook_command_is_only_configured(self):
        self.file(".claude/settings.json", json.dumps({"hooks": {"PreToolUse": [{"hooks": [{"type": "command", "command": "touch executed"}]}]}}))
        _, rows, _ = self.score()
        self.assertEqual(rows["hooks"]["evidence"], "CONFIGURED")
        self.assertFalse((self.repo / "executed").exists())

    def test_strict_mode_does_not_certify_static_inventory(self):
        result = self.run_script("scorecard.sh", "--strict")
        self.assertEqual(result.returncode, 1)

    def test_suggested_steering_budget_is_advisory(self):
        self.file("AGENTS.md", "Useful local guidance\n" * 201)
        result, rows, _ = self.score()
        self.assertEqual(result.returncode, 0)
        self.assertEqual(rows["steering"]["evidence"], "CONFIGURED")
        self.assertIn("Advisory", rows["steering"]["detail"])

    def test_invalid_target_fails_instead_of_scoring_wrong_repo(self):
        result = subprocess.run(["bash", str(SOURCE / "scripts/scorecard.sh")],
                                env={**os.environ, "TARGET_REPO": str(self.root / "absent")}, text=True, capture_output=True)
        self.assertEqual(result.returncode, 2)

    def test_adapted_file_is_pass_immediately_after_adoption(self):
        skill = self.pin_skill()
        self.adopt(skill)
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("PASS", result.stdout)
        self.assertNotIn("EDITED", result.stdout)
        manifest = json.loads((self.repo / ".lean-agentic-baseline/manifest.json").read_text())
        entry = manifest["adopted"][0]
        self.assertNotEqual(entry["adopted_sha256"], entry["template_sha256"])

    def test_extensionless_templates_and_guidance_are_preserved(self):
        skill = self.pin_skill()
        version = json.loads((skill / "VERSION.json").read_text())
        template = "assets/templates/tier-3/CODEOWNERS"
        for path in [template, "SKILL.md", "README.md", "references/assessment.md"]:
            self.assertIn(path, version["files"])
        self.file(".github/CODEOWNERS", "* @example-org/maintainers\n")
        result = self.run_script("adopt.sh", template, ".github/CODEOWNERS", skill=skill)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_local_edit_reported_independently(self):
        skill = self.pin_skill()
        self.adopt(skill)
        self.file("AGENTS.md", "Later local change\n")
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertIn("EDITED", result.stdout)
        self.assertNotIn("DRIFT", result.stdout)

    def test_output_examples_and_evals_are_pinned_with_content(self):
        skill = self.pin_skill()
        version = json.loads((skill / "VERSION.json").read_text())
        key = version["guide_version"] + "-" + version["skill_revision"]
        contents = json.loads((skill / "references/version-history" / (key + ".contents.json")).read_text())
        for path in ["references/output-examples.md", "evals/evals.json"]:
            self.assertEqual(version["files"][path], "sha256:" + hashlib.sha256((skill / path).read_bytes()).hexdigest())
            self.assertEqual(contents[path], (skill / path).read_text())
        cases = json.loads((skill / "evals/evals.json").read_text())["evals"]
        self.assertEqual(len(cases), 4)
        self.assertEqual(len({case["id"] for case in cases}), 4)
        self.assertTrue(all(case["expectations"] for case in cases))

    def test_upstream_and_local_changes_are_both_visible(self):
        skill = self.pin_skill()
        self.adopt(skill)
        self.upstream_change(skill)
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertIn("DRIFT", result.stdout)
        self.file("AGENTS.md", "Later local change\n")
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertIn("DRIFT_EDITED", result.stdout)

    def test_missing_target_and_template_fail(self):
        skill = self.pin_skill()
        self.adopt(skill)
        (skill / TEMPLATE).unlink()
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertEqual(result.returncode, 1)
        self.assertIn("TEMPLATE_GONE", result.stdout)
        (self.repo / "AGENTS.md").unlink()
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertEqual(result.returncode, 1)
        self.assertIn("GONE", result.stdout)

    def test_legacy_adaptation_is_unknown_not_falsely_edited(self):
        skill = self.pin_skill()
        self.adopt(skill)
        manifest = self.repo / ".lean-agentic-baseline/manifest.json"
        data = json.loads(manifest.read_text())
        del data["adopted"][0]["adopted_sha256"]
        manifest.write_text(json.dumps(data))
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertIn("BASELINE_UNKNOWN", result.stdout)
        self.upstream_change(skill)
        result = self.run_script("check-pinned-versions.sh", str(self.repo), skill=skill)
        self.assertIn("DRIFT_BASELINE_UNKNOWN", result.stdout)

    def test_adoption_requires_existing_target_and_fresh_template(self):
        skill = self.pin_skill()
        result = self.run_script("adopt.sh", TEMPLATE, "missing.md", skill=skill)
        self.assertEqual(result.returncode, 1)
        self.assertFalse((self.repo / ".lean-agentic-baseline").exists())
        self.file("AGENTS.md", "Adapted\n")
        (skill / TEMPLATE).write_text("Changed without manifest update\n")
        result = self.run_script("adopt.sh", TEMPLATE, "AGENTS.md", skill=skill)
        self.assertEqual(result.returncode, 1)

    def test_paths_cannot_escape_repository(self):
        skill = self.pin_skill()
        outside = self.root / "outside.md"
        outside.write_text("outside\n")
        for path in [str(outside), "../outside.md"]:
            result = self.run_script("adopt.sh", TEMPLATE, path, skill=skill)
            self.assertEqual(result.returncode, 1)
        (self.repo / "linked.md").symlink_to(outside)
        result = self.run_script("adopt.sh", TEMPLATE, "linked.md", skill=skill)
        self.assertEqual(result.returncode, 1)

    def test_malformed_manifest_does_not_get_overwritten(self):
        skill = self.pin_skill()
        self.file("AGENTS.md", "Adapted\n")
        manifest = self.file(".lean-agentic-baseline/manifest.json", '{"adopted":[{}]}')
        original = manifest.read_bytes()
        result = self.run_script("adopt.sh", TEMPLATE, "AGENTS.md", skill=skill)
        self.assertEqual(result.returncode, 1)
        self.assertEqual(manifest.read_bytes(), original)

    def test_history_retains_content_and_cannot_be_overwritten(self):
        skill = self.pin_skill()
        contents = list((skill / "references/version-history").glob("*.contents.json"))
        self.assertEqual(len(contents), 1)
        self.assertEqual(json.loads(contents[0].read_text())[TEMPLATE], (skill / TEMPLATE).read_text())
        before = (skill / "VERSION.json").read_bytes()
        (skill / TEMPLATE).write_text("Unversioned template edit\n")
        result = self.run_script("generate-version-manifest.sh", skill=skill)
        self.assertEqual(result.returncode, 1)
        self.assertEqual((skill / "VERSION.json").read_bytes(), before)

    def test_permission_allow_rule_cannot_satisfy_ask_first(self):
        self.file("docs/PERMISSIONS.md", "## Ask first\n- `.github/**`\n")
        settings = self.file(".claude/settings.json", '{"permissions":{"allow":["Edit(.github/**)"]}}')
        result = self.run_script("checks/permissions-drift.sh")
        self.assertEqual(result.returncode, 1, result.stdout)
        settings.write_text('{"permissions":{"ask":["Edit(.github/**)"]}}')
        result = self.run_script("checks/permissions-drift.sh")
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_permission_substring_collision_does_not_pass(self):
        self.file("docs/PERMISSIONS.md", "## Ask first\n- `.github/**`\n")
        self.file(".claude/settings.json", '{"permissions":{"ask":["Edit(other.github/**)"]}}')
        result = self.run_script("checks/permissions-drift.sh")
        self.assertEqual(result.returncode, 1)

    def test_empty_ask_first_section_is_not_a_pass(self):
        self.file("docs/PERMISSIONS.md", "## Ask first\n")
        self.file(".claude/settings.json", "{}")
        result = self.run_script("checks/permissions-drift.sh")
        self.assertEqual(result.returncode, 2)

    def test_missing_agent_identity_has_skip_exit_code(self):
        result = subprocess.run(["bash", str(SOURCE / "scripts/checks/check-codeowners.sh")],
                                cwd=self.repo, env={k: v for k, v in os.environ.items() if k != "AGENT_LOGIN"}, text=True, capture_output=True)
        self.assertEqual(result.returncode, 2)

    def test_codeowners_comments_are_not_owner_assignments(self):
        gates = ["/package.json", "/.github/workflows/", "/.claude/", "/lefthook.yml", "/AGENTS.md"]
        self.file(".github/CODEOWNERS", "# Contact @my-bot for automation\n" + "\n".join(f"{gate} @example-org/maintainers # @my-bot documentation" for gate in gates))
        result = subprocess.run(["bash", str(SOURCE / "scripts/checks/check-codeowners.sh")],
                                cwd=self.repo, env={**os.environ, "AGENT_LOGIN": "my-bot"}, text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.file(".github/CODEOWNERS", "\n".join(f"{gate} @my-bot" for gate in gates))
        result = subprocess.run(["bash", str(SOURCE / "scripts/checks/check-codeowners.sh")],
                                cwd=self.repo, env={**os.environ, "AGENT_LOGIN": "my-bot"}, text=True, capture_output=True)
        self.assertEqual(result.returncode, 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
