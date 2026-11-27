#!/usr/bin/env bash
# Copies the vault's change-impact-diagram skill into this plugin.
# Installed plugins cannot read files outside their own folder, and they do not
# follow a symlink that points outside it, so the plugin carries a copy.
# Usage: ./sync-skills.sh          copy
#        ./sync-skills.sh --check  exit 1 if the copy is out of date
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
src="$here/../../skills/change-impact-diagram"
dst="$here/skills/change-impact-diagram"
if [ "${1:-}" = "--check" ]; then
  diff -r "$src/SKILL.md" "$dst/SKILL.md" >/dev/null && diff -r "$src/scripts" "$dst/scripts" >/dev/null \
    && echo "change-impact-diagram: in sync" && exit 0
  echo "change-impact-diagram: copy is out of date; run tools/ndv-pr-review/sync-skills.sh" >&2
  exit 1
fi
rm -rf "$dst"
mkdir -p "$dst"
cp "$src/SKILL.md" "$dst/SKILL.md"
cp -r "$src/scripts" "$dst/scripts"
echo "change-impact-diagram: copied"
