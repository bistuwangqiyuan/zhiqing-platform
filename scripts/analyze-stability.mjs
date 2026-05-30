import fs from "node:fs";

console.log("Run | Pass | Pend | Fail | Elapsed (ms)");
console.log("--- | --- | --- | --- | ---");
const summaries = [];
for (let i = 1; i <= 3; i++) {
  const j = JSON.parse(fs.readFileSync(`reports/round-8-run${i}.json`, "utf8"));
  console.log(`${i} | ${j.passed} | ${j.pending} | ${j.failed} | ${j.elapsed_ms}`);
  summaries.push(j);
}

// Detect flaky tests: any test that passes in one run but fails in another
const allTestNames = new Set();
for (const s of summaries) {
  for (const r of s.results) allTestNames.add(`${r.layer}::${r.name}`);
}

let flaky = 0;
for (const name of allTestNames) {
  const states = summaries.map((s) => {
    const r = s.results.find((rr) => `${rr.layer}::${rr.name}` === name);
    if (!r) return "missing";
    return r.pass ? "pass" : r.pending ? "pend" : "fail";
  });
  const unique = new Set(states);
  if (unique.size > 1) {
    flaky++;
    console.log(`FLAKY: ${name} -> ${states.join(", ")}`);
  }
}
console.log(`\nFlaky tests: ${flaky}`);
