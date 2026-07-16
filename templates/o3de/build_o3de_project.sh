#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${1:-.}"
ENGINE_PATH="${O3DE_ENGINE_PATH:-}"

if [[ -z "$ENGINE_PATH" ]]; then
  echo "O3DE_ENGINE_PATH is not set. Set it to the root of your O3DE engine installation." >&2
  exit 1
fi

O3DE_CMD="$ENGINE_PATH/bin/o3de"
if [[ ! -x "$O3DE_CMD" ]]; then
  echo "Could not find executable o3de at $O3DE_CMD. Verify your O3DE engine installation." >&2
  exit 1
fi

echo "Using O3DE engine at: $ENGINE_PATH"
echo "Building O3DE project at: $PROJECT_PATH"

pushd "$PROJECT_PATH" >/dev/null

$O3DE_CMD project --generate
$O3DE_CMD asset --project-path "$PROJECT_PATH" build
$O3DE_CMD build --project-path "$PROJECT_PATH" --platform linux64

echo "O3DE build completed successfully."
popd >/dev/null
