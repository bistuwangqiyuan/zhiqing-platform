/**
 * Drizzle schema for Neon Postgres (auto-provisioned by the Netlify Neon
 * extension; connection string injected via NETLIFY_DATABASE_URL).
 *
 * Layout:
 *   - Auth.js v5 standard tables: users / accounts / sessions / verification_tokens
 *   - App tables:                 wallets / transactions / ai_calls
 *
 * All money is integer micro_cny (1 CNY = 1,000,000 micro_cny). Matches
 * lib/pricing.ts. Timestamps are timestamptz.
 *
 * Compatible with @auth/drizzle-adapter `pg` schema.
 */
import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  bigint,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
  uuid
} from "drizzle-orm/pg-core";

// ---------- Auth.js v5 tables ----------

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", withTimezone: true }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull()
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] })
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull()
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull()
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] })
  })
);

// ---------- App tables ----------

export const txKindEnum = pgEnum("tx_kind", [
  "signup_grant",
  "topup",
  "debit",
  "refund",
  "adjust"
]);

export const wallets = pgTable("wallet", {
  userId: text("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balanceMicro: bigint("balance_micro", { mode: "number" })
    .notNull()
    .default(0),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull()
});

export const transactions = pgTable(
  "transaction",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: txKindEnum("kind").notNull(),
    amountMicro: bigint("amount_micro", { mode: "number" }).notNull(),
    balanceAfter: bigint("balance_after", { mode: "number" }).notNull(),
    ref: text("ref"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (t) => ({
    refUniq: uniqueIndex("transaction_ref_uniq").on(t.ref),
    userCreatedIdx: index("transaction_user_created_idx").on(
      t.userId,
      t.createdAt
    )
  })
);

export const aiCalls = pgTable(
  "ai_call",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    costMicro: bigint("cost_micro", { mode: "number" }).notNull().default(0),
    chargedMicro: bigint("charged_micro", { mode: "number" })
      .notNull()
      .default(0),
    status: text("status").notNull(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (a) => ({
    userCreatedIdx: index("ai_call_user_created_idx").on(a.userId, a.createdAt)
  })
);

export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type AiCall = typeof aiCalls.$inferSelect;
