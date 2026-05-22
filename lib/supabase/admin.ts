/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted server code:
 *   - Stripe webhook (crediting wallets)
 *   - lib/wallet.ts RPC wrappers
 * NEVER import this into a Client Component.
 */
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
