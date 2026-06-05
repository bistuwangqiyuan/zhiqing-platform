import type { Locale } from "@/i18n/routing";

export type CaseMetric = { label: string; value: string };
export type CaseStudy = {
  id: string;
  title: string;
  track: string;
  region: string;
  year: number;
  image: string;
  summary: string;
  metrics: CaseMetric[];
  body: string[];
};

const ZH: CaseStudy[] = [
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

const EN: CaseStudy[] = [
  {
    id: "ai-saas-2027",
    title: "AI Knowledge-Workflow SaaS · Series A US$80M",
    track: "AI Applications & Data Services",
    region: "Shenzhen / San Francisco",
    year: 2027,
    image: "/images/case-study-1.png",
    summary:
      "At the track-selection stage, the platform used counter-scenarios to surface 3 fatal assumptions (data wall, customer implementation cycle, regulatory risk). The founding team pivoted within 6 months and ultimately closed its Series A.",
    metrics: [
      { label: "Due-diligence time saved", value: "62%" },
      { label: "Valuation multiple", value: "9.3x" },
      { label: "ARR at 36 months", value: "$24M" }
    ],
    body: [
      "The team kicked off the Deep Program in Q4 2026. Original assumption: a B2C content-creation SaaS.",
      "A 5-dimension track stress test found B2C acquisition cost (CAC) lacked elasticity, and China's Interim Measures for Generative AI Services pushed content-platform compliance costs down on margins by roughly 18-26%.",
      "The platform's Critic Agent produced 12 counter-falsifications; the team pivoted to an 'enterprise knowledge workflow' PMF in 60 days. Across 12K Monte Carlo paths, median ARR rose 4.2x and survival probability 1.7x after the pivot.",
      "Signed for a 5% stake (common shares + anti-dilution protection). Closed Series A in H2 2027 at a $200M valuation."
    ]
  },
  {
    id: "robotics-arm-2027",
    title: "Industrial Cobot Arm · Pre-A US$15M",
    track: "Advanced Manufacturing",
    region: "Suzhou / Munich",
    year: 2027,
    image: "/images/growth-city.png",
    summary:
      "Facing a European market-entry decision, the platform delivered a 3-country compliance timeline + tariff scenarios + channel profit-share sensitivity, averting a flawed plan to set up a German subsidiary.",
    metrics: [
      { label: "Compliance advisory saved", value: "$420K" },
      { label: "Valuation revision", value: "+38%" },
      { label: "First delivery", value: "T+5 mo" }
    ],
    body: [
      "Original plan: a German subsidiary + direct sales. The platform model estimated an EBITDA gap of ~€4.6M over the first 18 months.",
      "Alternative path: a Dutch channel profit-share + German market agency, saving €2.8M over the first 18 months but forgoing 3 large-customer opportunities.",
      "The Critic Agent's 12-dimension assessment recommended a Dutch channel profit-share + a Munich engineering-delivery node, securing technical validation with 7 major customers.",
      "Pre-A valuation rose from $35M to $48M, with no down-round risk."
    ]
  },
  {
    id: "medical-device-2028",
    title: "Cardiovascular Consumable · Angel US$6M",
    track: "Healthcare & Devices",
    region: "Shanghai / Boston",
    year: 2028,
    image: "/images/multi-agent.png",
    summary:
      "By laying out the NMPA registration path and FDA 510(k) timeline in parallel, the team avoided duplicate validation and compressed an 18-month regulatory path to 11 months.",
    metrics: [
      { label: "Regulatory path cut", value: "-39%" },
      { label: "First clinical sites", value: "8" },
      { label: "Valuation multiple", value: "5.7x" }
    ],
    body: [
      "The team originally planned for NMPA only. The platform's policy scan found a 70% overlap between NMPA and FDA in device classification and clinical-dataset definitions.",
      "The platform delivered a dual-track registration timeline + clinical-site priority (by enrollment speed × data compliance) and connected the team to 3 CROs experienced in dual-track filings.",
      "Outcome: 65% data reuse between NMPA Class III and FDA 510(k), saving $1.2M of duplicate clinical budget.",
      "Closed a $6M angel round at a $36M pre-money valuation."
    ]
  },
  {
    id: "green-battery-2028",
    title: "Sodium-Ion Storage Integration · Series A US$45M",
    track: "Green & Energy Materials",
    region: "Ningde / Paris",
    year: 2028,
    image: "/images/track-pillars.png",
    summary:
      "Choosing between lithium and sodium, the platform used a 6-dimension cost-path model + 3-country tariff sensitivity to justify a narrow-band entry strategy: sodium-ion + C&I energy storage.",
    metrics: [
      { label: "Entry niche", value: "C&I storage" },
      { label: "Gross margin", value: "27.4%" },
      { label: "First-year orders", value: "$12M" }
    ],
    body: [
      "Sodium-ion material route: hard-carbon anode + Prussian-white cathode — 5 sources of uncertainty across raw-material price / cycle.",
      "The platform delivered cost paths across 10K Monte Carlo paths and recommended 'no EV for 2 years, focus on C&I storage.'",
      "Acting on this strategy, the team built a 200MWh pilot line with a district in Ningde and won $12M of first-year orders.",
      "Series A valuation $180M, signed with a 5% equity alignment (restricted stock, 3-year vesting)."
    ]
  },
  {
    id: "enterprise-ops-2029",
    title: "Enterprise Operations Agent · Seed US$8M",
    track: "Enterprise Software & Automation",
    region: "Beijing / Singapore",
    year: 2029,
    image: "/images/product-dashboard.png",
    summary:
      "Targeting 'mid-market operations automation' — avoiding both consumer and mega-enterprise — the team validated its PMF hypothesis through 30 targeted customer interviews.",
    metrics: [
      { label: "Targeted interviews", value: "30" },
      { label: "PMF signal", value: "92%" },
      { label: "ACV", value: "$58K" }
    ],
    body: [
      "The platform's Interview Designer Agent auto-generated interview guides and counter-questions for 12 customer types.",
      "Of 30 interviews, 28 showed clear willingness to pay; 17 of those entered a pilot.",
      "ACV $58K, gross margin 72%, with a clear roadshow path.",
      "Closed an $8M seed round at a $40M pre-money valuation."
    ]
  },
  {
    id: "logistics-data-2029",
    title: "Cross-Border Logistics Data Hub · Series A US$30M",
    track: "AI Applications & Data Services",
    region: "Hangzhou / Rotterdam",
    year: 2029,
    image: "/images/about-office.png",
    summary:
      "Using a 5-country customs-compliance timeline + a data-flow risk map, the team cut the clearance-failure rate from 4.7% to 0.6%.",
    metrics: [
      { label: "Clearance-failure rate", value: "↓ 87%" },
      { label: "Customer retention", value: "94%" },
      { label: "ARR at 24 months", value: "$11M" }
    ],
    body: [
      "Data-compliance issues in the old system delayed 110K of 2.4M shipments.",
      "The platform's Regulator Watcher produced 5-country data-flow compliance requirements + a risk-path map.",
      "The clearance-failure rate fell from 4.7% to 0.6%, and customer NPS rose +28.",
      "Series A valuation $260M, with existing shareholders fully topping up."
    ]
  }
];

export const CASES_BY_LOCALE: Record<Locale, CaseStudy[]> = { zh: ZH, en: EN };

// Stable across locales — drives generateStaticParams.
export const CASE_IDS = ZH.map((c) => c.id);

export function getCases(locale: string): CaseStudy[] {
  return CASES_BY_LOCALE[(locale as Locale)] ?? ZH;
}

export function getCase(locale: string, id: string): CaseStudy | undefined {
  return getCases(locale).find((c) => c.id === id);
}
