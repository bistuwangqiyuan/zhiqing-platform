/**
 * Browser-side Supabase client for Client Components.
 * Use for sign-in/sign-up flows and any client-side auth interaction.
 *
 * Throws a clear error when env vars are missing instead of letting Supabase
 * surface a confusing one (the previous behaviour leaked through to the user).
 */
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase 未配置：请在部署平台 (Netlify) 添加 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量"
    );
  }
  return createBrowserClient(url, key);
}
