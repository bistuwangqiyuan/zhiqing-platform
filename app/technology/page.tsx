import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight, Search, Shield, Zap, Database, Cpu, FileText, Bot, Bug, GitBranch } from "lucide-react";

export const metadata = { title: "技术架构" };

const LAYERS = [
  {
    icon: <Database className="h-5 w-5" />,
    name: "数据层 · Data Layer",
    desc: "结构化产业数据库（公开报告、财报、政策、专利、招聘趋势）+ 用户私有数据隔离仓",
    keys: ["50+ 数据源", "增量同步 24/7", "脱敏与权限分级"]
  },
  {
    icon: <Search className="h-5 w-5" />,
    name: "检索层 · Retrieval",
    desc: "向量检索 + BM25 + 关系图谱混合，再由 Re-rank Agent 做证据片段重排",
    keys: ["Hybrid Search", "Top-K 100→12 重排", "片段引用率 ≥ 92%"]
  },
  {
    icon: <Bot className="h-5 w-5" />,
    name: "智能体层 · Agent Mesh",
    desc: "12 个分工 Agent (产业研究 / 竞品 / 政策 / 财务 / 法务 / 路演 / 撰稿 / Critic 等)",
    keys: ["多模型路由", "并行 + 仲裁", "可观测调度"]
  },
  {
    icon: <Bug className="h-5 w-5" />,
    name: "评测层 · Evaluation",
    desc: "Critic Agent 反向证伪 + 自动化评测集 + 内容安全过滤",
    keys: ["反向论证", "幻觉检测", "合规标签"]
  },
  {
    icon: <FileText className="h-5 w-5" />,
    name: "交付层 · Delivery",
    desc: "BP / 可行性报告 / 路演材料 / Excel 数据包 / 网站交互可视化",
    keys: ["PDF / DOCX", "Excel 联动", "Web 交互"]
  },
  {
    icon: <Shield className="h-5 w-5" />,
    name: "审计层 · Audit",
    desc: "Prompt / 模型版本 / 检索片段 / 时间戳全量留痕，可向投资人与监管复现",
    keys: ["不可篡改日志", "复现包导出", "SOC 2 路线图"]
  }
];

const AGENTS = [
  { name: "产业研究 · Industry Researcher", role: "拆解赛道结构、边界、价值链" },
  { name: "竞品 Proxy · Competitor Analyst", role: "财务 proxy + 战略意图推断" },
  { name: "政策扫描 · Regulator Watcher", role: "持续追踪监管事件与政策导向" },
  { name: "财务建模 · Financial Modeler", role: "蒙特卡洛 + 敏感性 + NPV" },
  { name: "法务结构 · Legal Architect", role: "增资 / 转让 / 换股标准条款" },
  { name: "访谈提纲 · Interview Designer", role: "尽调清单与客户访谈提纲" },
  { name: "撰稿 · Writer", role: "BP / 可行性报告结构化撰写" },
  { name: "排版 · Designer", role: "PDF / 路演 / Web 交互输出" },
  { name: "Critic · Adversarial", role: "反向论证、识别幸存者偏差" },
  { name: "评测 · Evaluator", role: "幻觉检测、引用一致性" },
  { name: "调度 · Orchestrator", role: "Agent 路由与仲裁" },
  { name: "审计 · Auditor", role: "全量日志与复现包" }
];

