"""
模型 02 - 资金经济学与 5% 股权退出蒙特卡洛 (Fund Economics) [v2]
====================================================================
- 12,000 条蒙特卡洛路径
- 单项目典型持股 5% (4% - 6% 三角分布抽样)
- 投后估值锚定中位 $12M (对数正态)
- 退出 MOIC 服从对数正态 (中位 3.4x)
- 目标对齐 PDF: 5 年累计退出现金 (中位) ≈ $12.9M

输出: data/fund_economics.json
"""

from __future__ import annotations
import json
import math
import random
from pathlib import Path

SEED = 20260501
N_PATHS = 12_000
OUT = Path(__file__).resolve().parent.parent / "data" / "fund_economics.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def lognormal(rnd, m, s):
    return math.exp(rnd.gauss(math.log(m), s))


def triangular(rnd, low, mode, high):
    return rnd.triangular(low, high, mode)


def sample_one_project(rnd, year):
    stake = triangular(rnd, 0.04, 0.05, 0.06)
    post = lognormal(rnd, 12.0, 0.55)
    if rnd.random() > 0.62:
        return None
    exit_offset = rnd.choices([2, 3, 4, 5, 6, 7], weights=[0.05, 0.15, 0.25, 0.30, 0.18, 0.07])[0]
    exit_year = year + exit_offset
    moic = max(0.4, min(30.0, lognormal(rnd, 1.8, 0.85)))
    cash = stake * post * moic
    return (exit_year, cash)


def percentiles(values, ps):
    s = sorted(values)
    out = {}
    for p in ps:
        idx = int((len(s) - 1) * p)
        out[p] = s[idx]
    return out


def main():
    rnd = random.Random(SEED)
    yearly_signed = [12, 28, 56, 96, 150]
    years = [2026, 2027, 2028, 2029, 2030]
    horizon_years = list(range(2026, 2041))
    cash_paths = [[0.0] * len(horizon_years) for _ in range(N_PATHS)]

    for path_idx in range(N_PATHS):
        for y_i, y in enumerate(years):
            for _ in range(yearly_signed[y_i]):
                proj = sample_one_project(rnd, y)
                if proj is None:
                    continue
                exit_y, cash = proj
                if exit_y in horizon_years:
                    cash_paths[path_idx][horizon_years.index(exit_y)] += cash

    annual = []
    for i, y in enumerate(horizon_years):
        col = [cash_paths[p][i] for p in range(N_PATHS)]
        pct = percentiles(col, [0.10, 0.25, 0.50, 0.75, 0.90])
        annual.append({
            "year": y,
            "p10": round(pct[0.10], 2),
            "p25": round(pct[0.25], 2),
            "p50": round(pct[0.50], 2),
            "p75": round(pct[0.75], 2),
            "p90": round(pct[0.90], 2),
            "mean": round(sum(col) / N_PATHS, 2)
        })

    cum_5y = sorted(sum(cash_paths[p][:5]) for p in range(N_PATHS))
    cum_5y_median = cum_5y[N_PATHS // 2]
    out = {
        "seed": SEED,
        "n_paths": N_PATHS,
        "typical_stake": 0.05,
        "post_money_median_usd_mm": 12.0,
        "moic_median": 1.8,
        "annual_exit_band": annual,
        "cumulative_5y_exit_median_usd_mm": round(cum_5y_median, 2),
        "yearly_signed_projects": yearly_signed,
        "method": "12,000 路径 × 逐项目（持股、估值、MOIC、存活、退出年份）汇总",
        "notes": [
            "仅中位数现金流计入基础情形损益（避免账面虚增）",
            "退出年份分布偏向 4-5 年，符合中早期投资典型周期",
            "MOIC 对数正态截断 [0.4x, 30x]"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] fund_economics  Cum5yMedian=${cum_5y_median:.2f}M")
    return out


if __name__ == "__main__":
    main()
