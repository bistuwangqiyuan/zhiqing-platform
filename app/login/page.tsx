import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "登录 / 注册",
  description: "通过邮箱魔法链接登录智擎 PreFounder。新邮箱注册即送 ¥1 试用额度。"
};

export default function LoginPage() {
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

          <Suspense fallback={<div className="mt-8 h-32 animate-pulse rounded-2xl bg-ink-50" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
