import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight, ShieldCheck, Globe2 } from "lucide-react";

export const metadata = { title: "关于" };

const TEAM = [
  { name: "陈维", role: "首席分析师 / 联合创始人", bio: "前麦肯锡咨询合伙人 · 哈佛 MBA · 12 年战略与产业研究经验" },
  { name: "李霄", role: "法务架构 / 联合创始人", bio: "前 KKR 法务总监 · NYU LLM · 跨境股权与并购法律 14 年" },
  { name: "Mariam K.", role: "量化研究负责人", bio: "MIT 计算金融博士 · 前 Two Sigma 研究员 · 蒙特卡洛与情景分析专家" },
  { name: "Tobias W.", role: "平台架构师", bio: "前 Google AI 资深工程师 · ETH Zurich · 多智能体系统专家" },
  { name: "陆嘉辰", role: "客户成功总监", bio: "前 SaaS 创业者 (A 轮 8000 万美元) · 北大光华 EMBA" },
  { name: "Sasha P.", role: "数据科学", bio: "前 Bloomberg 量化分析师 · LSE 经济学博士 · 政策与监管模型化" }
];

const ROADMAP = [
  { quarter: "2026 H1", milestone: "MVP 上线 · 启径标准版 · Seed 8-12M USD", status: "完成中" },
  { quarter: "2026 H2", milestone: "首批 12 个深度陪跑项目签约 · 5% 股权框架落地", status: "进行中" },
  { quarter: "2027 H1", milestone: "企业版发布 · API + SSO · 5 大行业模型库", status: "规划" },
  { quarter: "2027 H2", milestone: "Series A 25-40M USD · 销售规模化 · 投后管理工具", status: "规划" },
  { quarter: "2028", milestone: "海外市场进入 (新加坡 / 欧盟) · 跨境合规层", status: "规划" },
  { quarter: "2029", milestone: "Series B (可选) · 并购整合或预上市准备", status: "战略" },
  { quarter: "2030", milestone: "5 年累计收入 $355M · 净利 $235M · IPO 窗口", status: "目标" }
];

const RISKS = [
  { name: "监管收紧", level: "中-高", mitigation: "多智能体合规过滤 + 政策时间轴 + 法务季度审计" },
  { name: "AI 模型依赖", level: "中", mitigation: "多模型路由 + 自研轻量推理 + 缓存层降低单位成本" },
  { name: "客户获取成本", level: "中", mitigation: "高校 / 孵化器 / FA 渠道分润 + 内容营销长尾" },
  { name: "数据合规", level: "中", mitigation: "AES-256 加密 + 地域部署 + SOC 2 路线图" },
  { name: "5% 股权法律风险", level: "中", mitigation: "标准化 4 类条款 + 跨境法律顾问 + 季度披露" },
  { name: "幻觉与质量", level: "高", mitigation: "Critic Agent 反向证伪 + 评测集 + 引用一致性强制" }
];

