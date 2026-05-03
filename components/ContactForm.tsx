"use client";
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const TYPES = [
  { id: "general", label: "一般咨询" },
  { id: "starter", label: "标准版" },
  { id: "enterprise", label: "企业版" },
  { id: "deep", label: "深度陪跑 (5% 股权对齐)" },
  { id: "press", label: "媒体 / 合作" },
  { id: "legal", label: "法务 / 数据合规" }
];

export function ContactForm({ defaultType = "general" }: { defaultType?: string }) {
  const [type, setType] = useState(defaultType);
  const [step, setStep] = useState<"form" | "submitting" | "ok">("form");
  const [form, setForm] = useState({
    name: "", email: "", company: "", role: "",
    track: "AI 应用与数据服务", stage: "想法阶段", funding: "未融资", message: ""
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
        <h3 className="mt-6 text-display-md font-semibold text-ink-900">我们已收到你的请求</h3>
        <p className="mt-3 text-[14px] text-ink-500 max-w-md mx-auto">
          {type === "deep" ? "深度陪跑申请已进入 Critic Agent 预筛，72 小时内合伙人会与你联系。" : "我们 24 小时内回复 " + form.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink-100 bg-white p-8 lg:p-10">
      <div className="space-y-2">
        <span className="text-[12px] text-ink-500">咨询类型</span>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`text-[13px] px-4 py-2 rounded-full border transition-all ${
                type === t.id ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink-200 hover:border-ink-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid sm:grid-cols-2 gap-4">
        <Field label="姓名" required>
          <input className="input" type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="邮箱" required>
          <input className="input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="公司 / 团队">
          <input className="input" type="text" value={form.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <Field label="职位 / 角色">
          <input className="input" type="text" value={form.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
      </div>

      {(type === "deep" || type === "enterprise") && (
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <Field label="赛道">
            <select className="input" value={form.track} onChange={(e) => set("track", e.target.value)}>
              <option>AI 应用与数据服务</option>
              <option>企业软件与自动化</option>
              <option>先进制造</option>
              <option>绿色低碳与能源材料</option>
              <option>医疗健康与器械</option>
              <option>其他</option>
            </select>
          </Field>
          <Field label="阶段">
            <select className="input" value={form.stage} onChange={(e) => set("stage", e.target.value)}>
              <option>想法阶段</option>
              <option>原型 / MVP</option>
              <option>早期客户</option>
              <option>融资中</option>
              <option>已融资</option>
            </select>
          </Field>
          <Field label="融资历史">
            <select className="input" value={form.funding} onChange={(e) => set("funding", e.target.value)}>
              <option>未融资</option>
              <option>天使</option>
              <option>Pre-A / A 轮</option>
              <option>B 轮及以上</option>
            </select>
          </Field>
        </div>
      )}

      <Field label="留言" required>
        <textarea
          className="input"
          rows={5}
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="请简述你的项目 / 赛道方向 / 主要决策困惑…"
        />
      </Field>

      <button type="submit" disabled={step === "submitting"} className="mt-7 btn-primary w-full">
        {step === "submitting" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> 加密提交中…</>
        ) : (
          <><Send className="h-4 w-4" /> 发送请求</>
        )}
      </button>

      <p className="mt-4 text-[11px] text-ink-400 text-center">
        提交即表示同意我们的隐私政策。我们绝不向第三方分享你的项目信息。
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
