import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const memberRoleEnum = pgEnum("member_role", ["admin", "member"]);
export const planStatusEnum = pgEnum("plan_status", [
  "draft",
  "active",
  "archived",
]);
export const planSourceEnum = pgEnum("plan_source", [
  "ai_generated",
  "text_import",
  "manual",
  "proposal",
]);
export const planTypeEnum = pgEnum("plan_type", ["diet", "training"]);
export const proposalStatusEnum = pgEnum("proposal_status", [
  "pending",
  "approved",
  "rejected",
]);
export const dietAdherenceEnum = pgEnum("diet_adherence", [
  "on_plan",
  "adjusted",
  "off_plan",
]);
export const trainingAdherenceEnum = pgEnum("training_adherence", [
  "done",
  "rest",
  "skipped",
]);
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);
export const messageChannelEnum = pgEnum("message_channel", [
  "web",
  "telegram",
]);
export const scheduledJobTypeEnum = pgEnum("scheduled_job_type", [
  "daily_digest",
  "evening_checkin",
  "weekly_reminder",
]);

/**
 * Canonical Member table (also backs Better Auth's user model).
 */
export const members = pgTable("members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: memberRoleEnum("role").notNull().default("member"),
  timezone: text("timezone").notNull().default("America/Sao_Paulo"),
  telegramChatId: text("telegram_chat_id").unique(),
  digestEnabled: boolean("digest_enabled").notNull().default(true),
  digestTime: text("digest_time").notNull().default("07:00"),
  eveningCheckinEnabled: boolean("evening_checkin_enabled")
    .notNull()
    .default(true),
  eveningCheckinTime: text("evening_checkin_time").notNull().default("21:00"),
  weeklyCheckinEnabled: boolean("weekly_checkin_enabled")
    .notNull()
    .default(true),
  weeklyCheckinWeekday: integer("weekly_checkin_weekday").notNull().default(0), // 0 = Sunday
  weeklyCheckinTime: text("weekly_checkin_time").notNull().default("08:00"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const allowlistEntries = pgTable("allowlist_entries", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  addedByMemberId: text("added_by_member_id").references(() => members.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const telegramLinkTokens = pgTable(
  "telegram_link_tokens",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("telegram_link_tokens_member_id_idx").on(table.memberId)]
);

export const telegramBotStates = pgTable(
  "telegram_bot_states",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .unique()
      .references(() => members.id, { onDelete: "cascade" }),
    state: text("state").notNull().default("idle"),
    payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("telegram_bot_states_member_id_idx").on(table.memberId)]
);

export const healthProfiles = pgTable("health_profiles", {
  id: text("id").primaryKey(),
  memberId: text("member_id")
    .notNull()
    .unique()
    .references(() => members.id, { onDelete: "cascade" }),
  age: integer("age"),
  biologicalSex: text("biological_sex"),
  heightCm: integer("height_cm"),
  currentWeightKg: numeric("current_weight_kg", { precision: 5, scale: 2 }),
  targetWeightKg: numeric("target_weight_kg", { precision: 5, scale: 2 }),
  primaryGoal: text("primary_goal"),
  goalDetails: jsonb("goal_details").$type<Record<string, unknown>>().default({}),
  routineDetails: jsonb("routine_details")
    .$type<Record<string, unknown>>()
    .default({}),
  dietPreferences: jsonb("diet_preferences")
    .$type<Record<string, unknown>>()
    .default({}),
  trainingHealthHistory: jsonb("training_health_history")
    .$type<Record<string, unknown>>()
    .default({}),
  communicationToneNote: text("communication_tone_note"),
  disclaimerAcceptedAt: timestamp("disclaimer_accepted_at", {
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dietPlans = pgTable(
  "diet_plans",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    version: integer("version").notNull().default(1),
    status: planStatusEnum("status").notNull().default("draft"),
    title: text("title").notNull(),
    dailyTargets: jsonb("daily_targets")
      .$type<Record<string, unknown>>()
      .notNull(),
    meals: jsonb("meals").$type<Array<Record<string, unknown>>>().notNull(),
    source: planSourceEnum("source").notNull().default("manual"),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("diet_plans_member_id_idx").on(table.memberId),
    index("diet_plans_member_status_idx").on(table.memberId, table.status),
  ]
);

export const trainingPlans = pgTable(
  "training_plans",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    version: integer("version").notNull().default(1),
    status: planStatusEnum("status").notNull().default("draft"),
    title: text("title").notNull(),
    weeklySplit: jsonb("weekly_split")
      .$type<Record<string, unknown>>()
      .notNull(),
    source: planSourceEnum("source").notNull().default("manual"),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("training_plans_member_id_idx").on(table.memberId),
    index("training_plans_member_status_idx").on(table.memberId, table.status),
  ]
);

export const planProposals = pgTable(
  "plan_proposals",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    planType: planTypeEnum("plan_type").notNull(),
    basePlanId: text("base_plan_id"),
    proposedPayload: jsonb("proposed_payload")
      .$type<Record<string, unknown>>()
      .notNull(),
    summaryPtBr: text("summary_pt_br").notNull(),
    status: proposalStatusEnum("status").notNull().default("pending"),
    telegramMessageId: text("telegram_message_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("plan_proposals_member_id_idx").on(table.memberId),
    index("plan_proposals_member_status_idx").on(table.memberId, table.status),
  ]
);

export const dailyLogs = pgTable(
  "daily_logs",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    dietAdherence: dietAdherenceEnum("diet_adherence"),
    trainingAdherence: trainingAdherenceEnum("training_adherence"),
    workoutOverride: jsonb("workout_override").$type<Record<string, unknown>>(),
    dailyNotes: jsonb("daily_notes")
      .$type<Array<Record<string, unknown>>>()
      .default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("daily_logs_member_date_uidx").on(table.memberId, table.date),
  ]
);

export const weeklyCheckins = pgTable(
  "weekly_checkins",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    checkinDate: date("checkin_date").notNull(),
    fastingWeightKg: numeric("fasting_weight_kg", {
      precision: 5,
      scale: 2,
    }).notNull(),
    waistCm: numeric("waist_cm", { precision: 5, scale: 1 }),
    notes: text("notes"),
    aiReviewPtBr: text("ai_review_pt_br"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("weekly_checkins_member_id_idx").on(table.memberId)]
);

export const progressPhotos = pgTable(
  "progress_photos",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    checkinId: text("checkin_id")
      .notNull()
      .references(() => weeklyCheckins.id, { onDelete: "cascade" }),
    angleLabel: text("angle_label"),
    storagePath: text("storage_path").notNull(),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("progress_photos_member_id_idx").on(table.memberId),
    index("progress_photos_checkin_id_idx").on(table.checkinId),
  ]
);

export const mentorMessages = pgTable(
  "mentor_messages",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    channel: messageChannelEnum("channel").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("mentor_messages_member_id_idx").on(table.memberId)]
);

export const conversationSummaries = pgTable(
  "conversation_summaries",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .unique()
      .references(() => members.id, { onDelete: "cascade" }),
    summaryText: text("summary_text").notNull(),
    coveredUntilMessageId: text("covered_until_message_id"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("conversation_summaries_member_id_idx").on(table.memberId)]
);

export const scheduledDispatches = pgTable(
  "scheduled_dispatches",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    jobType: scheduledJobTypeEnum("job_type").notNull(),
    dispatchDate: date("dispatch_date").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("scheduled_dispatches_member_job_date_uidx").on(
      table.memberId,
      table.jobType,
      table.dispatchDate
    ),
  ]
);
