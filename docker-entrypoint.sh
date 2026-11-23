#!/bin/sh
set -e

MODE="${1:-web}"

if [ "$MODE" = "scheduler" ]; then
  exec ./node_modules/.bin/tsx src/scheduler.ts
fi

echo "[entrypoint] Running database migrations..."
./node_modules/.bin/tsx src/db/migrate.ts

echo "[entrypoint] Starting Next.js web server..."
exec node server.js
