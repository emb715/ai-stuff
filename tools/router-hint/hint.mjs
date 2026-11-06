#!/usr/bin/env node
// router-hint: suggest at most one ai-stuff route for a user turn, using two
// TypeSafe (Jev) requests, after the "skill suggestion" pattern in the TypeSafe docs.
//
//   node hint.mjs "<user turn>"          print the decision as JSON
//   node hint.mjs --hook                 Claude Code UserPromptSubmit hook: reads the
//                                        hook JSON on stdin, prints a hint line or nothing
//   node hint.mjs --eval <cases.json>    run every case, print a table, write results JSON
//
// Install the hook with install.mjs. No dependencies (Node 18+).
//
// Environment:
//   TYPESAFE_API_KEY        the API key, or
//   TYPESAFE_API_KEY_FILE   a file holding it (e.g. ~/.secrets/jev.key); read at call time
//   TYPESAFE_MODEL          default jev-1.14.0
//   AI_STUFF_ROOT           vault checkout to read the router from; default: two levels up
//   ROUTER_HINT_CACHE       cache file. Default: cache.json beside this file for the CLI and
//                           --eval modes, none in --hook mode (user turns are not stored)
//   ROUTER_HINT_LOG         --hook mode: write the full decision JSON to this file

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.AI_STUFF_ROOT || join(HERE, "..", "..");
const ROUTER = join(REPO, "skills", "ai-stuff-artifact-router", "SKILL.md");
const HOOK_MODE = process.argv[2] === "--hook";
const CACHE_FILE = process.env.ROUTER_HINT_CACHE || (HOOK_MODE ? "" : join(HERE, "cache.json"));
const MODEL = process.env.TYPESAFE_MODEL || "jev-1.14.0";
const TIMEOUT_MS = 12000; // under the hook's 20 s timeout, so a slow API never stalls a turn

// Thresholds. Start from the docs' 0.7 / 0.3 defaults; do not fit them to eval cases.
const GATE_NO = 0.3;      // "is this work to do?" below this: no hint
const SKIP_YES = 0.7;     // "named an artifact" / "vault operation" above this: no hint
const FITS_MIN = 0.5;     // second pass: the winner must fit at least this well
const SHORTLIST = 3;
const FULLTEXT_CHARS = 1400;

// ---------- roster: the router's own manifests, read from disk ----------

function roster() {
  const md = readFileSync(ROUTER, "utf8");
  const manifest = md.slice(md.indexOf("## Manifest"), md.indexOf("## Chains"));
  const rows = [];
  for (const line of manifest.split("\n")) {
    const m = line.match(/^\| `((?:playbooks|prompts)\/[a-z0-9-]+\/)` \| `(\w+)` \| (.+?) \| (.+?) \| (\w+) \|$/);
    if (!m) continue;
    const [, path, intent, entry, exit] = m;
    const name = path.split("/")[1];
    rows.push({ name, path, intent, entry: clean(entry), exit: clean(exit), full: readmeText(path) });
  }
  if (rows.length < 15) throw new Error(`parsed only ${rows.length} manifest rows from ${ROUTER}`);
  return rows;
}

