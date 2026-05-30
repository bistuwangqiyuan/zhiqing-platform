"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "loading" | "anon" | "auth" | "misconfigured";

export function HeaderAuthLink({
  variant = "desktop"
}: {
  variant?: "desktop" | "mobile";
}) {
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setMode("misconfigured");
      return;
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setMode(user ? "auth" : "anon");
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setMode(session?.user ? "auth" : "anon");
    });
    return () => subscription.unsubscribe();
  }, []);

  const desktopCls =
    "rounded-full bg-ink-900 text-white text-[13px] px-4 py-1.5 font-medium hover:bg-ink-700 transition-colors";
  const mobileCls = "btn-primary flex-1 justify-center";
  const cls = variant === "desktop" ? desktopCls : mobileCls;

  if (mode === "loading") {
    return <span className={cls + " opacity-50 pointer-events-none"}>…</span>;
  }
  if (mode === "anon" || mode === "misconfigured") {
    // Even when Supabase isn't wired up we still show "登录" so the layout looks right;
    // the /login page itself surfaces the misconfiguration.
    return (
      <Link href="/login" className={cls}>
        登录
      </Link>
    );
  }
  return (
    <Link href="/account" className={cls}>
      我的账户
    </Link>
  );
}
