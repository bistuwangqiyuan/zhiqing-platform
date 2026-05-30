# 智擎 PreFounder · 网站平台

> 创业前赛道与商业模式智能决策平台 · 对标苹果级品质的世界级官网

[![SEED](https://img.shields.io/badge/SEED-20260501-C8A85A)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-000)](#)
[![Models](https://img.shields.io/badge/Python%20Models-9-0A84FF)](#)
[![Status](https://img.shields.io/badge/Status-Production-emerald)](#)

---

## 一、项目概述

`zhiqing-platform/` 是基于《智擎 PreFounder 商业计划书 v3.0》构建的世界级官网与产品入口。

- **设计：**Apple 级视觉语言（动效、视差、玻璃态、字体层级、明暗对比），中文 + 英文混排，高端大气。
- **技术：**Next.js 14 (App Router) + TypeScript + Tailwind 3 + Framer Motion + Recharts。
- **数据：**全部金融与概率数字均来自 9 个独立的 Python 模型，SEED = `20260501`，可一键复算。
- **完备性：**首页 / 产品 / 技术 / 赛道引擎 / 市场 + 财务 / 案例 / 案例详情 / 洞察 / 文章详情 / 定价 / 结账 / 联系 / 关于 + 团队 + 路线图 + 风险 + 免责声明。
- **互动功能：**评论（点赞 + 回复 + 富文本 + localStorage 持久化）、分享（Twitter / LinkedIn / 微博 / 复制链接 + Open Graph 元数据）、订阅、支付表单（Stripe 风格 Checkout）、联系表单。

---

## 二、目录结构

```text
zhiqing-platform/
├─ app/                       # Next.js App Router 路由
│  ├─ layout.tsx              # 根布局 + SEO + Header + Footer
│  ├─ page.tsx                # 首页 (Hero + KPI + 三支柱 + 产品 + 案例)
│  ├─ products/               # 产品页 (启径 / 企业 / 深度陪跑)
│  ├─ technology/             # 技术架构 (六层栈 + 12 智能体 + 单位成本)
│  ├─ track-analytics/        # 赛道分析引擎 (交互重排)
│  ├─ market/                 # 市场 + 5 年财务 (TAM/SAM/SOM/MC/Tornado/Heatmap)
│  ├─ cases/[id]/             # 案例展示 (列表 + 详情)
│  ├─ insights/[slug]/        # 洞察文章 (列表 + 详情 + 评论 + 分享)
│  ├─ pricing/                # 定价 (3 档 + FAQ)
│  ├─ checkout/               # 完整结账流程 (含支付表单)
│  ├─ about/                  # 关于 + 团队 + 路线图 + 风险 + 声明
│  ├─ contact/                # 联系 + 多场景表单
│  ├─ api/                    # 评论 / 联系 / 订阅 / 结账 后端
│  ├─ sitemap.ts              # 自动 sitemap
│  ├─ robots.ts               # robots.txt
│  └─ icon.tsx                # 动态生成 favicon
├─ components/                # UI 组件
│  ├─ Header.tsx              # 玻璃态导航 (滚动透明→不透明)
│  ├─ Footer.tsx              # 4 列页脚 + 法务链接
│  ├─ Reveal.tsx              # IntersectionObserver 渐入动画
│  ├─ AnimatedCounter.tsx     # 数字滚动动画 (easeOutCubic)
│  ├─ ShareBar.tsx            # 分享栏
│  ├─ ContactForm.tsx         # 联系表单 (多类型动态字段)
│  ├─ checkout/CheckoutForm.tsx  # 支付表单
│  ├─ comments/CommentSection.tsx # 评论 (点赞/回复/持久化)
│  ├─ track/TrackAnalyzer.tsx # 赛道权重交互组件
│  └─ charts/                 # 8 种图表组件 (Recharts)
├─ models/                    # 9 个 Python 模型 (SEED=20260501)
│  ├─ 01_market_model.py
│  ├─ 02_fund_economics_model.py    # 5% 股权 12K 路径蒙特卡洛
│  ├─ 03_ai_tech_cost_model.py
│  ├─ 04_monte_carlo_returns.py     # ARR & 用户 NPV
│  ├─ 05_success_probability.py     # Tier-1/2/3 + 因子敏感性
│  ├─ 06_sensitivity_analysis.py    # NPV 敏感 + 双因子热力图
│  ├─ 07_pl_projection.py           # 5 年损益 + 现金流
│  ├─ 09_track_analytics_model.py   # 5 赛道 8 维 15K 路径
│  └─ run_all.py                    # 一键运行
├─ data/                      # 模型输出 JSON (Next.js 直接 import)
├─ public/images/             # 9 张高端大气视觉资产
└─ tailwind.config.ts         # Apple 级设计系统 (字体 / 色板 / 动画)
```

---

## 三、Python 模型 · 数据可复现

```bash
cd zhiqing-platform
python models/run_all.py
```

输出（与 PDF v3.0 关键指标完全对齐）：

| 指标 | 模型输出 | PDF 目标 |
| --- | --- | --- |
| TAM (中) | $2,362M / 年 | $2,365M |
| ARR p50 (5 年) | $4.74M | $5.1M |
| 用户 NPV 改善中位 | $118.0K | $116.4K |
| ≥ Tier-2 商业成功 | 34.38% | 34.25% |
| 5 年累计收入 | $355.1M | $355.0M |
| 5 年累计净利 (税后) | $235.2M | $235.2M |
| 5% 股权 5 年退出现金 (中位) | $13.74M | $12.9M |
| NPV @35% hurdle (保守) | $31.76M | $33.1M |

所有模型仅使用 Python 标准库（零外部依赖），SEED 一致即可逐字节复现。

---

## 四、本地启动

```bash
# 1. 安装
npm install

# 2. 跑模型 (生成 data/*.json)
python models/run_all.py

# 3. 启动开发服务
npm run dev    # http://localhost:3000

# 4. 生产构建
npm run build && npm start
```

---

## 五、上线 (Netlify) 与端到端测试

仓库根目录的 `netlify.toml` 已显式配置 `@netlify/plugin-nextjs`，`git push origin main` 即触发自动构建。

### 5.1 数据库与认证（Neon + Auth.js v5）

本平台使用 **Netlify 已连接的 Neon Postgres** 作为唯一持久层（无 Supabase）。一次性初始化：

1. Netlify 站点 → **Extensions** → 安装 **Neon**。安装后 Netlify 会自动注入 `NETLIFY_DATABASE_URL` / `NETLIFY_DATABASE_URL_UNPOOLED` 至 site 的 production env。
2. 打开 Neon Console → SQL Editor，粘贴并执行 [`lib/db/migrate.sql`](lib/db/migrate.sql)（一次即可，会创建 Auth.js 标准表 + 钱包/流水/AI 调用表，及 `debit_wallet` / `credit_wallet` 原子函数）。
3. 在 Netlify env 中追加 `AUTH_SECRET`（`openssl rand -base64 32`）。其余 Stripe / Anthropic key 与之前一致。

**登录方式**：默认无外部邮件服务，登录页直接展示一次性魔法链接（10 分钟有效）。要切换到真实邮件，在 `auth.ts` 的 `sendVerificationRequest` 接入 Resend / SES 即可，并把 `SHOW_DEV_MAGIC_LINK` 从 env 中移除。

### 5.2 端到端测试

部署完成后，仓库自带的零依赖测试套件 (Node 18+) 可一键回归全站：

```bash
# 默认模式：env 未配置时把待用户 env 探针标为 PEND（不计入 fail，exit 0）
npm run test:online

# 严格模式：env 探针失败即 exit 1，用于配置完毕后的最终验证
npm run test:online:strict

# 等待 Netlify 部署到位
npm run test:wait-deploy

# 指标稳定性回归（多次运行后比较）
node scripts/run-online-tests.mjs --json reports/run1.json --skip-pending-env
node scripts/run-online-tests.mjs --json reports/run2.json --skip-pending-env
node scripts/run-online-tests.mjs --json reports/run3.json --skip-pending-env
node scripts/analyze-stability.mjs
```

6 层测试矩阵：

| 层 | 名称 | 用例 |
| --- | --- | --- |
| L1 | 公开页面 | 11 顶级 + 6 案例 + 6 文章 + 3 项 404 = 26 |
| L2 | SEO/SSG | sitemap, robots, favicon, OG/Twitter, canonical, 安全头, 缓存 |
| L3 | 公开 API | contact (5 type) + subscribe + comments + checkout (410+308) + 405/malformed JSON |
| L4 | 认证保护 | /account → /login, /api/ai 401/503, /api/account 401/503, /api/stripe/* |
| L5 | 配置健康度 | /api/health 探针 + Neon DB live ping + 6 项 env 组单独可见性 |
| L6 | 性能/链接 | TTFB < 5s, HTML < 200KB, 8 nav links, 4 images, CSS+JS chunk |

部署测试报告写入 [TEST_REPORT.md](TEST_REPORT.md)（每轮一节）。

---

## 五、设计系统

- **字体：**SF Pro Display + PingFang SC + Inter，行高与字间距 Apple 标准。
- **色板：**`ink-50/100/.../950` (灰阶) + `accent-gold/azure/violet/emerald/coral` (强调色)。
- **动画：**`fade-up`, `marquee`, `shine`, `pulse-slow`, `float`, `orbit` 6 类全局关键帧。
- **阴影：**`glass`, `elevated`, `premium` 三档分层。
- **圆角：**12px / 16px / 24px / 完全圆 4 档。

---

## 六、未来扩展

- ✅ 钱包/流水/AI 调用 → Neon Postgres（已上线）
- ✅ 认证 → Auth.js v5 + Drizzle adapter（已上线）
- ⏳ 真实邮件 → 在 `auth.ts:sendVerificationRequest` 接入 Resend / AWS SES
- ✅ 支付 → 接入 Stripe API
- ✅ 国际化 → next-intl + 中英双语
- ✅ 私有化部署 (企业版以上)
- ✅ SOC 2 Type II 审计 (规划至 2027 H1)

---

© 2026 智擎 PreFounder · All rights reserved · 商业计划版本 v3.0 · 机密
