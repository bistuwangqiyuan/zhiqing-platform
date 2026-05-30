#!/usr/bin/env node
/**
 * 把 run-online-tests.mjs 输出的 JSON 转成 Markdown 报告章节，追加到 TEST_REPORT.md。
 *
 * 用法:
 *   node scripts/append-test-report.mjs --json reports/round-1.json --round 1 --note "修复 middleware env 降级"
 */

import { readFile, appendFile } from "node:fs/promises";
import process from "node:process";

const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : null;
};

const JSON_PATH = flag("--json");
const ROUND = flag("--round") || "?";
const NOTE = flag("--note") || "";
const REPORT = flag("--report") || "TEST_REPORT.md";

if (!JSON_PATH) {
  console.error("Usage: --json <path> --round <N> [--note <text>] [--report TEST_REPORT.md]");
  process.exit(2);
}

const data = JSON.parse(await readFile(JSON_PATH, "utf8"));

const layerNames = {
  L1: "公开页面 (HTTP 200 + 关键文案)",
  L2: "SEO / SSG 资产",
  L3: "公开 API",
  L4: "认证保护",
  L5: "配置健康度",
  L6: "性能与内部链接"
};

const lines = [];
lines.push("");
lines.push(`## Round ${ROUND} · ${data.finished_at.replace("T", " ").replace(/\..+/, "")} UTC`);
lines.push("");
if (NOTE) {
  lines.push(`> **本轮修复点**: ${NOTE}`);
  lines.push("");
}
lines.push("**总览**");
lines.push("");
lines.push(`| 项目 | 值 |`);
lines.push(`| --- | --- |`);
lines.push(`| BASE_URL | \`${data.base_url}\` |`);
lines.push(`| 总用例 | ${data.total} |`);
lines.push(`| 通过 | ${data.passed} |`);
if (typeof data.pending === "number")
  lines.push(`| 待用户配置 | ${data.pending} |`);
lines.push(`| 失败 | ${data.failed} |`);
lines.push(`| 耗时 | ${(data.elapsed_ms / 1000).toFixed(1)} s |`);
lines.push(`| 通过率 | ${((data.passed / Math.max(data.total, 1)) * 100).toFixed(1)} % |`);
lines.push("");

lines.push("**分层统计**");
lines.push("");
lines.push("| 层 | 名称 | 通过 / 总数 |");
lines.push("| --- | --- | --- |");
for (const layer of ["L1", "L2", "L3", "L4", "L5", "L6"]) {
  const s = data.layers[layer];
  if (!s || s.total === 0) continue;
  let flag;
  if (s.failed === 0 && (!s.pending || s.pending === 0)) flag = "✅";
  else if (s.failed === 0) flag = "🟡 (待配置)";
  else flag = "❌";
  const pendingNote = s.pending && s.pending > 0 ? ` (含待配置 ${s.pending})` : "";
  lines.push(`| ${layer} | ${layerNames[layer]} | ${flag} ${s.passed} / ${s.total}${pendingNote} |`);
}
lines.push("");

lines.push("**用例明细**");
lines.push("");
lines.push("| 层 | 用例 | 状态 | HTTP | 耗时 (ms) | 备注 |");
lines.push("| --- | --- | :---: | :---: | ---: | --- |");
for (const r of data.results) {
  let status;
  if (r.pass) status = "✅ PASS";
  else if (r.pending) status = "🟡 PEND";
  else status = "❌ FAIL";
  const note = (r.reason || "").replace(/\|/g, "\\|").slice(0, 120);
  lines.push(
    `| ${r.layer} | ${r.name.replace(/\|/g, "\\|")} | ${status} | ${r.status ?? "-"} | ${r.ms ?? "-"} | ${note} |`
  );
}
lines.push("");

const failed = data.results.filter((r) => !r.pass && !r.pending);
if (failed.length > 0) {
  lines.push("**失败详情**");
  lines.push("");
  for (const r of failed) {
    lines.push(`- **[${r.layer}] ${r.name}**`);
    if (r.reason) lines.push(`  - 原因: ${r.reason}`);
    if (r.snippet)
      lines.push(`  - 响应片段: \`${String(r.snippet).replace(/\n/g, " ").slice(0, 200)}\``);
  }
  lines.push("");
}

const pendingCases = data.results.filter((r) => r.pending);
if (pendingCases.length > 0) {
  lines.push("**待用户配置（不计入失败）**");
  lines.push("");
  for (const r of pendingCases) {
    lines.push(`- **[${r.layer}] ${r.name}**`);
    if (r.reason) lines.push(`  - 原因: ${r.reason}`);
  }
  lines.push("");
}

await appendFile(REPORT, lines.join("\n"), "utf8");
console.log(`Appended Round ${ROUND} (${data.passed}/${data.total} pass) to ${REPORT}`);
