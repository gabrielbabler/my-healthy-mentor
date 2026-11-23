# My Healthy Mentor — Product & Architecture Specification (v1)

> **Domain Vocabulary**: Canonical terms used throughout this spec and codebase are defined in [GLOSSARY.md](../GLOSSARY.md). Architectural trade-offs are recorded in [docs/adr/](./adr/).

## 1. Vision & Scope

**My Healthy Mentor** is a self-hosted, mobile-first web application and Telegram companion that manages a member's **Diet Plan**, **Training Plan**, daily adherence, and weekly body-evolution check-ins with an AI **Mentor** that never forgets the member's goals or routine.

- **Codebase language**: English (`TypeScript`).
- **Product language (UI, Mentor responses, Telegram messages)**: Portuguese — Brazil (`pt-BR`).
- **Units & formatting**: Brazilian metric conventions (`kg`, `cm`, `g`, `kcal`, `L`, `DD/MM/YYYY`).
- **Hosting**: Self-hosted VPS managed via **Coolify** (Docker Compose).
- **Operating cost target**: **\$0/month** for personal usage via free-tier cloud LLM providers.
- **Multi-user posture**: Full `member_id` scoping + Google OAuth allowlist so inviting testers or commercializing later requires no schema rewrite; billing, public landing pages, and SaaS admin dashboards are explicitly out of scope for v1.

---

## 2. Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Next.js (App Router, TypeScript) |
| UI | Tailwind CSS + shadcn/ui (mobile-first, Light/Dark mode, installable PWA) |
| Database | PostgreSQL + Drizzle ORM (auto-migrated on boot) |
| Auth | Better Auth (Google OAuth + `ADMIN_EMAIL`/`ALLOWED_EMAILS` + DB allowlist) |
| AI SDK | Vercel AI SDK (provider-agnostic routing & fallback chain) |
| Primary AI (Free) | Google Gemini via AI Studio free tier (text, structured JSON, Telegram audio) |
| Fallback AI (Free) | Groq free tier (Llama text / Whisper audio) & OpenRouter `:free` models |
| Telegram | Bot API via Next.js webhook route (prod) / long-polling (local dev) |
| Image Processing | `sharp` — WebP conversion, max 1600px, EXIF/GPS stripping |
| Deployment | Docker Compose on Coolify (`web`, `scheduler`, `postgres` + photo volume) |

---

## 3. Core Product Workflows

### 3.1 Authentication & Onboarding
1. Member signs in with **Google OAuth**. Access is checked against `ADMIN_EMAIL`/`ALLOWED_EMAILS` (seeded into the DB allowlist on boot) and the `allowlist_entries` table. Unauthorized emails see *"Acesso restrito a convidados"*.
2. First-time members complete a **5-step Health Profile wizard** (non-essential fields optional, with a brief one-time medical/nutrition disclaimer):
   - **Corpo e Dados Básicos**: age, biological sex, height (`cm`), current weight (`kg`), optional body fat % / waist (`cm`).
   - **Objetivo e Prazo**: primary goal (fat loss / hypertrophy / recomposition / maintenance / conditioning), target weight, desired pace, personal motivation.
   - **Rotina**: wake/sleep times, work activity level, preferred training days/time/duration, gym vs. home equipment, daily meal count/times.
   - **Preferências Alimentares**: allergies/intolerances, disliked foods, favorite everyday Brazilian foods, cooking style, budget tier, eating-out frequency, supplements.
   - **Histórico e Saúde**: training experience level, injuries/limitations, cardio preference, free-text communication tone preference.
3. Everything in the Health Profile remains editable anytime under **Perfil -> Meu Perfil**, immediately updating future Mentor context.

### 3.2 Diet Plan & Training Plan Lifecycle
- **Creation paths**:
  1. **AI Generation**: Mentor generates editable **Plan Drafts** (Diet Plan + Training Plan) from the member's Health Profile.
  2. **Smart Text Import ("Importar por Texto")**: Member pastes raw unstructured text (including a full copied Gemini thread mixing diet and training together, or either individually). The AI parses and splits it into structured editable **Plan Drafts**.
