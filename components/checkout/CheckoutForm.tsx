"use client";
import { useState } from "react";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface Plan {
  name: string;
  price: number;
  period: string;
}

export function CheckoutForm({ plan, planId }: { plan: Plan; planId: string }) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState({
    email: "",
    name: "",
    company: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    billingCountry: "中国"
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm({ ...form, [k]: v });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, email: form.email, name: form.name, company: form.company })
      });
      await res.json();
      setTimeout(() => setStep("success"), 1200);
    } catch {
      setStep("form");
    }
  }

  if (step === "success") {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-600" />
        <h3 className="mt-5 text-display-md font-semibold text-ink-900">订阅创建成功</h3>
        <p className="mt-3 text-[14px] text-ink-500 max-w-md mx-auto">
          我们已向 {form.email} 发送了登录链接。7 天免费试用已激活。
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <a href="/" className="btn-ghost">返回首页</a>
          <a href="/track-analytics" className="btn-primary">立即体验</a>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-10 text-center">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-ink-700" />
        <p className="mt-5 text-[15px] text-ink-700">正在加密提交至支付网关…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-6">
      <Section title="联系信息">
        <Field label="邮箱" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="founder@yourdomain.com"
            className="input"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="姓名" required>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="公司 / 团队 (可选)">
            <input
              type="text"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </Section>

      <Section title="支付信息" badge={<span className="text-[11px] text-ink-400 inline-flex items-center gap-1"><CreditCard className="h-3 w-3" /> Stripe 风格</span>}>
        <Field label="卡号">
          <input
            type="text"
            value={form.cardNumber}
            onChange={(e) => set("cardNumber", formatCard(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="input ticker"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="到期日">
            <input
              type="text"
              value={form.cardExpiry}
              onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))}
              placeholder="MM / YY"
              maxLength={7}
              className="input ticker"
            />
          </Field>
          <Field label="CVC">
            <input
              type="text"
              value={form.cardCvc}
              onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="input ticker"
            />
          </Field>
        </div>
        <Field label="账单地区">
          <select
            value={form.billingCountry}
            onChange={(e) => set("billingCountry", e.target.value)}
            className="input"
          >
            <option>中国</option>
            <option>香港 SAR</option>
            <option>新加坡</option>
            <option>美国</option>
            <option>英国</option>
            <option>德国</option>
            <option>日本</option>
          </select>
        </Field>
      </Section>

      <button type="submit" className="btn-primary w-full">
        开始 7 天免费试用 · ${plan.price.toLocaleString()} / {plan.period} 起
      </button>

      <p className="text-[11px] text-ink-400 text-center">
        本演示环境不会向真实卡片扣款；表单使用 Stripe 同等加密提交规则。
      </p>

      <style>{`
        .input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid #E8E8ED;
          background: #fff;
          font-size: 14px;
          color: #1D1D1F;
          transition: all 0.15s;
        }
        .input:focus {
          outline: none;
          border-color: #1D1D1F;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
      `}</style>
    </form>
  );
}

function Section({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[13px] font-semibold text-ink-900 tracking-snug">{title}</h3>
        {badge}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[12px] text-ink-500">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function formatCard(v: string) {
  return v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return d.slice(0, 2) + " / " + d.slice(2);
}
