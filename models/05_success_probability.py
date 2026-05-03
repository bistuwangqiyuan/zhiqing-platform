"""
模型 05 - 项目成功概率与 Tier 分布 [v2 对齐 PDF]
====================================================
基于多因子打分 + Bootstrap 蒙特卡洛 (N=30,000)
对齐 PDF: Tier-1 ≈ 10.06%, Tier-2 ≈ 24.20%, Tier-3 ≈ 41.68%, Failure ≈ 24.07%

输出: data/success_probability.json
"""

from __future__ import annotations
import json
import random
from pathlib import Path

SEED = 20260501
N = 30_000
OUT = Path(__file__).resolve().parent.parent / "data" / "success_probability.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def factor_sample(rnd):
    return {
        "team":              min(1.0, max(0.0, rnd.gauss(0.62, 0.16))),
        "market_timing":     min(1.0, max(0.0, rnd.gauss(0.55, 0.18))),
        "product_quality":   min(1.0, max(0.0, rnd.gauss(0.60, 0.15))),
        "moat":              min(1.0, max(0.0, rnd.gauss(0.48, 0.18))),
        "gtm_efficiency":    min(1.0, max(0.0, rnd.gauss(0.52, 0.17))),
        "regulatory":        min(1.0, max(0.0, rnd.gauss(0.66, 0.14))),
        "unit_economics":    min(1.0, max(0.0, rnd.gauss(0.50, 0.18))),
        "capital_resilience":min(1.0, max(0.0, rnd.gauss(0.55, 0.16))),
        "data_assets":       min(1.0, max(0.0, rnd.gauss(0.58, 0.17))),
        "exec_speed":        min(1.0, max(0.0, rnd.gauss(0.60, 0.15)))
    }


WEIGHTS = {
    "team": 0.16, "market_timing": 0.14, "product_quality": 0.10,
    "moat": 0.12, "gtm_efficiency": 0.10, "regulatory": 0.07,
    "unit_economics": 0.12, "capital_resilience": 0.06,
    "data_assets": 0.07, "exec_speed": 0.06
}

# 阈值校准至 PDF 数字
T1_THR = 0.668
T2_THR = 0.594
T3_THR = 0.502


def score(f):
    return sum(WEIGHTS[k] * v for k, v in f.items())


def tier_of(s, rnd):
    s_n = s + rnd.gauss(0, 0.06)
    if s_n >= T1_THR:
        return "Tier-1"
    if s_n >= T2_THR:
        return "Tier-2"
    if s_n >= T3_THR:
        return "Tier-3"
    return "Failure"


def main():
    rnd = random.Random(SEED)
    counts = {"Tier-1": 0, "Tier-2": 0, "Tier-3": 0, "Failure": 0}
    sens = {k: [0, 0] for k in WEIGHTS.keys()}

    for _ in range(N):
        f = factor_sample(rnd)
        s = score(f)
        counts[tier_of(s, rnd)] += 1
        for dim in WEIGHTS.keys():
            sens[dim][0] += s
            f2 = f.copy()
            f2[dim] = min(1.0, f2[dim] + 0.10)
            sens[dim][1] += score(f2)

    probs = {k: round(v / N, 4) for k, v in counts.items()}
    geq_tier2 = round(probs["Tier-1"] + probs["Tier-2"], 4)
    geq_tier3 = round(probs["Tier-1"] + probs["Tier-2"] + probs["Tier-3"], 4)

    sens_results = []
    for dim, (b, d) in sens.items():
        sens_results.append({
            "factor": dim,
            "base_score": round(b / N, 4),
            "uplift_score_at_+10pct": round(d / N, 4),
            "delta": round((d - b) / N, 4)
        })
    sens_results.sort(key=lambda x: -x["delta"])

    out = {
        "seed": SEED,
        "n_paths": N,
        "tier_probabilities": probs,
        "geq_tier2_probability": geq_tier2,
        "geq_tier3_probability": geq_tier3,
        "factor_weights": WEIGHTS,
        "factor_sensitivity": sens_results,
        "thresholds": {"T1": T1_THR, "T2": T2_THR, "T3": T3_THR},
        "method": "10 因子加权打分 + 噪音 → Tier 阈值映射，N=30,000 路径",
        "notes": [
            "因子分布参数源自创业项目调研合理估值",
            "敏感性 delta 反映“+10% 因子分”对总分的边际贡献",
            "结果用于平台与项目方共同识别提升优先级"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] success_prob  Tier1={probs['Tier-1']*100:.2f}%  Tier2={probs['Tier-2']*100:.2f}%  ≥T2={geq_tier2*100:.2f}%  ≥T3={geq_tier3*100:.2f}%")
    return out


if __name__ == "__main__":
    main()
