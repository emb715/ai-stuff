#!/usr/bin/env node
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
;// CONCATENATED MODULE: external "node:child_process"
const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
;// CONCATENATED MODULE: ./src/core/criteria.ts
/**
 * Criterion identification.
 *
 * A test earns the right to be evidence for a criterion by naming it. The
 * convention is a bare `AC<n>` token in the test title or an `@AC<n>` tag:
 *
 *   test('AC4: the Save button is disabled while the save is in flight', ...)
 *   test('completes checkout from a populated cart', { tag: '@AC12' }, ...)
 *
 * Anything else is an unmapped test — useful, but not an anchor for any stated
 * criterion.
 */
const AC_PATTERN = /\bAC[-_ ]?(\d+)\b/gi;
/** Normalise any recognised spelling to the canonical `AC12` form. */
function normaliseId(raw) {
    const digits = raw.replace(/\D/g, "");
    return `AC${Number.parseInt(digits, 10)}`;
}
/**
 * Extract every criterion id referenced by a test title and its tags.
 * A single test may cover more than one criterion.
 */
function extractIds(title, tags = []) {
    const found = new Set();
    for (const source of [title, ...tags]) {
        for (const match of source.matchAll(AC_PATTERN)) {
            found.add(normaliseId(match[1]));
        }
    }
    return [...found].sort(compareIds);
}
/**
 * Extract the declared criteria list from a criteria document.
 *
 * Deliberately permissive about surrounding formatting — markdown lists,
 * tables, and headings all work — because the criteria file is written by a
 * human or an upstream playbook, not by this tool. Order of first appearance
 * is not preserved; ids are returned sorted so the ledger is stable.
 */
function parseCriteria(text) {
    const found = new Set();
    for (const match of text.matchAll(AC_PATTERN)) {
        found.add(normaliseId(match[1]));
    }
    return [...found].sort(compareIds);
}
/** Numeric ordering, so AC10 sorts after AC9 rather than after AC1. */
function compareIds(a, b) {
    const na = Number.parseInt(a.replace(/\D/g, ""), 10);
    const nb = Number.parseInt(b.replace(/\D/g, ""), 10);
    return na - nb;
}

;// CONCATENATED MODULE: ./src/core/ledger.ts
/**
 * Build the criteria ledger required by playbooks/acceptance-verification.
 *
 * The contract that matters: a criterion is `pass` only when a named test
 * mapped to it passed. Suite-wide green is never evidence for a criterion no
 * test claimed. That single rule is what this tool exists to enforce, and it is
 * why `unverified` is a first-class state alongside `pass` and `fail`.
 */

const START_MARKER = "<!-- e2e-web:start -->";
const END_MARKER = "<!-- e2e-web:end -->";
function toAnchor(o) {
    return {
        title: o.title,
        file: o.file,
        line: o.line,
        status: o.status,
        project: o.project,
    };
}
/**
 * Resolve one criterion's state from the tests that claimed it.
 *
 * Precedence is deliberate: any failure dominates, then flakiness, then
 * skipping. A criterion whose only coverage was skipped is `unverified`, not
 * `pass` — a skipped test is the absence of evidence.
 */
function resolveState(anchors) {
    if (anchors.length === 0) {
        return { state: "unverified", note: "no test claims this criterion" };
    }
    if (anchors.some((a) => a.status === "fail")) {
        return { state: "fail", note: "a covering test failed" };
    }
    if (anchors.some((a) => a.status === "flaky")) {
        return {
            state: "flaky",
            note: "a covering test passed only on retry — not evidence until stable",
        };
    }
    if (anchors.every((a) => a.status === "skipped")) {
        return { state: "unverified", note: "every covering test was skipped" };
    }
    return { state: "pass" };
}
/**
 * Decide the run-level verdict.
 *
 * This tool cannot know criterion severity, so it never claims VERIFIED when
 * anything is unresolved — it downgrades to VERIFIED_WITH_CONDITIONS and leaves
 * the severity call to the human running the playbook. Under-claiming is the
 * only safe direction for a release gate.
 */
function resolveVerdict(rows) {
    if (rows.length === 0)
        return "NOT_VERIFIED";
    if (rows.some((r) => r.state === "fail"))
        return "NOT_VERIFIED";
    if (rows.some((r) => r.state === "unverified" || r.state === "flaky")) {
        return "VERIFIED_WITH_CONDITIONS";
    }
    return "VERIFIED";
}
/**
 * @param declared Criteria ids from the criteria document. When empty, the
 * ledger covers only criteria some test claimed — which cannot prove coverage,
 * so the rendered block says so explicitly.
 */
