#!/usr/bin/env bash
# Optional: turn "get the outline first" into a gate instead of a hoped-for habit.
# Wire on PreToolUse with matcher "Read".
in=$(cat)
f=$(jq -r '.tool_input.file_path // empty' <<<"$in")
lim=$(jq -r '.tool_input.limit // empty' <<<"$in")
pages=$(jq -r '.tool_input.pages // empty' <<<"$in")

# Plain-text files read without a range. PDFs, images and other binaries are skipped.
if [[ -z "$lim" && -z "$pages" && -f "$f" ]] && grep -Iq . "$f" && [[ $(wc -l <"$f") -gt 300 ]]; then
  echo "Large file: $f. Get its outline or search first, or read with offset and limit." >&2
  exit 2
fi
exit 0
