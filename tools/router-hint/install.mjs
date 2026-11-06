#!/usr/bin/env node
// Install or remove the router-hint UserPromptSubmit hook in a Claude Code settings file.
//
//   node install.mjs [--project <dir> | --global | --settings <file>]
//                    [--key-file <path>] [--uninstall] [--dry-run]
//
// Target, first that applies:
//   --settings <file>   that file
//   --global            ~/.claude/settings.json (every project on this machine)
//   --project <dir>     <dir>/.claude/settings.local.json (default <dir>: the current directory)
//
// --key-file  path to a file holding the TypeSafe key (default ~/.secrets/jev.key). The hook
//             reads it at call time; the key itself is never written to the settings file.
//
// The hook entry is recognised by the absolute path of hint.mjs, so running this again
// replaces it instead of adding a second one. Other hooks and settings are left untouched.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const HINT = join(HERE, "hint.mjs");
const MARK = "router-hint/hint.mjs";
const TIMEOUT_S = 20;

function parse(argv) {
  const o = { project: process.cwd(), keyFile: "~/.secrets/jev.key" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--settings") o.settings = argv[++i];
    else if (a === "--project") o.project = argv[++i];
    else if (a === "--global") o.global = true;
    else if (a === "--key-file") o.keyFile = argv[++i];
    else if (a === "--uninstall") o.uninstall = true;
    else if (a === "--dry-run") o.dryRun = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return o;
}

function target(o) {
  if (o.settings) return resolve(o.settings);
  if (o.global) return join(homedir(), ".claude", "settings.json");
  return join(resolve(o.project), ".claude", "settings.local.json");
}

const quote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

function command(o) {
  return `TYPESAFE_API_KEY_FILE=${quote(o.keyFile)} node --no-warnings ${quote(HINT)} --hook`;
}

// Drop every hook entry that runs router-hint; drop matcher groups left empty.
function strip(groups) {
  return (groups || [])
    .map((g) => ({ ...g, hooks: (g.hooks || []).filter((h) => !String(h.command || "").includes(MARK)) }))
    .filter((g) => g.hooks.length > 0);
}

function main() {
  const o = parse(process.argv.slice(2));
  const file = target(o);
  const settings = existsSync(file) ? JSON.parse(readFileSync(file, "utf8") || "{}") : {};
  settings.hooks = settings.hooks || {};
  const kept = strip(settings.hooks.UserPromptSubmit);
  if (!o.uninstall) kept.push({ hooks: [{ type: "command", command: command(o), timeout: TIMEOUT_S }] });
  if (kept.length) settings.hooks.UserPromptSubmit = kept;
  else delete settings.hooks.UserPromptSubmit;
  if (!Object.keys(settings.hooks).length) delete settings.hooks;

  const text = JSON.stringify(settings, null, 2) + "\n";
  if (o.dryRun) {
    process.stdout.write(`# ${file}\n${text}`);
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  console.log(`${o.uninstall ? "removed router-hint from" : "installed router-hint in"} ${file}`);
  if (!o.uninstall) {
    const kf = o.keyFile.startsWith("~/") ? join(homedir(), o.keyFile.slice(2)) : o.keyFile;
    if (!existsSync(kf)) console.log(`note: ${o.keyFile} does not exist yet; the hook stays silent until it does`);
  }
}

try {
  main();
} catch (e) {
  console.error(`install: ${e.message}`);
  process.exitCode = 1;
}
