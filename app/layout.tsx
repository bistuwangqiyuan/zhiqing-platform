import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://zhiqing.ai"),
  title: {
    default: "智擎 PreFounder · 创业前赛道与商业模式智能决策平台",
    template: "%s · 智擎 PreFounder"
  },
  description:
    "智擎 PreFounder 以多智能体工作流与可验证数据源，服务尚未注册公司、但已严肃考虑创业的群体——在投入资金与时间之前，完成赛道比较、商业模式画布、竞争格局、监管与情景压力测试。",
  keywords: [
    "智擎 PreFounder", "ZhiQing", "创业前", "赛道分析", "商业模式画布", "蒙特卡洛",
    "可行性研究", "商业计划书", "AI 投资决策", "智能决策平台"
  ],
  authors: [{ name: "ZhiQing PreFounder" }],
  openGraph: {
    title: "智擎 PreFounder · 创业前智能决策平台",
    description: "结构化、智能化、可量化——在你点燃第一笔资金之前，先点亮你的判断。",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/images/hero-orb.png",
        width: 1200,
        height: 630,
        alt: "智擎 PreFounder"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "智擎 PreFounder · 创业前智能决策平台",
    description: "结构化、智能化、可量化——在你点燃第一笔资金之前，先点亮你的判断。",
    images: ["/images/hero-orb.png"]
  },
  alternates: {
    canonical: "https://zhiqing.ai"
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0E" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-surface text-ink-700 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
