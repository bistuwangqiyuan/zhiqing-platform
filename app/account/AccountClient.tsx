"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  Loader2,
  Sparkles,
  LogOut,
  History,
  Settings
} from "lucide-react";
import { formatMicroCny } from "@/lib/pricing";

type Tx = {
  id: string;
  kind: "signup_grant" | "topup" | "debit" | "refund" | "adjust";
  amount_micro: number;
  balance_after: number;
  ref: string | null;
  created_at: string;
};

const KIND_LABEL: Record<Tx["kind"], string> = {
  signup_grant: "注册赠送",
  topup: "充值",
  debit: "调用扣费",
  refund: "退款",
  adjust: "余额调整"
};

const KIND_ICON: Record<Tx["kind"], typeof Gift> = {
  signup_grant: Gift,
  topup: ArrowUpCircle,
  debit: ArrowDownCircle,
  refund: ArrowUpCircle,
  adjust: Settings
};

export function AccountClient({
  email,
  balanceMicro,
  transactions,
  topupPackages
}: {
  email: string;
  balanceMicro: number;
  transactions: Tx[];
  topupPackages: { id: string; label: string }[];
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  async function topup(id: string) {
    setBusyId(id);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topup_id: id })
      });
      const data = await r.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error ?? "充值会话创建失败");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function tryAi() {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          messages: [
            { role: "user", content: "用一句话介绍智擎 PreFounder。" }
          ],
          max_tokens: 200
        })
      });
      const data = await r.json();
      if (!r.ok) {
        setTestResult(`错误：${data.error ?? r.statusText}`);
        return;
      }
      const text = data.content?.[0]?.text ?? "(空)";
      setTestResult(
        text +
          `\n\n— 本次计费 ${formatMicroCny(
            data.charged_micro
          )}（含 10% 加价），调用后余额 ${formatMicroCny(data.balance_micro)}`
      );
      setTimeout(() => location.reload(), 1500);
    } catch (e) {
      setTestResult(`错误：${(e as Error).message}`);
    } finally {
      setTesting(false);
    }
  }

  const lowBalance = balanceMicro < 1_000_000;

  return (
    <section className="pt-28 pb-24">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">
              Account
            </p>
            <h1 className="mt-2 text-display-md font-semibold text-ink-900 tracking-snug">
              我的账户
            </h1>
            <p className="mt-2 text-[13px] text-ink-500">{email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 text-[13px] text-ink-500 hover:text-ink-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>

        {/* 余额 + 试调用 */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 to-ink-700 text-white p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-gold/20 blur-3xl" />
            <Wallet className="h-6 w-6 text-accent-gold relative" />
            <p className="mt-4 text-[12px] tracking-[0.18em] uppercase text-white/60 relative">
              当前余额
            </p>
            <p className="mt-2 text-display-xl font-semibold tracking-tightest relative">
              {formatMicroCny(balanceMicro)}
            </p>
            <p className="mt-3 text-[13px] text-white/70 relative">
              每次调用按 LLM 真实成本 × 1.1 扣减。
              {lowBalance && (
                <strong className="text-accent-gold"> 余额偏低，建议充值。</strong>
              )}
            </p>
          </div>

          <div className="rounded-3xl border border-ink-100 bg-white p-6">
            <Sparkles className="h-5 w-5 text-accent-gold" />
            <h3 className="mt-3 text-[15px] font-semibold text-ink-900">试调用</h3>
            <p className="mt-1 text-[12px] text-ink-500">
              用 Haiku 调一次，验证全链路计费。
            </p>
            <button
              onClick={tryAi}
              disabled={testing || balanceMicro <= 0}
              className="mt-4 w-full btn-primary justify-center disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> 调用中…
                </>
              ) : (
                "开始试调用"
              )}
            </button>
            {balanceMicro <= 0 && (
              <p className="mt-2 text-[11px] text-coral-600">
                余额为 0，请先充值。
              </p>
            )}
            {testResult && (
              <pre className="mt-3 text-[11px] text-ink-600 whitespace-pre-wrap bg-ink-50 p-3 rounded-lg max-h-48 overflow-auto">
                {testResult}
              </pre>
            )}
          </div>
        </div>

        {/* 充值 */}
        <div className="mt-12">
          <h2 className="text-[18px] font-semibold text-ink-900">充值</h2>
          <p className="mt-1 text-[13px] text-ink-500">
            支持 <strong>支付宝</strong>、<strong>微信支付</strong>、信用卡（通过 Stripe）。无赠送、无折扣，充什么到账什么。
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {topupPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => topup(pkg.id)}
                disabled={busyId !== null}
                className="rounded-2xl border border-ink-100 bg-white p-6 text-left hover:border-accent-gold hover:shadow-elevated transition-all disabled:opacity-50"
              >
                <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500">
                  Top up
                </p>
                <p className="mt-2 text-display-md font-semibold text-ink-900">
                  {pkg.label}
                </p>
                <p className="mt-1 text-[12px] text-ink-500">
                  支付宝 / 微信 / 信用卡
                </p>
                {busyId === pkg.id && (
                  <Loader2 className="mt-3 h-4 w-4 animate-spin text-ink-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 流水 */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-ink-700" />
            <h2 className="text-[18px] font-semibold text-ink-900">最近流水</h2>
          </div>
          {transactions.length === 0 ? (
            <p className="mt-3 text-[13px] text-ink-500">暂无流水。</p>
          ) : (
            <div className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
              {transactions.map((tx) => {
                const Icon = KIND_ICON[tx.kind];
                const isIn = tx.amount_micro >= 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isIn
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-coral-50 text-coral-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-ink-900">
                          {KIND_LABEL[tx.kind]}
                        </p>
                        <p className="text-[11px] text-ink-500">
                          {new Date(tx.created_at).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-[14px] font-semibold ${
                          isIn ? "text-emerald-600" : "text-ink-900"
                        }`}
                      >
                        {isIn ? "+" : "−"}
                        {formatMicroCny(Math.abs(tx.amount_micro))}
                      </p>
                      <p className="text-[11px] text-ink-400">
                        余额 {formatMicroCny(tx.balance_after)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