function clean(s) {
  return s.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

// Purpose, When to use and Not for from the artifact's README, the router's own authority.
function readmeText(path) {
  const file = join(REPO, path, "README.md");
  if (!existsSync(file)) return "";
  const body = readFileSync(file, "utf8").replace(/^---[\s\S]*?\n---\n/, "");
  const keep = [];
  for (const sec of body.split(/\n(?=# )/)) {
    if (/^# (Purpose|When to use)/.test(sec)) keep.push(sec.trim());
  }
  return clean(keep.join("\n\n")).slice(0, FULLTEXT_CHARS);
}

// ---------- TypeSafe call, cached ----------

const cache = CACHE_FILE && existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
let cacheDirty = false;

function apiKey() {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY.trim();
  const file = process.env.TYPESAFE_API_KEY_FILE;
  if (!file) return "";
  const path = file.startsWith("~/") ? join(homedir(), file.slice(2)) : file;
  return existsSync(path) ? readFileSync(path, "utf8").trim() : "";
}

async function ask(state, questions) {
  const payload = { model: MODEL, state, questions };
  const key = createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
  if (cache[key]) return cache[key].response;
  const token = apiKey();
  if (!token) throw new Error("no TYPESAFE_API_KEY or readable TYPESAFE_API_KEY_FILE, and the request is not cached");
  const res = await fetch("https://api.typesafe.ai/v1/systemone", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  // A failed call is an error, never a "no".
  if (!res.ok) throw new Error(`TypeSafe ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const response = await res.json();
  cache[key] = { payload, response };
  cacheDirty = true;
  return response;
}

function saveCache() {
  if (cacheDirty && CACHE_FILE) writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1) + "\n");
}

// ---------- the two requests ----------
// All question wording lives here, in one place.

const Q = {
  which:
    "Which of these procedures fits what the user in `user_turn` already has and wants to end up with?",
  work:
    "Does `user_turn` ask for help carrying out a piece of software or product work, such as planning, building, reviewing, releasing, responding to an outage, or learning from finished work?",
  workTrue:
    "The user wants a multi-step piece of work done, or wants to know how to approach one.",
  workFalse:
    "The user asks a factual question, asks about this repository's own files, or asks for a small single-step task such as one function or one test file.",
  named:
    "Does `user_turn` name the specific playbook, prompt or procedure the user wants to use?",
  vault:
    "Is `user_turn` about maintaining the artifacts of this knowledge repository itself, such as promoting, deprecating, linting, auditing, archiving or saving a skill, prompt or playbook?",
  rerank:
    "Which procedure in `candidates` should the user in `user_turn` start with, given what they already have?",
  fits: (name) =>
    `Does the procedure in \`candidates.${name}\` start from what the user in \`user_turn\` already has and produce what they want?`,
};

async function firstPass(turn, rows) {
  const criteria = Object.fromEntries(rows.map((r) => [r.name, `Starts from: ${r.entry}. Produces: ${r.exit}.`]));
  return ask(
    { user_turn: turn },
    {
      which: { type: "choice", instructions: Q.which, criteria },
      work: { type: "noul", instructions: Q.work, criteria: { true: Q.workTrue, false: Q.workFalse } },
      named: { type: "noul", instructions: Q.named },
      vault: { type: "noul", instructions: Q.vault },
    },
  );
}

async function secondPass(turn, cands) {
  const candidates = Object.fromEntries(cands.map((r) => [r.name, `Starts from: ${r.entry}. Produces: ${r.exit}.\n\n${r.full}`]));
  const questions = {
    which: {
      type: "choice",
      instructions: Q.rerank,
      criteria: Object.fromEntries(cands.map((r) => [r.name, `The procedure described in \`candidates.${r.name}\``])),
    },
  };
  for (const r of cands) questions[`fits__${r.name}`] = { type: "noul", instructions: Q.fits(r.name) };
  return ask({ user_turn: turn, candidates }, questions);
}

// Decisions in code. Every combination ends in "suggest" or "none", with a reason.
export async function suggest(turn) {
  const rows = roster();
  const a = (await firstPass(turn, rows)).answers;
  const p1 = a.which.probabilities;
  const ranked = Object.entries(p1).sort((x, y) => y[1] - x[1]);
  const out = {
    first: { top: ranked.slice(0, SHORTLIST), work: a.work.noul, named: a.named.noul, vault: a.vault.noul },
  };
  if (a.named.noul > SKIP_YES) return { ...out, decision: "none", reason: "artifact named" };
  if (a.vault.noul > SKIP_YES) return { ...out, decision: "none", reason: "vault operation" };
  if (a.work.noul < GATE_NO) return { ...out, decision: "none", reason: "not work to route" };

  const cands = ranked.slice(0, SHORTLIST).map(([n]) => rows.find((r) => r.name === n));
  const b = (await secondPass(turn, cands)).answers;
  const fits = Object.fromEntries(cands.map((r) => [r.name, b[`fits__${r.name}`].noul]));
  const winner = b.which.choice;
  out.second = { probabilities: b.which.probabilities, fits };
  if (fits[winner] < FITS_MIN) return { ...out, decision: "none", reason: `best candidate fits ${fits[winner].toFixed(2)}` };
  const row = rows.find((r) => r.name === winner);
  return { ...out, decision: "suggest", route: row.path, unsettledGate: a.work.noul < SKIP_YES };
}

export function hintLine(result) {
  if (result.decision !== "suggest") return "";
  return (
    "<artifact_relevance>\n" +
    `This looks like work the ai-stuff-artifact-router skill routes; its likely route is ${result.route}. ` +
    "Load that skill to confirm before answering. Ignore this if it does not fit what the user actually asked for.\n" +
    "</artifact_relevance>"
  );
}

// ---------- CLI ----------

async function main() {
  const args = process.argv.slice(2);
  try {
    if (HOOK_MODE) {
      const input = JSON.parse(readFileSync(0, "utf8") || "{}");
      const r = await suggest(input.prompt || "");
      process.stdout.write(hintLine(r));
      if (process.env.ROUTER_HINT_LOG) writeFileSync(process.env.ROUTER_HINT_LOG, JSON.stringify(r, null, 1));
    } else if (args[0] === "--eval") {
      const cases = JSON.parse(readFileSync(args[1], "utf8"));
      const results = [];
      for (const c of cases) {
        const r = await suggest(c.prompt);
        results.push({ id: c.id, truth: c.truth, ...r });
        const got = r.decision === "suggest" ? r.route : `none (${r.reason})`;
        console.log(`${c.id.padEnd(5)} ${got.padEnd(48)} truth: ${c.truth}`);
      }
      writeFileSync(args[2] || join(HERE, "eval-results.json"), JSON.stringify(results, null, 1) + "\n");
    } else {
      console.log(JSON.stringify(await suggest(args.join(" ")), null, 1));
    }
  } catch (e) {
    // In hook mode a failure must not block the user's turn: say nothing, log to stderr.
    console.error(`router-hint: ${e.message}`);
    if (!HOOK_MODE) process.exitCode = 1;
  } finally {
    saveCache();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
