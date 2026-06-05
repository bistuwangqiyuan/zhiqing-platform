import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Check, Sparkles } from "lucide-react";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "pricing" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;

const PLAN_CONFIG = [
  { id: "starter", price: 39, annualPrice: 396, href: "/account", highlighted: false, accent: "from-accent-azure/10 to-transparent" },
  { id: "enterprise", price: 1880, annualPrice: 18960, href: "/contact?type=enterprise", highlighted: true, accent: "from-accent-gold/15 to-transparent" },
  { id: "deep", price: 38000, annualPrice: null as number | null, href: "/contact?type=deep", highlighted: false, accent: "from-violet-500/10 to-transparent" }
];

type PlanCopy = { name: string; eyebrow: string; period: string; desc: string; features: string[]; cta: string };
type Faq = { q: string; a: string };

export default function PricingPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("pricing");
  const plans = t.raw("plans") as PlanCopy[];
  const faqs = t.raw("faqs") as Faq[];

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
            <div className="mt-8 rounded-2xl border border-accent-gold/40 bg-amber-50/60 p-5 max-w-3xl">
              <p className="text-[13px] text-ink-700 leading-relaxed">
                {t.rich("banner", {
                  b: (c) => <strong>{c}</strong>,
                  a: (c) => <Link href="/account" className="underline text-ink-900 hover:text-accent-gold">{c}</Link>
                })}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-6">
            {PLAN_CONFIG.map((cfg, i) => {
              const p = plans[i];
              return (
                <Reveal key={cfg.id} delay={i * 0.07}>
                  <div
                    id={cfg.id}
                    className={`relative h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden ${
                      cfg.highlighted
                        ? "border-2 border-accent-gold bg-gradient-to-br from-white to-amber-50/40 shadow-elevated"
                        : "border border-ink-100 bg-white hover:shadow-elevated"
                    }`}
                  >
                    <div className={`absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br ${cfg.accent} blur-3xl pointer-events-none`} />
                    <div className="relative">
                      {cfg.highlighted && (
                        <span className="absolute -top-4 right-0 text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-accent-gold text-ink-900 font-semibold">
                          {t("popular")}
                        </span>
                      )}
                      <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500">{p.eyebrow}</p>
                      <h3 className="mt-2 text-display-md font-semibold text-ink-900 tracking-snug">{p.name}</h3>
                      <p className="mt-3 text-[14px] text-ink-500 min-h-[42px]">{p.desc}</p>
                      <div className="mt-7 flex items-baseline gap-1">
                        <span className="text-display-lg font-semibold text-ink-900 tracking-tightest">
                          ${cfg.price.toLocaleString()}
                        </span>
                        <span className="text-[14px] text-ink-500">{p.period}</span>
                      </div>
                      {cfg.annualPrice && (
                        <p className="text-[12px] text-ink-400 mt-1">
                          {t("annual", { price: cfg.annualPrice.toLocaleString() })}
                        </p>
                      )}
                      <Link href={cfg.href} className={`mt-7 w-full ${cfg.highlighted ? "btn-gold" : "btn-primary"}`}>
                        {p.cta}
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
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("faqEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug">{t("faqTitle")}</h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
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
              <h2 className="mt-4 text-display-md font-semibold tracking-snug">{t("ctaTitle")}</h2>
              <p className="mt-3 text-white/70 max-w-xl mx-auto">
                {t("ctaDesc")}
              </p>
              <Link href="/contact" className="mt-8 btn-gold">{t("ctaBtn")}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
