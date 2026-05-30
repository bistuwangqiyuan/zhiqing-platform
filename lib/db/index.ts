/**
 * Neon Postgres client wired through Drizzle ORM.
 *
 * Connection: NETLIFY_DATABASE_URL (auto-injected by the Netlify Neon
 * extension on production builds). For local dev, set DATABASE_URL.
 *
 * The HTTP driver is edge-compatible and connectionless — no pool to drain,
 * works inside Next.js middleware/route handlers running on Netlify Edge.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function resolveConnectionString(): string {
  const url =
    process.env.NETLIFY_DATABASE_URL ??
    process.env.DATABASE_URL ??
    process.env.NETLIFY_DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "Database not configured: set NETLIFY_DATABASE_URL (provided automatically by the Netlify Neon extension) or DATABASE_URL for local dev."
    );
  }
  return url;
}

let _client: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  _client = neon(resolveConnectionString());
  _db = drizzle(_client, { schema });
  return _db;
}

export function getSql(): NeonQueryFunction<false, false> {
  if (_client) return _client;
  _client = neon(resolveConnectionString());
  return _client;
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.NETLIFY_DATABASE_URL ||
      process.env.DATABASE_URL ||
      process.env.NETLIFY_DATABASE_URL_UNPOOLED
  );
}

export { schema };
