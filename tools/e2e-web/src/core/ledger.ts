/**
 * Build the criteria ledger required by playbooks/acceptance-verification.
 *
 * The contract that matters: a criterion is `pass` only when a named test
 * mapped to it passed. Suite-wide green is never evidence for a criterion no
 * test claimed. That single rule is what this tool exists to enforce, and it is
 * why `unverified` is a first-class state alongside `pass` and `fail`.
 */

import { compareIds, extractIds } from "./criteria.js";
import type { ParsedReport, TestOutcome } from "./report.js";

export const START_MARKER = "<!-- e2e-web:start -->";
export const END_MARKER = "<!-- e2e-web:end -->";

export type CriterionState = "pass" | "fail" | "flaky" | "unverified";
export type Verdict = "VERIFIED" | "VERIFIED_WITH_CONDITIONS" | "NOT_VERIFIED";

export interface Anchor {
	title: string;
	file: string;
	line: number;
	status: TestOutcome["status"];
	project: string;
}

export interface LedgerRow {
	id: string;
	state: CriterionState;
	anchors: Anchor[];
	/** Present when the row is not `pass`; explains what a reader must do. */
	note?: string;
}

export interface BuildTarget {
	/** Commit SHA, build number, or deployment id. Required by the playbook. */
	build: string;
	/** URL the suite ran against. */
	url?: string;
	/** Environment name, e.g. "preview", "staging". */
	environment?: string;
}

export interface Ledger {
	rows: LedgerRow[];
	/** Tests that named no criterion. Not failures — just not anchors. */
	unmapped: Anchor[];
	verdict: Verdict;
	target: BuildTarget;
	stats: ParsedReport["stats"];
}

function toAnchor(o: TestOutcome): Anchor {
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
function resolveState(anchors: Anchor[]): { state: CriterionState; note?: string } {
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
function resolveVerdict(rows: LedgerRow[]): Verdict {
	if (rows.length === 0) return "NOT_VERIFIED";
	if (rows.some((r) => r.state === "fail")) return "NOT_VERIFIED";
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
export function buildLedger(
	report: ParsedReport,
	target: BuildTarget,
	declared: string[] = [],
): Ledger {
	const byId = new Map<string, Anchor[]>();
	const unmapped: Anchor[] = [];

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

	const rows: LedgerRow[] = ids.map((id) => {
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

const STATE_LABEL: Record<CriterionState, string> = {
	pass: "pass",
	fail: "**fail**",
	flaky: "flaky",
	unverified: "**unverified**",
};

function renderAnchor(a: Anchor): string {
	const loc = a.line > 0 ? `${a.file}:${a.line}` : a.file;
	const project = a.project ? ` (${a.project})` : "";
	return `\`${loc}\` — ${a.title}${project}`;
}

function escapeCell(text: string): string {
	return text.replace(/\|/g, "\\|");
}

/** Render the ledger as a markdown block, delimited by upsert markers. */
export function renderBlock(ledger: Ledger): string {
	const { target, rows, unmapped, verdict, stats } = ledger;
	const lines: string[] = [START_MARKER, "", "## Acceptance verification", ""];

	lines.push(`**Verdict: ${verdict}**`, "");

	const targetBits = [`build \`${target.build}\``];
	if (target.url) targetBits.push(`against ${target.url}`);
	if (target.environment) targetBits.push(`env \`${target.environment}\``);
	lines.push(
		`${targetBits.join(" · ")} · ${stats.expected} passed, ${stats.unexpected} failed, ${stats.flaky} flaky, ${stats.skipped} skipped`,
		"",
	);

	if (rows.length === 0) {
		lines.push(
			"> No criteria found. No test named an `AC<n>` criterion and no criteria document was supplied — this run is not evidence for anything.",
			"",
		);
	} else {
		lines.push("| Criterion | State | Evidence anchor |", "|---|---|---|");
		for (const row of rows) {
			const evidence =
				row.anchors.length > 0
					? row.anchors.map((a) => escapeCell(renderAnchor(a))).join("<br>")
					: `_${escapeCell(row.note ?? "no anchor")}_`;
			const note =
				row.anchors.length > 0 && row.note ? `<br>_${escapeCell(row.note)}_` : "";
			lines.push(`| ${row.id} | ${STATE_LABEL[row.state]} | ${evidence}${note} |`);
		}
		lines.push("");
	}

	const unverified = rows.filter((r) => r.state === "unverified");
	if (unverified.length > 0) {
		lines.push(
			`**${unverified.length} ${unverified.length === 1 ? "criterion" : "criteria"} unverified.** Absence of a check is not a pass — each needs a manual probe (acceptance-verification Step 5) or a test.`,
			"",
		);
	}

	if (unmapped.length > 0) {
		lines.push(
			`<details><summary>${unmapped.length} test${unmapped.length === 1 ? "" : "s"} claimed no criterion</summary>`,
			"",
		);
		for (const a of unmapped) lines.push(`- ${renderAnchor(a)}`);
		lines.push("", "</details>", "");
	}

	lines.push(
		"<sub>Generated by `tools/e2e-web`. A criterion is `pass` only when a test naming it passed — suite-wide green is not evidence.</sub>",
		"",
		END_MARKER,
	);

	return lines.join("\n");
}
