import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { models } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Layers, Telescope, BarChart3, Quote } from "lucide-react";
import { StackedRevChart } from "@/components/charts/StackedRevChart";

const gold = (chunks: React.ReactNode) => (
  <span className="text-gradient-gold">{chunks}</span>
);
const blue = (chunks: React.ReactNode) => (
  <span className="text-gradient-blue">{chunks}</span>
);
const br = () => <br />;

export default function Home() {
  const t = useTranslations("home");
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
              {t("heroBadge")}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-display-2xl font-semibold tracking-tightest text-ink-900 leading-[0.95] max-w-5xl">
              {t.rich("heroTitle", { gold, br })}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-500">
              {t("heroSubtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/track-analytics" className="btn-primary">
                {t("heroCtaTrack")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="btn-ghost">
                {t("heroCtaProducts")}
              </Link>
              <Link href="/contact" className="hidden sm:inline-flex items-center gap-1 text-[14px] text-ink-600 hover:text-ink-900 transition-colors">
                {t("heroCtaDeep")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-20 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image
                src="/images/hero-orb.png"
                alt={t("heroAlt")}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="text-white/95">
                  <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">{t("heroMeshEyebrow")}</p>
                  <p className="mt-1 text-display-md font-semibold">{t("heroMeshTitle")}</p>
                </div>
                <Link href="/technology" className="hidden md:inline-flex items-center gap-1 text-[13px] text-white/90 hover:text-white">
                  {t("heroViewTech")}
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
              {t("metricsEyebrow")}
            </p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 max-w-3xl tracking-snug">
              {t.rich("metricsTitle", { gold })}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-ink-500">
              {t("metricsSubtitle")}
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard eyebrow={t("m1Eyebrow")} value={tam} prefix="$" suffix={t("m1Suffix")} decimals={0} caption={t("m1Caption")} />
            <MetricCard eyebrow={t("m2Eyebrow")} value={arrP50} prefix="$" suffix={t("m2Suffix")} decimals={1} caption={t("m2Caption")} />
            <MetricCard eyebrow={t("m3Eyebrow")} value={probTier2 * 100} suffix={t("m3Suffix")} decimals={2} caption={t("m3Caption")} />
            <MetricCard eyebrow={t("m4Eyebrow")} value={npvImp} prefix="$" suffix={t("m4Suffix")} decimals={1} caption={t("m4Caption")} />
            <MetricCard eyebrow={t("m5Eyebrow")} value={cum5y.total_5y_mm} prefix="$" suffix={t("m5Suffix")} decimals={1} caption={t("m5Caption")} />
            <MetricCard eyebrow={t("m6Eyebrow")} value={cum5y.net_profit_5y_mm} prefix="$" suffix={t("m6Suffix")} decimals={1} caption={t("m6Caption")} />
            <MetricCard eyebrow={t("m7Eyebrow")} value={cum5y.equity_exit_5y_mm} prefix="$" suffix={t("m7Suffix")} decimals={1} caption={t("m7Caption")} />
            <MetricCard eyebrow={t("m8Eyebrow")} value={models.sens.base_npv_usd_mm} prefix="$" suffix={t("m8Suffix")} decimals={1} caption={t("m8Caption")} />
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("pillarsEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("pillarsTitle", { blue })}
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            <Pillar icon={<Layers className="h-5 w-5" />} title={t("pillar1Title")} desc={t("pillar1Desc")} accent="from-accent-gold/30 to-accent-gold/0" />
            <Pillar icon={<Telescope className="h-5 w-5" />} title={t("pillar2Title")} desc={t("pillar2Desc")} accent="from-accent-azure/30 to-accent-azure/0" />
            <Pillar icon={<BarChart3 className="h-5 w-5" />} title={t("pillar3Title")} desc={t("pillar3Desc")} accent="from-emerald-500/30 to-emerald-500/0" />
          </div>
        </div>
      </section>

      {/* PRODUCT TRIO SHOWCASE */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("linesEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("linesTitle", { gold })}
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-12 gap-6">
            <ProductCard
              cls="md:col-span-7 row-span-2"
              eyebrow={t("lineDeepEyebrow")}
              title={t("lineDeepTitle")}
              desc={t("lineDeepDesc")}
              cta={{ href: "/products#deep-program", label: t("lineDeepCta") }}
              image="/images/product-report.png"
              dark
              tall
            />
            <ProductCard
              cls="md:col-span-5"
              eyebrow={t("lineStarterEyebrow")}
              title={t("lineStarterTitle")}
              desc={t("lineStarterDesc")}
              cta={{ href: "/products", label: t("lineStarterCta") }}
              image="/images/product-dashboard.png"
            />
            <ProductCard
              cls="md:col-span-5"
              eyebrow={t("lineEntEyebrow")}
              title={t("lineEntTitle")}
              desc={t("lineEntDesc")}
              cta={{ href: "/products#enterprise", label: t("lineEntCta") }}
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
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">{t("revEyebrow")}</p>
                <h2 className="mt-3 text-display-lg font-semibold tracking-snug">
                  {t.rich("revTitle", { gold })}
                </h2>
                <p className="mt-5 text-[15px] text-white/70 max-w-md">
                  {t("revDesc")}
                </p>
                <div className="mt-8 flex gap-3">
                  <Link href="/market" className="btn-gold">
                    {t("revCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="bg-white/95 text-ink-700 rounded-2xl p-6 shadow-elevated">
                  <p className="text-[12px] text-ink-500">{t("revChartCaption")}</p>
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
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("trustEyebrow")}</p>
                <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug">
                  {t.rich("trustTitle", { blue })}
                </h2>
                <ul className="mt-8 space-y-5">
                  {[
                    { title: t("defense1Title"), desc: t("defense1Desc") },
                    { title: t("defense2Title"), desc: t("defense2Desc") },
                    { title: t("defense3Title"), desc: t("defense3Desc") },
                    { title: t("defense4Title"), desc: t("defense4Desc") },
                    { title: t("defense5Title"), desc: t("defense5Desc") }
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
                <Quotes text={t("quote1Text")} author={t("quote1Author")} role={t("quote1Role")} />
                <Quotes text={t("quote2Text")} author={t("quote2Author")} role={t("quote2Role")} />
                <Quotes text={t("quote3Text")} author={t("quote3Author")} role={t("quote3Role")} />
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
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("ctaEyebrow")}</p>
              <h2 className="mt-3 text-display-xl font-semibold tracking-tightest text-ink-900">
                {t("ctaTitle")}
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-[16px] text-ink-500">
                {t("ctaDesc")}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/pricing" className="btn-primary">
                  {t("ctaStart")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-gold">
                  {t("ctaDeep")}
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
