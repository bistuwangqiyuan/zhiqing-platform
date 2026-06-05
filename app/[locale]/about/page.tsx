import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight, ShieldCheck } from "lucide-react";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => <span className="text-gradient-gold">{chunks}</span>;
const blue = (chunks: React.ReactNode) => <span className="text-gradient-blue">{chunks}</span>;
const br = () => <br />;

// Stable, locale-independent keys driving the color logic.
const RISK_LEVEL_KEYS = ["midHigh", "mid", "mid", "mid", "mid", "high"] as const;
const ROADMAP_STATUS_KEYS = ["done", "inProgress", "planned", "planned", "planned", "strategy", "target"] as const;

type TeamMember = { name: string; role: string; bio: string };
type Risk = { name: string; level: string; mitigation: string };
type Milestone = { quarter: string; milestone: string; status: string };

export default function AboutPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("about");
  const fund = models.fund;

  const team = t.raw("team") as TeamMember[];
  const risks = t.raw("risks") as Risk[];
  const roadmap = t.raw("roadmap") as Milestone[];
  const disclaimer = t.raw("disclaimer") as string[];
  const privacy = t.raw("privacy") as string[];

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              {t.rich("title", { gold, br })}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/about-office.png" alt={t("heroImgAlt")} fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">{t("heroEyebrow")}</p>
                <p className="mt-1 text-display-md font-semibold">{t("heroCaption")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="section">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("missionEyebrow")}</p>
            <p className="mt-4 text-display-md font-semibold text-ink-900 tracking-snug">
              {t("mission")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("teamEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("teamTitle", { blue })}
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              {t("teamNote")}
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.03}>
                <div className="rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-0.5">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-ink-300 via-ink-500 to-ink-700 grid place-items-center text-white text-xl font-semibold">
                    {m.name[0]}
                  </div>
                  <h3 className="mt-5 text-headline font-semibold text-ink-900">{m.name}</h3>
                  <p className="mt-1 text-[12px] text-ink-500">{m.role}</p>
                  <p className="mt-3 text-[13px] text-ink-600 leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE / RISKS */}
      <section id="governance" className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("govEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              {t.rich("govTitle", { gold })}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">{t("riskColName")}</th>
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">{t("riskColLevel")}</th>
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">{t("riskColMitigation")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {risks.map((r, i) => {
                    const key = RISK_LEVEL_KEYS[i];
                    return (
                      <tr key={r.name}>
                        <td className="py-3 px-5 text-ink-700 font-medium">{r.name}</td>
                        <td className="py-3 px-5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                            key === "high" ? "bg-red-50 text-red-700" :
                            key === "midHigh" || key === "mid" ? "bg-amber-50 text-amber-700" :
                            "bg-emerald-50 text-emerald-700"
                          }`}>
                            {r.level}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-ink-500">{r.mitigation}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="section bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-32 -left-32 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-accent-gold/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-accent-azure/20 to-transparent blur-3xl" />
        </div>
        <div className="container relative">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">{t("roadmapEyebrow")}</p>
            <h2 className="mt-3 text-display-lg font-semibold tracking-snug max-w-3xl">
              {t.rich("roadmapTitle", { gold })}
            </h2>
          </Reveal>

          <div className="mt-12 relative">
            <div className="absolute left-4 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-white/15" />
            <ul className="space-y-8">
              {roadmap.map((r, i) => {
                const key = ROADMAP_STATUS_KEYS[i];
                return (
                  <Reveal key={r.quarter} delay={i * 0.05}>
                    <li className={`relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-10 ${i % 2 === 0 ? "" : "lg:[&>:first-child]:order-2"}`}>
                      <div className="absolute left-3 lg:left-1/2 lg:-translate-x-1/2 top-2 h-3 w-3 rounded-full bg-accent-gold ring-4 ring-ink-900" />
                      <div className={`${i % 2 === 0 ? "lg:text-right lg:pr-10" : "lg:pl-10"}`}>
                        <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">{r.quarter}</p>
                        <h3 className="mt-2 text-headline font-semibold text-white">{r.milestone}</h3>
                        <span className={`mt-2 inline-block text-[11px] px-2 py-0.5 rounded-full ${
                          key === "done" ? "bg-emerald-500/20 text-emerald-300" :
                          key === "inProgress" ? "bg-accent-gold/20 text-accent-gold" :
                          key === "planned" ? "bg-white/10 text-white/70" :
                          "bg-white/5 text-white/50"
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section id="disclaimer" className="section">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("disclaimerEyebrow")}</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">{t("disclaimerTitle")}</h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-[14px] text-ink-600 leading-relaxed">
              {disclaimer.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                {t("disclaimerStat", {
                  stake: (fund.typical_stake * 100).toFixed(0),
                  postMoney: fund.post_money_median_usd_mm
                })}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="privacy" className="section bg-ink-50/40">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("privacyEyebrow")}</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">{t("privacyTitle")}</h2>
            <ul className="mt-6 space-y-3 text-[14px] text-ink-600 list-disc list-inside">
              {privacy.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="terms" className="section">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
              <ShieldCheck className="h-6 w-6 mx-auto text-accent-gold" />
              <h2 className="mt-4 text-display-md font-semibold text-ink-900 tracking-snug">{t("termsTitle")}</h2>
              <p className="mt-3 max-w-xl mx-auto text-ink-500">{t("termsDesc")}</p>
              <Link href="/contact?type=legal" className="mt-8 btn-primary inline-flex">
                {t("termsCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
