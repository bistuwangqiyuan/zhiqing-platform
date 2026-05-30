# 智擎 PreFounder · 上线测试报告

> 目标：对 `https://zhiqing-platform.netlify.app` 进行最多 10 轮"测试 → 修复 → 重新部署"循环，直到所有用例全部通过。

## 一、测试目标与方法

- **被测系统**：智擎 PreFounder Next.js 14 应用（线上 Netlify 实例）
- **被测 URL**：`https://zhiqing-platform.netlify.app`
- **部署触发**：`git push origin main` → Netlify 自动构建（`@netlify/plugin-nextjs`）
- **测试工具**：`scripts/run-online-tests.mjs`（原生 Node 18+ `fetch`，零依赖）
- **报告生成**：`scripts/append-test-report.mjs`（自动追加每轮章节）

## 二、五层测试矩阵

| 层 | 名称 | 用例 | 期望 |
| --- | --- | --- | --- |
| L1 | 公开页面 | 11 顶级路由 + 6 案例详情 + 6 文章详情 = 23 个 URL | HTTP 200 + 关键文案存在 |
| L2 | SEO / SSG | sitemap.xml / robots.txt / favicon.svg / `<head>` meta | 资产可用 + 元数据齐全 |
| L3 | 公开 API | POST /api/contact, /api/subscribe, /api/comments, /api/checkout (410) | 200 success / 410 deprecated |
| L4 | 认证保护 | /account → /login, /api/ai 401, /api/account/usage 401, /api/stripe/* | 中间件正确拦截 |
| L5 | 配置健康度 | 首页无 runtime 错误 banner, webhook 路由可达 | 推断 env 配置完备 |

## 三、轮次记录

> 每一轮都会自动追加在下面。包含：BASE_URL、用例总数、通过率、分层统计、失败详情、本轮修复点。

<!-- ROUNDS_BELOW -->

## Round 0 (baseline) · 2026-05-30 04:54:55 UTC

> **本轮修复点**: 在任何修复之前，对线上 https://zhiqing-platform.netlify.app 的零修改基线测试。预期会因为 middleware.ts 中 Supabase env 缺失断言而全站 500，本次结果作为后续轮次对比锚点。

**总览**

| 项目 | 值 |
| --- | --- |
| BASE_URL | `https://zhiqing-platform.netlify.app` |
| 总用例 | 38 |
| 通过 | 3 |
| 失败 | 35 |
| 耗时 | 10.0 s |
| 通过率 | 7.9 % |

**分层统计**

| 层 | 名称 | 通过 / 总数 |
| --- | --- | --- |
| L1 | 公开页面 (HTTP 200 + 关键文案) | ⚠️ 0 / 23 |
| L2 | SEO / SSG 资产 | ⚠️ 1 / 4 |
| L3 | 公开 API | ⚠️ 0 / 4 |
| L4 | 认证保护 | ⚠️ 1 / 5 |
| L5 | 配置健康度 | ⚠️ 1 / 2 |

**用例明细**

| 层 | 用例 | 状态 | HTTP | 耗时 (ms) | 备注 |
| --- | --- | :---: | :---: | ---: | --- |
| L1 | / | ❌ FAIL | 500 | 2665 | expected 200, got 500 |
| L1 | /products | ❌ FAIL | 500 | 162 | expected 200, got 500 |
| L1 | /technology | ❌ FAIL | 500 | 138 | expected 200, got 500 |
| L1 | /track-analytics | ❌ FAIL | 500 | 97 | expected 200, got 500 |
| L1 | /market | ❌ FAIL | 500 | 100 | expected 200, got 500 |
| L1 | /cases | ❌ FAIL | 500 | 95 | expected 200, got 500 |
| L1 | /insights | ❌ FAIL | 500 | 109 | expected 200, got 500 |
| L1 | /pricing | ❌ FAIL | 500 | 102 | expected 200, got 500 |
| L1 | /contact | ❌ FAIL | 500 | 121 | expected 200, got 500 |
| L1 | /about | ❌ FAIL | 500 | 106 | expected 200, got 500 |
| L1 | /login | ❌ FAIL | 500 | 119 | expected 200, got 500 |
| L1 | /cases/ai-saas-2027 | ❌ FAIL | 500 | 168 | expected 200, got 500 |
| L1 | /cases/robotics-arm-2027 | ❌ FAIL | 500 | 97 | expected 200, got 500 |
| L1 | /cases/medical-device-2028 | ❌ FAIL | 500 | 105 | expected 200, got 500 |
| L1 | /cases/green-battery-2028 | ❌ FAIL | 500 | 96 | expected 200, got 500 |
| L1 | /cases/enterprise-ops-2029 | ❌ FAIL | 500 | 95 | expected 200, got 500 |
| L1 | /cases/logistics-data-2029 | ❌ FAIL | 500 | 97 | expected 200, got 500 |
| L1 | /insights/what-pre-founders-actually-need | ❌ FAIL | 500 | 91 | expected 200, got 500 |
| L1 | /insights/5-percent-equity-economics | ❌ FAIL | 500 | 97 | expected 200, got 500 |
| L1 | /insights/monte-carlo-decision-making | ❌ FAIL | 500 | 101 | expected 200, got 500 |
| L1 | /insights/regulator-watcher-architecture | ❌ FAIL | 500 | 105 | expected 200, got 500 |
| L1 | /insights/critic-agent-explained | ❌ FAIL | 500 | 95 | expected 200, got 500 |
| L1 | /insights/ai-track-2027-outlook | ❌ FAIL | 500 | 97 | expected 200, got 500 |
| L2 | /sitemap.xml | ❌ FAIL | 500 | 116 | not a valid sitemap |
| L2 | /robots.txt | ❌ FAIL | 500 | 101 | not a valid robots.txt |
| L2 | /favicon.svg | ✅ PASS | 200 | 810 |  |
| L2 | homepage <head> meta | ❌ FAIL | 500 | 270 | missing: hasTitle, hasDescription, hasOgTitle, hasTwitterCard, hasViewport |
| L3 | POST /api/contact | ❌ FAIL | 500 | 109 | not success |
| L3 | POST /api/subscribe | ❌ FAIL | 500 | 99 | not success |
| L3 | POST /api/comments | ❌ FAIL | 500 | 110 | not success |
| L3 | POST /api/checkout (deprecated → 410) | ❌ FAIL | 500 | 99 | expected 410, got 500 |
| L4 | GET /account → /login | ❌ FAIL | 500 | 96 | status=500 location= |
| L4 | POST /api/ai unauthenticated → 401 | ❌ FAIL | 500 | 120 | expected 401, got 500 |
| L4 | GET /api/account/usage unauth → 401 | ❌ FAIL | 500 | 94 | expected 401, got 500 |
| L4 | POST /api/stripe/checkout unauth → 401 | ❌ FAIL | 500 | 93 | expected 401, got 500 |
| L4 | POST /api/stripe/webhook bad sig → 400/500 | ✅ PASS | 500 | 2221 |  |
| L5 | homepage no runtime error banner | ❌ FAIL | 500 | 102 | page contains a runtime error message |
| L5 | /api/stripe/webhook reachable | ✅ PASS | 500 | 468 |  |

**失败详情**

- **[L1] /**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /products**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /technology**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /track-analytics**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /market**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /pricing**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /contact**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /about**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /login**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/ai-saas-2027**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/robotics-arm-2027**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/medical-device-2028**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/green-battery-2028**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/enterprise-ops-2029**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /cases/logistics-data-2029**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/what-pre-founders-actually-need**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/5-percent-equity-economics**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/monte-carlo-decision-making**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/regulator-watcher-architecture**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/critic-agent-explained**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L1] /insights/ai-track-2027-outlook**
  - 原因: expected 200, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L2] /sitemap.xml**
  - 原因: not a valid sitemap
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L2] /robots.txt**
  - 原因: not a valid robots.txt
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L2] homepage <head> meta**
  - 原因: missing: hasTitle, hasDescription, hasOgTitle, hasTwitterCard, hasViewport
- **[L3] POST /api/contact**
  - 原因: not success
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L3] POST /api/subscribe**
  - 原因: not success
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L3] POST /api/comments**
  - 原因: not success
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L3] POST /api/checkout (deprecated → 410)**
  - 原因: expected 410, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L4] GET /account → /login**
  - 原因: status=500 location=
- **[L4] POST /api/ai unauthenticated → 401**
  - 原因: expected 401, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L4] GET /api/account/usage unauth → 401**
  - 原因: expected 401, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L4] POST /api/stripe/checkout unauth → 401**
  - 原因: expected 401, got 500
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!  Check your Supabase project's API settings to find these values  https://supabase.com/dashboard/project/_/settings/api`
- **[L5] homepage no runtime error banner**
  - 原因: page contains a runtime error message
  - 响应片段: `Your project's URL and Key are required to create a Supabase client!`
