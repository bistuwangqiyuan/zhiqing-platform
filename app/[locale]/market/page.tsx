import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "market" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;
const blue = (chunks: React.ReactNode) => <span className="text-gradient-blue">{chunks}</span>;

export default function MarketPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("market");
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

  const tierLabels = { low: t("tierLow"), mid: t("tierMid"), high: t("tierHigh") };

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              {t.rich("title", { gold })}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* MARKET SIZE */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("sizeEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("sizeTitle", { blue })}
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] text-ink-500">
              {t("sizeDesc")}
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <MarketCard
              title={t("tamTitle")}
              data={m.tam_usd_mm_per_year}
              note={t("tamNote", { arpu: m.anchor.arpu_usd_year.mid })}
              icon={<Globe2 className="h-5 w-5" />}
              tierLabels={tierLabels}
            />
            <MarketCard
              title={t("samTitle")}
              data={m.sam_usd_mm_per_year}
              note={t("samNote")}
              icon={<Building2 className="h-5 w-5" />}
              tierLabels={tierLabels}
            />
            <MarketCard
              title={t("somTitle")}
              data={m.som_year5_usd_mm}
              note={t("somNote")}
              icon={<TrendingUp className="h-5 w-5" />}
              tierLabels={tierLabels}
            />
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6">
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("barTitle")}</p>
              <div className="mt-4">
                <BarChart
                  data={m.five_year_path_mid as any}
                  xKey="year"
                  bars={[
                    { key: "subscription_revenue_mm", color: "#0A84FF", label: t("barSub") },
                    { key: "deep_revenue_mm", color: "#C8A85A", label: t("barDeep") }
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
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("plEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("plTitle", { gold })}
            </h2>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            <Reveal delay={0.05}>
              <div className="lg:col-span-7 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("revBreakdown")}</p>
                <StackedRevChart
                  data={pl.revenue_breakdown as any}
                  labels={{ subscription: t("revLabelSub"), cash: t("revLabelCash"), equity: t("revLabelEquity") }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="lg:col-span-5 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("cum5y")}</p>
                <ul className="mt-5 space-y-3 text-[14px]">
                  <Row label={t("rowSubCum")} value={`$${pl.cumulative.subscription_5y_mm}M`} />
                  <Row label={t("rowCashCum")} value={`$${pl.cumulative.cash_consulting_5y_mm}M`} />
                  <Row label={t("rowEquityCum")} value={`$${pl.cumulative.equity_exit_5y_mm}M`} />
                  <Row label={t("rowTotal")} value={`$${pl.cumulative.total_5y_mm}M`} highlight />
                  <Row label={t("rowNet")} value={`$${pl.cumulative.net_profit_5y_mm}M`} highlight />
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 overflow-x-auto">
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("plTableTitle")}</p>
              <table className="w-full mt-5 text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 text-ink-500">
                    <th className="text-left py-2 font-medium">{t("thYear")}</th>
                    <th className="py-2 font-medium">{t("thRevenue")}</th>
                    <th className="py-2 font-medium">{t("thOpex")}</th>
                    <th className="py-2 font-medium">{t("thEbit")}</th>
                    <th className="py-2 font-medium">{t("thTax")}</th>
                    <th className="py-2 font-medium">{t("thNet")}</th>
                    <th className="py-2 font-medium">{t("thMargin")}</th>
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
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("mcEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("mcTitle", { blue })}
            </h2>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("arrTitle")}</p>
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
                    pathsLabel={t("histPaths")}
                    freqLabel={t("histFreq")}
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("npvTitle")}</p>
                <p className="mt-2 text-[12px] text-ink-400">
                  {t("npvSub", {
                    median: mc.user_npv_improvement_thousand_usd.median,
                    prob: (mc.user_npv_improvement_thousand_usd.prob_positive * 100).toFixed(1)
                  })}
                </p>
                <div className="mt-4">
                  <HistogramChart
                    bins={mc.npv_histogram as any}
                    p50={mc.user_npv_improvement_thousand_usd.median}
                    color="#C8A85A"
                    xUnit="K"
                    pathsLabel={t("histPaths")}
                    freqLabel={t("histFreq")}
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="lg:col-span-2 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("equityTitle")}</p>
                <p className="mt-2 text-[12px] text-ink-400">
                  {t("equitySub", {
                    cum: fund.cumulative_5y_exit_median_usd_mm,
                    stake: (fund.typical_stake * 100).toFixed(0),
                    postMoney: fund.post_money_median_usd_mm,
                    moic: fund.moic_median
                  })}
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
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("probEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("probTitle", { gold })}
            </h2>
            <p className="mt-3 text-[14px] text-ink-500 max-w-3xl">
              {t("probSub", {
                tier2: (prob.geq_tier2_probability * 100).toFixed(2),
                tier3: (prob.geq_tier3_probability * 100).toFixed(2)
              })}
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("outcomeTitle")}</p>
                <div className="mt-4">
                  <PieChart data={tierData} tooltipLabel={t("pieTooltip")} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
                  {tierData.map((td, i) => (
                    <div key={td.name} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ background: ["#C8A85A", "#1D1D1F", "#0A84FF", "#A1A1A6"][i] }}
                      />
                      <span className="text-ink-600">{td.name}</span>
                      <span className="ml-auto ticker text-ink-700">{(td.value * 100).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("factorTitle")}</p>
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
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("sensEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("sensTitle", { blue, npv: sens.base_npv_usd_mm })}
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              {t("sensSub", { rate: (sens.discount_rate * 100).toFixed(0), init: sens.initial_investment_mm })}
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            <Reveal>
              <div className="lg:col-span-7 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("tornadoTitle")}</p>
                <div className="mt-4">
                  <Tornado items={sens.single_factor_tornado as any} note={t("tornadoNote")} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="lg:col-span-5 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("heatmapTitle")}</p>
                <div className="mt-4">
                  <Heatmap grid={sens.heatmap_arpu_x_conversion as any} header={t("heatmapHeader")} note={t("heatmapNote")} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
            <h2 className="text-display-md font-semibold tracking-snug text-ink-900">{t("ctaTitle")}</h2>
            <p className="mt-3 max-w-xl mx-auto text-ink-500">
              {t("ctaDesc")}
            </p>
            <Link href="/contact?type=enterprise" className="mt-8 btn-primary inline-flex">
              {t("ctaBtn")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MarketCard({
  title, data, note, icon, tierLabels
}: {
  title: string;
  data: { low: number; mid: number; high: number };
  note: string;
  icon: React.ReactNode;
  tierLabels: { low: string; mid: string; high: string };
}) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">{icon}</span>
          <p className="text-[13px] font-semibold text-ink-700">{title}</p>
        </div>
        <div className="mt-6 space-y-2">
          <Tier label={tierLabels.low} value={data.low} />
          <Tier label={tierLabels.mid} value={data.mid} highlight />
          <Tier label={tierLabels.high} value={data.high} />
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
