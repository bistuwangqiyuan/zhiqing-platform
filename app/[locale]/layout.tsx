import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhiqing-platform.netlify.app";

type SEO = {
  brand: string;
  titleDefault: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  htmlLang: string;
};

const SEO_BY_LOCALE: Record<Locale, SEO> = {
  zh: {
    brand: "智擎 PreFounder",
    titleDefault: "智擎 PreFounder · 创业前赛道与商业模式智能决策平台",
    description:
      "智擎 PreFounder 以多智能体工作流与可验证数据源，服务尚未注册公司、但已严肃考虑创业的群体——在投入资金与时间之前，完成赛道比较、商业模式画布、竞争格局、监管与情景压力测试。",
    keywords: [
      "智擎 PreFounder", "ZhiQing", "创业前", "赛道分析", "商业模式画布", "蒙特卡洛",
      "可行性研究", "商业计划书", "AI 投资决策", "智能决策平台"
    ],
    ogTitle: "智擎 PreFounder · 创业前智能决策平台",
    ogDescription: "结构化、智能化、可量化——在你点燃第一笔资金之前，先点亮你的判断。",
    ogLocale: "zh_CN",
    htmlLang: "zh-CN"
  },
  en: {
    brand: "ZhiQing PreFounder",
    titleDefault:
      "ZhiQing PreFounder · Pre-Founding Track & Business-Model Decision Platform",
    description:
      "ZhiQing PreFounder pairs multi-agent workflows with verifiable data sources for people who are seriously considering a startup but haven't incorporated yet — run track comparison, business-model canvas, competitive landscape, and regulatory / scenario stress tests before you commit capital and time.",
    keywords: [
      "ZhiQing PreFounder", "pre-founder", "track analysis", "business model canvas",
      "Monte Carlo", "feasibility study", "business plan", "AI investment decision",
      "decision intelligence"
    ],
    ogTitle: "ZhiQing PreFounder · Pre-Founding Decision Intelligence",
    ogDescription:
      "Structured, intelligent, quantifiable — sharpen your judgment before you spend your first dollar.",
    ogLocale: "en_US",
    htmlLang: "en"
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const seo = SEO_BY_LOCALE[params.locale] ?? SEO_BY_LOCALE.zh;
  const canonical = params.locale === "zh" ? "/" : `/${params.locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.titleDefault, template: `%s · ${seo.brand}` },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "ZhiQing PreFounder" }],
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      type: "website",
      locale: seo.ogLocale,
      images: [
        { url: "/images/hero-orb.png", width: 1200, height: 630, alt: seo.brand }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: ["/images/hero-orb.png"]
    },
    alternates: {
      canonical,
      languages: {
        "zh-CN": "/",
        "en-US": "/en",
        "x-default": "/"
      }
    },
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] }
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0E" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const { locale } = params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const htmlLang = SEO_BY_LOCALE[locale as Locale]?.htmlLang ?? "zh-CN";

  return (
    <html lang={htmlLang} className="scroll-smooth">
      <body className="bg-surface text-ink-700 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
