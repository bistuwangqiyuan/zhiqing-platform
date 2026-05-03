import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, MapPin, Calendar, Users, TrendingUp } from "lucide-react";

export const metadata = { title: "案例" };

export const CASES = [
  {
    id: "ai-saas-2027",
    title: "AI 知识工作流 SaaS · A 轮 8000 万美元",
    track: "AI 应用与数据服务",
    region: "深圳 / 旧金山",
    year: 2027,
    image: "/images/case-study-1.png",
    summary:
      "在赛道选择阶段，平台通过反向情景识别 3 项致命假设（数据墙、客户实施周期、监管侧风险），创始团队在 6 个月内完成转向，最终斩获 A 轮。",
    metrics: [
      { label: "节省尽调时间", value: "62%" },
      { label: "估值倍数", value: "9.3x" },
      { label: "ARR 36 个月", value: "$24M" }
    ],
    body: [
      "团队在 2026 年 Q4 启动深度陪跑。原始假设：B2C 内容创作 SaaS。",
      "通过 5 维赛道压力测试，发现 B2C 渠道获客成本 (CAC) 弹性不足，且监管侧《生成式 AI 服务管理暂行办法》对内容平台的合规成本压制利润率约 18-26%。",
      "平台 Critic Agent 输出 12 条反向证伪，团队在 60 天内完成 PMF 转向至「企业知识工作流」。蒙特卡洛 12K 路径下，转向后 ARR 中位提升 4.2x，存活率提升 1.7x。",
      "签约 5% 股权 (普通股 + 反稀释保护)。2027 H2 完成 A 轮，估值 $200M。"
    ]
  },
  {
    id: "robotics-arm-2027",
    title: "工业机器人协作臂 · Pre-A 1500 万美元",
    track: "先进制造",
    region: "苏州 / 慕尼黑",
    year: 2027,
    image: "/images/growth-city.png",
    summary:
      "面对欧洲市场进入决策，平台输出 3 国合规时间轴 + 关税情景 + 渠道分润敏感性，避免一次错误的德国子公司设立计划。",
    metrics: [
      { label: "节省合规咨询", value: "$420K" },
      { label: "估值修正", value: "+38%" },
      { label: "首单交付", value: "T+5 月" }
    ],
    body: [
      "原计划：德国子公司 + 直营销售。平台模型估算前 18 个月 EBITDA 缺口 ~ €4.6M。",
      "替代路径：荷兰渠道分润 + 德国市场代理，前 18 个月节约成本 €2.8M，但失去 3 个大客户机会。",
      "Critic Agent 综合 12 维评估，最终建议：荷兰渠道分润 + 慕尼黑工程交付分点，达成 7 大客户技术验证。",
      "Pre-A 估值由 $35M → $48M，无 down round 风险。"
    ]
  },
  {
    id: "medical-device-2028",
    title: "心血管耗材 · 天使轮 600 万美元",
    track: "医疗健康与器械",
    region: "上海 / 波士顿",
    year: 2028,
    image: "/images/multi-agent.png",
    summary:
      "把 NMPA 注册路径与 FDA 510(k) 时间轴并行铺开，避免重复验证；将 18 个月监管路径压缩至 11 个月。",
    metrics: [
      { label: "监管路径压缩", value: "-39%" },
      { label: "首批临床中心", value: "8 家" },
      { label: "估值倍数", value: "5.7x" }
    ],
    body: [
      "团队原计划仅做 NMPA。平台政策扫描发现：器械分类与临床数据集口径在 NMPA / FDA 间存在 70% 重叠。",
      "平台输出双轨注册时间轴 + 临床中心选择优先级 (按入组速度 × 数据合规)，并对接 3 家具备双轨经验的 CRO 顾问。",
      "实际效果：NMPA 三类与 FDA 510(k) 数据复用率 65%，节约重复临床预算 $1.2M。",
      "天使轮按 $36M Pre-money 完成 $6M 融资。"
    ]
  },
  {
    id: "green-battery-2028",
    title: "钠电储能系统集成 · Series A 4500 万美元",
    track: "绿色低碳与能源材料",
    region: "宁德 / 巴黎",
    year: 2028,
    image: "/images/track-pillars.png",
    summary:
      "在锂电与钠电之间，平台用 6 维成本路径模型 + 3 国关税敏感性，论证「钠电 + 工商业储能」窄带切入战略。",
    metrics: [
      { label: "切入窄带", value: "工商储能" },
      { label: "毛利率", value: "27.4%" },
      { label: "首年订单", value: "$12M" }
    ],
    body: [
      "钠电材料路线：硬碳负极 + 普鲁士白正极。原料价格 / 周期共 5 个不确定性来源。",
      "平台输出蒙特卡洛 1 万路径下的成本路径，建议「2 年内不进 EV、聚焦工商业储能」。",
      "团队据此战略与宁德某区合作建成 200MWh 中试线，首年获 $12M 订单。",
      "Series A 估值 $180M，签约 5% 股权对齐 (受限股，3 年解锁)。"
    ]
  },
  {
    id: "enterprise-ops-2029",
    title: "企业运营智能体 · Seed 800 万美元",
    track: "企业软件与自动化",
    region: "北京 / 新加坡",
    year: 2029,
    image: "/images/product-dashboard.png",
    summary:
      "切入「中型企业运营自动化」，避开 ToC 与超大企业，通过 30 家定向客户访谈完成 PMF 假设验证。",
    metrics: [
      { label: "定向客户访谈", value: "30 家" },
      { label: "PMF 信号", value: "92%" },
      { label: "ACV", value: "$58K" }
    ],
    body: [
      "平台 Interview Designer Agent 自动生成 12 个客户类型的访谈提纲与反向问题。",
      "30 场访谈中 28 场有明确付费意向；其中 17 家进入试点。",
      "ACV $58K，毛利 72%，路演路径清晰。",
      "Seed $8M 完成，估值 $40M Pre-money。"
    ]
  },
  {
    id: "logistics-data-2029",
    title: "跨境物流数据中台 · Series A 3000 万美元",
    track: "AI 应用与数据服务",
    region: "杭州 / 鹿特丹",
    year: 2029,
    image: "/images/about-office.png",
    summary:
      "用 5 国清关合规时间轴 + 数据流转风险图谱，把通关失败率从 4.7% 降到 0.6%。",
    metrics: [
      { label: "通关失败率", value: "↓ 87%" },
      { label: "客户留存", value: "94%" },
      { label: "ARR 24 个月", value: "$11M" }
    ],
    body: [
      "原系统数据合规问题导致 2.4M 单中 11 万单延误。",
      "平台 Regulator Watcher 输出 5 国数据流转合规要求 + 风险路径图谱。",
      "实际通关失败率从 4.7% 降至 0.6%，客户 NPS +28。",
      "Series A 估值 $260M，老股东全数加注。"
    ]
  }
];

