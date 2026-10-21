#!/usr/bin/env bash
in=$(cat)
# Already continuing because of this hook: let it stop, don't loop forever.
[[ "$(jq -r '.stop_hook_active // false' <<<"$in")" == "true" ]] && exit 0

# validate.sh already reports only the first failure.
if ! out=$(pnpm --silent validate 2>&1); then
  printf '%s\n' "$out" >&2
  exit 2
fi
exit 0
