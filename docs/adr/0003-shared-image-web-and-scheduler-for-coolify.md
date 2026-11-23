---
status: accepted
---

# Shared-image web and scheduler services for Coolify deployment

The Docker Compose stack runs three services—`web` (Next.js App Router + Telegram webhook endpoint), `scheduler` (a lightweight TypeScript worker running from the same Docker image), and `postgres`—rather than relying on Coolify's external scheduled-task UI or an in-process Next.js timer. Keeping the scheduler as a dedicated sidecar container makes per-member timezone-aware notifications (Daily Digest, evening adherence prompt, Weekly Check-in reminder) self-contained in source control, avoids serverless/Next.js worker lifecycle pitfalls, and uses idempotent database locks so container restarts never double-send messages.

## Consequences

- Production (Coolify/HTTPS) auto-registers the Telegram webhook on startup (verified via `X-Telegram-Bot-Api-Secret-Token`); local development (`NODE_ENV=development`) automatically switches to Telegram long-polling so no tunnel/ngrok is required.
- Container startup automatically runs pending Drizzle database migrations before booting `web` and `scheduler`.