export default function TechnologyPage() {
  const cost = models.ai.per_report;
  const sub = models.ai.monthly_per_user_subscription;

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Technology</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              不做行情低延迟交易——<span className="text-gradient-blue">研究即架构</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              智擎 PreFounder 与证券交易架构本质不同：核心是检索增强生成、结构化数值引擎、评测集与内容安全过滤器，以及全量审计留痕。
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/tech-architecture.png" alt="六层技术栈" fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">六层技术栈</p>
                <p className="mt-1 text-display-md font-semibold">研究 → 检索 → 智能体 → 评测 → 交付 → 审计</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIX LAYERS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Six-Layer Stack</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              层层可测、层层可审、<span className="text-gradient-gold">层层可复现</span>。
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAYERS.map((l, i) => (
              <Reveal key={l.name} delay={i * 0.05}>
                <div className="relative h-full rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
                    {l.icon}
                  </span>
                  <h3 className="mt-5 text-headline font-semibold text-ink-900">{l.name}</h3>
                  <p className="mt-2 text-[14px] text-ink-500 leading-relaxed">{l.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {l.keys.map((k) => (
                      <span key={k} className="text-[11px] px-2 py-1 rounded-full bg-ink-50 text-ink-600 border border-ink-100">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT MESH */}
      <section className="section bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <Image src="/images/multi-agent.png" alt="" fill className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/40" />
        </div>
        <div className="container relative">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">Multi-Agent Mesh</p>
            <h2 className="mt-3 text-display-lg font-semibold tracking-snug max-w-3xl">
              12 位智能体，分工 · 协作 · <span className="text-gradient-gold">相互证伪</span>。
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] text-white/75">
              单一 Agent 容易陷入幸存者偏差与共谋错误。我们用任务分工 + Critic 反向论证 + 评测层一票否决，把"看似自洽"的结论与真正可重复的结论分开。
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENTS.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.03}>
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-accent-gold">
                    <Cpu className="h-4 w-4" />
                    <p className="text-[11px] tracking-[0.15em] uppercase">Agent {String(i + 1).padStart(2, "0")}</p>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-white">{a.name}</p>
                  <p className="mt-1 text-[12px] text-white/60">{a.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COST TRANSPARENCY */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Cost Transparency · 模型 03</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              我们把<span className="text-gradient-blue">单位成本</span>摊开给你看。
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-ink-500">
              不是市场价，是每一份 60-120 页深度报告我们真实的边际成本，逐行逐项可复算。
            </p>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">单份深度报告 · 边际成本</p>
                <p className="mt-2 text-display-md font-semibold text-ink-900">${cost.total_per_report.toFixed(2)}</p>
                <ul className="mt-6 space-y-3 text-[14px]">
                  <Row label="API 推理 (635K tokens, 70:30 in/out 混合定价)" value={`$${cost.api_cost.toFixed(2)}`} />
                  <Row label="嵌入与向量检索" value={`$${cost.embedding_cost.toFixed(2)}`} />
                  <Row label="评测与安全过滤" value={`$${cost.safety_eval_cost.toFixed(2)}`} />
                  <Row label="文档生成 (PDF/Excel/路演)" value={`$${cost.docgen_cost.toFixed(2)}`} />
                  <Row label="工程师内部分摊" value={`$${cost.engineer_alloc.toFixed(2)}`} />
                </ul>
                <p className="mt-5 text-[12px] text-ink-400">
                  注：报价端 $25K-$45K 不等，毛利空间用于模型迭代、复杂尽调与法务结构成本。
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-7">
                <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">单订阅用户 · 月度服务成本</p>
                <p className="mt-2 text-display-md font-semibold text-ink-900">${sub.monthly_total.toFixed(2)}/月</p>
                <ul className="mt-6 space-y-3 text-[14px]">
                  <Row label="API 推理" value={`$${sub.monthly_api_cost.toFixed(2)}`} />
                  <Row label="存储 (用户工作空间)" value={`$${sub.monthly_storage.toFixed(2)}`} />
                  <Row label="CDN / 网络" value={`$${sub.monthly_cdn.toFixed(2)}`} />
                  <Row label="鉴权 / 风控" value={`$${sub.monthly_auth.toFixed(2)}`} />
                </ul>
                <p className="mt-5 text-[12px] text-ink-400">规模化后预计单位成本下降 ~35% (模型 03 注：保守保留)。</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
            <Zap className="h-6 w-6 mx-auto text-accent-azure" />
            <h2 className="mt-4 text-display-md font-semibold tracking-snug text-ink-900">看一下我们的赛道分析引擎跑起来。</h2>
            <p className="mt-3 max-w-xl mx-auto text-ink-500">15K 蒙特卡洛路径，输出首优频率、排序稳健性与基准得分热力图。</p>
            <Link href="/track-analytics" className="mt-8 btn-primary">
              进入赛道引擎 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-none">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-700 ticker">{value}</span>
    </li>
  );
}
