import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { TrackAnalyzer } from "@/components/track/TrackAnalyzer";
import { localizeTrack } from "@/lib/content/tracks";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "trackPage" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;
const blue = (chunks: React.ReactNode) => <span className="text-gradient-blue">{chunks}</span>;
const u = (chunks: React.ReactNode) => (
  <u className="decoration-accent-gold underline-offset-4">{chunks}</u>
);

export default function TrackAnalyticsPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const locale = useLocale();
  const t = useTranslations("trackPage");
  const winFreq = models.track.win_frequency;
  const matrix = models.track.score_matrix;
  const robust = models.track.rank_robustness;
  const notes = t.raw("notes") as string[];

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
              {t.rich("subtitle", { u, n: models.track.n_paths.toLocaleString(locale === "zh" ? "zh-CN" : "en-US") })}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/track-pillars.png" alt={t("heroImgAlt")} fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">{t("heroEyebrow", { k: (models.track.n_paths / 1000).toFixed(0) })}</p>
                <p className="mt-1 text-display-md font-semibold">{t("heroCaption")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE ANALYZER */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("interactiveEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("interactiveTitle", { blue })}
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              <TrackAnalyzer matrix={matrix as any} weights={models.track.weights as any} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WIN FREQUENCY */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("winEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("winTitle", { gold })}
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              {t("winNote")}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-3">
              {winFreq.map((w, i) => (
                <div key={w.track} className="rounded-xl border border-ink-100 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-[14px] font-semibold text-ink-700 w-7">#{i + 1}</span>
                      <span className="text-[15px] font-semibold text-ink-900">{localizeTrack(w.track, locale)}</span>
                    </div>
                    <span className="text-[15px] font-semibold ticker text-ink-700">{(w.win_rate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-gold to-[#E5CB7E] rounded-full"
                      style={{ width: `${w.win_rate * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROBUSTNESS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("robustEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("robustTitle", { blue })}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">{t("robustColTrack")}</th>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <th key={r} className="py-3 px-3 text-center font-semibold text-ink-700">{t("rankNth", { r })}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {robust.map((r) => (
                    <tr key={r.track}>
                      <td className="py-3 px-5 text-ink-700 font-medium">{localizeTrack(r.track, locale)}</td>
                      {r.rank_distribution.map((p, i) => {
                        const intensity = Math.min(1, p * 1.5);
                        return (
                          <td key={i} className="py-2 px-2 text-center">
                            <div
                              className="h-9 rounded-md flex items-center justify-center text-[12px] text-white"
                              style={{ background: `rgba(11, 22, 50, ${0.15 + intensity * 0.85})` }}
                            >
                              {(p * 100).toFixed(1)}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16">
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("methodEyebrow")}</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">{t("methodTitle")}</h2>
            <p className="mt-4 text-[15px] text-ink-500 max-w-3xl">{t("method")}</p>
            <ul className="mt-6 space-y-2 text-[13px] text-ink-500 list-disc list-inside">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Link href="/contact?type=deep" className="mt-8 btn-primary inline-flex">
              {t("methodCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
