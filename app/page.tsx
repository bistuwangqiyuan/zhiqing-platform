import Link from "next/link";
import Image from "next/image";
import { models } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Layers, Telescope, BarChart3, Quote } from "lucide-react";
import { StackedRevChart } from "@/components/charts/StackedRevChart";

export default function Home() {
  const tam = models.market.tam_usd_mm_per_year.mid;
  const arrP50 = models.mc.arr_year5_distribution_usd_mm.p50;
  const npvImp = models.mc.user_npv_improvement_thousand_usd.median;
  const probTier2 = models.prob.geq_tier2_probability;
  const cum5y = models.pl.cumulative;

  return (
    <>
      {/* HERO */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ink-50 via-white to-white" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] parallax-orb opacity-70" />
          <div className="absolute inset-0 bg-dot opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
        </div>

        <div className="container relative">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-ink-500">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
              Pre-Founder Intelligent Decision Platform
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-display-2xl font-semibold tracking-tightest text-ink-900 leading-[0.95] max-w-5xl">
              在你点燃第一笔资金之前，<br />
              先<span className="text-gradient-gold">点亮</span>你的判断。
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-500">
              智擎 PreFounder 以多智能体工作流与可验证数据源，服务尚未注册公司、但已严肃考虑创业的群体——在投入资金与时间之前，完成赛道比较、商业模式画布、竞争格局、监管与情景压力测试。
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/track-analytics" className="btn-primary">
                体验赛道分析引擎
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="btn-ghost">
                查看产品
              </Link>
              <Link href="/contact" className="hidden sm:inline-flex items-center gap-1 text-[14px] text-ink-600 hover:text-ink-900 transition-colors">
                预约深度陪跑
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-20 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image
                src="/images/hero-orb.png"
                alt="智擎 PreFounder 多智能体决策网络"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="text-white/95">
                  <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">Multi-Agent Reasoning Mesh</p>
                  <p className="mt-1 text-display-md font-semibold">12 Agents · 8 Layers · 9 Models</p>
                </div>
                <Link href="/technology" className="hidden md:inline-flex items-center gap-1 text-[13px] text-white/90 hover:text-white">
                  查看技术架构
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* KEY METRICS */}
      <section className="section relative">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">
              Quantified Outcomes · 模型输出
            </p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 max-w-3xl tracking-snug">
              不止漂亮的故事——所有数据来自<span className="text-gradient-gold">可复现的 Python 模型</span>。
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-ink-500">
              SEED 20260501 · 9 个独立模型 · 12,000–30,000 蒙特卡洛路径 · 对照《商业计划书 v3.0》原始数据。
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              eyebrow="TAM · 中情景"
              value={tam}
              prefix="$"
              suffix="M / 年"
              decimals={0}
              caption="深度分析年费池 · 模型 01"
            />
            <MetricCard
              eyebrow="ARR · 第 5 年中位"
              value={arrP50}
              prefix="$"
              suffix="M"
              decimals={1}
              caption="20K 路径蒙特卡洛 · 模型 04"
            />
            <MetricCard
              eyebrow="≥ Tier-2 商业成功"
              value={probTier2 * 100}
              suffix="%"
              decimals={2}
              caption="30K 路径成功率 · 模型 05"
            />
            <MetricCard
              eyebrow="用户 NPV 改善 · 中位"
              value={npvImp}
              prefix="$"
              suffix="K"
              decimals={1}
              caption="智能排序 vs 随机基准 · 模型 04"
            />
            <MetricCard
              eyebrow="5 年累计收入"
              value={cum5y.total_5y_mm}
              prefix="$"
              suffix="M"
              decimals={1}
              caption="订阅 + 现金 + 中位股权变现 · 模型 02+07"
            />
            <MetricCard
              eyebrow="5 年累计净利"
              value={cum5y.net_profit_5y_mm}
              prefix="$"
              suffix="M"
              decimals={1}
              caption="税后口径 · 模型 07"
            />
            <MetricCard
              eyebrow="股权变现 · 5 年中位"
              value={cum5y.equity_exit_5y_mm}
              prefix="$"
              suffix="M"
              decimals={1}
              caption="12K 路径 · 5% 持股 · 模型 02"
            />
            <MetricCard
              eyebrow="NPV @ 35% 创业 hurdle"
              value={models.sens.base_npv_usd_mm}
              prefix="$"
              suffix="M"
              decimals={1}
              caption="保守口径 · 模型 06"
            />
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Why ZhiQing</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              三个支柱，重新定义<span className="text-gradient-blue">创业前决策</span>。
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <Pillar
              icon={<Layers className="h-5 w-5" />}
              title="结构化"
              desc="从赛道雷达到商业模式画布——一致的「假设—证据—结论」链条。每一项判断都可追溯、可审计、可复盘。"
              accent="from-accent-gold/30 to-accent-gold/0"
            />
            <Pillar
              icon={<Telescope className="h-5 w-5" />}
              title="智能体协作"
              desc="多 Agent 分工：产业研究、竞品财务 proxy、政策扫描、访谈提纲与尽调清单——并行检索、相互证伪。"
              accent="from-accent-azure/30 to-accent-azure/0"
            />
            <Pillar
              icon={<BarChart3 className="h-5 w-5" />}
              title="可量化"
              desc="情景与敏感性：价格、获客成本、监管事件对你模型的冲击——12,000+ 蒙特卡洛路径还原不确定性。"
              accent="from-emerald-500/30 to-emerald-500/0"
            />
          </div>
        </div>
      </section>

      {/* PRODUCT TRIO SHOWCASE */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Product Lines</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              三条产品线，对应三种<span className="text-gradient-gold">决策深度</span>。
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-12 gap-6">
            <ProductCard
              cls="md:col-span-7 row-span-2"
              eyebrow="深度陪跑 · DEEP PROGRAM"
              title="商业计划书 / 可行性研究 + 约 5% 股权"
              desc="为已有创业意向的核心团队定制：完整尽调、法务结构化的换股安排，与平台报酬深度对齐项目长期估值。"
              cta={{ href: "/products#deep-program", label: "了解深度陪跑" }}
              image="/images/product-report.png"
              dark
              tall
            />
            <ProductCard
              cls="md:col-span-5"
              eyebrow="启径标准版 · STARTER"
              title="赛道比较 · BM Canvas · 政策时间轴"
              desc="个人与小团队的 SaaS 订阅，低门槛，立即可用。"
              cta={{ href: "/products", label: "查看标准版" }}
              image="/images/product-dashboard.png"
            />
            <ProductCard
              cls="md:col-span-5"
              eyebrow="企业版 · ENTERPRISE"
              title="行业模型 · 路演材料 · 投后管理"
              desc="孵化器、园区、精品 FA 的赛前实验室，含 SLA 与企业治理对接。"
              cta={{ href: "/products#enterprise", label: "查看企业版" }}
              image="/images/growth-city.png"
            />
          </div>
        </div>
      </section>

      {/* REVENUE PREVIEW */}
      <section className="section bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-accent-gold/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-accent-azure/20 to-transparent blur-3xl" />
        </div>
        <div className="container relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">Five-Year Trajectory</p>
                <h2 className="mt-3 text-display-lg font-semibold tracking-snug">
                  三元收入：订阅 · 现金咨询 · <span className="text-gradient-gold">5% 股权变现</span>。
                </h2>
                <p className="mt-5 text-[15px] text-white/70 max-w-md">
                  我们不靠故事——靠保守口径：未实现的账面估值不入收入；只有依法登记的股权退出现金才计入基础情形损益。
                </p>
                <div className="mt-8 flex gap-3">
                  <Link href="/market" className="btn-gold">
                    查看完整财务模型
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="bg-white/95 text-ink-700 rounded-2xl p-6 shadow-elevated">
                  <p className="text-[12px] text-ink-500">USD M · 五年路径 · 模型 02 + 07</p>
                  <StackedRevChart data={models.pl.revenue_breakdown as any} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / TESTIMONIAL */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal>
              <div>
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">合规与防线</p>
                <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug">
                  五道防线，<span className="text-gradient-blue">把风险写在合同里</span>。
                </h2>
                <ul className="mt-8 space-y-5">
                  {[
                    { title: "数据回溯链", desc: "每一条结论都可追溯至原始证据片段（产业报告、政策文件、财报、专利）。" },
                    { title: "Critic Agent 反向证伪", desc: "由独立智能体对主智能体输出做反向论证，识别幸存者偏差与共谋错误。" },
                    { title: "审计留痕", desc: "提示词、模型版本、温度、检索片段全量留痕，可向投资人、监管复现。" },
                    { title: "内容安全过滤", desc: "对照《生成式人工智能服务管理暂行办法》，输出风险标签与不可解释性提示。" },
                    { title: "股权法律框架", desc: "5% 股权采用增资 / 转让 / 顾问换股标准条款，价格、锁定期、信息披露逐项列明。" }
                  ].map((it) => (
                    <li key={it.title} className="flex gap-4">
                      <ShieldCheck className="h-5 w-5 mt-0.5 text-accent-gold flex-shrink-0" />
                      <div>
                        <p className="text-[15px] font-semibold text-ink-700">{it.title}</p>
                        <p className="mt-1 text-[14px] text-ink-500">{it.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-4">
                <Quotes
                  text="智擎 PreFounder 是我见过最严肃的创业前决策工具。它不是替你做决定——它把你不愿面对的反向情景，逐个写在你眼前。"
                  author="陆嘉辰"
                  role="某 SaaS 创始人 · A 轮 8000 万美元"
                />
                <Quotes
                  text="把 12,000 条蒙特卡洛路径直接给到投委会，节省了我们至少 60% 的尽调时间。"
                  author="张维"
                  role="某美元基金合伙人"
                />
                <Quotes
                  text="比起做一份漂亮的 BP，他们更愿意先告诉我「这个赛道为什么不该做」。这就是为什么我签了深度陪跑。"
                  author="Maria L."
                  role="医疗器械连续创业者"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-b from-white to-ink-50">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center shadow-elevated">
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Take the Decision Seriously</p>
              <h2 className="mt-3 text-display-xl font-semibold tracking-tightest text-ink-900">
                把判断 · 留给数据。
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-[16px] text-ink-500">
                注册即可使用启径标准版；签署 NDA 后，我们会与你共同设计赛道压力测试与商业模式画布。
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/pricing" className="btn-primary">
                  立即开始
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-gold">
                  预约深度陪跑
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function MetricCard({
  eyebrow, value, prefix, suffix, decimals = 0, caption
}: {
  eyebrow: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
}) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-glass hover:shadow-elevated transition-all duration-500 hover:-translate-y-0.5">
        <p className="text-[11px] tracking-[0.18em] uppercase text-ink-400">{eyebrow}</p>
        <p className="mt-3 text-display-md font-semibold text-ink-900 tracking-tightest">
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </p>
        <p className="mt-3 text-[12px] text-ink-500">{caption}</p>
      </div>
    </Reveal>
  );
}

function Pillar({
  icon, title, desc, accent
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <Reveal>
      <div className={`relative rounded-3xl bg-white border border-ink-100 p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 group overflow-hidden`}>
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${accent} blur-3xl opacity-80 group-hover:opacity-100 transition-opacity`} />
        <div className="relative">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
            {icon}
          </span>
          <h3 className="mt-6 text-display-md font-semibold text-ink-900 tracking-snug">{title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

function ProductCard({
  cls = "", eyebrow, title, desc, cta, image, dark, tall
}: {
  cls?: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { href: string; label: string };
  image: string;
  dark?: boolean;
  tall?: boolean;
}) {
  return (
    <Reveal>
      <Link
        href={cta.href}
        className={`relative block rounded-3xl overflow-hidden group ${cls} ${tall ? "min-h-[460px]" : "min-h-[300px]"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
        />
        <div className={`absolute inset-0 ${dark ? "bg-gradient-to-t from-black/85 via-black/40 to-black/15" : "bg-gradient-to-t from-black/75 via-black/30 to-transparent"}`} />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
          <p className="text-[11px] tracking-[0.18em] uppercase text-white/70">{eyebrow}</p>
          <h3 className="mt-2 text-display-md font-semibold tracking-snug max-w-md">{title}</h3>
          <p className="mt-3 text-[14px] text-white/80 max-w-md">{desc}</p>
          <span className="mt-5 inline-flex items-center gap-1 text-[13px] text-white/95 group-hover:text-white">
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function Quotes({ text, author, role }: { text: string; author: string; role: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500">
      <Quote className="h-5 w-5 text-accent-gold" />
      <p className="mt-4 text-[16px] leading-relaxed text-ink-700">{text}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-ink-300 to-ink-700" />
        <div>
          <p className="text-[13px] font-semibold text-ink-700">{author}</p>
          <p className="text-[12px] text-ink-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