- **Review & Activation**: Member edits meals, macros, substitutions, or exercises in the Web UI and activates the plan. Activating a new plan archives the previous active plan as a read-only **Plan Version**.
- **Diet Plan structure**:
  - Daily targets: `kcal`, protein (`g`), carbs (`g`), fat (`g`), water (`L`), optional training-day tweak notes.
  - Ordered **Meals**: name, suggested time, food items (name, quantity in `g`/household measure, estimated macros), and built-in **substitution options**.
- **Training Plan structure**:
  - Day-of-week weekly split (`Seg`–`Dom`): workout label or rest day.
  - Ordered **Exercises**: name, sets, rep range, rest seconds, optional notes / cardio block.
- **Plan Proposals (Safe Mutability)**:
  - Ad-hoc chat freely offers one-off substitutions and same-day advice.
  - Any permanent change to the active Diet Plan or Training Plan is created as a **Plan Proposal** with a concise before/after summary.
  - Member receives **Aprovar / Rejeitar** inline buttons in Telegram plus a link to inspect/tweak the full diff in the Web App. Approving snapshots the prior active plan into **Plan Versions** and activates the new version.

### 3.3 Daily Companion (Web "Hoje" + Telegram)
- **Telegram Linking**: One-tap deep link (`https://t.me/<bot>?start=<one_time_token>`) generated in Web **Configurações** binds the member's `telegram_chat_id` to their `member_id`.
- **Daily Digest**: Sent at the member's configured time & timezone (default `America/Sao_Paulo`), summarizing today's training session (or rest day) and today's meals/targets.
- **Evening Adherence Check-in (Optional, Configurable)**: Single Telegram message with **2-tap inline buttons** (also mirrored on Web **Hoje**):
  - `Dieta`: `100%` / `Adaptada` / `Fora`
  - `Treino`: `Feito` / `Descanso` / `Pulei`
- **Same-Day Flexibility**:
  - **Workout Override**: One-tap *"Trocar treino de hoje"* (or telling the Mentor) shifts today's workout without modifying the base weekly split.
  - **Daily Notes**: Telling the Mentor about a planned *"refeição livre / trash-meal"* or deviation triggers same-day adjustment advice and attaches a concise **Daily Note** to today's **Daily Log** so later messages and the Weekly Check-in retain the context.
- **Synced Mentor Thread**: Single conversation thread accessible in both **Telegram** (text + voice notes/áudios) and the Web **Chat** tab.
- **Telegram Slash Commands**:
  - `/hoje` — resend today's digest (respecting any Workout Override).
  - `/dieta` — view full meals and substitutions.
  - `/treino` — view today's exercises, sets, reps, and rest.
  - `/checkin` — start a Weekly Check-in flow anytime.
  - `/peso <valor>` — quick fasting weight log.
  - `/cancelar` — exit an active multi-step Telegram flow.

### 3.4 Weekly Check-in & Progress Photos
- **Reminder**: Sent on the member's configured weekday & time via Telegram.
- **Guided Submission**:
  - **Telegram**: Postgres-backed state machine (`idle` -> `awaiting_weight` -> `awaiting_photos` -> `awaiting_notes`) with `/cancelar` and an automatic **2-hour timeout**.
  - **Web App**: Direct upload form under **Evolução**.
  - **Fields**: Fasting weight (`kg`), 1–3 **Progress Photos** (flexible angles, e.g., frente/lado/costas), optional waist (`cm`), optional subjective notes (energy, sleep, hunger, strength).
- **Photo Privacy & Storage**:
  - Converted via `sharp` to **WebP** (max 1600px, EXIF/GPS metadata stripped).
  - Saved on the Coolify persistent volume (`/data/photos/<member_id>/<checkin_id>/<photo_id>.webp`).
  - Served strictly via authenticated Next.js route (`/api/photos/[photoId]`) verifying `member_id` ownership.
  - **Not sent to external AI vision models in v1** (see [ADR-0002](./adr/0002-local-only-progress-photos-without-cloud-vision.md)).
