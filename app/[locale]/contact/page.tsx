import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });
  return { title: t("metaTitle") };
}

const gold = (chunks: React.ReactNode) => (
  <span className="text-gradient-gold">{chunks}</span>
);
const br = () => <br />;

export default function ContactPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { type?: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("contact");
  const type = searchParams?.type ?? "general";

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">{t("eyebrow")}</p>
              <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest">
                {t.rich("title", { gold, br })}
              </h1>
              <p className="mt-6 text-[15px] text-ink-500 leading-relaxed">
                {t("subtitle")}
              </p>

              <div className="mt-12 space-y-5">
                <Item
                  icon={<Mail className="h-4 w-4" />}
                  title={t("emailTitle")}
                  value={
                    <>
                      <a href="mailto:mingxinai@agentmail.to" className="hover:text-ink-900 transition-colors">mingxinai@agentmail.to</a>
                      <br />
                      <a href="mailto:13426086861@139.com" className="hover:text-ink-900 transition-colors">13426086861@139.com</a>
                    </>
                  }
                />
                <Item icon={<Phone className="h-4 w-4" />} title={t("phoneTitle")} value="+86 134 2608 6861" />
                <Item icon={<MapPin className="h-4 w-4" />} title={t("officeTitle")} value={t("officeValue")} />
                <Item icon={<ShieldCheck className="h-4 w-4" />} title={t("ndaTitle")} value={t("ndaValue")} />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ContactForm defaultType={type} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ icon, title, value }: { icon: React.ReactNode; title: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="h-9 w-9 rounded-full bg-ink-50 grid place-items-center text-ink-700 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[12px] text-ink-400">{title}</p>
        <p className="text-[14px] text-ink-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
