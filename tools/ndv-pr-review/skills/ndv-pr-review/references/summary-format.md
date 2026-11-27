# Summary format

One block, in this order. Omit any section that has nothing in it.

````markdown
<!-- ndv-pr-review sha=<head sha> -->
## ndv review: <Fix before merge | Merge after fixes | Ready to merge> · <risk> risk · <layer> <op>[, <layer> <op>]

<one or two sentences: what the change does to the system and the main reason for the verdict>

Tests: <command> <passed>/<total> passed<, <n> failing in changed code> | not run (<reason>)

### Fix order

1. **Critical** `<file:line>`: <finding, one line>. Fix: <the change>.
2. **Warning** `<file:line>`: <finding>. Fix: <the change>.

### `<primitive id>` (<layer>, <op>)

<one sentence: why this layer and op matter for this change>

- **Critical** (ndv-<agent>[, ndv-<agent>]): <finding> `<file:line>`
  Failure: <what goes wrong, for whom>. Fix: <the change>.
- **Warning** (ndv-<agent>): <finding> `<file:line>`
  Failure: <...>. Fix: <...>.

<details>
<summary>Suggestions (<n>)</summary>

- (ndv-<agent>): <finding> `<file:line>`. Fix: <the change>.

</details>

<details>
<summary>Already on base (<n>)</summary>

- (ndv-<agent>): <problem that predates this change> `<file:line>`

</details>

<details>
<summary>Run details</summary>

Fleet <version> · <D> dispatches · base `<base>@<short sha>` -> head `<short sha>` · classification <high | medium (map built on the spot) | low (stale map)>

| Primitive | Layer | Op | Critical | Warning | Suggestion |
|---|---|---|---|---|---|
| `<id>` | <layer> | <op> | <n> | <n> | <n> |

Verified: <n> confirmed, <n> rejected, <n> merged as duplicates, <n> moved to base.

Handoffs, Deferred and Incomplete, as Flow reported them.

Raw fleet report.

</details>

<sub>ndv-pr-review 0.8.0</sub>
````

Rules:

- Verdict: any Critical -> `Fix before merge`; Warnings only -> `Merge after fixes`; none -> `Ready to merge`.
- Risk word comes from the verified findings, not from the op: `high` if any Critical, `medium` if any Warning, `low` otherwise. The layers and ops follow it as the change's shape.
- When the op is `adds` or `removes` but no Critical was found, say in the opening sentence that the change is structurally new and was checked at full depth.
- Fix order: every Critical, then every Warning, most severe and most widely felt first. Each line repeats the fix from its finding.
- Primitives sort by op (adds, removes, extends, composes), then by Critical count.
- Suggestions, Already on base and Run details are always collapsed.
- The `<!-- ndv-pr-review ... -->` marker is the first line, so the next run can find and update this comment.
