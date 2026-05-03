import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { models } from "@/lib/data";

export const metadata = { title: "产品" };

export default function ProductsPage() {
  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Products</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              三条产品线，<span className="text-gradient-gold">一致的判断标准</span>。
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] text-ink-500 leading-relaxed">
              启径标准版用于个人快速入门，企业版服务孵化器与园区，深度陪跑则与创始人共担长期估值与公司治理义务边界。
            </p>
          </Reveal>
        </div>
      </section>

      {/* STARTER */}
      <ProductSection
        id="starter"
        eyebrow="启径标准版 · STARTER"
        title="赛道比较 · BM Canvas · 政策时间轴"
        subtitle="低门槛，立即可用。10 分钟看清一个赛道的关键不确定性。"
        bullets={[
          "8 维赛道评分 + 蒙特卡洛排序稳健性",
          "BM Canvas 自动起稿（9 个画布块）",
          "政策时间轴 · 监管预警 · 可订阅推送",
          "竞品财务 proxy + 公开融资雷达",
          "可导出 PDF / Excel 一键尽调清单"
        ]}
        image="/images/product-dashboard.png"
        cta={[
          { href: "/pricing#starter", label: "查看定价" },
          { href: "/checkout?plan=starter", label: "立即订阅", primary: true }
        ]}
        align="left"
      />

      {/* ENTERPRISE */}
      <ProductSection
        id="enterprise"
        eyebrow="企业版 · ENTERPRISE"
        title="行业模型 · 路演材料 · 投后管理"
        subtitle="为孵化器、园区、精品 FA 提供可承载团队规模的赛前实验室。"
        bullets={[
          "多组织 / 多席位 SSO + 角色权限",
          "行业模型库（AI / 制造 / 医疗 / 绿能 / 企服）",
          "路演材料模板 + 自动数据包",
          "API 接入项目库 / CRM / 投决系统",
          "SLA 99.9% + 专属客户成功"
        ]}
        image="/images/growth-city.png"
        align="right"
        cta={[
          { href: "/contact?type=enterprise", label: "申请试用" },
          { href: "/pricing#enterprise", label: "定价方案", primary: true }
        ]}
      />

      {/* DEEP PROGRAM */}
      <ProductSection
        id="deep-program"
        eyebrow="深度陪跑 · DEEP PROGRAM"
        title="商业计划书 / 可行性研究 + 约 5% 股权"
        subtitle="为已有创业意向的核心团队定制：完整尽调 + 法务结构化的换股安排。"
        dark
        bullets={[
          "60–120 页商业计划书 / 可行性研究报告",
          "法务结构：增资 / 转让 / 顾问换股 任选其一",
          `12,000 路径蒙特卡洛 · 典型 ${models.fund.typical_stake * 100}% 持股 · 中位投后估值 $${models.fund.post_money_median_usd_mm}M`,
          "投后管理：复盘节点、董事观察席（可选）",
          "约定锁定期 / 信息披露 / 反稀释保护"
        ]}
        image="/images/product-report.png"
        cta={[
          { href: "/contact?type=deep", label: "预约创始人会议", primary: true },
          { href: "/cases", label: "查看陪跑案例" }
        ]}
        align="left"
      />

      {/* COMPARISON TABLE */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Compare</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              一张表，看清三条产品线的<span className="text-gradient-blue">承诺与边界</span>。
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-4 px-5 font-semibold text-ink-700">能力</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">启径标准版</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">企业版</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">深度陪跑</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {COMPARE.map((row) => (
                    <tr key={row.label} className="hover:bg-ink-50/50 transition-colors">
                      <td className="py-3 px-5 text-ink-700">{row.label}</td>
                      <Cell value={row.starter} />
                      <Cell value={row.enterprise} />
                      <Cell value={row.deep} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-900 to-ink-700 text-white p-12 text-center">
              <Sparkles className="h-6 w-6 mx-auto text-accent-gold" />
              <h2 className="mt-4 text-display-md font-semibold tracking-snug">还在犹豫赛道？让数据告诉你。</h2>
              <p className="mt-3 max-w-xl mx-auto text-white/70">
                30 秒注册，免费体验 5 大赛道的蒙特卡洛排序稳健性。
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/track-analytics" className="btn-gold">
                  体验赛道引擎 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-ghost border-white/30 text-white hover:bg-white/10">
                  预约 1:1 顾问
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ProductSection({
  id, eyebrow, title, subtitle, bullets, image, cta, align = "left", dark = false
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string;
  cta: { href: string; label: string; primary?: boolean }[];
  align?: "left" | "right";
  dark?: boolean;
}) {
  return (
    <section id={id} className={`section ${dark ? "bg-ink-900 text-white" : ""}`}>
      <div className="container">
        <div className={`grid lg:grid-cols-12 gap-10 items-center ${align === "right" ? "lg:[&>:first-child]:order-2" : ""}`}>
          <div className="lg:col-span-6">
            <Reveal>
              <p className={`text-[12px] tracking-[0.18em] uppercase ${dark ? "text-white/60" : "text-ink-500"}`}>{eyebrow}</p>
              <h2 className={`mt-3 text-display-lg font-semibold tracking-snug ${dark ? "text-white" : "text-ink-900"}`}>{title}</h2>
              <p className={`mt-4 text-[16px] ${dark ? "text-white/70" : "text-ink-500"}`}>{subtitle}</p>
              <ul className="mt-8 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className={`flex gap-3 ${dark ? "text-white/85" : "text-ink-700"}`}>
                    <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 ${dark ? "text-accent-gold" : "text-emerald-600"}`} />
                    <span className="text-[14px]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                {cta.map((c) => (
                  <Link
                    key={c.label}
                    href={c.href}
                    className={c.primary ? (dark ? "btn-gold" : "btn-primary") : (dark ? "btn-ghost border-white/30 text-white hover:bg-white/10" : "btn-ghost")}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-elevated border border-ink-100/40">
                <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const COMPARE = [
  { label: "赛道比较 + BM Canvas", starter: true, enterprise: true, deep: true },
  { label: "政策时间轴 + 监管预警", starter: true, enterprise: true, deep: true },
  { label: "竞品财务 proxy", starter: true, enterprise: true, deep: true },
  { label: "蒙特卡洛 (1K 路径)", starter: true, enterprise: "12K 路径", deep: "30K 路径" },
  { label: "API 接入 / SSO", starter: false, enterprise: true, deep: true },
  { label: "行业模型库", starter: false, enterprise: true, deep: true },
  { label: "60-120 页 BP / 可行性报告", starter: false, enterprise: "可加购", deep: true },
  { label: "投后顾问 / 董事观察席", starter: false, enterprise: false, deep: true },
  { label: "5% 股权对齐", starter: false, enterprise: false, deep: true },
  { label: "审计留痕 / 投资人复现包", starter: false, enterprise: true, deep: true }
];

function Cell({ value }: { value: any }) {
  if (value === true) return <td className="py-3 px-5 text-center text-emerald-600">✓</td>;
  if (value === false) return <td className="py-3 px-5 text-center text-ink-300">—</td>;
  return <td className="py-3 px-5 text-center text-ink-700 text-[12px]">{value}</td>;
}
