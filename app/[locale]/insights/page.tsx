import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Calendar, User } from "lucide-react";
import { getPosts } from "@/lib/content/posts";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "insightsList" });
  return { title: t("metaTitle") };
}

const blue = (chunks: React.ReactNode) => (
  <span className="text-gradient-blue">{chunks}</span>
);

export default function InsightsPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("insightsList");
  const tc = useTranslations("common");
  const posts = getPosts(params.locale);

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
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <Link
                  href={`/insights/${p.slug}`}
                  className={`group relative block rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 ${
                    i === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className={`grid ${i === 0 ? "lg:grid-cols-2" : ""}`}>
                    <div className={`relative ${i === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[300px]" : "aspect-[16/9]"} overflow-hidden`}>
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
                      />
                    </div>
                    <div className="p-7">
                      <div className="flex items-center gap-3 text-[11px] text-ink-400">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                        <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{p.author}</span>
                      </div>
                      <h3 className={`mt-3 font-semibold text-ink-900 tracking-snug group-hover:text-ink-700 transition-colors ${
                        i === 0 ? "text-display-md" : "text-headline"
                      }`}>
                        {p.title}
                      </h3>
                      <p className="mt-3 text-[14px] text-ink-500 leading-relaxed line-clamp-3">{p.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {p.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-50 text-ink-500 border border-ink-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[12px] text-ink-700 group-hover:text-accent-gold transition-colors">
                          {tc("readMore")} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-14 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("newsletterEyebrow")}</p>
                <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">{t("newsletterTitle")}</h2>
                <p className="mt-3 text-[14px] text-ink-500">{t("newsletterDesc")}</p>
              </div>
              <form className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 h-12 px-5 rounded-full border border-ink-200 focus:outline-none focus:border-ink-700 text-[14px]"
                />
                <button type="submit" className="btn-primary">{t("subscribe")}</button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
