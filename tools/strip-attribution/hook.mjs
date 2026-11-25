#!/usr/bin/env node
// Claude Code PreToolUse hook. Strips Claude attribution from PR, issue and comment bodies:
// the `<!-- claude-projects-attribution: ... -->` line, the "_Requested by ... [project thread](...)_"
// line, "Generated with/by Claude Code" lines and claude.ai/code/session_ links.
// - Bash: `gh pr|issue create|edit|comment` and `gh pr review`. Inline --body/-b text is rewritten
//   in the command; --body-file/-F gets a cleaned temp copy.
// - GitHub MCP tools (name contains "github"): every string `body` field is cleaned.
// Returns hookSpecificOutput.updatedInput without permissionDecision, so normal permissions apply.
// Fails open: any error leaves the call untouched.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const GH = /\bgh\s+(?:pr\s+(?:create|edit|comment|review)|issue\s+(?:create|edit|comment))\b/;
const GIT_COMMIT = /\bgit\s+(?:-[Cc]\s+\S+\s+)*commit\b/;

const PATTERNS = [
  /<!--\s*claude-projects-attribution:[^\n]*?-->/g,
  /_?Requested by [^\n]*?\[project thread\]\([^)\n]*\)_?/g,
  /_?(?:🤖\s*)?Generated (?:with|by) \[?Claude Code\]?(?:\([^)\n]*\))?_?/gi,
  /Co-Authored-By:[ \t]*Claude[^\n<]*<noreply@anthropic\.com>/gi,
  /Claude-Session:[ \t]*\S*/g,
  /<?https:\/\/claude\.ai\/code\/session_[A-Za-z0-9_-]+>?/g,
];

export function clean(text) {
  let out = text;
  for (const p of PATTERNS) out = out.replace(p, '');
  if (out === text) return text;
  // Lines emptied by removal collapse; a dangling `---` footer separator goes too.
  out = out
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+---\n(?=\s*(?:EOF\b|["')]|$))/g, '\n')
    .replace(/(--body(?:=|\s+)|-b\s+)(["'])\n+/g, '$1$2')
    .replace(/(<<-?\s*['"]?\w+['"]?\n)\n+/g, '$1')
    .replace(/\n+(?=\s*(?:EOF\b|["']\)?\s*$))/gm, '\n');
  return out;
}

const BODY_FILE = /(--body-file(?:=|\s+)|--file(?:=|\s+)|-F\s+)(?:"([^"]+)"|'([^']+)'|([^\s;&|]+))/g;

export function rewrite(command, cwd = process.cwd()) {
  if (!GH.test(command) && !GIT_COMMIT.test(command)) return command;
  let out = clean(command);
  out = out.replace(BODY_FILE, (m, flag, dq, sq, bare) => {
    const path = dq ?? sq ?? bare;
    if (path === '-') return m;
    try {
      const body = readFileSync(resolve(cwd, path), 'utf8');
      if (clean(body) === body) return m;
      const cleaned = `${clean(body).trim()}\n`;
      const tmp = join(mkdtempSync(join(tmpdir(), 'gh-body-')), 'body.md');
      writeFileSync(tmp, cleaned);
      return `${flag}'${tmp}'`;
    } catch {
      return m;
    }
  });
  return out;
}

const MCP_GITHUB = /^mcp__.*github/i;

// Returns the rewritten tool_input, or null when nothing changes.
export function updatedInput({ tool_name: name, tool_input: ti, cwd } = {}) {
  if (!ti || typeof ti !== 'object') return null;
  if (name === 'Bash' && typeof ti.command === 'string') {
    const command = rewrite(ti.command, cwd);
    return command === ti.command ? null : { ...ti, command };
  }
  if (MCP_GITHUB.test(name ?? '')) {
    let changed = false;
    const walk = (v) => {
      if (Array.isArray(v)) return v.map(walk);
      if (!v || typeof v !== 'object') return v;
      const o = {};
      for (const [k, x] of Object.entries(v)) {
        if ((k === 'body' || k === 'message') && typeof x === 'string') {
          const c = clean(x);
          if (c !== x) { changed = true; o[k] = c.trim(); continue; }
        }
        o[k] = walk(x);
      }
      return o;
    };
    const out = walk(ti);
    return changed ? out : null;
  }
  return null;
}

async function main() {
  try {
    let raw = '';
    for await (const chunk of process.stdin) raw += chunk;
    const input = JSON.parse(raw);
    const next = updatedInput(input);
    if (!next) return;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PreToolUse', updatedInput: next },
    }));
  } catch {
    // fail open
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
