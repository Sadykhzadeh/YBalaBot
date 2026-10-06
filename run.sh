#!/usr/bin/env bash
# `deno task start` does the same thing; this is kept for existing deploys.
set -euo pipefail
exec deno run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-import \
  --env-file \
  index.ts
