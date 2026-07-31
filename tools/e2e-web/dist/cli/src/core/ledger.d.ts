/**
 * Build the criteria ledger required by playbooks/acceptance-verification.
 *
 * The contract that matters: a criterion is `pass` only when a named test
 * mapped to it passed. Suite-wide green is never evidence for a criterion no
 * test claimed. That single rule is what this tool exists to enforce, and it is
 * why `unverified` is a first-class state alongside `pass` and `fail`.
 */
import type { ParsedReport, TestOutcome } from "./report.js";
export declare const START_MARKER = "<!-- e2e-web:start -->";
export declare const END_MARKER = "<!-- e2e-web:end -->";
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
/**
 * @param declared Criteria ids from the criteria document. When empty, the
 * ledger covers only criteria some test claimed — which cannot prove coverage,
 * so the rendered block says so explicitly.
 */
export declare function buildLedger(report: ParsedReport, target: BuildTarget, declared?: string[]): Ledger;
/** Render the ledger as a markdown block, delimited by upsert markers. */
export declare function renderBlock(ledger: Ledger): string;
