"use client";
import { useMemo, useState } from "react";

const DIMS = [
  { key: "market_size", label: "市场规模" },
  { key: "growth", label: "增长速率" },
  { key: "unit_economics", label: "单位经济" },
  { key: "policy", label: "政策友好" },
  { key: "capital_access", label: "资金可得" },
  { key: "exit_friendly", label: "退出友好" },
  { key: "tech_maturity", label: "技术成熟" },
  { key: "entry_barrier", label: "进入壁垒" }
] as const;

interface MatrixRow {
  track: string;
  market_size: number;
  growth: number;
  unit_economics: number;
  policy: number;
  capital_access: number;
  exit_friendly: number;
  tech_maturity: number;
  entry_barrier: number;
  weighted: number;
}

interface Props {
  matrix: MatrixRow[];
  weights: Record<string, number>;
}

export function TrackAnalyzer({ matrix, weights: defaultWeights }: Props) {
  const [w, setW] = useState<Record<string, number>>(defaultWeights);

  const sum = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  const normalized = useMemo(() => {
    const out: Record<string, number> = {};
    for (const k of Object.keys(w)) out[k] = w[k] / sum;
    return out;
  }, [w, sum]);

  const ranked = useMemo(() => {
    return [...matrix]
      .map((row) => {
        const score =
          DIMS.reduce((acc, d) => acc + (row as any)[d.key] * (normalized[d.key] ?? 0), 0);
        return { ...row, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [matrix, normalized]);

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 rounded-2xl border border-ink-100 bg-white p-6">
        <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">权重</p>
        <p className="mt-1 text-[12px] text-ink-400">总和会自动归一化</p>
        <div className="mt-6 space-y-4">
          {DIMS.map((d) => (
            <div key={d.key}>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="text-ink-700">{d.label}</span>
                <span className="ticker text-ink-500">{(w[d.key] * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.30}
                step={0.01}
                value={w[d.key]}
                onChange={(e) => setW({ ...w, [d.key]: Number(e.target.value) })}
                className="w-full accent-ink-900"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setW(defaultWeights)}
          className="mt-6 w-full text-[13px] py-2.5 rounded-full border border-ink-200 hover:bg-ink-50 transition-colors text-ink-700"
        >
          恢复默认权重
        </button>
      </div>

      <div className="lg:col-span-7 rounded-2xl border border-ink-100 bg-white p-6">
        <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">实时排序</p>
        <p className="mt-1 text-[12px] text-ink-400">基于你设定的权重 (归一化) × 各维度均值得分</p>
        <ol className="mt-6 space-y-3">
          {ranked.map((r, i) => (
            <li key={r.track} className="rounded-xl bg-ink-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold ${
                    i === 0 ? "bg-accent-gold text-ink-900" : "bg-white text-ink-700 border border-ink-200"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-[14px] font-medium text-ink-900">{r.track}</span>
                <span className="text-[14px] ticker text-ink-700">{r.score.toFixed(2)} / 10</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
                <div
                  className={`h-full rounded-full ${i === 0 ? "bg-accent-gold" : "bg-ink-700"}`}
                  style={{ width: `${(r.score / 10) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[12px] text-ink-400">
          注：本组件为教学用快速重排，正式报告会调用完整蒙特卡洛 + 反向情景。
        </p>
      </div>
    </div>
  );
}
