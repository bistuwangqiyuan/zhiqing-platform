import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  const columns = [
    {
      title: t("colProduct"),
      links: [
        { href: "/products", label: t("standard") },
        { href: "/products#enterprise", label: t("enterprise") },
        { href: "/products#deep-program", label: t("deepProgram") },
        { href: "/track-analytics", label: t("trackEngine") }
      ]
    },
    {
      title: t("colSolutions"),
      links: [
        { href: "/cases", label: t("casesLink") },
        { href: "/market", label: t("marketLink") },
        { href: "/technology", label: t("technologyLink") },
        { href: "/insights", label: t("insightsLink") }
      ]
    },
    {
      title: t("colCompany"),
      links: [
        { href: "/about", label: t("about") },
        { href: "/about#team", label: t("team") },
        { href: "/about#governance", label: t("governance") },
        { href: "/contact", label: t("contact") }
      ]
    },
    {
      title: t("colInfo"),
      links: [
        { href: "/pricing", label: t("pricing") },
        { href: "/contact", label: t("consult") },
        { href: "/insights", label: t("learning") },
        { href: "/about#disclaimer", label: t("disclaimer") }
      ]
    }
  ];

  return (
    <footer className="border-t border-ink-100 bg-ink-50/40">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-900 text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2L4 7l8 5 8-5-8-5zM4 12l8 5 8-5M4 17l8 5 8-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-semibold text-ink-700">智擎 PreFounder</span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500 max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-ink-700 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-500 hover:text-ink-900 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-ink-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[12px] text-ink-400">{t("copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="/about#disclaimer" className="text-[12px] text-ink-400 hover:text-ink-700">
              {t("disclaimer")}
            </Link>
            <Link href="/about#privacy" className="text-[12px] text-ink-400 hover:text-ink-700">
              {t("privacy")}
            </Link>
            <Link href="/about#terms" className="text-[12px] text-ink-400 hover:text-ink-700">
              {t("terms")}
            </Link>
            <span className="text-[12px] text-ink-400">{t("region")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
