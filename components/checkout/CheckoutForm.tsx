"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface Plan {
  name: string;
  price: number;
  period: string;
}

export function CheckoutForm({ plan, planId }: { plan: Plan; planId: string }) {
  const t = useTranslations("checkout");
  const countries = t.raw("countries") as string[];
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState({
    email: "",
    name: "",
    company: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    billingCountry: countries[0]
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
        <h3 className="mt-5 text-display-md font-semibold text-ink-900">{t("successTitle")}</h3>
        <p className="mt-3 text-[14px] text-ink-500 max-w-md mx-auto">
          {t("successDesc", { email: form.email })}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <a href="/" className="btn-ghost">{t("backHome")}</a>
          <a href="/track-analytics" className="btn-primary">{t("tryNow")}</a>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-10 text-center">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-ink-700" />
        <p className="mt-5 text-[15px] text-ink-700">{t("processing")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-6">
      <Section title={t("contactInfo")}>
        <Field label={t("fieldEmail")} required>
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
          <Field label={t("fieldName")} required>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t("fieldCompany")}>
            <input
              type="text"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </Section>

      <Section title={t("paymentInfo")} badge={<span className="text-[11px] text-ink-400 inline-flex items-center gap-1"><CreditCard className="h-3 w-3" /> {t("stripeStyle")}</span>}>
        <Field label={t("fieldCard")}>
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
          <Field label={t("fieldExpiry")}>
            <input
              type="text"
              value={form.cardExpiry}
              onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))}
              placeholder="MM / YY"
              maxLength={7}
              className="input ticker"
            />
          </Field>
          <Field label={t("fieldCvc")}>
            <input
              type="text"
              value={form.cardCvc}
              onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="input ticker"
            />
          </Field>
        </div>
        <Field label={t("fieldBilling")}>
          <select
            value={form.billingCountry}
            onChange={(e) => set("billingCountry", e.target.value)}
            className="input"
          >
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </Section>

      <button type="submit" className="btn-primary w-full">
        {t("submit", { price: plan.price.toLocaleString(), period: plan.period })}
      </button>

      <p className="text-[11px] text-ink-400 text-center">
        {t("demoNote")}
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
