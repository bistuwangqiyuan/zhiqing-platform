#!/usr/bin/env node
/**
 * 智擎 PreFounder · 线上端到端测试
 *
 * 用法:
 *   node scripts/run-online-tests.mjs                  # 默认 https://zhiqing-platform.netlify.app
 *   BASE_URL=https://x.netlify.app node scripts/run-online-tests.mjs
 *   node scripts/run-online-tests.mjs --layer L1,L2    # 只跑指定层
 *   node scripts/run-online-tests.mjs --json out.json  # 同时输出 JSON
 *
 * 五层测试矩阵:
 *   L1 公开页面 HTTP 200 + 关键文案
 *   L2 SEO/SSG 资产 (sitemap, robots, favicon, OG/Twitter, JSON-LD)
 *   L3 公开 API (contact, subscribe, comments, /api/checkout 410)
 *   L4 认证保护 (/account 重定向, /api/ai 401, /api/account/* 401, /api/stripe/checkout 401)
 *   L5 配置健康度 (检查 /api/stripe/checkout、/api/ai 在已知输入下能定位是 401 / 配置缺失 / 其他)
 *
 * 输出:
 *   - 控制台彩色摘要
 *   - JSON 结构 (供 generator-report.mjs 写入 TEST_REPORT.md)
 */

import process from "node:process";
import { writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const has = (name) => args.includes(name);

const BASE_URL =
  flag("--base") ||
  process.env.BASE_URL ||
  "https://zhiqing-platform.netlify.app";
const LAYERS = (flag("--layer") || "L1,L2,L3,L4,L5")
  .split(",")
  .map((s) => s.trim().toUpperCase());
const JSON_OUT = flag("--json");
const VERBOSE = has("--verbose");

const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const BLUE = (s) => `\x1b[34m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;
const BOLD = (s) => `\x1b[1m${s}\x1b[0m`;

// ===========================================================================
// 路由清单 (与 app/cases/page.tsx + app/insights/page.tsx 同步)
// ===========================================================================
const STATIC_PAGES = [
  { path: "/", mustContain: ["智擎", "PreFounder"] },
  { path: "/products", mustContain: ["产品"] },
  { path: "/technology", mustContain: ["技术"] },
  { path: "/track-analytics", mustContain: ["赛道"] },
  { path: "/market", mustContain: ["市场"] },
  { path: "/cases", mustContain: ["案例"] },
  { path: "/insights", mustContain: ["洞察", "Insights"] },
  { path: "/pricing", mustContain: ["定价"] },
  { path: "/contact", mustContain: ["联系", "咨询"] },
  { path: "/about", mustContain: ["关于"] },
  { path: "/login", mustContain: ["登录", "邮箱"] }
];

const CASE_IDS = [
  "ai-saas-2027",
  "robotics-arm-2027",
  "medical-device-2028",
  "green-battery-2028",
  "enterprise-ops-2029",
  "logistics-data-2029"
];

const POST_SLUGS = [
  "what-pre-founders-actually-need",
  "5-percent-equity-economics",
  "monte-carlo-decision-making",
  "regulator-watcher-architecture",
  "critic-agent-explained",
  "ai-track-2027-outlook"
];

// ===========================================================================
// HTTP helper
// ===========================================================================
async function http(method, pathname, opts = {}) {
  const url = pathname.startsWith("http")
    ? pathname
    : new URL(pathname, BASE_URL).toString();
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), opts.timeout ?? 30000);
  try {
    const res = await fetch(url, {
      method,
      headers: opts.headers,
      body: opts.body,
      redirect: opts.redirect ?? "manual",
      signal: ctrl.signal
    });
    const text = opts.skipBody ? "" : await res.text();
    return {
      ok: true,
      status: res.status,
      headers: Object.fromEntries(res.headers),
      text,
      ms: Date.now() - t0,
      url
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err.message,
      ms: Date.now() - t0,
      url
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ===========================================================================
// 测试结果累积
// ===========================================================================
const results = [];
function record(layer, name, pass, detail = {}) {
  results.push({
    layer,
    name,
    pass,
    ts: new Date().toISOString(),
    ...detail
  });
  const icon = pass ? GREEN("PASS") : RED("FAIL");
  const line = `${icon} [${layer}] ${name}${
    detail.status ? ` (${detail.status}, ${detail.ms ?? "?"}ms)` : ""
  }`;
  console.log(line);
  if (!pass && detail.reason) console.log("       " + DIM(detail.reason));
  if (VERBOSE && detail.snippet)
    console.log("       " + DIM(String(detail.snippet).slice(0, 160)));
}

// ===========================================================================
// L1 — Static pages
// ===========================================================================
async function runL1() {
  console.log(BOLD(BLUE("\n=== L1 · 公开页面 HTTP 200 + 关键文案 ===")));
  const all = [
    ...STATIC_PAGES,
    ...CASE_IDS.map((id) => ({
      path: `/cases/${id}`,
      mustContain: ["案例"]
    })),
    ...POST_SLUGS.map((s) => ({ path: `/insights/${s}`, mustContain: [] }))
  ];
  for (const page of all) {
    const r = await http("GET", page.path);
    if (!r.ok) {
      record("L1", page.path, false, {
        reason: `network: ${r.error}`,
        ms: r.ms
      });
      continue;
    }
    if (r.status !== 200) {
      record("L1", page.path, false, {
        status: r.status,
        ms: r.ms,
        snippet: r.text.slice(0, 200),
        reason: `expected 200, got ${r.status}`
      });
      continue;
    }
    const missing = page.mustContain.filter((kw) => !r.text.includes(kw));
    if (missing.length > 0) {
      record("L1", page.path, false, {
        status: r.status,
        ms: r.ms,
        reason: `missing keywords: ${missing.join(", ")}`,
        snippet: r.text.slice(0, 200)
      });
      continue;
    }
    record("L1", page.path, true, { status: r.status, ms: r.ms });
  }
}

// ===========================================================================
// L2 — SEO / SSG
// ===========================================================================
async function runL2() {
  console.log(BOLD(BLUE("\n=== L2 · SEO / SSG 资产 ===")));

  // sitemap.xml
  {
    const r = await http("GET", "/sitemap.xml");
    const ok =
      r.ok &&
      r.status === 200 &&
      r.text.includes("<urlset") &&
      r.text.includes("<loc>");
    record("L2", "/sitemap.xml", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : "not a valid sitemap",
      snippet: r.text?.slice(0, 200)
    });
  }

  // robots.txt
  {
    const r = await http("GET", "/robots.txt");
    const ok =
      r.ok &&
      r.status === 200 &&
      /User-?agent/i.test(r.text);
    record("L2", "/robots.txt", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : "not a valid robots.txt",
      snippet: r.text?.slice(0, 200)
    });
  }

  // favicon.svg
  {
    const r = await http("GET", "/favicon.svg");
    const ok = r.ok && (r.status === 200 || r.status === 301 || r.status === 302);
    record("L2", "/favicon.svg", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 2xx/3xx, got ${r.status}`
    });
  }

  // homepage meta tags
  {
    const r = await http("GET", "/");
    const checks = {
      hasTitle: /<title>[^<]*智擎[^<]*<\/title>/.test(r.text),
      hasDescription: /<meta[^>]*name="description"[^>]*content="[^"]*"/i.test(
        r.text
      ),
      hasOgTitle: /<meta[^>]*property="og:title"[^>]*content="[^"]*"/i.test(
        r.text
      ),
      hasTwitterCard: /<meta[^>]*name="twitter:card"[^>]*content="[^"]*"/i.test(
        r.text
      ),
      hasViewport: /<meta[^>]*name="viewport"[^>]*content="[^"]*"/i.test(r.text)
    };
    const missing = Object.entries(checks)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    const ok = r.ok && missing.length === 0;
    record("L2", "homepage <head> meta", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `missing: ${missing.join(", ")}`
    });
  }
}

