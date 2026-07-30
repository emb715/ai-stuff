/**
 * Manifest parser — reads and validates boundaries.yaml.
 *
 * The manifest is the handoff between judgment (drawing boundaries)
 * and mechanical (scaffolding). It lists boundaries with dir, name,
 * purpose, surface entry files, and optional maxLines override.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { parse as parseYaml } from "yaml";
import { ManifestError } from "./errors.ts";

export { ManifestError };

export interface BoundaryEntry {
  dir: string;
  name: string;
  purpose: string;
  surface: string[];
  maxLines?: number;
}

export interface Manifest {
  maxLines: number;
  boundaries: BoundaryEntry[];
  repoRoot: string;
}

/**
 * Read and validate boundaries.yaml from a repo root.
 * Throws ManifestError on any validation failure.
 */
export function loadManifest(repoRoot: string): Manifest {
  const manifestPath = join(repoRoot, "boundaries.yaml");

  if (!existsSync(manifestPath)) {
    throw new ManifestError(
      `No boundaries.yaml found at ${manifestPath}. Create one listing your boundaries. See the experiment README for schema.`,
    );
  }

  const raw = readFileSync(manifestPath, "utf-8");
  let parsed: unknown;

  try {
    parsed = parseYaml(raw);
  } catch (e) {
    throw new ManifestError(`Failed to parse boundaries.yaml: ${(e as Error).message}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new ManifestError("boundaries.yaml is empty or not an object");
  }

  const obj = parsed as Record<string, unknown>;
  const maxLines = typeof obj.maxLines === "number" ? obj.maxLines : 40;
  const rawBoundaries = obj.boundaries;

  if (!Array.isArray(rawBoundaries)) {
    throw new ManifestError("boundaries.yaml: 'boundaries' must be an array", "boundaries");
  }

  const boundaries: BoundaryEntry[] = [];

  for (let i = 0; i < rawBoundaries.length; i++) {
    const entry = rawBoundaries[i] as Record<string, unknown>;
    const prefix = `boundaries[${i}]`;

    if (!entry || typeof entry !== "object") {
      throw new ManifestError(`${prefix}: not an object`, prefix);
    }
    if (typeof entry.dir !== "string" || entry.dir.length === 0) {
      throw new ManifestError(`${prefix}: 'dir' must be a non-empty string`, `${prefix}.dir`);
    }
    if (typeof entry.name !== "string" || entry.name.length === 0) {
      throw new ManifestError(`${prefix}: 'name' must be a non-empty string`, `${prefix}.name`);
    }
    if (typeof entry.purpose !== "string" || entry.purpose.length === 0) {
      throw new ManifestError(`${prefix}: 'purpose' must be a non-empty string`, `${prefix}.purpose`);
    }
    if (!Array.isArray(entry.surface) || entry.surface.length === 0) {
      throw new ManifestError(
        `${prefix}: 'surface' must be a non-empty array of entry file paths`,
        `${prefix}.surface`,
      );
    }
    for (const s of entry.surface) {
      if (typeof s !== "string") {
        throw new ManifestError(`${prefix}.surface: all entries must be strings`, `${prefix}.surface`);
      }
    }

    const maxLinesOverride = typeof entry.maxLines === "number" ? entry.maxLines : undefined;

    // Validate boundary dir exists and is contained under repo root
    const dirAbs = resolve(repoRoot, entry.dir);
    if (dirAbs !== repoRoot && !dirAbs.startsWith(repoRoot + sep)) {
      throw new ManifestError(
        `${prefix}: dir '${entry.dir}' escapes repo root`,
        `${prefix}.dir`,
      );
    }
    if (!existsSync(dirAbs)) {
      throw new ManifestError(
        `${prefix}: dir '${entry.dir}' does not exist (resolved to ${dirAbs})`,
        `${prefix}.dir`,
      );
    }

    // Validate each surface file path is contained under the boundary dir.
    // `dir` is now guaranteed contained, so a contained surface file cannot
    // escape repoRoot.
    for (const s of entry.surface as string[]) {
      const surfaceAbs = resolve(dirAbs, s);
      if (surfaceAbs !== dirAbs && !surfaceAbs.startsWith(dirAbs + sep)) {
        throw new ManifestError(
          `${prefix}.surface: '${s}' escapes boundary dir '${entry.dir}'`,
          `${prefix}.surface`,
        );
      }
    }

    boundaries.push({
      dir: entry.dir,
      name: entry.name,
      purpose: entry.purpose,
      surface: entry.surface as string[],
      maxLines: maxLinesOverride,
    });
  }

  if (boundaries.length === 0) {
    throw new ManifestError("boundaries.yaml: 'boundaries' array is empty");
  }

  return {
    maxLines,
    boundaries,
    repoRoot: resolve(repoRoot),
  };
}

/**
 * Resolve a boundary's directory to an absolute path.
 */
export function boundaryDir(manifest: Manifest, entry: BoundaryEntry): string {
  return join(manifest.repoRoot, entry.dir);
}