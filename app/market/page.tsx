import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight, TrendingUp, Building2, Globe2 } from "lucide-react";
import { StackedRevChart } from "@/components/charts/StackedRevChart";
import { BarChart } from "@/components/charts/BarChart";
import { AreaBandChart } from "@/components/charts/AreaBandChart";
import { Tornado } from "@/components/charts/Tornado";
import { Heatmap } from "@/components/charts/Heatmap";
import { HistogramChart } from "@/components/charts/HistogramChart";
import { PieChart } from "@/components/charts/PieChart";

export const metadata = { title: "市场与财务" };

export default function MarketPage() {
  const m = models.market;
  const pl = models.pl;
  const mc = models.mc;
  const fund = models.fund;
  const sens = models.sens;
  const prob = models.prob;

  const equityBand5y = fund.annual_exit_band.slice(0, 5).map((a) => ({
    year: a.year, p10: a.p10, p50: a.p50, p90: a.p90
  }));

  const tierData = [
    { name: "Tier-1", value: prob.tier_probabilities["Tier-1"] },
    { name: "Tier-2", value: prob.tier_probabilities["Tier-2"] },
    { name: "Tier-3", value: prob.tier_probabilities["Tier-3"] },
    { name: "Failure", value: prob.tier_probabilities["Failure"] }
  ];

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Market & Financials · 模型 01 / 04 / 05 / 06 / 07</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              全部数字 · <span className="text-gradient-gold">逐项可复算</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              市场口径、财务路径、概率分布、敏感性 · 每一张图都来自仓库里的 Python 脚本。投资人复现包包含全部 SEED、参数与中间数据。
            </p>
          </Reveal>
        </div>
      </section>

      {/* MARKET SIZE */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">TAM · SAM · SOM · 模型 01</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              先把<span className="text-gradient-blue">市场口径</span>说清楚。
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] text-ink-500">
              意向池：基于国家市场监督管理总局 2024 年新设企业 454.6 万户 + 广义创业意向（未注册创业者、个体户升级、连续创业、海外华人）合计约 12.3M 人。
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <MarketCard
              title="TAM · 深度分析年费池"
              data={m.tam_usd_mm_per_year}
              note={`意向池 × 付费转化率 × ARPU；ARPU 中 = $${m.anchor.arpu_usd_year.mid}/年`}
              icon={<Globe2 className="h-5 w-5" />}
            />
            <MarketCard
              title="SAM · 可服务市场"
              data={m.sam_usd_mm_per_year}
              note="TAM × 可服务比例 0.42 (语言/地域/合规)"
              icon={<Building2 className="h-5 w-5" />}
            />
            <MarketCard
              title="SOM · 第 5 年份额"
              data={m.som_year5_usd_mm}
              note="SAM × 份额情景 (低/中/高)"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">五年付费用户与现金收入路径 (中情景)</p>
              <div className="mt-4">
                <BarChart
                  data={m.five_year_path_mid as any}
                  xKey="year"
                  bars={[
                    { key: "subscription_revenue_mm", color: "#0A84FF", label: "订阅" },
                    { key: "deep_revenue_mm", color: "#C8A85A", label: "深度咨询" }
                  ]}
                  format="usd"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* P&L */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">P&L · 模型 07</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              五年损益 · 三元收入：<span className="text-gradient-gold">订阅 · 现金 · 股权</span>。
            </h2>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            <Reveal delay={0.05}>
              <div className="lg:col-span-7 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">收入构成 (USD M)</p>
                <StackedRevChart data={pl.revenue_breakdown as any} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="lg:col-span-5 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">5 年累计</p>
                <ul className="mt-5 space-y-3 text-[14px]">
                  <Row label="订阅累计" value={`$${pl.cumulative.subscription_5y_mm}M`} />
                  <Row label="现金咨询/B2B 累计" value={`$${pl.cumulative.cash_consulting_5y_mm}M`} />
                  <Row label="股权变现 (中位) 累计" value={`$${pl.cumulative.equity_exit_5y_mm}M`} />
                  <Row label="总收入" value={`$${pl.cumulative.total_5y_mm}M`} highlight />
                  <Row label="净利润 (税后)" value={`$${pl.cumulative.net_profit_5y_mm}M`} highlight />
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 overflow-x-auto">
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">逐年损益表</p>
              <table className="w-full mt-5 text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 text-ink-500">
                    <th className="text-left py-2 font-medium">年份</th>
                    <th className="py-2 font-medium">收入</th>
                    <th className="py-2 font-medium">OpEx</th>
                    <th className="py-2 font-medium">EBIT</th>
                    <th className="py-2 font-medium">税与其他</th>
                    <th className="py-2 font-medium">净利润</th>
                    <th className="py-2 font-medium">净利率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {pl.pl.map((p) => (
                    <tr key={p.year}>
                      <td className="py-3 font-medium text-ink-700">{p.year}</td>
                      <td className="py-3 ticker text-center">${p.revenue_mm}M</td>
                      <td className="py-3 ticker text-center">${p.opex_mm}M</td>
                      <td className="py-3 ticker text-center">${p.ebit_mm}M</td>
                      <td className="py-3 ticker text-center">${p.tax_and_other_mm}M</td>
                      <td className={`py-3 ticker text-center font-semibold ${p.net_profit_mm < 0 ? "text-red-600" : "text-emerald-600"}`}>
                        ${p.net_profit_mm}M
                      </td>
                      <td className="py-3 ticker text-center text-ink-700">{p.net_margin_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MONTE CARLO */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Monte Carlo · 模型 02 + 04</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              不确定性<span className="text-gradient-blue">不掩盖</span>——12K–30K 路径全部展示。
            </h2>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">第 5 年 ARR 分布 (USD M) · 20K 路径</p>
                <p className="mt-2 text-[12px] text-ink-400">
                  P10 = ${mc.arr_year5_distribution_usd_mm.p10}M · P50 = ${mc.arr_year5_distribution_usd_mm.p50}M · P90 = ${mc.arr_year5_distribution_usd_mm.p90}M
                </p>
                <div className="mt-4">
                  <HistogramChart
                    bins={mc.histogram as any}
                    p10={mc.arr_year5_distribution_usd_mm.p10}
                    p50={mc.arr_year5_distribution_usd_mm.p50}
                    p90={mc.arr_year5_distribution_usd_mm.p90}
                    color="#0A84FF"
                    xUnit="M"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">用户 NPV 改善 (千美元) · 智能 vs 随机基准</p>
                <p className="mt-2 text-[12px] text-ink-400">
                  中位 ${mc.user_npv_improvement_thousand_usd.median}K · P(改善&gt;0) = {(mc.user_npv_improvement_thousand_usd.prob_positive * 100).toFixed(1)}%
                </p>
                <div className="mt-4">
                  <HistogramChart
                    bins={mc.npv_histogram as any}
                    p50={mc.user_npv_improvement_thousand_usd.median}
                    color="#C8A85A"
                    xUnit="K"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="lg:col-span-2 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">5% 股权组合年度退出现金带 P10–P50–P90 · 12K 路径</p>
                <p className="mt-2 text-[12px] text-ink-400">
                  5 年累计中位 = ${fund.cumulative_5y_exit_median_usd_mm}M · 典型持股 {(fund.typical_stake * 100).toFixed(0)}% · 投后估值中位 ${fund.post_money_median_usd_mm}M · MOIC 中位 {fund.moic_median}x
                </p>
                <div className="mt-4">
                  <AreaBandChart data={equityBand5y} format="usd" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SUCCESS PROBABILITY */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Success Probability · 模型 05</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              项目成功概率分布 · <span className="text-gradient-gold">10 因子打分</span>。
            </h2>
            <p className="mt-3 text-[14px] text-ink-500 max-w-3xl">
              ≥ Tier-2 商业成功概率 = {(prob.geq_tier2_probability * 100).toFixed(2)}% · 存活 ≥ Tier-3 = {(prob.geq_tier3_probability * 100).toFixed(2)}%
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">结局分布</p>
                <div className="mt-4">
                  <PieChart data={tierData} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
                  {tierData.map((t, i) => (
                    <div key={t.name} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ background: ["#C8A85A", "#1D1D1F", "#0A84FF", "#A1A1A6"][i] }}
                      />
                      <span className="text-ink-600">{t.name}</span>
                      <span className="ml-auto ticker text-ink-700">{(t.value * 100).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">因子敏感性 · +10% 提升的边际贡献</p>
                <ul className="mt-4 space-y-2">
                  {prob.factor_sensitivity.slice(0, 8).map((f) => {
                    const max = prob.factor_sensitivity[0].delta;
                    const pct = (f.delta / max) * 100;
                    return (
                      <li key={f.factor} className="flex items-center gap-3">
                        <span className="w-32 text-[12px] text-ink-600 capitalize">{f.factor.replaceAll("_", " ")}</span>
                        <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent-gold to-[#E5CB7E]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-14 text-right text-[12px] ticker text-ink-700">+{(f.delta * 100).toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SENSITIVITY */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Sensitivity · 模型 06</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              基础 NPV = ${sens.base_npv_usd_mm}M · <span className="text-gradient-blue">敏感性 + 双因子热力图</span>
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              折现率 {(sens.discount_rate * 100).toFixed(0)}% · 创业 hurdle rate · 扣 45% (税+冗余) · Y0 初始投资 $-{sens.initial_investment_mm}M
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            <Reveal>
              <div className="lg:col-span-7 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">单因子龙卷风图</p>
                <div className="mt-4">
                  <Tornado items={sens.single_factor_tornado as any} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="lg:col-span-5 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">ARPU × 转化率 双因子热力</p>
                <div className="mt-4">
                  <Heatmap grid={sens.heatmap_arpu_x_conversion as any} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
            <h2 className="text-display-md font-semibold tracking-snug text-ink-900">所有计算 · 一行命令复算。</h2>
            <p className="mt-3 max-w-xl mx-auto text-ink-500">
              SEED = 20260501 · python models/run_all.py · JSON 输出 → 网站直接读取
            </p>
            <Link href="/contact?type=enterprise" className="mt-8 btn-primary inline-flex">
              申请投资人复现包 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MarketCard({
  title, data, note, icon
}: {
  title: string;
  data: { low: number; mid: number; high: number };
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">{icon}</span>
          <p className="text-[13px] font-semibold text-ink-700">{title}</p>
        </div>
        <div className="mt-6 space-y-2">
          <Tier label="低情景" value={data.low} />
          <Tier label="中情景" value={data.mid} highlight />
          <Tier label="高情景" value={data.high} />
        </div>
        <p className="mt-5 text-[12px] text-ink-400">{note}</p>
      </div>
    </Reveal>
  );
}

function Tier({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="text-ink-500">{label}</span>
      <span className={`ticker font-semibold ${highlight ? "text-gradient-gold" : "text-ink-700"}`}>${value}M</span>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <li className={`flex items-center justify-between py-2 ${highlight ? "border-t border-ink-200 pt-3 mt-2" : ""}`}>
      <span className="text-ink-500">{label}</span>
      <span className={`ticker font-semibold ${highlight ? "text-ink-900" : "text-ink-700"}`}>{value}</span>
    </li>
  );
}