export default function AboutPage() {
  const fund = models.fund;

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">About</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              我们不替你做决定——<br />
              我们让你的<span className="text-gradient-gold">决定可以被审计</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              智擎 PreFounder 是为「严肃创业者」打造的赛前实验室。我们结合多智能体研究、可复现的财务模型与法务结构化的换股安排，为你完成创业前最重要的判断。
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/about-office.png" alt="智擎办公室" fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">HQ Shanghai · Singapore · London</p>
                <p className="mt-1 text-display-md font-semibold">研究即产品 · 透明即护城河</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="section">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Mission</p>
            <p className="mt-4 text-display-md font-semibold text-ink-900 tracking-snug">
              在 70% 的创业失败源于「赛道与模式假设错误」的世界里，我们让创业前的判断可结构化、可量化、可审计。
            </p>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Team</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              28 人，全部来自<span className="text-gradient-blue">麦肯锡 · KKR · MIT · Google · Two Sigma</span>。
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              5 年期内规划至 125 人 · 累计人力成本 $51.8M (模型 07)
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.03}>
                <div className="rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500 hover:-translate-y-0.5">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-ink-300 via-ink-500 to-ink-700 grid place-items-center text-white text-xl font-semibold">
                    {m.name[0]}
                  </div>
                  <h3 className="mt-5 text-headline font-semibold text-ink-900">{m.name}</h3>
                  <p className="mt-1 text-[12px] text-ink-500">{m.role}</p>
                  <p className="mt-3 text-[13px] text-ink-600 leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE / RISKS */}
      <section id="governance" className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Governance & Risk</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              把<span className="text-gradient-gold">风险</span>说清楚，比把故事说清楚更重要。
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">风险名称</th>
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">等级</th>
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">缓释机制</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {RISKS.map((r) => (
                    <tr key={r.name}>
                      <td className="py-3 px-5 text-ink-700 font-medium">{r.name}</td>
                      <td className="py-3 px-5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                          r.level.includes("高") ? "bg-red-50 text-red-700" :
                          r.level.includes("中") ? "bg-amber-50 text-amber-700" :
                          "bg-emerald-50 text-emerald-700"
                        }`}>
                          {r.level}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-ink-500">{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="section bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-32 -left-32 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-accent-gold/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-accent-azure/20 to-transparent blur-3xl" />
        </div>
        <div className="container relative">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">Roadmap</p>
            <h2 className="mt-3 text-display-lg font-semibold tracking-snug max-w-3xl">
              5 年里程碑 · <span className="text-gradient-gold">逐季可验证</span>。
            </h2>
          </Reveal>

          <div className="mt-12 relative">
            <div className="absolute left-4 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-white/15" />
            <ul className="space-y-8">
              {ROADMAP.map((r, i) => (
                <Reveal key={r.quarter} delay={i * 0.05}>
                  <li className={`relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-10 ${i % 2 === 0 ? "" : "lg:[&>:first-child]:order-2"}`}>
                    <div className="absolute left-3 lg:left-1/2 lg:-translate-x-1/2 top-2 h-3 w-3 rounded-full bg-accent-gold ring-4 ring-ink-900" />
                    <div className={`${i % 2 === 0 ? "lg:text-right lg:pr-10" : "lg:pl-10"}`}>
                      <p className="text-[12px] tracking-[0.18em] uppercase text-white/60">{r.quarter}</p>
                      <h3 className="mt-2 text-headline font-semibold text-white">{r.milestone}</h3>
                      <span className={`mt-2 inline-block text-[11px] px-2 py-0.5 rounded-full ${
                        r.status === "完成中" ? "bg-emerald-500/20 text-emerald-300" :
                        r.status === "进行中" ? "bg-accent-gold/20 text-accent-gold" :
                        r.status === "规划" ? "bg-white/10 text-white/70" :
                        "bg-white/5 text-white/50"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section id="disclaimer" className="section">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Disclaimer · 重要声明</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">机密 · 仅供合格决策与融资审阅</h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 space-y-5 text-[14px] text-ink-600 leading-relaxed">
              <p>
                本网站及其相关文件由智擎 PreFounder 筹备团队编制，面向潜在投资人、战略合作伙伴与经适当性评估的专业读者。
              </p>
              <p>
                除软件订阅与商业计划书 / 可行性研究的咨询费用外，本文所述「对目标公司持有约 5% 股权」须以依法签署的增资、股权转让或顾问换股等交易文件为准，并受公司注册地证券与私募融资规则约束；不构成任何公开募集或面向不特定对象的证券发行要约。
              </p>
              <p>
                本平台聚焦于创业前的行业/赛道研究、商业模式结构化论证与情景分析；不提供二级市场证券、期货的实盘交易指令。股权部分经济后果在模型中以「流动性实现」保守入账，未实现估值不确认为收入。
              </p>
              <p>
                文中预测与概率均源于可复现的 Python 模型与合理假设，存在重大不确定性。任何结论不应被视为对未来业绩或项目退出回报的承诺。
              </p>
              <p>
                典型持股 {(fund.typical_stake * 100).toFixed(0)}% · 12,000 路径蒙特卡洛 · SEED = 20260501 · 中位投后估值 ${fund.post_money_median_usd_mm}M
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="privacy" className="section bg-ink-50/40">
        <div className="container max-w-4xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Privacy Policy</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">隐私政策</h2>
            <ul className="mt-6 space-y-3 text-[14px] text-ink-600 list-disc list-inside">
              <li>所有用户工作空间数据采用 AES-256 加密存储</li>
              <li>按地域部署：中国 (上海)、新加坡、法兰克福</li>
              <li>不向第三方出售个人信息或工作空间数据</li>
              <li>可在 Account → Privacy 中导出 / 删除全部数据 (GDPR / 个人信息保护法对齐)</li>
              <li>SOC 2 Type II 认证路线图：2027 H1</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="terms" className="section">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
              <ShieldCheck className="h-6 w-6 mx-auto text-accent-gold" />
              <h2 className="mt-4 text-display-md font-semibold text-ink-900 tracking-snug">想看完整条款？</h2>
              <p className="mt-3 max-w-xl mx-auto text-ink-500">服务条款 / DPA / SCC / 跨境数据传输条款全文，以及法务结构化的 5% 股权标准模板。</p>
              <Link href="/contact?type=legal" className="mt-8 btn-primary inline-flex">
                索取完整法务包 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
