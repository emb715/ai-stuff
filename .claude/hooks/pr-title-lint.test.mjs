import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { decide } from './pr-title-lint.mjs';

const ROOT = new URL('../..', import.meta.url).pathname;
const pr = (title, tool_name = 'mcp__github__create_pull_request') =>
  ({ hook_event_name: 'PreToolUse', tool_name, tool_input: { owner: 'o', repo: 'r', title } });

test('long PR title is denied with the lint output', () => {
  const out = decide(pr('feat(strip-attribution): remove footer the GitHub MCP server adds to new PRs'), ROOT);
  assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
  assert.match(out.hookSpecificOutput.permissionDecisionReason, /76 chars, limit is 72/);
});

test('non-conventional title on update is denied', () => {
  const out = decide(pr('Add a thing', 'mcp__github__update_pull_request'), ROOT);
  assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
});

test('valid title, missing title and other tools pass through', () => {
  assert.equal(decide(pr('feat(x): add y'), ROOT), null);
  assert.equal(decide({ hook_event_name: 'PreToolUse', tool_name: 'mcp__github__update_pull_request', tool_input: { body: 'b' } }, ROOT), null);
  assert.equal(decide(pr('bad title', 'mcp__github__issue_write'), ROOT), null);
});

test('SessionStart sets core.hooksPath to .githooks', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lint-hook-'));
  spawnSync('git', ['init', '-q', dir]);
  decide({ hook_event_name: 'SessionStart' }, dir);
  const r = spawnSync('git', ['-C', dir, 'config', 'core.hooksPath'], { encoding: 'utf8' });
  assert.equal(r.stdout.trim(), '.githooks');
});

test('missing lint script fails open', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lint-hook-'));
  assert.equal(decide(pr('bad title'), dir), null);
});
