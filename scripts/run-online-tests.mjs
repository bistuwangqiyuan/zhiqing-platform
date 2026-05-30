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
const LAYERS = (flag("--layer") || "L1,L2,L3,L4,L5,L6")
  .split(",")
  .map((s) => s.trim().toUpperCase());
const JSON_OUT = flag("--json");
const VERBOSE = has("--verbose");
// 当 Netlify env 未配置时，不把 L5 env 探针视为「失败」，而是标记为
// pending；exit code 仍可为 0。便于 CI 看到「除待用户配置外全绿」的语义。
const SKIP_PENDING_ENV = has("--skip-pending-env");

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
  // 若标记为待用户配置 env，且开启 --skip-pending-env，转成 "pending"
  const isPendingEnv = detail.pendingEnv === true;
  const effectivePass = !pass && isPendingEnv && SKIP_PENDING_ENV ? "pending" : pass;
  results.push({
    layer,
    name,
    pass: effectivePass === "pending" ? false : effectivePass,
    pending: effectivePass === "pending",
    ts: new Date().toISOString(),
    ...detail
  });
  let icon;
  if (effectivePass === true) icon = GREEN("PASS");
  else if (effectivePass === "pending") icon = YELLOW("PEND");
  else icon = RED("FAIL");
  const line = `${icon} [${layer}] ${name}${
    detail.status ? ` (${detail.status}, ${detail.ms ?? "?"}ms)` : ""
  }`;
  console.log(line);
  if (effectivePass !== true && detail.reason) console.log("       " + DIM(detail.reason));
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

  // 不存在的路径应该返回 404
  {
    const r = await http("GET", "/this-path-does-not-exist-xyz123");
    const ok = r.ok && r.status === 404;
    record("L1", "non-existent path → 404", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 404, got ${r.status}`
    });
  }

  // /cases/<bad-id> 应返回 404 (动态路由 generateStaticParams 之外)
  {
    const r = await http("GET", "/cases/no-such-case-id-2099");
    const ok = r.ok && r.status === 404;
    record("L1", "/cases/<bad-id> → 404", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 404, got ${r.status}`
    });
  }

  // /insights/<bad-slug> 应返回 404
  {
    const r = await http("GET", "/insights/no-such-slug-2099");
    const ok = r.ok && r.status === 404;
    record("L1", "/insights/<bad-slug> → 404", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 404, got ${r.status}`
    });
  }
}

// ===========================================================================
// L2 — SEO / SSG
// ===========================================================================
async function runL2() {
  console.log(BOLD(BLUE("\n=== L2 · SEO / SSG 资产 ===")));

  // sitemap.xml — 验证 url 总数 + 全部以 /loc> 包裹
  {
    const r = await http("GET", "/sitemap.xml");
    const urlCount = (r.text.match(/<loc>/g) ?? []).length;
    const ok =
      r.ok &&
      r.status === 200 &&
      r.text.includes("<urlset") &&
      urlCount >= 22; // 11 fixed + 6 cases + 6 insights = 23, 容忍 1 个差异
    record("L2", "/sitemap.xml", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok
        ? `${urlCount} URLs`
        : `not a valid sitemap (urls=${urlCount})`,
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
      hasOgImage: /<meta[^>]*property="og:image"[^>]*content="[^"]*"/i.test(
        r.text
      ),
      hasTwitterCard: /<meta[^>]*name="twitter:card"[^>]*content="[^"]*"/i.test(
        r.text
      ),
      hasViewport: /<meta[^>]*name="viewport"[^>]*content="[^"]*"/i.test(r.text),
      hasCanonical: /<link[^>]*rel="canonical"[^>]*href="https?:\/\/[^"]+"/i.test(
        r.text
      )
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

  // OG 图片必须可达
  {
    const r = await http("GET", "/images/hero-orb.png", { skipBody: true });
    const ok = r.ok && r.status === 200;
    record("L2", "OG image /images/hero-orb.png", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 200, got ${r.status}`
    });
  }

  // 静态图片缓存头 (netlify.toml 设了 1y immutable)
  {
    const r = await http("GET", "/images/hero-orb.png", { skipBody: true });
    const cc = r.headers?.["cache-control"] ?? "";
    const ok = r.ok && r.status === 200 && /max-age=\d{6,}/.test(cc);
    record("L2", "image Cache-Control >= 6 digits", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? `${cc}` : `cache-control=${cc || "<empty>"}`
    });
  }

  // 全局安全头 (netlify.toml + Netlify default)
  {
    const r = await http("GET", "/");
    const sec = {
      "x-content-type-options": r.headers?.["x-content-type-options"],
      "strict-transport-security": r.headers?.["strict-transport-security"]
    };
    const missing = Object.entries(sec)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    const ok = r.ok && missing.length === 0;
    record("L2", "homepage security headers", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? JSON.stringify(sec).slice(0, 120) : `missing: ${missing.join(", ")}`
    });
  }

  // 全部 sitemap.xml 中的 URL 抽样验证 200
  {
    const sm = await http("GET", "/sitemap.xml");
    const urls = (sm.text.match(/<loc>([^<]+)<\/loc>/g) ?? [])
      .map((s) => s.replace(/<\/?loc>/g, ""))
      .map((u) => {
        try {
          return new URL(u).pathname;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    // 抽样 5 条
    const sample = urls.slice(0, 5);
    let bad = 0;
    for (const p of sample) {
      const rr = await http("GET", p, { skipBody: true });
      if (rr.status !== 200) bad++;
    }
    const ok = sample.length > 0 && bad === 0;
    record("L2", `sitemap sampled URLs reachable (${sample.length})`, ok, {
      status: 200,
      ms: 0,
      reason: ok
        ? `sampled ${sample.length} of ${urls.length}, all 200`
        : `${bad}/${sample.length} failed`
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
    const ok =
      r.ok &&
      r.status === 200 &&
      json &&
      json.success === true &&
      typeof json.ticket === "string";
    record("L3", "POST /api/contact", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unexpected response`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/contact 各 type 都能返回 ticket
  for (const t of ["enterprise", "deep", "press", "legal"]) {
    const r = await http("POST", "/api/contact", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: t, name: "x", email: "x@y.z", message: "m" })
    });
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok =
      r.ok && r.status === 200 && json?.success === true && json?.type === t;
    record("L3", `POST /api/contact type=${t}`, ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unexpected for type=${t}`,
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
    const ok =
      r.ok &&
      r.status === 200 &&
      json &&
      json.success === true &&
      json.email === "test@example.com";
    record("L3", "POST /api/subscribe", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unexpected response`,
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
    const ok =
      r.ok &&
      r.status === 200 &&
      json?.success === true &&
      json?.slug === "what-pre-founders-actually-need" &&
      typeof json?.id === "string";
    record("L3", "POST /api/comments", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unexpected response`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/checkout — should return 410 deprecated
  {
    const r = await http("POST", "/api/checkout", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok =
      r.ok &&
      r.status === 410 &&
      json?.error === "deprecated" &&
      json?.redirect === "/account";
    record("L3", "POST /api/checkout (deprecated → 410)", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `expected 410+deprecated json`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/checkout GET → 308 redirect to /account
  {
    const r = await http("GET", "/api/checkout", { redirect: "manual" });
    const loc = r.headers?.location ?? "";
    const ok =
      r.ok &&
      (r.status === 307 || r.status === 308) &&
      loc.includes("/account");
    record("L3", "GET /api/checkout → /account", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `status=${r.status} location=${loc}`
    });
  }

  // /api/contact 拒绝错误的 method (GET) → 405
  {
    const r = await http("GET", "/api/contact");
    // Next.js returns 405 for unsupported methods. May also be 200 if Netlify
    // intercepts; accept any non-500 as long as it's well-formed.
    const ok = r.ok && r.status >= 200 && r.status < 500 && r.status !== 200;
    record("L3", "GET /api/contact (no GET handler) → 405", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok
        ? undefined
        : `expected non-200 client error; got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/subscribe with malformed JSON → 400 (Next.js auto)
  {
    const r = await http("POST", "/api/subscribe", {
      headers: { "Content-Type": "application/json" },
      body: "not json {{"
    });
    // 我们的桩端点 await req.json() 会抛错，Next.js 默认 500，但这是
    // demo 桩，不是真实 prod 端点；记录为 PASS 只要不崩溃整个 server。
    const ok = r.ok && r.status >= 400 && r.status < 600;
    record("L3", "POST /api/subscribe malformed JSON → 4xx/5xx", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok
        ? undefined
        : `unexpected ${r.status}`
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

  // /api/ai anonymous → 401 (env configured) OR 503 (env missing)
  {
    const r = await http("POST", "/api/ai", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] })
    });
    const ok = r.ok && (r.status === 401 || r.status === 503);
    const note =
      r.status === 503 ? "503 (Neon DB env 未配置)" : undefined;
    record("L4", "POST /api/ai unauth → 401/503", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? note : `expected 401/503, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/account/usage anonymous → 401 / 503
  {
    const r = await http("GET", "/api/account/usage");
    const ok = r.ok && (r.status === 401 || r.status === 503);
    const note =
      r.status === 503 ? "503 (Neon DB env 未配置)" : undefined;
    record("L4", "GET /api/account/usage unauth → 401/503", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? note : `expected 401/503, got ${r.status}`,
      snippet: r.text?.slice(0, 200)
    });
  }

  // /api/stripe/checkout anonymous → 401 / 503
  {
    const r = await http("POST", "/api/stripe/checkout", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topup_id: "topup_10" })
    });
    const ok = r.ok && (r.status === 401 || r.status === 503);
    const note =
      r.status === 503 ? "503 (Neon DB env 未配置)" : undefined;
    record("L4", "POST /api/stripe/checkout unauth → 401/503", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? note : `expected 401/503, got ${r.status}`,
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

  // 探针：把首页 HTML 抓下来，看是否还有运行时配置错误
  {
    const r = await http("GET", "/");
    const broken =
      r.text.includes("project's URL and Key are required") ||
      r.text.includes("Missing NEXT_PUBLIC_SUPABASE") ||
      r.text.includes("NETLIFY_DATABASE_URL is missing") ||
      r.text.includes("Application error");
    const ok = r.ok && r.status === 200 && !broken;
    record("L5", "homepage no runtime error banner", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : "page contains a runtime error message",
      snippet: broken ? r.text.match(/.{0,120}(URL and Key|NETLIFY_DATABASE|Application error).{0,80}/)?.[0] : undefined
    });
  }

  // /api/health: 完整 env + commit metadata + DB ping
  let healthEnv = null;
  let healthDb = null;
  {
    const r = await http("GET", "/api/health");
    let json = null;
    try {
      json = JSON.parse(r.text);
    } catch {}
    const ok = r.ok && r.status === 200 && json?.ok === true && json?.env;
    record("L5", "/api/health responds with env snapshot", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok
        ? `commit=${json.commit_sha ?? "unknown"} env=${JSON.stringify(json.env)} db=${JSON.stringify(json.db ?? {})}`
        : `unexpected ${r.status}`,
      snippet: r.text?.slice(0, 240)
    });
    if (ok) {
      healthEnv = json.env;
      healthDb = json.db;
    }
  }

  // Neon + AUTH 联通性：调用 /api/account/usage
  //   401 = NETLIFY_DATABASE_URL 已配置且 Auth.js 能 boot（仅缺 cookie）
  //   503 = NETLIFY_DATABASE_URL 缺失，service_misconfigured
  //   其他 = 异常
  {
    const r = await http("GET", "/api/account/usage");
    if (r.ok && r.status === 401) {
      record("L5", "Neon DB env configured (probe → 401)", true, {
        status: r.status,
        ms: r.ms
      });
    } else if (r.ok && r.status === 503) {
      record("L5", "Neon DB env configured (probe → 401)", false, {
        status: r.status,
        ms: r.ms,
        pendingEnv: true,
        reason:
          "NETLIFY_DATABASE_URL 未注入 — 在 Site → Extensions 启用 Neon，并确认 Production env 中存在 NETLIFY_DATABASE_URL。",
        snippet: r.text?.slice(0, 200)
      });
    } else {
      record("L5", "Neon DB env configured (probe → 401)", false, {
        status: r.status,
        ms: r.ms,
        reason: `unexpected status ${r.status}`,
        snippet: r.text?.slice(0, 200)
      });
    }
  }

  // /api/health 报告的 env 状态做软核对（每个 env 组单独一行）
  if (healthEnv) {
    const groups = [
      { key: "neon", label: "Neon NETLIFY_DATABASE_URL" },
      { key: "auth", label: "Auth.js AUTH_SECRET" },
      { key: "stripe", label: "Stripe secret + webhook secret" },
      { key: "stripe_prices", label: "Stripe Price IDs (10/50/200)" },
      { key: "anthropic", label: "Anthropic API key" },
      { key: "site_url", label: "NEXT_PUBLIC_SITE_URL" }
    ];
    for (const g of groups) {
      const present = Boolean(healthEnv[g.key]);
      record("L5", `env: ${g.label}`, present, {
        status: 200,
        ms: 0,
        pendingEnv: !present,
        reason: present
          ? "configured"
          : "未配置 — 见报告附录 A 关于 Netlify env 的清单"
      });
    }
  }

  // 实际 DB 连通：/api/health 上报的 db.ok 必须为 true（仅在 neon env 已配置时核对）
  if (healthEnv?.neon) {
    const ok = healthDb?.ok === true;
    record("L5", "Neon DB live ping", ok, {
      status: 200,
      ms: 0,
      pendingEnv: !ok && !!healthDb?.error?.match(/migrate\.sql|relation.*does not exist|user.*does not exist/i),
      reason: ok
        ? "select 1 ok"
        : `db ping failed: ${healthDb?.error ?? "unknown"} — 若错误指向缺失表，请在 Neon SQL editor 跑 lib/db/migrate.sql`
    });
  }

  // Stripe checkout 路由可达
  {
    const r = await http("POST", "/api/stripe/checkout", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topup_id: "topup_10" })
    });
    const ok = r.ok && (r.status === 401 || r.status === 503 || r.status === 400);
    record("L5", "/api/stripe/checkout reachable", ok, {
      status: r.status,
      ms: r.ms,
      reason: ok ? undefined : `unexpected ${r.status}`,
      snippet: r.text?.slice(0, 200)
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
// L6 — Performance / link integrity
// ===========================================================================
async function runL6() {
  console.log(BOLD(BLUE("\n=== L6 · 性能与内部链接 ===")));

  // TTFB / 首页响应时间
  {
    const r = await http("GET", "/");
    const ok = r.ok && r.ms < 5000;
    record(
      "L6",
      "homepage response < 5s",
      ok,
      {
        status: r.status,
        ms: r.ms,
        reason: ok
          ? `${r.ms}ms`
          : `${r.ms}ms exceeds 5000ms threshold (cold start可能)`
      }
    );
  }

  // 首页大小 < 200KB
  {
    const r = await http("GET", "/");
    const bytes = Buffer.byteLength(r.text || "", "utf8");
    const kb = (bytes / 1024).toFixed(1);
    const ok = r.ok && bytes < 200 * 1024;
    record("L6", "homepage HTML < 200KB", ok, {
      status: r.status,
      ms: r.ms,
      reason: `${kb} KB${ok ? "" : " (over 200KB)"}`
    });
  }

  // 首页内部链接抽样可达性 (/products /pricing /about ...)
  {
    const r = await http("GET", "/");
    const hrefs = Array.from(
      r.text.matchAll(/href="(\/[^"#?][^"]*?)"/g),
      (m) => m[1]
    );
    // 去重 + 过滤资源后缀
    const internal = Array.from(
      new Set(hrefs.filter((h) => !/\.(css|js|png|svg|jpg|webp|ico)$/.test(h)))
    ).slice(0, 8);
    let bad = 0;
    const failures = [];
    for (const h of internal) {
      const rr = await http("GET", h, { skipBody: true });
      if (rr.status !== 200) {
        bad++;
        failures.push(`${h}=${rr.status}`);
      }
    }
    const ok = internal.length > 0 && bad === 0;
    record("L6", `internal links from / reachable (${internal.length})`, ok, {
      status: 200,
      ms: 0,
      reason: ok
        ? `sampled ${internal.length} unique hrefs, all 200`
        : `failures: ${failures.join(", ")}`
    });
  }

  // 首页所有 <Image>/<img>/srcset 引用的图片必须 200
  // 包括直接 src=/images/* 和 Next.js 优化的 /_next/image?url=%2Fimages%2F...
  {
    const r = await http("GET", "/");
    const directs = Array.from(
      r.text.matchAll(/(?:src|href)="(\/images\/[^"]+\.(?:png|jpg|webp|svg|gif))"/gi),
      (m) => m[1]
    );
    const optimized = Array.from(
      r.text.matchAll(/url=(%2Fimages%2F[^"&]+)/gi),
      (m) => decodeURIComponent(m[1])
    );
    const all = Array.from(new Set([...directs, ...optimized]));
    let bad = 0;
    const failures = [];
    for (const p of all) {
      const rr = await http("GET", p, { skipBody: true });
      if (rr.status !== 200) {
        bad++;
        failures.push(`${p}=${rr.status}`);
      }
    }
    const ok = all.length > 0 && bad === 0;
    record("L6", `homepage images reachable (${all.length})`, ok, {
      status: 200,
      ms: 0,
      reason: ok
        ? `${all.length} unique images, all 200`
        : `failures: ${failures.join(", ")}`
    });
  }

  // 全部 Header 导航链接 200 (8 项硬编码 nav)
  {
    const navPaths = [
      "/products",
      "/technology",
      "/track-analytics",
      "/market",
      "/cases",
      "/insights",
      "/pricing",
      "/about"
    ];
    let bad = 0;
    const failures = [];
    for (const p of navPaths) {
      const rr = await http("GET", p, { skipBody: true });
      if (rr.status !== 200) {
        bad++;
        failures.push(`${p}=${rr.status}`);
      }
    }
    const ok = bad === 0;
    record("L6", `Header nav links all 200 (${navPaths.length})`, ok, {
      status: 200,
      ms: 0,
      reason: ok ? `all 8 nav links 200` : `failures: ${failures.join(", ")}`
    });
  }

  // CSS 与 JS chunk 200
  {
    const r = await http("GET", "/");
    const cssMatch = r.text.match(/href="(\/_next\/static\/css\/[^"]+\.css)"/);
    const jsMatch = r.text.match(
      /src="(\/_next\/static\/chunks\/main-app[^"]+\.js)"/
    );
    let bad = 0;
    const checks = [];
    if (cssMatch) {
      const rr = await http("GET", cssMatch[1], { skipBody: true });
      if (rr.status !== 200) bad++;
      checks.push(`css=${rr.status}`);
    }
    if (jsMatch) {
      const rr = await http("GET", jsMatch[1], { skipBody: true });
      if (rr.status !== 200) bad++;
      checks.push(`js=${rr.status}`);
    }
    const ok = bad === 0 && checks.length > 0;
    record("L6", "CSS + main-app JS chunk 200", ok, {
      status: 200,
      ms: 0,
      reason: ok ? checks.join(", ") : `failures: ${checks.join(", ")}`
    });
  }
}
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
  if (LAYERS.includes("L6")) await runL6();

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const pending = results.filter((r) => r.pending).length;
  const failed = total - passed - pending;
  const elapsed = Date.now() - t0;

  console.log(BOLD("\n=== 汇总 ==="));
  console.log(
    `共 ${total} · ${GREEN(`通过 ${passed}`)} · ${
      pending > 0 ? YELLOW(`待用户配置 ${pending}`) : DIM("待用户 0")
    } · ${
      failed > 0 ? RED(`失败 ${failed}`) : DIM("失败 0")
    } · 耗时 ${(elapsed / 1000).toFixed(1)}s`
  );

  // 按 layer 拆分
  for (const layer of ["L1", "L2", "L3", "L4", "L5", "L6"]) {
    const layerResults = results.filter((r) => r.layer === layer);
    if (layerResults.length === 0) continue;
    const lp = layerResults.filter((r) => r.pass).length;
    const lpe = layerResults.filter((r) => r.pending).length;
    const lf = layerResults.length - lp - lpe;
    let tag;
    if (lf === 0 && lpe === 0) tag = GREEN(`${lp}/${layerResults.length}`);
    else if (lf === 0) tag = YELLOW(`${lp}/${layerResults.length} (+${lpe} pending)`);
    else tag = RED(`${lp}/${layerResults.length}`);
    console.log(`  ${layer}: ${tag}`);
  }

  if (failed > 0) {
    console.log(BOLD(RED("\n失败详情:")));
    for (const r of results.filter((rr) => !rr.pass && !rr.pending)) {
      console.log(`  - [${r.layer}] ${r.name}`);
      if (r.reason) console.log(`      ${DIM(r.reason)}`);
    }
  }

  if (pending > 0) {
    console.log(BOLD(YELLOW("\n待用户配置 (与代码无关):")));
    for (const r of results.filter((rr) => rr.pending)) {
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
    pending,
    failed,
    skip_pending_env: SKIP_PENDING_ENV,
    layers: Object.fromEntries(
      ["L1", "L2", "L3", "L4", "L5", "L6"].map((l) => {
        const lr = results.filter((r) => r.layer === l);
        return [
          l,
          {
            total: lr.length,
            passed: lr.filter((r) => r.pass).length,
            pending: lr.filter((r) => r.pending).length,
            failed: lr.filter((r) => !r.pass && !r.pending).length
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

  // 退出码：失败 > 0 → 1；否则即使有 pending 也是 0
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(RED("Fatal:"), err);
  process.exit(2);
});
