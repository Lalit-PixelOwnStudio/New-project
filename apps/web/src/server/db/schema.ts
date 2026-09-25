import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const ts = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });
const now = () => ts("created_at").notNull().defaultNow();

/* ---------------------------- Better Auth core ---------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: now(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: ts("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: now(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: ts("access_token_expires_at"),
    refreshTokenExpiresAt: ts("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: now(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: ts("expires_at").notNull(),
  createdAt: now(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

/* -------------------------------- Commerce -------------------------------- */

/** One checkout attempt. Fulfilment is idempotent on the provider's order id. */
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    product: text("product").notNull(),
    styleId: text("style_id"),
    provider: text("provider").notNull(),
    providerOrderId: text("provider_order_id").notNull(),
    providerPaymentId: text("provider_payment_id"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    country: text("country"),
    status: text("status").notNull().default("created"),
    createdAt: now(),
    paidAt: ts("paid_at"),
  },
  (t) => [uniqueIndex("orders_provider_order_idx").on(t.provider, t.providerOrderId), index("orders_user_idx").on(t.userId)],
);

/** Pro access for a period. Buying again extends from the current end date. */
export const passes = pgTable(
  "passes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => orders.id),
    startsAt: ts("starts_at").notNull(),
    endsAt: ts("ends_at").notNull(),
    createdAt: now(),
  },
  (t) => [index("passes_user_idx").on(t.userId)],
);

/** Page credits: positive from page packs, negative when spent. */
export const creditLedger = pgTable(
  "credit_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    orderId: text("order_id").references(() => orders.id),
    createdAt: now(),
  },
  (t) => [index("credit_user_idx").on(t.userId)],
);

export const styleUnlocks = pgTable(
  "style_unlocks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    styleId: text("style_id").notNull(),
    orderId: text("order_id").references(() => orders.id),
    createdAt: now(),
  },
  (t) => [uniqueIndex("style_unlock_idx").on(t.userId, t.styleId)],
);

/* ------------------------------- Product use ------------------------------ */

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    settings: jsonb("settings").notNull(),
    createdAt: now(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [index("documents_user_idx").on(t.userId, t.updatedAt)],
);

/** Pages exported, for daily limits. Guests are tracked by an anonymous cookie id. */
export const exportLog = pgTable(
  "export_log",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    anonId: text("anon_id"),
    pages: integer("pages").notNull(),
    creditsUsed: integer("credits_used").notNull().default(0),
    dpi: integer("dpi").notNull(),
    createdAt: now(),
  },
  (t) => [index("export_user_idx").on(t.userId, t.createdAt), index("export_anon_idx").on(t.anonId, t.createdAt)],
);

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  type: text("type").notNull(),
  payload: jsonb("payload").notNull(),
  processedAt: ts("processed_at").default(sql`now()`),
});

/** People who want the business API; contacted when it opens. */
export const waitlist = pgTable("waitlist", {
  email: text("email").primaryKey(),
  company: text("company"),
  useCase: text("use_case"),
  volume: text("volume"),
  createdAt: now(),
});

/**
 * Ratings and comments left after a download or on /feedback. Holds the
 * settings used (hand, paper, pages…), never the text that was written.
 */
export const feedback = pgTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    rating: integer("rating").notNull(),
    message: text("message"),
    email: text("email"),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    anonId: text("anon_id"),
    context: jsonb("context"),
    createdAt: now(),
  },
  (t) => [index("feedback_created_idx").on(t.createdAt), index("feedback_anon_idx").on(t.anonId, t.createdAt)],
);
