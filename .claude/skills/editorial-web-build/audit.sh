#!/usr/bin/env bash
# Detects common "AI/template look" patterns in a web codebase.
# Usage: audit.sh <directory>   (scans .tsx .jsx .ts .css .html, skips node_modules/.next)
# Output: one line per rule with hit count, then the first hits. Exit 0 always:
# hits are prompts for judgement, not automatic failures.

set -u
DIR="${1:-.}"
INCLUDE=(--include='*.tsx' --include='*.jsx' --include='*.ts' --include='*.css' --include='*.html')
EXCLUDE=(--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=out)

rule() {
  local name="$1" pattern="$2"
  local hits
  hits=$(grep -rEn "${INCLUDE[@]}" "${EXCLUDE[@]}" -- "$pattern" "$DIR" 2>/dev/null || true)
  local count=0
  [ -n "$hits" ] && count=$(printf '%s\n' "$hits" | wc -l | tr -d ' ')
  printf '%-34s %4s\n' "$name" "$count"
  if [ "$count" -gt 0 ]; then
    printf '%s\n' "$hits" | head -3 | sed -E "s#^$DIR/?#    #" | cut -c1-160
  fi
}

echo "AI-pattern audit: $DIR"
echo "-----------------------------------------"
rule "gradients"                 'linear-gradient|radial-gradient|bg-gradient-|from-(purple|blue|indigo|violet)'
rule "glassmorphism / blur"      'backdrop-blur|backdrop-filter'
rule "large rounded cards"       'rounded-(2xl|3xl)'
rule "pills (rounded-full)"      'rounded-full'
rule "drop shadows"              'shadow-(sm|md|lg|xl|2xl)|box-shadow'
rule "hover scale"               'hover:scale-|group-hover:scale-'
rule "3-column grids"            'grid-cols-3'
rule "centred text blocks"       'text-center'
rule "purple / neon colours"     '#(c77dff|7fffd4|5b2d6a|8b5cf6|a855f7|6366f1)|purple-|violet-|indigo-'
rule "generic fonts"             '"(Inter|Montserrat|Poppins|Open Sans|Roboto)"'
rule "!important"                '!important'
rule "scroll arrow / bounce"     'animate-bounce|ScrollArrow'
rule "star ratings"              '★|StarIcon|RatingBadge|rating'
echo "-----------------------------------------"
echo "Each hit needs a written justification or a fix (see SKILL.md section 3)."
