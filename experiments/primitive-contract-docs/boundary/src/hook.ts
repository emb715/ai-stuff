/**
 * Pre-commit hook installer — installs a git hook that runs `boundary check`.
 *
 * Installs to `.git/hooks/pre-commit`. If a hook already exists, appends
 * a boundary check block (between markers) rather than clobbering.
 *
 * The hook runs `boundary check` and blocks the commit if any boundary fails.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const HOOK_MARKER_START = "# >>> boundary check >>>";
const HOOK_MARKER_END = "# <<< boundary check <<<";
const HOOK_BLOCK = `${HOOK_MARKER_START}
# Added by 'boundary install-hook'. Runs boundary check before commit.
boundary check --repo "$(git rev-parse --show-toplevel)" 2>&1 || exit 1
${HOOK_MARKER_END}`;

export interface HookInstallResult {
  gitDir: string;
  hookPath: string;
  action: "created" | "appended" | "already-present";
  message: string;
}

/**
 * Find the .git directory by walking up from the given path.
 */
function findGitDir(startPath: string): string | null {
  let current = resolve(startPath);
  while (true) {
    const gitDir = join(current, ".git");
    if (existsSync(gitDir)) return gitDir;
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

import { dirname } from "node:path";

/**
 * Install the pre-commit hook. Creates the hooks dir if needed.
 * If a hook exists, inserts the boundary block between markers (idempotent).
 */
export function installHook(repoRoot: string): HookInstallResult {
  const gitDir = findGitDir(repoRoot);
  if (!gitDir) {
    return {
      gitDir: "",
      hookPath: "",
      action: "already-present",
      message: "Not a git repository — no .git directory found.",
    };
  }

  const hooksDir = join(gitDir, "hooks");
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }

  const hookPath = join(hooksDir, "pre-commit");
  const existing = existsSync(hookPath) ? readFileSync(hookPath, "utf-8") : "";

  // Check if the block is already present
  if (existing.includes(HOOK_MARKER_START)) {
    return {
      gitDir,
      hookPath,
      action: "already-present",
      message: "Hook block already present — no changes needed.",
    };
  }

  if (existing.length === 0) {
    // Create new hook
    const content = `#!/bin/sh\n${HOOK_BLOCK}\n`;
    writeFileSync(hookPath, content, "utf-8");
    chmodSync(hookPath, 0o755);
    return {
      gitDir,
      hookPath,
      action: "created",
      message: `Created pre-commit hook at ${hookPath}.`,
    };
  }

  // Append to existing hook — add a blank line + the block
  const content = `${existing}\n${HOOK_BLOCK}\n`;
  writeFileSync(hookPath, content, "utf-8");
  chmodSync(hookPath, 0o755);
  return {
    gitDir,
    hookPath,
    action: "appended",
    message: `Appended boundary check block to existing pre-commit hook at ${hookPath}.`,
  };
}

/**
 * Remove the boundary check block from the pre-commit hook (if present).
 */
export function uninstallHook(repoRoot: string): { removed: boolean; message: string } {
  const gitDir = findGitDir(repoRoot);
  if (!gitDir) {
    return { removed: false, message: "Not a git repository." };
  }

  const hookPath = join(gitDir, "hooks", "pre-commit");
  if (!existsSync(hookPath)) {
    return { removed: false, message: "No pre-commit hook found." };
  }

  const content = readFileSync(hookPath, "utf-8");
  if (!content.includes(HOOK_MARKER_START)) {
    return { removed: false, message: "No boundary check block found in hook." };
  }

  // Remove the block (and any leading blank lines before it)
  const cleaned = content.replace(
    new RegExp(`\n*${escapeRegex(HOOK_MARKER_START)}[\\s\\S]*?${escapeRegex(HOOK_MARKER_END)}\n*`, "g"),
    "\n",
  ).trim() + "\n";

  if (cleaned.trim() === "#!/bin/sh" || cleaned.trim() === "") {
    // Hook is now empty or just a shebang — leave it, don't delete
    writeFileSync(hookPath, cleaned, "utf-8");
  } else {
    writeFileSync(hookPath, cleaned, "utf-8");
  }

  return { removed: true, message: `Removed boundary check block from ${hookPath}.` };
}

import { chmodSync } from "node:fs";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}