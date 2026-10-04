#!/usr/bin/env bash
# Points your global Claude Code settings at this repo's statusline.sh.
# Backs up ~/.claude/settings.json first. Safe to run more than once.
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"
settings="$HOME/.claude/settings.json"

command -v jq >/dev/null || { echo "Please install jq first (macOS: brew install jq)"; exit 1; }

chmod +x "$repo_dir/statusline.sh"
mkdir -p "$HOME/.claude"
[ -f "$settings" ] || echo '{}' > "$settings"

backup="$settings.backup-$(date +%Y%m%d-%H%M%S)"
cp "$settings" "$backup"
echo "Backed up old settings to: $backup"

tmp=$(mktemp)
jq --arg cmd "$repo_dir/statusline.sh" \
  '.statusLine = {type: "command", command: $cmd, padding: 0}' "$settings" > "$tmp"
mv "$tmp" "$settings"
echo "Status line now runs: $repo_dir/statusline.sh"
echo "Restart Claude Code (or start a new session) to see it."
