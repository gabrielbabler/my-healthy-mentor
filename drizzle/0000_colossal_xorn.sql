CREATE TYPE "public"."diet_adherence" AS ENUM('on_plan', 'adjusted', 'off_plan');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('web', 'telegram');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."plan_source" AS ENUM('ai_generated', 'text_import', 'manual', 'proposal');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('diet', 'training');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."scheduled_job_type" AS ENUM('daily_digest', 'evening_checkin', 'weekly_reminder');--> statement-breakpoint
CREATE TYPE "public"."training_adherence" AS ENUM('done', 'rest', 'skipped');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allowlist_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"added_by_member_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "allowlist_entries_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "conversation_summaries" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"summary_text" text NOT NULL,
	"covered_until_message_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_summaries_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"date" date NOT NULL,
	"diet_adherence" "diet_adherence",
	"training_adherence" "training_adherence",
	"workout_override" jsonb,
	"daily_notes" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diet_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" "plan_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"daily_targets" jsonb NOT NULL,
	"meals" jsonb NOT NULL,
	"source" "plan_source" DEFAULT 'manual' NOT NULL,
	"activated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"age" integer,
	"biological_sex" text,
	"height_cm" integer,
	"current_weight_kg" numeric(5, 2),
	"target_weight_kg" numeric(5, 2),
	"primary_goal" text,
	"goal_details" jsonb DEFAULT '{}'::jsonb,
	"routine_details" jsonb DEFAULT '{}'::jsonb,
	"diet_preferences" jsonb DEFAULT '{}'::jsonb,
	"training_health_history" jsonb DEFAULT '{}'::jsonb,
	"communication_tone_note" text,
	"disclaimer_accepted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "health_profiles_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"timezone" text DEFAULT 'America/Sao_Paulo' NOT NULL,
	"telegram_chat_id" text,
	"digest_enabled" boolean DEFAULT true NOT NULL,
	"digest_time" text DEFAULT '07:00' NOT NULL,
	"evening_checkin_enabled" boolean DEFAULT true NOT NULL,
	"evening_checkin_time" text DEFAULT '21:00' NOT NULL,
	"weekly_checkin_enabled" boolean DEFAULT true NOT NULL,
	"weekly_checkin_weekday" integer DEFAULT 0 NOT NULL,
	"weekly_checkin_time" text DEFAULT '08:00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_telegram_chat_id_unique" UNIQUE("telegram_chat_id")
);
--> statement-breakpoint
CREATE TABLE "mentor_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"role" "message_role" NOT NULL,
	"channel" "message_channel" NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"plan_type" "plan_type" NOT NULL,
	"base_plan_id" text,
	"proposed_payload" jsonb NOT NULL,
	"summary_pt_br" text NOT NULL,
	"status" "proposal_status" DEFAULT 'pending' NOT NULL,
	"telegram_message_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "progress_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"checkin_id" text NOT NULL,
	"angle_label" text,
	"storage_path" text NOT NULL,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_dispatches" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"job_type" "scheduled_job_type" NOT NULL,
	"dispatch_date" date NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "telegram_bot_states" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"state" text DEFAULT 'idle' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"expires_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_bot_states_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "telegram_link_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"member_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_link_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "training_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" "plan_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"weekly_split" jsonb NOT NULL,
	"source" "plan_source" DEFAULT 'manual' NOT NULL,
	"activated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "weekly_checkins" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"checkin_date" date NOT NULL,
	"fasting_weight_kg" numeric(5, 2) NOT NULL,
	"waist_cm" numeric(5, 1),
	"notes" text,
	"ai_review_pt_br" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_members_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allowlist_entries" ADD CONSTRAINT "allowlist_entries_added_by_member_id_members_id_fk" FOREIGN KEY ("added_by_member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_summaries" ADD CONSTRAINT "conversation_summaries_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_profiles" ADD CONSTRAINT "health_profiles_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_messages" ADD CONSTRAINT "mentor_messages_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_proposals" ADD CONSTRAINT "plan_proposals_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_checkin_id_weekly_checkins_id_fk" FOREIGN KEY ("checkin_id") REFERENCES "public"."weekly_checkins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_dispatches" ADD CONSTRAINT "scheduled_dispatches_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_members_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_bot_states" ADD CONSTRAINT "telegram_bot_states_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_link_tokens" ADD CONSTRAINT "telegram_link_tokens_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_checkins" ADD CONSTRAINT "weekly_checkins_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversation_summaries_member_id_idx" ON "conversation_summaries" USING btree ("member_id");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_logs_member_date_uidx" ON "daily_logs" USING btree ("member_id","date");--> statement-breakpoint
CREATE INDEX "diet_plans_member_id_idx" ON "diet_plans" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "diet_plans_member_status_idx" ON "diet_plans" USING btree ("member_id","status");--> statement-breakpoint
CREATE INDEX "mentor_messages_member_id_idx" ON "mentor_messages" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "plan_proposals_member_id_idx" ON "plan_proposals" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "plan_proposals_member_status_idx" ON "plan_proposals" USING btree ("member_id","status");--> statement-breakpoint
CREATE INDEX "progress_photos_member_id_idx" ON "progress_photos" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "progress_photos_checkin_id_idx" ON "progress_photos" USING btree ("checkin_id");--> statement-breakpoint
CREATE UNIQUE INDEX "scheduled_dispatches_member_job_date_uidx" ON "scheduled_dispatches" USING btree ("member_id","job_type","dispatch_date");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "telegram_bot_states_member_id_idx" ON "telegram_bot_states" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "telegram_link_tokens_member_id_idx" ON "telegram_link_tokens" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "training_plans_member_id_idx" ON "training_plans" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "training_plans_member_status_idx" ON "training_plans" USING btree ("member_id","status");--> statement-breakpoint
CREATE INDEX "weekly_checkins_member_id_idx" ON "weekly_checkins" USING btree ("member_id");