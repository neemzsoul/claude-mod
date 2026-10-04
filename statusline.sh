#!/usr/bin/env bash
# Claude Code status line: model · folder · context % bar · session cost
# Claude Code pipes session info (JSON) into this script; whatever we print is shown.

# ---- Settings you can change ------------------------------------------------
BAR_WIDTH=10        # how many blocks the context bar has
WARN_AT=50          # bar turns yellow at this % of context used
DANGER_AT=80        # bar turns red at this % of context used
FILLED="█"          # character for the used part of the bar
EMPTY="░"           # character for the unused part of the bar
# -----------------------------------------------------------------------------

input=$(cat)

# jq reads the JSON. Without it, show a hint instead of breaking.
if ! command -v jq >/dev/null 2>&1; then
  echo "status line needs jq (macOS: brew install jq)"
  exit 0
fi

model=$(jq -r '.model.display_name // "Claude"' <<<"$input")
dir=$(jq -r '.workspace.current_dir // .cwd // ""' <<<"$input")
cost=$(jq -r '.cost.total_cost_usd // 0' <<<"$input")

# Context used, in %. Newer Claude Code versions send it directly;
# otherwise work it out from the token counts.
pct=$(jq -r '
  .context_window.used_percentage
  // (if .context_window.current_usage and .context_window.context_window_size then
        ((.context_window.current_usage.input_tokens // 0)
         + (.context_window.current_usage.cache_creation_input_tokens // 0)
         + (.context_window.current_usage.cache_read_input_tokens // 0))
        * 100 / .context_window.context_window_size
      else 0 end)
  | floor' <<<"$input" 2>/dev/null)
[[ "$pct" =~ ^[0-9]+$ ]] || pct=0
(( pct > 100 )) && pct=100

# Colours
reset=$'\033[0m'; dim=$'\033[2m'
green=$'\033[32m'; yellow=$'\033[33m'; red=$'\033[31m'; cyan=$'\033[36m'
if   (( pct >= DANGER_AT )); then color=$red
elif (( pct >= WARN_AT ));   then color=$yellow
else                              color=$green
fi

# Build the bar, e.g. ███░░░░░░░
filled=$(( pct * BAR_WIDTH / 100 ))
bar=""
for ((i = 0; i < BAR_WIDTH; i++)); do
  if (( i < filled )); then bar+="$FILLED"; else bar+="$EMPTY"; fi
done

printf '%s%s%s %s· %s%s ctx %s%s %d%%%s %s· $%.2f%s\n' \
  "$cyan" "$model" "$reset" \
  "$dim" "${dir##*/}" "$reset" \
  "$color" "$bar" "$pct" "$reset" \
  "$dim" "$cost" "$reset"
