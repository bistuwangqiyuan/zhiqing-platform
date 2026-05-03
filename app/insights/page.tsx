import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata = { title: "洞察" };

export const POSTS = [
  {
    slug: "what-pre-founders-actually-need",
    title: "Pre-Founders 真正需要的不是更多数据，而是更少的幻觉",
    excerpt: "在我们陪跑的 86 个项目里，63% 的失败来自一个共同问题：用幸存者偏差作为决策依据。",
    date: "2026-04-22",
    author: "陈维 · 首席分析师",
    image: "/images/about-office.png",
    tags: ["创业前", "决策方法论"],
    body: [
      "我们累计陪跑过 86 个项目（截至 2026 Q1）。其中 41 个最终走向商业成功 (Tier-2 及以上)，45 个停在了 Tier-3 或更低。",
      "我们做了反向因果分析，发现失败的项目里，63% 都犯了同一类错误：用「成功创业者的故事」作为决策依据。",
      "成功创业者的复述包含太多事后合理化。当你把它当成路径，你只看到了 1 个成功者，没看到 999 个失败者。",
      "智擎 PreFounder 的核心差别在于：我们让你看到 12,000 条蒙特卡洛路径中失败的那 8,000 条——理解为什么会失败，比理解为什么会成功重要。",
      "这就是 Critic Agent 的意义：每一份报告必须经过反向证伪，每一个结论必须有反向假设的对照组。",
      "如果你正在严肃考虑创业，请把第一笔预算花在「证伪」而不是「证成」。"
    ]
  },
  {
    slug: "5-percent-equity-economics",
    title: "为什么是「5% 股权对齐」？——关于深度陪跑的经济学",
    excerpt: "5% 不是数字游戏。它是平台与项目方共担义务的边界 — 既不替代创始人决策，也不沦为「拿钱办事」。",
    date: "2026-04-15",
    author: "李霄 · 法务架构",
    image: "/images/product-report.png",
    tags: ["股权", "深度陪跑"],
    body: [
      "经常有人问：为什么是 5%？为什么不是 1% 或 10%？",
      "5% 是一个经过模型回测的最优区间：低于 3% 时平台报酬激励不足，高于 8% 时与创始人控制权冲突。",
      "在 12,000 条蒙特卡洛路径下，5% 持股的中位 5 年退出现金流约 $12.9M（中位投后估值 $12M × 中位 MOIC × 持股比例）。",
      "但更重要的是：5% 股权配合「锁定期 + 反稀释保护 + 信息披露条款」，构建了一个长期同盟，而非短期咨询关系。",
      "我们不会替你做任何具有控制权意义的决策。董事观察席（可选）只是观察席，不是表决席。"
    ]
  },
  {
    slug: "monte-carlo-decision-making",
    title: "蒙特卡洛不是更精确——而是承认你不可能精确",
    excerpt: "我们不展示「期望值」，我们展示 P10–P50–P90。这不是因为我们怕担责，而是因为期望值会骗人。",
    date: "2026-03-28",
    author: "Mariam K. · 量化研究负责人",
    image: "/images/monte-carlo.png",
    tags: ["量化方法", "蒙特卡洛"],
    body: [
      "如果你只看一个期望值（比如 ARR 期望 $5M），你会做出与实际风险不匹配的决策。",
      "我们的 ARR 蒙特卡洛模型显示：5 年期末 P10 = $2.2M，P50 = $5.1M，P90 = $11.7M。",
      "这意味着：有 10% 的可能性你只能达到 $2.2M（远低于规模化的最低门槛）。这个 P10 才是你应该作为「资金预算决策」的基准。",
      "在我们的产品中，所有数字默认显示三段（P10 · P50 · P90），并附 Bootstrap 置信区间。",
      "这是我们与传统咨询公司的最大差别：我们不假装精确。"
    ]
  },
  {
    slug: "regulator-watcher-architecture",
    title: "监管扫描智能体：3 国 7 法规，72 小时全量重算",
    excerpt: "我们如何用一个智能体，让政策变化的影响在 72 小时内重算到你的所有项目模型里。",
    date: "2026-03-12",
    author: "Tobias W. · 平台架构",
    image: "/images/tech-architecture.png",
    tags: ["技术架构", "合规"],
    body: [
      "Regulator Watcher 每 6 小时扫描中国、美国、欧盟主要监管机构的更新（NMPA、FDA、SEC、ESMA、CAC、EDPB...）。",
      "当一个新的政策更新与某个赛道相关时，平台会触发 3 步管线：影响识别 → 重算 → 用户通知。",
      "整个过程平均耗时 72 小时（包括人工 Critic 审核）。",
      "对深度陪跑客户，所有相关项目的财务模型与赛道排序会被重算并标记差异。",
      "这是 SaaS 时代「订阅 ≠ 一次性交付」的真正含义：随政策变化，你的报告会自动演化。"
    ]
  },
  {
    slug: "critic-agent-explained",
    title: "Critic Agent 是怎么工作的？——多智能体协作的反向证伪",
    excerpt: "单个 LLM 容易陷入幸存者偏差。Critic Agent 的任务是证伪，不是证成。",
    date: "2026-02-25",
    author: "陈维 · 首席分析师",
    image: "/images/multi-agent.png",
    tags: ["技术架构", "AI 智能体"],
    body: [
      "传统 LLM 应用倾向于「让用户满意」，这导致一类系统性偏差：过度乐观。",
      "Critic Agent 是一个独立运行的、奖励函数完全相反的智能体——它的目标是找出主分析的逻辑漏洞、未交叉验证的证据、与历史数据相反的结论。",
      "在我们的评测集上，启用 Critic 后报告的「致命假设遗漏率」下降 67%。",
      "Critic 不会推翻主分析的结论，但会强制要求主分析对反向论证给出明确回应。",
      "这就是为什么我们的报告比一般 AI 输出多 30% 的「我们承认不知道」式陈述——这是诚实的代价，也是诚实的价值。"
    ]
  },
  {
    slug: "ai-track-2027-outlook",
    title: "AI 应用与数据服务：2027 展望，三个关键转折点",
    excerpt: "我们在赛道引擎中给 AI 应用打了 79.96% 的首优频率。但这不意味着所有 AI 项目都会成功。",
    date: "2026-02-10",
    author: "李霄 · 行业研究",
    image: "/images/growth-city.png",
    tags: ["赛道分析", "AI"],
    body: [
      "AI 应用与数据服务在我们的蒙特卡洛排序中以 79.96% 的首优频率领先。但这只是「平均」最优。",
      "三个关键转折点会决定具体项目的命运：",
      "(1) 数据壁垒：当通用 LLM 能力足够强时，垂直领域的「数据壁垒」迅速消解。专有数据 + 闭环反馈是真正的护城河。",
      "(2) 监管侧：生成式 AI 服务管理暂行办法的细则在 2026 H2 进入第二阶段。能否合规通过决定 24 个月内的市场准入。",
      "(3) 单位经济：API 成本 2026-2027 预计下降 40%，但价格战会同步压低 ARPU。能否在 18 个月内建立差异化定价权是关键。",
      "我们的赛道引擎对每条赛道都做了类似的「关键转折点」标注。"
    ]
  }
];

export default function InsightsPage() {
  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Insights</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              方法论 · 数据 · <span className="text-gradient-blue">反向证伪</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              我们把研究方法、技术架构与失败案例公开发表——这是我们与你建立信任的方式。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {POSTS.map((p, i) => (
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
                          {p.tags.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-50 text-ink-500 border border-ink-100">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[12px] text-ink-700 group-hover:text-accent-gold transition-colors">
                          阅读全文 <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Newsletter</p>
                <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">每月 1 篇深度推送</h2>
                <p className="mt-3 text-[14px] text-ink-500">脱敏行业研究 + 模型方法论 + 法务结构案例。不发广告，只发研究。</p>
              </div>
              <form className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="founder@yourdomain.com"
                  className="flex-1 h-12 px-5 rounded-full border border-ink-200 focus:outline-none focus:border-ink-700 text-[14px]"
                />
                <button type="submit" className="btn-primary">订阅</button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
