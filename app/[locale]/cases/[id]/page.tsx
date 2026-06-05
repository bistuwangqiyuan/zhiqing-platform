import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCase, getCases, CASE_IDS } from "@/lib/content/cases";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import { ShareBar } from "@/components/ShareBar";

interface Params {
  params: { locale: string; id: string };
}

export function generateStaticParams() {
  return CASE_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params) {
  const c = getCase(params.locale, params.id);
  if (!c) return { title: params.locale === "en" ? "Case" : "案例" };
  return {
    title: c.title,
    description: c.summary,
    openGraph: { images: [c.image], title: c.title, description: c.summary }
  };
}

export default async function CaseDetail({ params }: Params) {
  const { locale, id } = params;
  setRequestLocale(locale);
  const t = await getTranslations("caseDetail");
  const cases = getCases(locale);
  const c = getCase(locale, id);
  if (!c) return notFound();
  const idx = cases.findIndex((x) => x.id === c.id);
  const next = cases[(idx + 1) % cases.length];

  return (
    <>
      <section className="pt-28 pb-8">
        <div className="container">
          <Link href="/cases" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-700">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("back")}
          </Link>
          <Reveal>
            <p className="mt-6 text-[12px] tracking-[0.18em] uppercase text-ink-500">{c.track}</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">{c.title}</h1>
            <div className="mt-4 flex items-center gap-5 text-[13px] text-ink-500">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{c.year}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{c.region}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-12">
        <div className="container">
          <Reveal delay={0.1}>
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-premium">
              <Image src={c.image} alt={c.title} fill priority className="object-cover" sizes="100vw" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[18px] leading-relaxed text-ink-700 first-letter:text-3xl first-letter:font-semibold first-letter:mr-1 first-letter:text-ink-900">
              {c.summary}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 grid grid-cols-3 gap-6 rounded-2xl border border-ink-100 bg-ink-50/60 p-7">
              {c.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-[12px] text-ink-500">{m.label}</p>
                  <p className="mt-1 text-display-md font-semibold text-gradient-gold tracking-tightest">{m.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 prose prose-lg max-w-none">
              {c.body.map((p, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-ink-600 mb-5">{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ShareBar title={c.title} className="mt-10" />
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("nextEyebrow")}</p>
            <Link href={`/cases/${next.id}`} className="mt-3 group flex items-center justify-between gap-6 rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500">
              <div>
                <p className="text-[12px] text-ink-400">{next.track}</p>
                <h3 className="mt-1 text-display-md font-semibold text-ink-900">{next.title}</h3>
              </div>
              <ArrowRight className="h-6 w-6 text-ink-400 group-hover:text-ink-900 group-hover:translate-x-1 transition-all" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
