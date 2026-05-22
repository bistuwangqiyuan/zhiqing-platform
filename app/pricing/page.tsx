import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Check, Sparkles } from "lucide-react";

export const metadata = { title: "定价" };

const PLANS = [
  {
    id: "starter",
    name: "启径标准版",
    eyebrow: "STARTER",
    price: 39,
    period: "/月",
    annualPrice: 396,
    desc: "适合个人创业者与小团队，10 分钟看清一个赛道。",
    features: [
      "8 维赛道评分 + 1K 路径排序",
      "BM Canvas 自动起稿",
      "政策时间轴 + 每周推送",
      "竞品 proxy + 公开融资雷达",
      "一键导出 PDF / Excel",
      "邮件支持"
    ],
    cta: { href: "/account", label: "充值开始使用" },
    accent: "from-accent-azure/10 to-transparent"
  },
  {
    id: "enterprise",
    name: "企业版",
    eyebrow: "ENTERPRISE",
    price: 1880,
    period: "/月起",
    annualPrice: 18960,
    desc: "孵化器、园区、精品 FA 的赛前实验室，含 SLA 与企业治理对接。",
    features: [
      "10 席位起 (可扩展至 200+)",
      "12K 路径蒙特卡洛",
      "行业模型库 (5 大赛道)",
      "API 接入 + SSO + 角色权限",
      "路演材料模板 + 自动数据包",
      "SLA 99.9% + 专属客户成功"
    ],
    cta: { href: "/contact?type=enterprise", label: "联系商务团队" },
    highlighted: true,
    accent: "from-accent-gold/15 to-transparent"
  },
  {
    id: "deep",
    name: "深度陪跑",
    eyebrow: "DEEP PROGRAM",
    price: 38000,
    period: " 起",
    annualPrice: null,
    desc: "完整尽调 + 法务结构化的换股安排，与平台报酬深度对齐项目长期估值。",
    features: [
      "60–120 页 BP / 可行性研究报告",
      "30K 路径 + 反向情景论证",
      "约 5% 股权对齐 (法务结构定制)",
      "投后管理与复盘节点",
      "董事观察席 (可选)",
      "投资人复现包"
    ],
    cta: { href: "/contact?type=deep", label: "申请创始人会议" },
    accent: "from-violet-500/10 to-transparent"
  }
];

const FAQS = [
  {
    q: "标准版与企业版的最大区别？",
    a: "标准版面向个人独立决策；企业版支持多席位 SSO、API 接入、行业模型库与 SLA，适合机构需要在团队内协作。"
  },
  {
    q: "5% 股权条款是否强制？",
    a: "完全自愿。深度陪跑可选择「纯付费」或「付费 + 5% 股权对齐」。股权方案适用于希望长期合作并承担相互义务的核心团队。"
  },
  {
    q: "是否提供退款？",
    a: "标准版 7 天无理由退款；企业版按合同约定（一般为按月退款）；深度陪跑则按里程碑交付，未交付部分可协议退还。"
  },
  {
    q: "海外客户如何付款？",
    a: "支持 Stripe (USD / EUR / GBP / SGD)、企业对公汇款、加密货币 (USDT)。深度陪跑可定制双币种账户。"
  },
  {
    q: "数据安全？",
    a: "所有用户数据加密存储 (AES-256)，按地域部署 (中国 / 新加坡 / 法兰克福)。支持私有化部署 (企业版以上)。"
  }
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Pricing</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              透明 · <span className="text-gradient-gold">可预算</span> · 与你利益对齐。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              三档清晰：低门槛订阅、企业级合作、深度陪跑（可选股权对齐）。所有方案均含 7 天免费试用与发票。
            </p>
            <div className="mt-8 rounded-2xl border border-accent-gold/40 bg-amber-50/60 p-5 max-w-3xl">
              <p className="text-[13px] text-ink-700 leading-relaxed">
                <strong>个人按量付费？</strong> 注册即送 ¥1 试用额度，按 <strong>LLM token 成本 × 1.1</strong> 实时扣减。
                支持<strong>支付宝 / 微信支付</strong>充值。 → <Link href="/account" className="underline text-ink-900 hover:text-accent-gold">前往 /account</Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <div
                  id={p.id}
                  className={`relative h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
                    p.highlighted
                      ? "border-2 border-accent-gold bg-gradient-to-br from-white to-amber-50/40 shadow-elevated"
                      : "border border-ink-100 bg-white hover:shadow-elevated"
                  }`}
                >
                  <div className={`absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br ${p.accent} blur-3xl pointer-events-none`} />
                  <div className="relative">
                    {p.highlighted && (
                      <span className="absolute -top-4 right-0 text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-accent-gold text-ink-900 font-semibold">
                        最受欢迎
                      </span>
                    )}
                    <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500">{p.eyebrow}</p>
                    <h3 className="mt-2 text-display-md font-semibold text-ink-900 tracking-snug">{p.name}</h3>
                    <p className="mt-3 text-[14px] text-ink-500 min-h-[42px]">{p.desc}</p>
                    <div className="mt-7 flex items-baseline gap-1">
                      <span className="text-display-lg font-semibold text-ink-900 tracking-tightest">
                        ${p.price.toLocaleString()}
                      </span>
                      <span className="text-[14px] text-ink-500">{p.period}</span>
                    </div>
                    {p.annualPrice && (
                      <p className="text-[12px] text-ink-400 mt-1">
                        年付 ${p.annualPrice.toLocaleString()}（约 8.3 折）
                      </p>
                    )}
                    <Link href={p.cta.href} className={`mt-7 w-full ${p.highlighted ? "btn-gold" : "btn-primary"}`}>
                      {p.cta.label}
                    </Link>
                    <ul className="mt-7 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-[14px] text-ink-700">
                          <Check className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">FAQ</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug">常见问题</h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-2xl border border-ink-100 bg-white p-6 hover:shadow-glass transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-[15px] font-semibold text-ink-900">{f.q}</span>
                    <span className="text-ink-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-[14px] text-ink-500 leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 to-ink-700 text-white p-12 text-center">
              <Sparkles className="h-6 w-6 mx-auto text-accent-gold" />
              <h2 className="mt-4 text-display-md font-semibold tracking-snug">不确定哪个方案？</h2>
              <p className="mt-3 text-white/70 max-w-xl mx-auto">
                15 分钟方案咨询 · 我们与你一起决定
              </p>
              <Link href="/contact" className="mt-8 btn-gold">预约咨询</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
