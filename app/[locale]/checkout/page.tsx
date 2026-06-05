import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "checkout" });
  return { title: t("metaTitle") };
}

export default function CheckoutPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { plan?: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("checkout");

  const planId = searchParams?.plan === "enterprise" ? "enterprise" : "starter";
  const plan =
    planId === "enterprise"
      ? { name: t("planEnterpriseName"), price: 1880, period: t("period"), eyebrow: "ENTERPRISE", sub: t("planEnterpriseSub") }
      : { name: t("planStarterName"), price: 39, period: t("period"), eyebrow: "STARTER", sub: t("planStarterSub") };

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <Link href="/pricing" className="text-[13px] text-ink-500 hover:text-ink-700">{t("back")}</Link>
            <h1 className="mt-4 text-display-lg font-semibold text-ink-900 tracking-snug">{t("title")}</h1>
            <p className="mt-2 text-[14px] text-ink-500">{t("subtitle")}</p>

            <CheckoutForm plan={{ name: plan.name, price: plan.price, period: plan.period }} planId={planId} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[11px] tracking-[0.18em] uppercase text-ink-500">{plan.eyebrow}</p>
                <h3 className="mt-2 text-headline font-semibold text-ink-900">{plan.name}</h3>
                <p className="mt-2 text-[13px] text-ink-500">{plan.sub}</p>

                <div className="mt-6 pt-6 border-t border-ink-100 space-y-3 text-[14px]">
                  <Row label={t("rowSub")} value={`$${plan.price.toLocaleString()} / ${plan.period}`} />
                  <Row label={t("rowTrial")} value={t("trialValue")} />
                  <Row label={t("rowToday")} value="$0.00" highlight />
                </div>

                <div className="mt-6 pt-6 border-t border-ink-100 space-y-3 text-[12px] text-ink-500">
                  <p className="inline-flex gap-2 items-center"><Lock className="h-3.5 w-3.5" /> {t("secure1")}</p>
                  <p className="inline-flex gap-2 items-center"><ShieldCheck className="h-3.5 w-3.5" /> {t("secure2")}</p>
                  <p className="inline-flex gap-2 items-center"><Sparkles className="h-3.5 w-3.5" /> {t("secure3")}</p>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-ink-400 text-center">
                {t.rich("agree", {
                  terms: (c) => <Link href="/about#terms" className="underline">{c}</Link>,
                  privacy: (c) => <Link href="/about#privacy" className="underline">{c}</Link>
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${highlight ? "pt-3 border-t border-ink-100 font-semibold text-ink-900" : "text-ink-600"}`}>
      <span>{label}</span>
      <span className="ticker">{value}</span>
    </div>
  );
}
