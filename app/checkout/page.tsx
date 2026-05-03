import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export const metadata = { title: "结账" };

const PLAN_INFO: Record<string, { name: string; price: number; period: string; eyebrow: string; sub: string }> = {
  starter: { name: "启径标准版", price: 39, period: "月", eyebrow: "STARTER", sub: "包含 8 维赛道评分 + BM Canvas + 政策推送" },
  enterprise: { name: "企业版", price: 1880, period: "月", eyebrow: "ENTERPRISE", sub: "10 席位起 + 12K 路径 + API + SLA" }
};

export default function CheckoutPage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = PLAN_INFO[searchParams?.plan ?? "starter"] ?? PLAN_INFO.starter;

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <Link href="/pricing" className="text-[13px] text-ink-500 hover:text-ink-700">← 返回定价</Link>
            <h1 className="mt-4 text-display-lg font-semibold text-ink-900 tracking-snug">完成订阅</h1>
            <p className="mt-2 text-[14px] text-ink-500">7 天免费试用 · 随时取消</p>

            <CheckoutForm plan={plan} planId={searchParams?.plan ?? "starter"} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500">{plan.eyebrow}</p>
                <h3 className="mt-2 text-headline font-semibold text-ink-900">{plan.name}</h3>
                <p className="mt-2 text-[13px] text-ink-500">{plan.sub}</p>

                <div className="mt-6 pt-6 border-t border-ink-100 space-y-3 text-[14px]">
                  <Row label="订阅" value={`$${plan.price.toLocaleString()} / ${plan.period}`} />
                  <Row label="试用" value="前 7 天免费" />
                  <Row label="今日支付" value="$0.00" highlight />
                </div>

                <div className="mt-6 pt-6 border-t border-ink-100 space-y-3 text-[12px] text-ink-500">
                  <p className="inline-flex gap-2 items-center"><Lock className="h-3.5 w-3.5" /> Stripe 加密支付 · PCI-DSS 一级认证</p>
                  <p className="inline-flex gap-2 items-center"><ShieldCheck className="h-3.5 w-3.5" /> 30 天无理由退款 · 7 天免费试用</p>
                  <p className="inline-flex gap-2 items-center"><Sparkles className="h-3.5 w-3.5" /> 试用期内可随时取消，不收取任何费用</p>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-ink-400 text-center">
                继续即表示同意 <Link href="/about#terms" className="underline">服务条款</Link> 与 <Link href="/about#privacy" className="underline">隐私政策</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${highlight ? "pt-3 border-t border-ink-100 font-semibold text-ink-900" : "text-ink-600"}`}>
      <span>{label}</span>
      <span className="ticker">{value}</span>
    </div>
  );
}
