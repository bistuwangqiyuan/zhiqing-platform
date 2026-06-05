"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function ContactForm({ defaultType = "general" }: { defaultType?: string }) {
  const t = useTranslations("contact");
  const TYPES = [
    { id: "general", label: t("typeGeneral") },
    { id: "starter", label: t("typeStarter") },
    { id: "enterprise", label: t("typeEnterprise") },
    { id: "deep", label: t("typeDeep") },
    { id: "press", label: t("typePress") },
    { id: "legal", label: t("typeLegal") }
  ];
  const tracks = t.raw("tracks") as string[];
  const stages = t.raw("stages") as string[];
  const fundings = t.raw("fundings") as string[];

  const [type, setType] = useState(defaultType);
  const [step, setStep] = useState<"form" | "submitting" | "ok">("form");
  const [form, setForm] = useState({
    name: "", email: "", company: "", role: "",
    track: tracks[0], stage: stages[0], funding: fundings[0], message: ""
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm({ ...form, [k]: v });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStep("submitting");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...form })
      });
    } catch {}
    setTimeout(() => setStep("ok"), 1000);
  }

  if (step === "ok") {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-12 text-center">
        <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600" />
        <h3 className="mt-6 text-display-md font-semibold text-ink-900">{t("okTitle")}</h3>
        <p className="mt-3 text-[14px] text-ink-500 max-w-md mx-auto">
          {type === "deep" ? t("okDeep") : t("okGeneral", { email: form.email })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink-100 bg-white p-8 lg:p-10">
      <div className="space-y-2">
        <span className="text-[12px] text-ink-500">{t("typeLabel")}</span>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((ty) => (
            <button
              key={ty.id}
              type="button"
              onClick={() => setType(ty.id)}
              className={`text-[13px] px-4 py-2 rounded-full border transition-all ${
                type === ty.id ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink-200 hover:border-ink-400"
              }`}
            >
              {ty.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid sm:grid-cols-2 gap-4">
        <Field label={t("fieldName")} required>
          <input className="input" type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label={t("fieldEmail")} required>
          <input className="input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label={t("fieldCompany")}>
          <input className="input" type="text" value={form.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <Field label={t("fieldRole")}>
          <input className="input" type="text" value={form.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
      </div>

      {(type === "deep" || type === "enterprise") && (
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <Field label={t("fieldTrack")}>
            <select className="input" value={form.track} onChange={(e) => set("track", e.target.value)}>
              {tracks.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label={t("fieldStage")}>
            <select className="input" value={form.stage} onChange={(e) => set("stage", e.target.value)}>
              {stages.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label={t("fieldFunding")}>
            <select className="input" value={form.funding} onChange={(e) => set("funding", e.target.value)}>
              {fundings.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      )}

      <Field label={t("fieldMessage")} required>
        <textarea
          className="input"
          rows={5}
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={t("messagePlaceholder")}
        />
      </Field>

      <button type="submit" disabled={step === "submitting"} className="mt-7 btn-primary w-full">
        {step === "submitting" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}</>
        ) : (
          <><Send className="h-4 w-4" /> {t("send")}</>
        )}
      </button>

      <p className="mt-4 text-[11px] text-ink-400 text-center">
        {t("agree")}
      </p>

      <style>{`
        .input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid #E8E8ED;
          background: #fff;
          font-size: 14px;
          color: #1D1D1F;
          transition: all 0.15s;
        }
        textarea.input { resize: vertical; min-height: 110px; }
        .input:focus {
          outline: none;
          border-color: #1D1D1F;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
      `}</style>
    </form>
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
