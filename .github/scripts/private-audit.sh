#!/usr/bin/env bash
# Private-details check for this PUBLIC repo (her 2026-11-22: "keep private info local and erase any public info").
#
# The terms it looks for are NOT in this repo: they live in local files on her computer, outside every repo
# (the Claude memory folder: private-terms.txt, one extended regex per line, shared by every app; and an optional
# private-terms-c22.txt there, terms checked in the two C22 repos only). This script only knows where to look.
# Without the main file (another computer, CI) the check says so and passes: it never blocks on a missing list.
#
# Usage (repo root):   .github/scripts/private-audit.sh [rev]     rev defaults to main; exit 1 = a term is in a tracked file at rev
# Override the list:   LCM_PRIVATE_TERMS=/path/to/terms.txt .github/scripts/private-audit.sh
# Run it on the commit that is about to go live, before "push live"; on exit 1 stop and erase the line it names.
set -uo pipefail
cd "$(dirname "$0")/../.."
REV="${1:-main}"
TERMS="${LCM_PRIVATE_TERMS:-}"
if [ -z "$TERMS" ]; then
  for f in "$HOME"/.claude/projects/*/memory/private-terms.txt; do [ -f "$f" ] && { TERMS="$f"; break; }; done
fi
if [ -z "$TERMS" ] || [ ! -f "$TERMS" ]; then
  echo "NOTE: no private-terms file found; the private-details check was skipped." >&2
  exit 0
fi
clean="$(mktemp)"; trap 'rm -f "$clean"' EXIT
grep -v -e '^[[:space:]]*$' -e '^[[:space:]]*#' "$TERMS" > "$clean"
EXTRA="$(dirname "$TERMS")/private-terms-c22.txt"
[ -f "$EXTRA" ] && grep -v -e '^[[:space:]]*$' -e '^[[:space:]]*#' "$EXTRA" >> "$clean"
[ -s "$clean" ] || { echo "NOTE: the private-terms file is empty; nothing to check." >&2; exit 0; }
hits=$(git grep -I -i -n -E -f "$clean" "$REV" -- . ':!*.mp4' ':!shots' 2>/dev/null | cut -c1-220)
if [ -n "$hits" ]; then
  echo "STOP: private terms are in $REV (the list is local and is never printed here; lines found):" >&2
  printf '%s\n' "$hits" | head -40 >&2
  exit 1
fi
echo "private-audit: clean ($REV)"
