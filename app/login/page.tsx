"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function LoginInner() {
  const search = useSearchParams();
  const redirect = search.get("redirect") ?? "/account";
  const urlError = search.get("error");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(
    urlError === "auth_not_configured"
      ? "登录服务暂不可用：当前部署缺少 Supabase 配置，请联系管理员。"
      : urlError === "missing_code"
        ? "登录链接无效或已过期，请重新发送。"
        : urlError
          ? decodeURIComponent(urlError)
          : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError(null);

    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (err) {
      setState("error");
      setError((err as Error).message);
      return;
    }

    const site =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${site}/auth/callback?redirect=${encodeURIComponent(redirect)}`
      }
    });

    if (error) {
      setState("error");
      setError(error.message);
    } else {
      setState("sent");
    }
  }

  return (
    <section className="min-h-[80vh] pt-28 pb-24">
      <div className="container max-w-md">
        <Link href="/" className="text-[13px] text-ink-500 hover:text-ink-700">
          ← 返回首页
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-10 shadow-glass">
          <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Sign in</p>
          <h1 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">
            登录 / 注册
          </h1>
          <p className="mt-3 text-[14px] text-ink-500 leading-relaxed">
            输入邮箱，我们会发送一条<strong className="text-ink-700">一次性登录链接</strong>。无密码，更安全。新邮箱注册即送 ¥1 试用额度。
          </p>

          {state === "sent" ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 text-[15px] font-semibold text-emerald-900">
                邮件已发送
              </h3>
              <p className="mt-2 text-[13px] text-emerald-800 leading-relaxed">
                请到 <strong>{email}</strong> 收件箱（包括垃圾邮件）查看登录链接，点击即可完成登录。
              </p>
              <button
                onClick={() => {
                  setState("idle");
                  setEmail("");
                }}
                className="mt-4 text-[13px] text-emerald-700 underline"
              >
                换一个邮箱
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-[12px] text-ink-500" htmlFor="email">
                  邮箱
                </label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={state === "sending"}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-ink-200 bg-white text-[14px] text-ink-900 placeholder:text-ink-400 focus:border-ink-700 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-2 items-start text-[12px] text-coral-600 bg-coral-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full btn-primary justify-center disabled:opacity-50"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    发送中…
                  </>
                ) : (
                  "发送登录链接"
                )}
              </button>

              <p className="text-[11px] text-ink-400 text-center pt-2">
                继续即表示同意{" "}
                <Link href="/about#terms" className="underline">
                  服务条款
                </Link>{" "}
                与{" "}
                <Link href="/about#privacy" className="underline">
                  隐私政策
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
