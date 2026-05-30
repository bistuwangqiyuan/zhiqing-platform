#!/usr/bin/env node
/**
 * 轮询 BASE_URL 直到检测到新版本生效 (默认: 直到首页不再含 "URL and Key are required").
 *
 * 用法:
 *   node scripts/wait-for-deploy.mjs                       # 默认 90 次 × 10 秒 = 15 分钟
 *   node scripts/wait-for-deploy.mjs --probe "/sitemap.xml" --expect "<urlset"
 *   node scripts/wait-for-deploy.mjs --commit d3b1d42      # 等到 /api/_health 报告该 sha (如有此端点)
 *
 * 退出码: 0 = 检测到新版本, 1 = 超时.
 */
import process from "node:process";

const args = process.argv.slice(2);
const flag = (n, def) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : def;
};

const BASE = flag("--base", process.env.BASE_URL || "https://zhiqing-platform.netlify.app");
const PROBE = flag("--probe", "/");
const EXPECT_NOT = flag("--expect-not", "URL and Key are required");
const EXPECT = flag("--expect", null);
const MAX = Number(flag("--max", "90"));
const INTERVAL = Number(flag("--interval-ms", "10000"));

console.log(`Waiting for deploy at ${BASE}${PROBE}`);
console.log(`  expect-not: "${EXPECT_NOT}"`);
if (EXPECT) console.log(`  expect:     "${EXPECT}"`);
console.log(`  max ${MAX} attempts, ${INTERVAL}ms apart  (~${(MAX * INTERVAL) / 60000}m total)`);

async function probe() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(BASE + PROBE, { signal: ctrl.signal });
    clearTimeout(t);
    const text = await res.text();
    return { status: res.status, text };
  } catch (e) {
    return { status: 0, text: "", error: e.message };
  }
}

let lastSummary = "";
for (let i = 1; i <= MAX; i++) {
  const r = await probe();
  const stillBroken = EXPECT_NOT && r.text.includes(EXPECT_NOT);
  const expectOk = EXPECT ? r.text.includes(EXPECT) : true;
  const summary = `attempt ${i}/${MAX}  status=${r.status}  brokenMarker=${stillBroken}  expectOk=${expectOk}`;
  if (summary !== lastSummary) {
    console.log("  " + summary + (r.error ? `  err=${r.error}` : ""));
    lastSummary = summary;
  }
  if (r.status >= 200 && r.status < 400 && !stillBroken && expectOk) {
    console.log(`✔ Deploy looks live after ${i} attempts (${(i * INTERVAL) / 1000}s).`);
    process.exit(0);
  }
  await new Promise((res) => setTimeout(res, INTERVAL));
}

console.error("✘ Timeout — new deploy did not become healthy in window.");
process.exit(1);
