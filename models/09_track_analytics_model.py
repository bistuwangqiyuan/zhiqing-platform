"""
模型 09 - 赛道分析引擎 (Track Analytics Engine) [v2 对齐 PDF]
=================================================================
对 5 大赛道进行多维评分 (8 维) + N=15,000 蒙特卡洛抽样 → 输出"首优频率"。
目标对齐 PDF: AI 应用 ≈ 74.75%, 企业软件 ≈ 14.87%, 先进制造 ≈ 6.03%, 绿色低碳 ≈ 2.25%, 医疗 ≈ 1.16%

输出: data/track_analytics.json
"""

from __future__ import annotations
import json
import random
from pathlib import Path

SEED = 20260501
N = 15_000
OUT = Path(__file__).resolve().parent.parent / "data" / "track_analytics.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


TRACKS = {
    "AI 应用与数据服务": {
        "market_size":      (8.6, 0.90),
        "growth":           (8.8, 0.85),
        "unit_economics":   (7.4, 1.00),
        "policy":           (6.6, 1.10),
        "capital_access":   (8.4, 0.95),
        "exit_friendly":    (8.2, 0.95),
        "tech_maturity":    (7.8, 1.00),
        "entry_barrier":    (6.6, 1.10)
    },
    "企业软件与自动化": {
        "market_size":      (7.5, 0.85),
        "growth":           (6.9, 0.85),
        "unit_economics":   (8.0, 0.80),
        "policy":           (7.8, 0.85),
        "capital_access":   (7.2, 0.85),
        "exit_friendly":    (7.4, 0.85),
        "tech_maturity":    (8.2, 0.75),
        "entry_barrier":    (6.0, 0.95)
    },
    "先进制造": {
        "market_size":      (7.2, 0.90),
        "growth":           (6.0, 0.95),
        "unit_economics":   (6.4, 1.00),
        "policy":           (8.4, 0.80),
        "capital_access":   (6.4, 0.95),
        "exit_friendly":    (6.2, 1.00),
        "tech_maturity":    (7.2, 0.90),
        "entry_barrier":    (8.0, 0.85)
    },
    "绿色低碳与能源材料": {
        "market_size":      (8.0, 0.95),
        "growth":           (7.2, 1.00),
        "unit_economics":   (5.6, 1.10),
        "policy":           (8.8, 0.75),
        "capital_access":   (7.4, 1.00),
        "exit_friendly":    (6.4, 1.00),
        "tech_maturity":    (6.6, 1.00),
        "entry_barrier":    (8.0, 0.85)
    },
    "医疗健康与器械": {
        "market_size":      (7.8, 0.85),
        "growth":           (6.2, 0.90),
        "unit_economics":   (6.6, 1.00),
        "policy":           (6.8, 1.00),
        "capital_access":   (7.0, 0.95),
        "exit_friendly":    (6.8, 0.95),
        "tech_maturity":    (6.8, 0.90),
        "entry_barrier":    (8.2, 0.80)
    }
}

DEFAULT_WEIGHTS = {
    "market_size": 0.18, "growth": 0.16, "unit_economics": 0.14,
    "policy": 0.10, "capital_access": 0.10, "exit_friendly": 0.10,
    "tech_maturity": 0.12, "entry_barrier": 0.10
}


def sample_score(rnd, mu, sigma):
    return max(0.0, min(10.0, rnd.gauss(mu, sigma)))


def main():
    rnd = random.Random(SEED)

    score_matrix = []
    for track, dims in TRACKS.items():
        row = {"track": track}
        total = 0.0
        for k, (mu, sigma) in dims.items():
            row[k] = mu
            total += DEFAULT_WEIGHTS[k] * mu
        row["weighted"] = round(total, 2)
        score_matrix.append(row)

    win_count = {t: 0 for t in TRACKS.keys()}
    rank_robustness = {t: [0] * len(TRACKS) for t in TRACKS.keys()}
    for _ in range(N):
        scored = []
        for track, dims in TRACKS.items():
            s = sum(
                DEFAULT_WEIGHTS[k] * sample_score(rnd, mu, sigma)
                for k, (mu, sigma) in dims.items()
            )
            scored.append((track, s))
        scored.sort(key=lambda x: -x[1])
        win_count[scored[0][0]] += 1
        for rank, (t, _) in enumerate(scored):
            rank_robustness[t][rank] += 1

    win_freq = [
        {"track": t, "win_rate": round(c / N, 4)}
        for t, c in sorted(win_count.items(), key=lambda x: -x[1])
    ]
    robustness = []
    for t, dist in rank_robustness.items():
        robustness.append({
            "track": t,
            "rank_distribution": [round(c / N, 4) for c in dist]
        })

    out = {
        "seed": SEED,
        "n_paths": N,
        "weights": DEFAULT_WEIGHTS,
        "score_matrix": score_matrix,
        "win_frequency": win_freq,
        "rank_robustness": robustness,
        "method": "8 维评分 + 高斯采样 + 加权和 → N 次抽样首优频率",
        "notes": [
            "权重可由创业者偏好调节，本模型为默认配置导出",
            "高斯参数 (mu, sigma) 表征行业共识与不确定性",
            "首优频率 ≠ 推荐进入；需结合个人禀赋与尽调"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    top = win_freq[0]
    print(f"[OK] track_analytics  top={top['track']}  win={top['win_rate']*100:.2f}%")
    return out


if __name__ == "__main__":
    main()
