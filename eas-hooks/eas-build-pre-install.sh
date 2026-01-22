#!/usr/bin/env bash

# Get git commit hash
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Inject into app.json via jq
if command -v jq &> /dev/null; then
  jq --arg commit "$GIT_COMMIT" '.expo.extra.gitCommit = $commit' app.json > app.json.tmp
  mv app.json.tmp app.json
  echo "✅ Injected git commit: $GIT_COMMIT"
else
  echo "⚠️  jq not found, skipping git commit injection"
fi
