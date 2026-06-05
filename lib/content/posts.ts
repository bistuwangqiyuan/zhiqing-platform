import type { Locale } from "@/i18n/routing";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  body: string[];
};

const ZH: Post[] = [
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

const EN: Post[] = [
  {
    slug: "what-pre-founders-actually-need",
    title: "What pre-founders actually need isn't more data — it's fewer illusions",
    excerpt: "Across the 86 projects we've coached, 63% of failures traced back to one common problem: using survivorship bias as the basis for decisions.",
    date: "2026-04-22",
    author: "Chen Wei · Chief Analyst",
    image: "/images/about-office.png",
    tags: ["Pre-founding", "Decision methodology"],
    body: [
      "We've coached 86 projects to date (through Q1 2026). 41 reached commercial success (Tier-2 or above); 45 stalled at Tier-3 or lower.",
      "Our reverse-causal analysis found that among the failures, 63% made the same kind of mistake: using 'successful founders' stories' as the basis for their decisions.",
      "Successful founders' retellings contain too much hindsight rationalization. When you treat them as a path, you see 1 winner and miss the 999 who failed.",
      "ZhiQing PreFounder's core difference: we show you the 8,000 failed paths out of 12,000 Monte Carlo runs — understanding why something fails matters more than understanding why it succeeds.",
      "That's the point of the Critic Agent: every report must pass counter-falsification, and every conclusion must have a control group of opposing assumptions.",
      "If you're seriously considering a startup, spend your first budget on 'falsifying,' not 'confirming.'"
    ]
  },
  {
    slug: "5-percent-equity-economics",
    title: "Why a '5% equity alignment'? — The economics of the Deep Program",
    excerpt: "5% isn't a number game. It's the boundary of shared obligation between the platform and the project — neither replacing the founder's decisions nor degrading into 'pay-to-deliver.'",
    date: "2026-04-15",
    author: "Li Xiao · Legal Architecture",
    image: "/images/product-report.png",
    tags: ["Equity", "Deep Program"],
    body: [
      "People often ask: why 5%? Why not 1% or 10%?",
      "5% is a model-backtested optimal band: below 3%, platform compensation isn't incentivizing enough; above 8%, it conflicts with founder control.",
      "Across 12,000 Monte Carlo paths, a 5% stake yields a median 5-year exit cash flow of about $12.9M (median post-money $12M × median MOIC × stake).",
      "But more importantly: 5% equity, combined with 'lock-up + anti-dilution protection + disclosure terms,' builds a long-term alliance rather than a short-term advisory relationship.",
      "We never make any decision that carries control implications for you. The board observer seat (optional) is just an observer seat, not a voting seat."
    ]
  },
  {
    slug: "monte-carlo-decision-making",
    title: "Monte Carlo isn't more precise — it admits you can't be precise",
    excerpt: "We don't show 'expected value,' we show P10–P50–P90. Not because we fear accountability, but because expected value lies.",
    date: "2026-03-28",
    author: "Mariam K. · Head of Quant Research",
    image: "/images/monte-carlo.png",
    tags: ["Quant methods", "Monte Carlo"],
    body: [
      "If you only look at a single expected value (say, an ARR expectation of $5M), you'll make decisions that don't match the real risk.",
      "Our ARR Monte Carlo model shows: at the end of 5 years, P10 = $2.2M, P50 = $5.1M, P90 = $11.7M.",
      "That means there's a 10% chance you only reach $2.2M (well below the minimum threshold for scaling). That P10 is what you should use as the basis for your 'capital-budget decision.'",
      "In our product, every number shows three bands by default (P10 · P50 · P90), with a bootstrap confidence interval.",
      "This is our biggest difference from traditional consulting firms: we don't pretend to be precise."
    ]
  },
  {
    slug: "regulator-watcher-architecture",
    title: "The regulatory-scan agent: 3 countries, 7 regulations, full recompute in 72 hours",
    excerpt: "How we use a single agent to recompute the impact of a policy change across all your project models within 72 hours.",
    date: "2026-03-12",
    author: "Tobias W. · Platform Architecture",
    image: "/images/tech-architecture.png",
    tags: ["Architecture", "Compliance"],
    body: [
      "Regulator Watcher scans updates from major regulators in China, the US, and the EU every 6 hours (NMPA, FDA, SEC, ESMA, CAC, EDPB...).",
      "When a new policy update is relevant to a track, the platform triggers a 3-step pipeline: impact identification → recompute → user notification.",
      "The whole process averages 72 hours (including human Critic review).",
      "For Deep Program clients, the financial models and track rankings of all relevant projects are recomputed and flagged for differences.",
      "This is what 'subscription ≠ one-time delivery' truly means in the SaaS era: as policy changes, your report evolves automatically."
    ]
  },
  {
    slug: "critic-agent-explained",
    title: "How does the Critic Agent work? — Counter-falsification in multi-agent collaboration",
    excerpt: "A single LLM easily falls into survivorship bias. The Critic Agent's job is to falsify, not to confirm.",
    date: "2026-02-25",
    author: "Chen Wei · Chief Analyst",
    image: "/images/multi-agent.png",
    tags: ["Architecture", "AI agents"],
    body: [
      "Traditional LLM apps tend to 'please the user,' which causes a systematic bias: over-optimism.",
      "The Critic Agent is an independently running agent with the exact opposite reward function — its goal is to find logical holes in the main analysis, un-cross-validated evidence, and conclusions that contradict historical data.",
      "On our evaluation set, enabling the Critic reduced the report's 'fatal-assumption omission rate' by 67%.",
      "The Critic doesn't overturn the main analysis's conclusions, but it forces the main analysis to respond explicitly to the counter-arguments.",
      "That's why our reports contain 30% more 'we admit we don't know' statements than typical AI output — that's the cost of honesty, and its value."
    ]
  },
  {
    slug: "ai-track-2027-outlook",
    title: "AI Applications & Data Services: a 2027 outlook and three key inflection points",
    excerpt: "Our track engine gives AI applications a 79.96% top-pick frequency. But that doesn't mean every AI project will succeed.",
    date: "2026-02-10",
    author: "Li Xiao · Industry Research",
    image: "/images/growth-city.png",
    tags: ["Track analysis", "AI"],
    body: [
      "AI Applications & Data Services leads our Monte Carlo ranking with a 79.96% top-pick frequency. But that's only the 'average' optimum.",
      "Three key inflection points will decide a specific project's fate:",
      "(1) Data barriers: when general-purpose LLMs are strong enough, vertical 'data barriers' dissolve quickly. Proprietary data + closed-loop feedback is the real moat.",
      "(2) Regulation: the detailed rules of the Interim Measures for Generative AI Services enter their second phase in H2 2026. Passing compliance decides market access over the next 24 months.",
      "(3) Unit economics: API costs are expected to drop 40% in 2026-2027, but price wars will compress ARPU in parallel. Establishing differentiated pricing power within 18 months is the key.",
      "Our track engine annotates similar 'key inflection points' for every track."
    ]
  }
];

export const POSTS_BY_LOCALE: Record<Locale, Post[]> = { zh: ZH, en: EN };

// Stable across locales — drives generateStaticParams.
export const POST_SLUGS = ZH.map((p) => p.slug);

export function getPosts(locale: string): Post[] {
  return POSTS_BY_LOCALE[(locale as Locale)] ?? ZH;
}

export function getPost(locale: string, slug: string): Post | undefined {
  return getPosts(locale).find((p) => p.slug === slug);
}