function buildLedger(report, target, declared = []) {
    const byId = new Map();
    const unmapped = [];
    for (const outcome of report.outcomes) {
        const ids = extractIds(outcome.title, outcome.tags);
        if (ids.length === 0) {
            unmapped.push(toAnchor(outcome));
            continue;
        }
        for (const id of ids) {
            const list = byId.get(id) ?? [];
            list.push(toAnchor(outcome));
            byId.set(id, list);
        }
    }
    // Declared criteria define the ledger. Criteria discovered only in test
    // titles are included too — a test claiming AC99 when the criteria document
    // has no AC99 is a mismatch worth surfacing, not hiding.
    const ids = [...new Set([...declared, ...byId.keys()])].sort(compareIds);
    const rows = ids.map((id) => {
        const anchors = byId.get(id) ?? [];
        const { state, note } = resolveState(anchors);
        const undeclared = declared.length > 0 && !declared.includes(id);
        return {
            id,
            state,
            anchors,
            note: undeclared
                ? `${note ? `${note}; ` : ""}not present in the criteria document`
                : note,
        };
    });
    return { rows, unmapped, verdict: resolveVerdict(rows), target, stats: report.stats };
}
const STATE_LABEL = {
    pass: "pass",
    fail: "**fail**",
    flaky: "flaky",
    unverified: "**unverified**",
};
function renderAnchor(a) {
    const loc = a.line > 0 ? `${a.file}:${a.line}` : a.file;
    const project = a.project ? ` (${a.project})` : "";
    return `\`${loc}\` — ${a.title}${project}`;
}
function escapeCell(text) {
    return text.replace(/\|/g, "\\|");
}
/** Render the ledger as a markdown block, delimited by upsert markers. */
function renderBlock(ledger) {
    const { target, rows, unmapped, verdict, stats } = ledger;
    const lines = [START_MARKER, "", "## Acceptance verification", ""];
    lines.push(`**Verdict: ${verdict}**`, "");
    const targetBits = [`build \`${target.build}\``];
    if (target.url)
        targetBits.push(`against ${target.url}`);
    if (target.environment)
        targetBits.push(`env \`${target.environment}\``);
    lines.push(`${targetBits.join(" · ")} · ${stats.expected} passed, ${stats.unexpected} failed, ${stats.flaky} flaky, ${stats.skipped} skipped`, "");
    if (rows.length === 0) {
        lines.push("> No criteria found. No test named an `AC<n>` criterion and no criteria document was supplied — this run is not evidence for anything.", "");
    }
    else {
        lines.push("| Criterion | State | Evidence anchor |", "|---|---|---|");
        for (const row of rows) {
            const evidence = row.anchors.length > 0
                ? row.anchors.map((a) => escapeCell(renderAnchor(a))).join("<br>")
                : `_${escapeCell(row.note ?? "no anchor")}_`;
            const note = row.anchors.length > 0 && row.note ? `<br>_${escapeCell(row.note)}_` : "";
            lines.push(`| ${row.id} | ${STATE_LABEL[row.state]} | ${evidence}${note} |`);
        }
        lines.push("");
    }
    const unverified = rows.filter((r) => r.state === "unverified");
    if (unverified.length > 0) {
        lines.push(`**${unverified.length} ${unverified.length === 1 ? "criterion" : "criteria"} unverified.** Absence of a check is not a pass — each needs a manual probe (acceptance-verification Step 5) or a test.`, "");
    }
    if (unmapped.length > 0) {
        lines.push(`<details><summary>${unmapped.length} test${unmapped.length === 1 ? "" : "s"} claimed no criterion</summary>`, "");
        for (const a of unmapped)
            lines.push(`- ${renderAnchor(a)}`);
        lines.push("", "</details>", "");
    }
    lines.push("<sub>Generated by `tools/e2e-web`. A criterion is `pass` only when a test naming it passed — suite-wide green is not evidence.</sub>", "", END_MARKER);
    return lines.join("\n");
}

