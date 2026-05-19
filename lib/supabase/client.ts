/**
 * Browser-side Supabase client for Client Components.
 * Use for sign-in/sign-up flows and any client-side auth interaction.
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
