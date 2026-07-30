/**
 * AGENTS.md template — the scaffold emitted by `init`.
 *
 * Template only — no obligation content. The human/agent fills the sections.
 * "Key entry point" is pre-filled from the extracted surface (the index is
 * done; the human/agent fills the obligations).
 *
 * The placeholders are designed to fail `check` until filled — that's the
 * enforcement: an unfilled template is not a contract.
 */

import type { BoundaryEntry } from "./manifest.ts";
import type { SurfaceSymbol } from "./surface.ts";

export function generateAgentsTemplate(
  entry: BoundaryEntry,
  surface: SurfaceSymbol[],
): string {
  const lines: string[] = [];

  lines.push(`# ${entry.name}`);
  lines.push("");
  lines.push(`**One-line purpose:** ${entry.purpose}`);
  lines.push("");
  lines.push("## Does");
  lines.push(
    "<!-- What this boundary does. Obligation only — not mechanism (no file paths, no param shapes, no implementation detail). -->");
  lines.push("");
  lines.push("## Does NOT");
  lines.push(
    "<!-- What a reader might expect but is explicitly out of scope. What neighboring boundaries own instead. -->");
  lines.push("");
  lines.push("## Communication");
  lines.push(
    "<!-- Caller obligations + owed invariants. Use: may / must / must not / owed. Obligation only — no file paths, no library names, no param shapes. -->");
  lines.push("");
  lines.push("## Key entry point");

  // Pre-fill from extracted surface — group by file
  const byFile = new Map<string, string[]>();
  for (const sym of surface) {
    if (!byFile.has(sym.file)) byFile.set(sym.file, []);
    byFile.get(sym.file)!.push(sym.name);
  }

  if (byFile.size > 0) {
    for (const [file, symbols] of byFile) {
      const symbolList = symbols.map((s) => `\`${s}\``).join(", ");
      lines.push(`- \`${file}\` — ${symbolList}`);
    }
  } else {
    lines.push("<!-- No exports found. List each entry file with its exported symbols. -->");
  }

  lines.push("");
  lines.push("## To touch this boundary");
  lines.push(
    "1. Run `boundary check` — must exit 0. Guards AGENTS.md integrity + surface containment + Communication section.");
  lines.push(
    "2. <!-- What a modifier must know before touching this boundary. -->");

  return lines.join("\n") + "\n";
}