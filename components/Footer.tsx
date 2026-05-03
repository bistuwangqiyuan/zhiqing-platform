import Link from "next/link";

const COLUMNS = [
  {
    title: "产品",
    links: [
      { href: "/products", label: "启径标准版" },
      { href: "/products#enterprise", label: "企业版" },
      { href: "/products#deep-program", label: "深度陪跑" },
      { href: "/track-analytics", label: "赛道分析引擎" }
    ]
  },
  {
    title: "解决方案",
    links: [
      { href: "/cases", label: "成功案例" },
      { href: "/market", label: "市场与财务" },
      { href: "/technology", label: "技术架构" },
      { href: "/insights", label: "研究洞察" }
    ]
  },
  {
    title: "公司",
    links: [
      { href: "/about", label: "关于我们" },
      { href: "/about#team", label: "团队" },
      { href: "/about#governance", label: "治理与合规" },
      { href: "/contact", label: "联系我们" }
    ]
  },
  {
    title: "信息",
    links: [
      { href: "/pricing", label: "定价方案" },
      { href: "/contact", label: "预约咨询" },
      { href: "/insights", label: "学习中心" },
      { href: "/about#disclaimer", label: "免责声明" }
    ]
  }
];

export function Footer() {
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
              在你点燃第一笔资金之前，先点亮你的判断。多智能体工作流 + 可验证数据源 + 可复现财务模型。
            </p>
          </div>

          {COLUMNS.map((col) => (
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
          <p className="text-[12px] text-ink-400">
            © 2026 智擎 PreFounder. All rights reserved. · 商业计划版本 v3.0 · SEED 20260501
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about#disclaimer" className="text-[12px] text-ink-400 hover:text-ink-700">
              免责声明
            </Link>
            <Link href="/about#privacy" className="text-[12px] text-ink-400 hover:text-ink-700">
              隐私政策
            </Link>
            <Link href="/about#terms" className="text-[12px] text-ink-400 hover:text-ink-700">
              服务条款
            </Link>
            <span className="text-[12px] text-ink-400">中国 · 全球</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
