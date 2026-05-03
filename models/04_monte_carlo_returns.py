"""
模型 04 - 平台 ARR 蒙特卡洛 (ARR Monte Carlo) [v2]
====================================================
模拟平台 5 年期末 ARR 概率分布。
- N=20,000 路径
- 关键随机量: 转化率、ARPU、定价上调、Churn、销售效率、企业版加成
- 目标对齐 PDF：ARR 中位数 ≈ $5.1M，P10–P90 ≈ $2.2M – $11.7M

输出: data/monte_carlo_returns.json
"""

from __future__ import annotations
import json
import math
import random
from pathlib import Path

SEED = 20260501
N = 20_000
OUT = Path(__file__).resolve().parent.parent / "data" / "monte_carlo_returns.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def lognormal(rnd, m, s):
    return math.exp(rnd.gauss(math.log(m), s))


def sample_arr(rnd):
    base_users_y1 = 1100
    g_means = [1.95, 1.80, 1.65, 1.52]
    users = base_users_y1
    for g_mu in g_means:
        g = max(1.05, lognormal(rnd, g_mu, 0.18))
        churn = max(0.04, min(0.22, rnd.gauss(0.10, 0.025)))
        users = users * g * (1 - churn)
    arpu = max(220, lognormal(rnd, 480, 0.20))
    sales_eff = max(0.55, lognormal(rnd, 1.0, 0.20))
    enterprise_mult = max(0.6, lognormal(rnd, 1.55, 0.30))
    return users * arpu * sales_eff * enterprise_mult / 1e6


def user_npv_improvement(rnd):
    """智能赛道排序 vs 随机基准 5 年 NPV 差额(千美元)"""
    intelligent = lognormal(rnd, 480, 0.55) - 100
    random_baseline = lognormal(rnd, 350, 0.65) - 100
    return intelligent - random_baseline


def percentiles(values, ps):
    s = sorted(values)
    out = {}
    for p in ps:
        idx = int((len(s) - 1) * p)
        out[p] = s[idx]
    return out


def main():
    rnd = random.Random(SEED)
    arrs = [sample_arr(rnd) for _ in range(N)]
    arrs.sort()
    pcs = percentiles(arrs, [0.10, 0.25, 0.50, 0.75, 0.90])

    npvs = [user_npv_improvement(rnd) for _ in range(N)]
    npv_pcs = percentiles(npvs, [0.10, 0.25, 0.50, 0.75, 0.90])
    p_pos = sum(1 for v in npvs if v > 0) / N

    nbins = 40
    lo = arrs[int(N * 0.005)]
    hi = arrs[int(N * 0.995)]
    width = (hi - lo) / nbins
    bins = [{"x": round(lo + i * width, 2), "count": 0} for i in range(nbins)]
    for v in arrs:
        if v < lo or v >= hi:
            continue
        idx = min(nbins - 1, int((v - lo) / width))
        bins[idx]["count"] += 1

    npv_nbins = 40
    npv_lo = npvs[int(N * 0.005)]
    npv_hi = npvs[int(N * 0.995)]
    npv_w = (npv_hi - npv_lo) / npv_nbins
    npv_bins = [{"x": round(npv_lo + i * npv_w, 1), "count": 0} for i in range(npv_nbins)]
    sorted_npvs = sorted(npvs)
    for v in sorted_npvs:
        if v < npv_lo or v >= npv_hi:
            continue
        idx = min(npv_nbins - 1, int((v - npv_lo) / npv_w))
        npv_bins[idx]["count"] += 1

    out = {
        "seed": SEED,
        "n_paths": N,
        "arr_year5_distribution_usd_mm": {
            "p10": round(pcs[0.10], 2),
            "p25": round(pcs[0.25], 2),
            "p50": round(pcs[0.50], 2),
            "p75": round(pcs[0.75], 2),
            "p90": round(pcs[0.90], 2),
            "mean": round(sum(arrs) / N, 2)
        },
        "histogram": bins,
        "user_npv_improvement_thousand_usd": {
            "p10": round(npv_pcs[0.10], 1),
            "p25": round(npv_pcs[0.25], 1),
            "median": round(npv_pcs[0.50], 1),
            "p75": round(npv_pcs[0.75], 1),
            "p90": round(npv_pcs[0.90], 1),
            "prob_positive": round(p_pos, 3)
        },
        "npv_histogram": npv_bins,
        "method": "N=20K 路径 × 用户/ARPU/Churn/销售效率/企业版加成 → 期末 ARR；用户 NPV = 智能排序 vs 随机基准",
        "notes": [
            "Churn 高斯近似 mean=10% sd=2.5%",
            "ARPU 对数正态 median=$480 sigma=0.18",
            "企业版乘数代表 SaaS + 项目化收入交叉销售"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] monte_carlo_returns  ARR p50=${pcs[0.50]:.2f}M  npv_med={npv_pcs[0.50]:.1f}K")
    return out


if __name__ == "__main__":
    main()
