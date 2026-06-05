import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { models } from "@/lib/data";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "products" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;
const blue = (chunks: React.ReactNode) => <span className="text-gradient-blue">{chunks}</span>;

type CompareRow = {
  label: string;
  starter: boolean | string;
  enterprise: boolean | string;
  deep: boolean | string;
};

export default function ProductsPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("products");
  const stake = String(models.fund.typical_stake * 100);
  const postMoney = String(models.fund.post_money_median_usd_mm);

  const deepBullets = (t.raw("deepBullets") as string[]).map((b) =>
    b.replace("{stake}", stake).replace("{postMoney}", postMoney)
  );
  const compare = t.raw("compare") as CompareRow[];

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              {t.rich("title", { gold })}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] text-ink-500 leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      <ProductSection
        id="starter"
        eyebrow={t("starterEyebrow")}
        title={t("starterTitle")}
        subtitle={t("starterSubtitle")}
        bullets={t.raw("starterBullets") as string[]}
        image="/images/product-dashboard.png"
        cta={[
          { href: "/pricing#starter", label: t("starterCta1") },
          { href: "/checkout?plan=starter", label: t("starterCta2"), primary: true }
        ]}
        align="left"
      />

      <ProductSection
        id="enterprise"
        eyebrow={t("enterpriseEyebrow")}
        title={t("enterpriseTitle")}
        subtitle={t("enterpriseSubtitle")}
        bullets={t.raw("enterpriseBullets") as string[]}
        image="/images/growth-city.png"
        align="right"
        cta={[
          { href: "/contact?type=enterprise", label: t("enterpriseCta1") },
          { href: "/pricing#enterprise", label: t("enterpriseCta2"), primary: true }
        ]}
      />

      <ProductSection
        id="deep-program"
        eyebrow={t("deepEyebrow")}
        title={t("deepTitle")}
        subtitle={t("deepSubtitle")}
        dark
        bullets={deepBullets}
        image="/images/product-report.png"
        cta={[
          { href: "/contact?type=deep", label: t("deepCta1"), primary: true },
          { href: "/cases", label: t("deepCta2") }
        ]}
        align="left"
      />

      {/* COMPARISON TABLE */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("compareEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("compareTitle", { blue })}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-4 px-5 font-semibold text-ink-700">{t("compareColCap")}</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">{t("compareColStarter")}</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">{t("compareColEnterprise")}</th>
                    <th className="py-4 px-5 font-semibold text-ink-700">{t("compareColDeep")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {compare.map((row) => (
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
              <h2 className="mt-4 text-display-md font-semibold tracking-snug">{t("ctaTitle")}</h2>
              <p className="mt-3 max-w-xl mx-auto text-white/70">
                {t("ctaDesc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/track-analytics" className="btn-gold">
                  {t("ctaTrack")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-ghost border-white/30 text-white hover:bg-white/10">
                  {t("ctaAdvisor")}
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

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <td className="py-3 px-5 text-center text-emerald-600">✓</td>;
  if (value === false) return <td className="py-3 px-5 text-center text-ink-300">—</td>;
  return <td className="py-3 px-5 text-center text-ink-700 text-[12px]">{value}</td>;
}
