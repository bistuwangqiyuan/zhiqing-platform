import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "./LoginForm";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "login" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function LoginPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("login");

  return (
    <section className="min-h-[80vh] pt-28 pb-24">
      <div className="container max-w-md">
        <Link href="/" className="text-[13px] text-ink-500 hover:text-ink-700">
          {t("backHome")}
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-10 shadow-glass">
          <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
          <h1 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">
            {t("title")}
          </h1>
          <p className="mt-3 text-[14px] text-ink-500 leading-relaxed">
            {t.rich("intro", { strong: (c) => <strong className="text-ink-700">{c}</strong> })}
          </p>

          <Suspense fallback={<div className="mt-8 h-32 animate-pulse rounded-2xl bg-ink-50" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