export default function CasesPage() {
  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Selected Engagements</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              真实陪跑案例 · <span className="text-gradient-gold">每一项判断都可追溯</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              下列案例为脱敏 / 化名展示，详细数据与法务结构以保密协议为准。深度陪跑客户可获得完整复盘报告。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link
                  href={`/cases/${c.id}`}
                  className="group relative block rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-[11px] tracking-[0.15em] uppercase text-white/95 bg-black/35 backdrop-blur px-2.5 py-1 rounded-full">
                      {c.track}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] text-ink-400">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{c.year}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{c.region}</span>
                    </div>
                    <h3 className="mt-3 text-[16px] font-semibold text-ink-900 tracking-snug group-hover:text-ink-700 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-500 leading-relaxed line-clamp-3">{c.summary}</p>
                    <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-ink-100">
                      {c.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="text-[10px] text-ink-400">{m.label}</p>
                          <p className="mt-1 text-[14px] font-semibold ticker text-ink-900">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1 text-[12px] text-ink-700 group-hover:text-accent-gold transition-colors">
                      查看完整案例
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
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
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
              <h2 className="text-display-md font-semibold tracking-snug text-ink-900">想成为下一个深度陪跑案例？</h2>
              <p className="mt-3 max-w-xl mx-auto text-ink-500">先做一次免费的赛道压力测试，再决定是否签约。</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/track-analytics" className="btn-primary">
                  免费赛道测试 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact?type=deep" className="btn-gold">
                  申请深度陪跑
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
