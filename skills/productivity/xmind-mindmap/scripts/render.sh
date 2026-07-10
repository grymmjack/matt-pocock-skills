#!/usr/bin/env bash
#
# render.sh — render a Mermaid `mindmap` (.mmd) to SVG / PNG / PDF.
#
# The .xmind file itself is the primary deliverable; this turns the .mmd twin
# that generate-xmind.js writes alongside it into shareable static images.
# Rendering uses Mermaid CLI (mmdc) driving a headless Chromium.
#
# Usage:
#   ./render.sh <input.mmd> [format] [output-basename]
#
#   format: svg | png | pdf | all   (default: svg)
#   output-basename: defaults to the input name without extension
#
# Examples:
#   ./render.sh photosynthesis.mmd png
#   ./render.sh photosynthesis.mmd all diagrams/photosynthesis
#
set -euo pipefail

IN="${1:?usage: render.sh <input.mmd> [svg|png|pdf|all] [out-basename]}"
FMT="${2:-svg}"
OUTBASE="${3:-${IN%.*}}"

if [[ ! -f "$IN" ]]; then
  echo "render.sh: input not found: $IN" >&2
  exit 1
fi

# Prefer a pre-installed Chromium (e.g. the Playwright browser this environment
# ships) so mmdc does not try to download one. Fall back to mmdc's default.
PPTR_CFG=""
CHROME="$(ls /opt/pw-browsers/chromium*/chrome-linux/chrome 2>/dev/null | head -1 || true)"
if [[ -n "$CHROME" ]]; then
  PPTR_CFG="$(mktemp --suffix=.json)"
  cat > "$PPTR_CFG" <<JSON
{ "executablePath": "$CHROME", "args": ["--no-sandbox"] }
JSON
  trap 'rm -f "$PPTR_CFG"' EXIT
fi

render_one() {
  local fmt="$1" out="$OUTBASE.$1"
  mkdir -p "$(dirname "$out")"
  local -a cmd=(npx -y @mermaid-js/mermaid-cli -i "$IN" -o "$out")
  [[ -n "$PPTR_CFG" ]] && cmd+=(-p "$PPTR_CFG")
  echo "rendering $out ..."
  "${cmd[@]}"
  echo "  -> $out"
}

case "$FMT" in
  svg|png|pdf) render_one "$FMT" ;;
  all) render_one svg; render_one png; render_one pdf ;;
  *) echo "render.sh: unknown format '$FMT' (svg|png|pdf|all)" >&2; exit 1 ;;
esac
