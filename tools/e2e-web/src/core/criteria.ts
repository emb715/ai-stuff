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
export function normaliseId(raw: string): string {
	const digits = raw.replace(/\D/g, "");
	return `AC${Number.parseInt(digits, 10)}`;
}

/**
 * Extract every criterion id referenced by a test title and its tags.
 * A single test may cover more than one criterion.
 */
export function extractIds(title: string, tags: string[] = []): string[] {
	const found = new Set<string>();
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
export function parseCriteria(text: string): string[] {
	const found = new Set<string>();
	for (const match of text.matchAll(AC_PATTERN)) {
		found.add(normaliseId(match[1]));
	}
	return [...found].sort(compareIds);
}

/** Numeric ordering, so AC10 sorts after AC9 rather than after AC1. */
export function compareIds(a: string, b: string): number {
	const na = Number.parseInt(a.replace(/\D/g, ""), 10);
	const nb = Number.parseInt(b.replace(/\D/g, ""), 10);
	return na - nb;
}
