/**
 * One-off migration runner. NOT part of the app bundle.
 *
 * Usage:
 *   $env:MIGRATE_DB_URL="postgresql://..."; node scripts/apply-migration.mjs
 *
 * Applies lib/db/migrate.sql against the target Neon database using the
 * simple query protocol (handles dollar-quoted function bodies + multiple
 * statements in one round-trip). Idempotent: migrate.sql uses
 * CREATE TABLE IF NOT EXISTS / CREATE OR REPLACE FUNCTION.
 */
import { readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.MIGRATE_DB_URL;
if (!url) {
  console.error("MIGRATE_DB_URL env is required");
  process.exit(2);
}

const sql = await readFile(new URL("../lib/db/migrate.sql", import.meta.url), "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  console.log("connected, applying migrate.sql ...");
  await client.query(sql);
  console.log("migrate.sql applied OK");

  const tables = await client.query(
    `select table_name from information_schema.tables
       where table_schema='public' order by table_name`
  );
  console.log("public tables:", tables.rows.map((r) => r.table_name).join(", "));

  const fns = await client.query(
    `select proname from pg_proc
       where proname in ('debit_wallet','credit_wallet') order by proname`
  );
  console.log("functions:", fns.rows.map((r) => r.proname).join(", "));
} catch (e) {
  console.error("MIGRATION FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