;// CONCATENATED MODULE: ./src/core/report.ts
/**
 * Parse a Playwright JSON report into a flat list of test outcomes.
 *
 * Playwright's JSON reporter nests suites arbitrarily deep; every level may
 * carry `specs`. This module flattens that tree so the ledger only ever deals
 * with a list.
 */
/**
 * Map Playwright's per-test status onto our four states.
 *
 * Playwright reports `expected` / `unexpected` / `flaky` / `skipped` at the
 * test level, which already accounts for `expect.fail` annotations and retries.
 * We deliberately keep `flaky` distinct from `pass`: a flaky test is not
 * evidence, it is a question.
 */
function mapStatus(raw) {
    switch (raw) {
        case "expected":
            return "pass";
        case "flaky":
            return "flaky";
        case "skipped":
            return "skipped";
        case "unexpected":
            return "fail";
        default:
            // An unrecognised status must never silently count as a pass.
            return "fail";
    }
}
function walkSuite(suite, inheritedFile, out) {
    const file = suite.file ?? inheritedFile;
    for (const spec of suite.specs ?? []) {
        const specFile = spec.file ?? file;
        for (const test of spec.tests ?? []) {
            const durationMs = (test.results ?? []).reduce((sum, r) => sum + (typeof r.duration === "number" ? r.duration : 0), 0);
            out.push({
                title: spec.title ?? "(untitled)",
                file: specFile,
                line: typeof spec.line === "number" ? spec.line : 0,
                status: mapStatus(test.status),
                durationMs,
                project: test.projectName ?? "",
                tags: spec.tags ?? [],
            });
        }
    }
    for (const child of suite.suites ?? []) {
        walkSuite(child, file, out);
    }
}
/**
 * Parse the JSON produced by `playwright test --reporter=json`.
 *
 * Throws on anything that is not a JSON object with a `suites` array — a
 * silently empty ledger is the failure mode this tool exists to prevent, so an
 * unreadable report must be loud.
 */
function parseReport(json) {
    let raw;
    try {
        raw = JSON.parse(json);
    }
    catch (err) {
        throw new Error(`report is not valid JSON: ${err.message}`);
    }
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.suites)) {
        throw new Error("report is not a Playwright JSON report (missing top-level `suites` array)");
    }
    const outcomes = [];
    for (const suite of raw.suites) {
        walkSuite(suite, suite.file ?? "", outcomes);
    }
    const s = raw.stats ?? {};
    return {
        outcomes,
        stats: {
            expected: s.expected ?? 0,
            unexpected: s.unexpected ?? 0,
            flaky: s.flaky ?? 0,
            skipped: s.skipped ?? 0,
            durationMs: s.duration ?? 0,
            startedAt: s.startTime ?? null,
        },
    };
}

;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
;// CONCATENATED MODULE: external "node:path"
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
;// CONCATENATED MODULE: ./src/core/run.ts




/**
 * Run the Playwright suite and return the raw JSON report.
 *
 * A non-zero exit is expected whenever tests fail, so it is not treated as an
 * error — the report is the product, and a failing suite is a legitimate,
 * informative result. Only a missing or unreadable report is fatal.
 */
function runSuite(opts = {}) {
    const { cwd, url, args = [] } = opts;
    const outDir = (0,external_node_fs_namespaceObject.mkdtempSync)((0,external_node_path_namespaceObject.join)((0,external_node_os_namespaceObject.tmpdir)(), "e2e-web-"));
    const outFile = (0,external_node_path_namespaceObject.join)(outDir, "report.json");
    const env = {
        ...process.env,
        PLAYWRIGHT_JSON_OUTPUT_NAME: outFile,
    };
    if (url)
        env.PLAYWRIGHT_TEST_BASE_URL = url;
    const [bin, ...baseArgs] = (opts.command ?? "npx playwright test").split(" ");
    try {
        (0,external_node_child_process_namespaceObject.execFileSync)(bin, [...baseArgs, "--reporter=json", ...args], {
            cwd,
            env,
            encoding: "utf8",
            stdio: ["ignore", "inherit", "inherit"],
            maxBuffer: 64 * 1024 * 1024,
        });
    }
    catch {
        // Test failures exit non-zero. The report still gets written; read it below.
    }
    if (!(0,external_node_fs_namespaceObject.existsSync)(outFile)) {
        throw new Error(`Playwright wrote no JSON report to ${outFile}. The suite likely failed to start — ` +
            "check that the project builds and that a playwright config is present.");
    }
    return (0,external_node_fs_namespaceObject.readFileSync)(outFile, "utf8");
}