- **Weekly AI Review & Evolução UI**:
  - Mentor evaluates fasting weight trend (vs. previous check-in, 4-week rolling average, and Week 1 baseline), weekly daily adherence, Daily Notes, and check-in notes -> generates PT-BR feedback and an optional **Plan Proposal**.
  - Web **Evolução** tab displays a fasting weight chart, check-in history, and a **side-by-side visual photo comparator** (any two dates) with download buttons.

---

## 4. AI Context Pipeline & Provider Strategy

### 4.1 Always-Injected 5-Layer Context (~3k–5k tokens)
Every Mentor turn deterministically assembles:
1. **Health Profile & Goals** (compact structured summary + PT-BR coach system prompt).
2. **Active Diet Plan & Training Plan** (structured JSON/markdown + today's weekday/override).
3. **Recent Progress** (last 4 Weekly Check-ins with weight deltas/notes + last 7 Daily Logs with adherence and Daily Notes).
4. **Rolling Conversation Summary** (condensed asynchronously every ~20 messages).
5. **Recent Mentor Thread Window** (last 12–15 raw messages across Web & Telegram).

### 4.2 Free-Tier Resilience
- Routed via **Vercel AI SDK** with env-configured model slots (`AI_CHAT_MODEL`, `AI_STRUCTURED_MODEL`, `AI_AUDIO_MODEL`) and ordered fallback providers:
  1. **Primary**: Google Gemini (AI Studio free tier).
  2. **Fallbacks**: Groq free tier (text + Whisper audio) and OpenRouter `:free` models on HTTP `429`/provider failure.

---

## 5. High-Level Data Model (PostgreSQL + Drizzle)

All domain tables carry `member_id` foreign keys and indexes:

- `members` — Better Auth user record + `timezone` (`America/Sao_Paulo`), `telegram_chat_id`, `role` (`admin` | `member`), notification schedule settings (digest time/enabled, evening check-in time/enabled, weekly check-in weekday/time/enabled).
- `allowlist_entries` — `email` (unique), `added_by_member_id`, `created_at`.
- `telegram_link_tokens` — `token`, `member_id`, `expires_at`, `used_at`.
- `telegram_bot_states` — `member_id`, `state`, `payload` (`jsonb`), `expires_at`.
- `health_profiles` — `member_id` (unique), structured columns + `jsonb` preferences/routine/health fields, `disclaimer_accepted_at`, `updated_at`.
- `diet_plans` — `id`, `member_id`, `version`, `status` (`draft` | `active` | `archived`), `title`, `daily_targets` (`jsonb`), `meals` (`jsonb`), `source` (`ai_generated` | `text_import` | `manual` | `proposal`), `activated_at`, `created_at`.
- `training_plans` — `id`, `member_id`, `version`, `status` (`draft` | `active` | `archived`), `title`, `weekly_split` (`jsonb`), `source`, `activated_at`, `created_at`.
- `plan_proposals` — `id`, `member_id`, `plan_type` (`diet` | `training`), `base_plan_id`, `proposed_payload` (`jsonb`), `summary_pt_br`, `status` (`pending` | `approved` | `rejected`), `telegram_message_id`, `created_at`, `resolved_at`.
- `daily_logs` — `id`, `member_id`, `date` (`YYYY-MM-DD`, unique per member), `diet_adherence` (`on_plan` | `adjusted` | `off_plan`), `training_adherence` (`done` | `rest` | `skipped`), `workout_override` (`jsonb`), `daily_notes` (`jsonb`), `updated_at`.
- `weekly_checkins` — `id`, `member_id`, `checkin_date`, `fasting_weight_kg`, `waist_cm`, `notes`, `ai_review_pt_br`, `created_at`.
- `progress_photos` — `id`, `member_id`, `checkin_id`, `angle_label`, `storage_path`, `width`, `height`, `size_bytes`, `created_at`.
- `mentor_messages` — `id`, `member_id`, `role` (`user` | `assistant`), `channel` (`web` | `telegram`), `content`, `metadata` (`jsonb`), `created_at`.
- `conversation_summaries` — `id`, `member_id`, `summary_text`, `covered_until_message_id`, `updated_at`.
- `scheduled_dispatches` — `id`, `member_id`, `job_type` (`daily_digest` | `evening_checkin` | `weekly_reminder`), `dispatch_date` (`YYYY-MM-DD`), `sent_at` (unique on `(member_id, job_type, dispatch_date)` for idempotency).

---

## 6. Web App Navigation (Mobile-First PWA)

- **Mobile**: 5-tab bottom navigation bar (`Hoje`, `Planos`, `Chat`, `Evolução`, `Perfil`).
- **Desktop**: Persistent left sidebar with the same 5 sections.
- **Screens**:
  1. **Hoje**: Today's workout (with one-tap *Trocar treino de hoje*), today's diet summary, 2-tap adherence buttons, active Daily Notes, and pending Plan Proposal banner.
  2. **Planos**: Diet Plan & Training Plan viewer/editor, **Importar por Texto**, **Gerar com IA**, Pending Proposals diff reviewer, and Plan Version history.
  3. **Chat**: Synced Mentor Thread (shared seamlessly with Telegram).
  4. **Evolução**: Fasting weight chart, Weekly Check-in submission form, check-in history & AI reviews, and **side-by-side Progress Photo comparator** with download.
  5. **Perfil**: Editable **Meu Perfil** (Health Profile), **Configurações** (Telegram linking, notification schedules & timezone, Light/Dark theme, Google OAuth email allowlist management).

---

## 7. Coolify Deployment Topology

`docker-compose.yml` builds one shared multi-stage Node/Next.js image and runs:
1. **`web`**: Runs pending Drizzle migrations on startup, auto-registers Telegram webhook in production (`APP_URL/api/telegram/webhook` + `TELEGRAM_WEBHOOK_SECRET`), serves Next.js App Router on port `3000`, mounts `photos_data:/data/photos`.
2. **`scheduler`**: Runs `dist/scheduler.js` from the same image; ticks every 60 seconds, evaluates members whose local time matches their configured dispatch windows, claims idempotent `scheduled_dispatches` rows, and sends Telegram messages.
3. **`postgres`**: PostgreSQL 16 with persistent volume (`pg_data`).

Local development (`NODE_ENV=development`) runs the Telegram bot in **long-polling mode** automatically so no public tunnel is needed.

---

## 8. Phased Implementation Roadmap

- **Phase 1 — Foundation & Auth**: Next.js + Tailwind + shadcn/ui + PWA manifest, Drizzle schema & auto-migrations, Docker Compose for Coolify, Better Auth + Google OAuth + allowlist gate, responsive 5-tab/sidebar shell.
- **Phase 2 — Health Profile & Plans**: 5-step onboarding wizard + editable *Meu Perfil*, Vercel AI SDK free-tier client with fallback chain, AI Plan Draft generation, **Importar por Texto** (Gemini thread parser), Diet & Training viewer/editor, and Plan Version history.
- **Phase 3 — Telegram Bot, Synced Chat & Scheduler**: Telegram webhook (prod) / long-polling (dev), one-tap deep-link binding, 5-layer context assembler + rolling Conversation Summary, synced Web/Telegram chat + voice note transcription, Daily Notes & Workout Override, Plan Proposals (Telegram inline Approve/Reject + Web diff), slash commands, and `scheduler` worker.
- **Phase 4 — Weekly Check-ins & Progress Photos**: Telegram check-in state machine + Web check-in form, `sharp` WebP + EXIF stripping + authenticated photo streaming, Weekly AI Review, fasting weight chart, and side-by-side photo comparator.
