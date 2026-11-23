---
status: accepted
---

# Multi-user data model gated by a Google OAuth email allowlist

Every domain table is scoped by `member_id` (user ID) and authenticated via Better Auth with Google OAuth, gated by an environment-seeded admin email plus a database-backed Allowlist Entry table manageable in settings. Although v1 is built for personal use with no billing, landing pages, or admin portals, enforcing multi-tenant boundaries and real OAuth from day one avoids a costly schema and auth rewrite if the app is opened to beta testers or commercialized later.

## Considered Options

- **Hardcoded single-user mode (single password / single Telegram chat ID)**: Faster initially, but forces a breaking rewrite of every table, route, and Telegram handler before inviting even one tester.
- **Email + password with invite codes**: Works without OAuth configuration, but adds password-reset/SMTP friction compared to reusing an existing Google account.

## Consequences

- Unauthorized Google accounts attempting sign-in are blocked cleanly with an invite-only notice.
- Each member links their own Telegram account via a short-lived one-tap deep link (`https://t.me/<bot>?start=<token>`).