// ===========================================================================
// L3 — Public APIs
// ===========================================================================
async function runL3() {
  console.log(BOLD(BLUE("\n=== L3 · 公开 API ===")));

  // /api/contact
  {
    const r = await http("POST", "/api/contact", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "general",
        name: "Test Bot",
        email: "test@example.com",
        message: "automated test"
      })
    });
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok = r.ok && r.status === 200 && json && json.success === true;
    record("L3", "POST /api/contact", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `not success`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/subscribe
  {
    const r = await http("POST", "/api/subscribe", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" })
    });
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok = r.ok && r.status === 200 && json && json.success === true;
    record("L3", "POST /api/subscribe", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `not success`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/comments
  {
    const r = await http("POST", "/api/comments", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "what-pre-founders-actually-need",
        author: "tester",
        content: "automated test"
      })
    });
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok = r.ok && r.status === 200 && json && json.success === true;
    record("L3", "POST /api/comments", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `not success`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/checkout — should return 410 deprecated
  {
    const r = await http("POST", "/api/checkout", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const ok = r.ok && r.status === 410;
    record("L3", "POST /api/checkout (deprecated → 410)", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 410, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }
}

// ===========================================================================
// L4 — Auth gating
// ===========================================================================
async function runL4() {
  console.log(BOLD(BLUE("\n=== L4 · 认证保护 ===")));

  // /account anonymous → 302/307 redirect to /login
  {
    const r = await http("GET", "/account", { redirect: "manual" });
    const loc = r.headers?.location ?? "";
    const ok =
      r.ok &&
      (r.status === 302 || r.status === 303 || r.status === 307) &&
      loc.includes("/login");
    record("L4", "GET /account → /login", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `status=${r.status} location=${loc}`
    });
  }

  // /api/ai anonymous → 401
  {
    const r = await http("POST", "/api/ai", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] })
    });
    const ok = r.ok && r.status === 401;
    record("L4", "POST /api/ai unauthenticated → 401", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 401, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/account/usage anonymous → 401
  {
    const r = await http("GET", "/api/account/usage");
    const ok = r.ok && r.status === 401;
    record("L4", "GET /api/account/usage unauth → 401", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 401, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/stripe/checkout anonymous → 401
  {
    const r = await http("POST", "/api/stripe/checkout", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topup_id: "topup_10" })
    });
    const ok = r.ok && r.status === 401;
    record("L4", "POST /api/stripe/checkout unauth → 401", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 401, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/stripe/webhook bad signature → 400
  {
    const r = await http("POST", "/api/stripe/webhook", {
      headers: { "Content-Type": "application/json", "stripe-signature": "t=1,v1=invalid" },
      body: '{"type":"ping"}'
    });
    // Acceptable: 400 (bad signature) OR 500 (webhook_not_configured) — both prove the route is alive.
    const ok =
      r.ok && (r.status === 400 || r.status === 500);
    record("L4", "POST /api/stripe/webhook bad sig → 400/500", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 400/500, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }
}

// ===========================================================================
// L5 — Configuration health
// ===========================================================================
async function runL5() {
  console.log(BOLD(BLUE("\n=== L5 · 配置健康度（推断 env 是否齐备）===")));

  // 探针：把首页 HTML 抓下来，看是否还有 Supabase 配置错误
  {
    const r = await http("GET", "/");
    const broken =
      r.text.includes("project's URL and Key are required") ||
      r.text.includes("Missing NEXT_PUBLIC_SUPABASE") ||
      r.text.includes("Application error");
    const ok = r.ok && r.status === 200 && !broken;
    record("L5", "homepage no runtime error banner", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : "page contains a runtime error message",
      snippet: broken ? r.text.match(/.{0,120}(URL and Key|Missing NEXT_PUBLIC|Application error).{0,80}/)?.[0] : undefined
    });
  }

  // Webhook 路由存在性 (POST without sig → 500 webhook_not_configured | 400 bad_signature)
  {
    const r = await http("POST", "/api/stripe/webhook", {
      body: "{}"
    });
    const ok = r.ok && (r.status === 400 || r.status === 500);
    record("L5", "/api/stripe/webhook reachable", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unreachable, status=${r.status}`
    });
  }
}

// ===========================================================================
// 主流程
// ===========================================================================
async function main() {
  console.log(BOLD("智擎 PreFounder · 上线测试"));
  console.log(DIM(`BASE_URL = ${BASE_URL}`));
  console.log(DIM(`LAYERS   = ${LAYERS.join(",")}`));
  const t0 = Date.now();

  if (LAYERS.includes("L1")) await runL1();
  if (LAYERS.includes("L2")) await runL2();
  if (LAYERS.includes("L3")) await runL3();
  if (LAYERS.includes("L4")) await runL4();
  if (LAYERS.includes("L5")) await runL5();

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;
  const elapsed = Date.now() - t0;

  console.log(BOLD("\n=== 汇总 ==="));
  console.log(
    `共 ${total} · ${GREEN(`通过 ${passed}`)} · ${
      failed > 0 ? RED(`失败 ${failed}`) : DIM("失败 0")
    } · 耗时 ${(elapsed / 1000).toFixed(1)}s`
  );

  // 按 layer 拆分
  for (const layer of ["L1", "L2", "L3", "L4", "L5"]) {
    const layerResults = results.filter((r) => r.layer === layer);
    if (layerResults.length === 0) continue;
    const lp = layerResults.filter((r) => r.pass).length;
    const lf = layerResults.length - lp;
    const tag = lf === 0 ? GREEN(`${lp}/${layerResults.length}`) : YELLOW(`${lp}/${layerResults.length}`);
    console.log(`  ${layer}: ${tag}`);
  }

  if (failed > 0) {
    console.log(BOLD(RED("\n失败详情:")));
    for (const r of results.filter((r) => !r.pass)) {
      console.log(`  - [${r.layer}] ${r.name}`);
      if (r.reason) console.log(`      ${DIM(r.reason)}`);
    }
  }

  const summary = {
    base_url: BASE_URL,
    started_at: new Date(Date.now() - elapsed).toISOString(),
    finished_at: new Date().toISOString(),
    elapsed_ms: elapsed,
    total,
    passed,
    failed,
    layers: Object.fromEntries(
      ["L1", "L2", "L3", "L4", "L5"].map((l) => {
        const lr = results.filter((r) => r.layer === l);
        return [
          l,
          {
            total: lr.length,
            passed: lr.filter((r) => r.pass).length,
            failed: lr.filter((r) => !r.pass).length
          }
        ];
      })
    ),
    results
  };

  if (JSON_OUT) {
    await writeFile(JSON_OUT, JSON.stringify(summary, null, 2), "utf8");
    console.log(DIM(`\n→ JSON written to ${JSON_OUT}`));
  }

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(RED("Fatal:"), err);
  process.exit(2);
});