;// CONCATENATED MODULE: ./src/core/upsert.ts


/**
 * Reject repo strings containing shell metacharacters. Defense-in-depth:
 * execFileSync bypasses the shell, but a malformed --repo value is never
 * a valid org/name and should fail fast.
 */
function validateRepo(repo) {
    if (/[;|&$`\n\r\\]/.test(repo)) {
        throw new Error(`invalid repo: ${JSON.stringify(repo)}`);
    }
    return repo;
}
/**
 * Splice a marked block into existing text: replace between markers if present,
 * append otherwise. Never touches anything outside the markers.
 *
 * Exported for tests — this is the logic worth pinning, not the gh plumbing.
 */
function spliceBlock(existing, block) {
    const trimmed = block.trim();
    if (!trimmed.startsWith(START_MARKER) || !trimmed.endsWith(END_MARKER)) {
        throw new Error(`block must start with "${START_MARKER}" and end with "${END_MARKER}"`);
    }
    const start = existing.indexOf(START_MARKER);
    const end = existing.indexOf(END_MARKER);
    const hasExisting = start !== -1 && end !== -1 && end > start;
    return hasExisting
        ? existing.slice(0, start) + trimmed + existing.slice(end + END_MARKER.length)
        : `${existing.trimEnd()}\n\n${trimmed}\n`;
}
function gh(args, opts) {
    return (0,external_node_child_process_namespaceObject.execFileSync)("gh", args, {
        encoding: "utf8",
        cwd: opts.cwd,
        input: opts.input,
    });
}
/** Fetch the current PR body. */
function getPRBody(prNumber, opts) {
    const repo = opts.repo ? validateRepo(opts.repo) : undefined;
    const args = ["pr", "view", String(prNumber)];
    if (repo)
        args.push("--repo", repo);
    args.push("--json", "body", "--jq", ".body");
    return gh(args, { cwd: opts.cwd });
}
/**
 * Upsert the verification block onto a PR.
 *
 * Default destination is a sticky comment rather than the PR body: a
 * verification result changes on every run, and rewriting the author's
 * description on each CI run is more intrusive than this tool needs to be.
 * Pass `destination: "body"` to match the change-impact tool's behaviour.
 */
function upsertBlock(block, opts) {
    const { prNumber, cwd, destination = "comment" } = opts;
    const repo = opts.repo ? validateRepo(opts.repo) : undefined;
    if (destination === "body") {
        const body = getPRBody(prNumber, { repo, cwd });
        const next = spliceBlock(body, block);
        const args = ["pr", "edit", String(prNumber)];
        if (repo)
            args.push("--repo", repo);
        args.push("--body-file", "-");
        gh(args, { cwd, input: next });
        console.log(`upserted verification block into PR #${prNumber} body`);
        return;
    }
    // Sticky comment: find an existing comment carrying our marker, edit it if
    // found, otherwise create one.
    const listArgs = ["pr", "view", String(prNumber)];
    if (repo)
        listArgs.push("--repo", repo);
    listArgs.push("--json", "comments");
    const raw = gh(listArgs, { cwd });
    let existingId;
    let existingBody = "";
    try {
        const parsed = JSON.parse(raw);
        const hit = (parsed.comments ?? []).find((c) => (c.body ?? "").includes(START_MARKER));
        if (hit) {
            existingId = hit.url ?? hit.id;
            existingBody = hit.body ?? "";
        }
    }
    catch {
        // A malformed comments payload is not worth failing the run over —
        // fall through and post a fresh comment.
    }
    if (existingId) {
        const args = ["pr", "comment", String(prNumber)];
        if (repo)
            args.push("--repo", repo);
        args.push("--edit-last", "--body-file", "-");
        gh(args, { cwd, input: spliceBlock(existingBody, block) });
        console.log(`updated verification comment on PR #${prNumber}`);
    }
    else {
        const args = ["pr", "comment", String(prNumber)];
        if (repo)
            args.push("--repo", repo);
        args.push("--body-file", "-");
        gh(args, { cwd, input: block.trim() });
        console.log(`added verification comment to PR #${prNumber}`);
    }
}

;// CONCATENATED MODULE: ./src/cli/index.ts







const USAGE = `
e2e-web — run a Playwright suite and emit a criteria ledger with runtime evidence anchors

Usage:
  e2e-web [options]

Options:
  --url <url>             Base URL to run against (sets PLAYWRIGHT_TEST_BASE_URL)
  --build <id>            Build identifier: commit SHA, build number, deployment id.
                          Defaults to the current git SHA. Required by the playbook —
                          a target you cannot name cannot be verified.
  --env <name>            Environment name recorded in the output (e.g. preview)
  --criteria <path>       Criteria document; every AC<n> in it becomes a ledger row
  --report <path>         Use an existing Playwright JSON report instead of running
  --pr <number>           Upsert the block onto this PR (requires gh CLI)
  --repo <org/name>       Repo for the gh CLI
  --destination <where>   'comment' (default) or 'body'
  --out <path>            Write the markdown block to a file
  --json                  Print the ledger as JSON instead of markdown
  --fail-on <level>       Exit non-zero on 'fail' (default) | 'unverified' | 'never'
  -h, --help              Show this help

Exit codes:
  0  verdict acceptable under --fail-on
  1  verdict unacceptable under --fail-on
  2  the run could not produce a ledger at all
`;
function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (!arg.startsWith("--") && arg !== "-h")
            continue;
        const key = arg === "-h" ? "help" : arg.slice(2);
        const next = argv[i + 1];
        if (next && !next.startsWith("--")) {
            args[key] = next;
            i++;
        }
        else {
            args[key] = true;
        }
    }
    return args;
}
function currentSha() {
    try {
        return (0,external_node_child_process_namespaceObject.execFileSync)("git", ["rev-parse", "--short", "HEAD"], {
            encoding: "utf8",
        }).trim();
    }
    catch {
        return "unknown";
    }
}
function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log(USAGE);
        process.exit(0);
    }
    const build = typeof args.build === "string" ? args.build : currentSha();
    if (build === "unknown") {
        console.error("warning: no --build given and git SHA unavailable. The target is unnamed, " +
            "which makes these anchors unciteable. Pass --build.");
    }
    let declared = [];
    if (typeof args.criteria === "string") {
        if (!(0,external_node_fs_namespaceObject.existsSync)(args.criteria)) {
            console.error(`criteria file not found: ${args.criteria}`);
            process.exit(2);
        }
        declared = parseCriteria((0,external_node_fs_namespaceObject.readFileSync)(args.criteria, "utf8"));
        if (declared.length === 0) {
            console.error(`no AC<n> criteria found in ${args.criteria}. Criteria must be identified ` +
                "as AC1, AC2, … for tests to anchor to them.");
            process.exit(2);
        }
    }
    let reportJson;
    try {
        reportJson =
            typeof args.report === "string"
                ? (0,external_node_fs_namespaceObject.readFileSync)(args.report, "utf8")
                : runSuite({
                    url: typeof args.url === "string" ? args.url : undefined,
                });
    }
    catch (err) {
        console.error(`could not obtain a Playwright report: ${err.message}`);
        process.exit(2);
    }
    let ledger;
    try {
        ledger = buildLedger(parseReport(reportJson), {
            build,
            url: typeof args.url === "string" ? args.url : undefined,
            environment: typeof args.env === "string" ? args.env : undefined,
        }, declared);
    }
    catch (err) {
        console.error(`could not parse the report: ${err.message}`);
        process.exit(2);
    }
    const block = renderBlock(ledger);
    if (args.json) {
        console.log(JSON.stringify(ledger, null, 2));
    }
    else {
        console.log(block);
    }
    if (typeof args.out === "string") {
        (0,external_node_fs_namespaceObject.writeFileSync)(args.out, block);
    }
    if (typeof args.pr === "string") {
        try {
            upsertBlock(block, {
                prNumber: Number.parseInt(args.pr, 10),
                repo: typeof args.repo === "string" ? args.repo : undefined,
                destination: args.destination === "body" ? "body" : "comment",
            });
        }
        catch (err) {
            console.error(`PR upsert failed: ${err.message}`);
            process.exit(2);
        }
    }
    const failOn = typeof args["fail-on"] === "string" ? args["fail-on"] : "fail";
    if (failOn === "never")
        process.exit(0);
    if (ledger.verdict === "NOT_VERIFIED")
        process.exit(1);
    if (failOn === "unverified" && ledger.verdict !== "VERIFIED")
        process.exit(1);
    process.exit(0);
}
main();

