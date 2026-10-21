#!/usr/bin/env bash
# Hooks receive the tool call as JSON on stdin.
in=$(cat)
path=$(jq -r '.tool_input.file_path // empty' <<<"$in")
cmd=$(jq -r '.tool_input.command // empty' <<<"$in")

block() {
  echo "Blocked: .env holds secrets. Read .env.example instead." >&2
  exit 2
}

# Read tool: check the path.
[[ "$path" == *.env.example ]] && exit 0
[[ "$path" == *.env || "$path" == *.env.* ]] && block

# Bash tool: check the command for .env / .env.local / ... (but not .env.example).
grep -oE '(^|[[:space:]/])\.env(\.[a-z]+)?([[:space:]]|$)' <<<"$cmd" \
  | grep -qv 'example' && block

exit 0
