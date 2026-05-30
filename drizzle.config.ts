/**
 * drizzle-kit config — used only for `drizzle-kit generate` / `studio`.
 *
 * Production deploys do NOT run drizzle-kit; the canonical schema is
 * `lib/db/migrate.sql`, which the operator runs once in the Neon SQL editor.
 */
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.NETLIFY_DATABASE_URL ??
      process.env.DATABASE_URL ??
      ""
  }
} satisfies Config;
