import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight, Search, Shield, Zap, Database, Cpu, FileText, Bot, Bug } from "lucide-react";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "technology" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;
const blue = (chunks: React.ReactNode) => <span className="text-gradient-blue">{chunks}</span>;

const LAYER_ICONS = [
  <Database key="d" className="h-5 w-5" />,
  <Search key="s" className="h-5 w-5" />,
  <Bot key="b" className="h-5 w-5" />,
  <Bug key="g" className="h-5 w-5" />,
  <FileText key="f" className="h-5 w-5" />,
  <Shield key="h" className="h-5 w-5" />
];

type Layer = { name: string; desc: string; keys: string[] };
type Agent = { name: string; role: string };

export default function TechnologyPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("technology");
  const cost = models.ai.per_report;
  const sub = models.ai.monthly_per_user_subscription;
  const layers = t.raw("layers") as Layer[];
  const agents = t.raw("agents") as Agent[];

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              {t.rich("title", { blue })}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/tech-architecture.png" alt={t("heroImgAlt")} fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">{t("heroEyebrow")}</p>
                <p className="mt-1 text-display-md font-semibold">{t("heroCaption")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIX LAYERS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("stackEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("stackTitle", { gold })}
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {layers.map((l, i) => (
              <Reveal key={l.name} delay={i * 0.05}>
                <div className="relative h-full rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
                    {LAYER_ICONS[i]}
                  </span>
                  <h3 className="mt-5 text-headline font-semibold text-ink-900">{l.name}</h3>
                  <p className="mt-2 text-[14px] text-ink-500 leading-relaxed">{l.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {l.keys.map((k) => (
                      <span key={k} className="text-[11px] px-2 py-1 rounded-full bg-ink-50 text-ink-600 border border-ink-100">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT MESH */}
      <section className="section bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <Image src="/images/multi-agent.png" alt="" fill className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/40" />
        </div>
        <div className="container relative">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">{t("meshEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold tracking-snug max-w-3xl">
              {t.rich("meshTitle", { gold })}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] text-white/75">
              {t("meshDesc")}
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.03}>
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-accent-gold">
                    <Cpu className="h-4 w-4" />
                    <p className="text-[11px] tracking-[0.15em] uppercase">Agent {String(i + 1).padStart(2, "0")}</p>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-white">{a.name}</p>
                  <p className="mt-1 text-[12px] text-white/60">{a.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COST TRANSPARENCY */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("costEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("costTitle", { blue })}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-ink-500">
              {t("costSubtitle")}
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("reportCardTitle")}</p>
                <p className="mt-2 text-display-md font-semibold text-ink-900">${cost.total_per_report.toFixed(2)}</p>
                <ul className="mt-6 space-y-3 text-[14px]">
                  <Row label={t("reportApi")} value={`$${cost.api_cost.toFixed(2)}`} />
                  <Row label={t("reportEmbedding")} value={`$${cost.embedding_cost.toFixed(2)}`} />
                  <Row label={t("reportSafety")} value={`$${cost.safety_eval_cost.toFixed(2)}`} />
                  <Row label={t("reportDocgen")} value={`$${cost.docgen_cost.toFixed(2)}`} />
                  <Row label={t("reportEngineer")} value={`$${cost.engineer_alloc.toFixed(2)}`} />
                </ul>
                <p className="mt-5 text-[12px] text-ink-400">
                  {t("reportNote")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("subCardTitle")}</p>
                <p className="mt-2 text-display-md font-semibold text-ink-900">${sub.monthly_total.toFixed(2)}{t("subMonthSuffix")}</p>
                <ul className="mt-6 space-y-3 text-[14px]">
                  <Row label={t("subApi")} value={`$${sub.monthly_api_cost.toFixed(2)}`} />
                  <Row label={t("subStorage")} value={`$${sub.monthly_storage.toFixed(2)}`} />
                  <Row label={t("subCdn")} value={`$${sub.monthly_cdn.toFixed(2)}`} />
                  <Row label={t("subAuth")} value={`$${sub.monthly_auth.toFixed(2)}`} />
                </ul>
                <p className="mt-5 text-[12px] text-ink-400">{t("subNote")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
            <Zap className="h-6 w-6 mx-auto text-accent-azure" />
            <h2 className="mt-4 text-display-md font-semibold tracking-snug text-ink-900">{t("ctaTitle")}</h2>
            <p className="mt-3 max-w-xl mx-auto text-ink-500">{t("ctaDesc")}</p>
            <Link href="/track-analytics" className="mt-8 btn-primary">
              {t("ctaBtn")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-none">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-700 ticker">{value}</span>
    </li>
  );
}
