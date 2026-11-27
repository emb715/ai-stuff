#!/usr/bin/env node
// Claude Code hook for this repo. Runs scripts/commit_lint.py before CI does.
// - SessionStart: sets core.hooksPath to .githooks, so the commit-msg hook checks every commit.
// - PreToolUse on GitHub MCP create/update_pull_request: denies a title commit-lint would fail,
//   with the reason, so Claude fixes the title and retries.
// Fails open: any error leaves the call untouched.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const PR_TOOL = /^mcp__.*github.*(?:create|update)_pull_request$/i;

export function lintTitle(title, root = ROOT) {
  const r = spawnSync('python3', [join(root, 'scripts/commit_lint.py'), '--title', title], { encoding: 'utf8' });
  // Exit 1 is a lint failure; anything else (missing python or script) fails open.
  return r.status === 1 ? (r.stdout + r.stderr).trim() : null;
}

export function decide(input, root = ROOT) {
  if (input.hook_event_name === 'SessionStart') {
    spawnSync('git', ['-C', root, 'config', 'core.hooksPath', '.githooks']);
    return null;
  }
  const title = input.tool_input?.title;
  if (!PR_TOOL.test(input.tool_name ?? '') || typeof title !== 'string') return null;
  const problem = lintTitle(title, root);
  if (!problem) return null;
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `PR title fails this repo's commit-lint (CI would fail). Fix the title and call the tool again.\n${problem}`,
    },
  };
}

async function main() {
  try {
    let raw = '';
    for await (const chunk of process.stdin) raw += chunk;
    const out = decide(JSON.parse(raw));
    if (out) process.stdout.write(JSON.stringify(out));
  } catch {
    // fail open
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
