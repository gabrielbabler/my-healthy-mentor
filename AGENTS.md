# AGENTS.md

Instructions for AI coding agents working on **My Healthy Mentor**.

## Start Here

Before making architectural or domain changes, read:
- `GLOSSARY.md` — Canonical domain vocabulary (single source of truth for naming).
- `docs/SPEC.md` — Product workflows, tech stack, data model, Coolify deployment, and phased roadmap.
- `docs/adr/` — Accepted architectural decisions that must not be casually reversed.

## Tech Stack

- **Runtime & Framework**: TypeScript, Next.js (App Router), Tailwind CSS, shadcn/ui, installable PWA.
- **Database**: PostgreSQL 16 + Drizzle ORM (pending migrations run automatically on container startup).
- **Auth**: Better Auth with Google OAuth, gated by `ADMIN_EMAIL`/`ALLOWED_EMAILS` + `allowlist_entries`.
- **AI**: Vercel AI SDK — Google Gemini (AI Studio free tier) primary + Groq / OpenRouter `:free` fallbacks via `.env`.
- **Messaging**: Telegram Bot API — webhook in production (`/api/telegram/webhook`), long-polling in local dev (`NODE_ENV=development`).
- **Media**: `sharp` for WebP conversion and EXIF/GPS stripping on local disk volume.
- **Deployment**: Self-hosted Coolify via `docker-compose.yml` (`web`, `scheduler`, `postgres` from one shared app image).

## Language & Locale Rules

- **Codebase**: Write all filenames, symbols, database tables/columns, comments, commit messages, and technical docs in **English**.
- **Product surface**: Write all UI copy, Mentor system prompts/responses, Telegram messages/commands, and member-facing errors in **Portuguese — Brazil (`pt-BR`)**.
- **Units & formatting**: Use Brazilian metric conventions (`kg`, `cm`, `g`, `kcal`, `L`, `DD/MM/YYYY`) and default timezone `America/Sao_Paulo`.

## Domain Modeling Discipline

- Follow `GLOSSARY.md` strictly in code, Drizzle schemas, API routes, and docs. Never introduce rejected synonyms (`_Avoid_` entries — e.g., use `Member`, not `User`/`Client`; `Diet Plan`, not `Meal Plan`; `Plan Proposal`, not `Suggestion`; `Daily Log`, not `Diary`).
- Keep `GLOSSARY.md` completely free of implementation details. Update it inline whenever a new domain term is introduced.
- Add a new ADR in `docs/adr/NNNN-slug.md` only when a decision is **hard to reverse**, **surprising without context**, and the **result of a real trade-off**.

## Non-Negotiable Architectural Guardrails

1. **Multi-tenant scoping everywhere** (`ADR-0004`): Every domain table, query, API route, and Telegram handler MUST scope by `member_id` and verify ownership. Never hardcode a single user or single Telegram chat ID.
2. **Allowlist-gated Google OAuth** (`ADR-0004`): Every sign-in must verify the email against the seeded `ADMIN_EMAIL`/`ALLOWED_EMAILS` and `allowlist_entries`. Unauthorized accounts must be rejected cleanly with a PT-BR invite-only notice.
3. **Structured context, no vector RAG in v1** (`ADR-0001`): Assemble the deterministic 5-layer context (~3k–5k tokens) on every Mentor turn: Health Profile + Active Diet/Training Plans + Last 4 Weekly Check-ins & Last 7 Daily Logs + Rolling Conversation Summary + Last 12–15 Mentor Thread messages. Do not introduce embeddings or `pgvector` unless `ADR-0001` is superseded.
4. **Progress photos stay 100% local in v1** (`ADR-0002`):
   - NEVER send `Progress Photo` bytes or URLs to external cloud AI/vision APIs.
   - Always sanitize uploads with `sharp` (convert to WebP, resize to max 1600px, strip EXIF/GPS metadata).
   - Store strictly on the persistent volume and serve exclusively through authenticated, ownership-checked API routes (never under `public/`).
   - Keep a clean adapter boundary in the weekly check-in review service so future vision analysis can be plugged in without changing storage or UX.
   - Telegram voice notes (audio) *are* allowed to use free-tier transcription (Gemini / Groq Whisper).
5. **Safe plan mutability**: Ad-hoc chat and weekly reviews must NEVER silently overwrite an active `Diet Plan` or `Training Plan`. Always create a `Plan Proposal` requiring explicit member approval (Telegram inline buttons or Web diff view), and archive the superseded active plan as a read-only `Plan Version`.
6. **Provider-agnostic, zero-cost AI**: Route all LLM calls through a central AI module backed by Vercel AI SDK with configurable `.env` model slots and fallback handling for HTTP `429` / provider errors. Never import vendor SDKs directly inside routes or UI components.
7. **Idempotent scheduling & Coolify parity** (`ADR-0003`):
   - Never rely on in-process Next.js timers or external Coolify cron UI setup; scheduled jobs belong in the `scheduler` entrypoint.
   - Guard every scheduled dispatch with a unique DB constraint on `(member_id, job_type, dispatch_date)` in `scheduled_dispatches` so restarts never double-send.
   - Verify production Telegram webhooks via `X-Telegram-Bot-Api-Secret-Token`.
   - Persist multi-step Telegram flows (such as Weekly Check-ins) in `telegram_bot_states` with `/cancelar` support and a 2-hour timeout.

## UI & Mobile-First Standards

- Design **mobile-first** for phone usage in the gym and kitchen, scaling cleanly to desktop.
- Preserve the 5-section navigation (`Hoje`, `Planos`, `Chat`, `Evolução`, `Perfil`): bottom navigation bar on mobile, sidebar on desktop.
- Support Light & Dark mode and maintain valid PWA manifest metadata.
- Keep daily tracking ultra-low-friction (2-tap adherence buttons + one-tap `Workout Override`, never forced per-gram food logging).

## Working Practices

- Follow the phased roadmap in `docs/SPEC.md` (Phase 1 → Phase 4). Keep changes focused on the current phase without premature commercialization features (no billing, marketing pages, or admin portals).
- Never commit secrets, `.env` files, or real member photos. Keep `.env.example` updated whenever adding environment variables.
- Run typecheck, lint, and tests before finishing any implementation task once the project scaffold exists.
