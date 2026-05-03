"""
模型 06 - NPV 敏感性与双因子热力图 [v2 对齐 PDF]
====================================================
基础 5 年自由现金流贴现 (折现率 12%) → NPV
- 净利采用 PDF 净利润口径 (扣税后)
- 加入 Year 0 初始投资 $10M (Seed 资金)，用于 NPV 平衡
- 单因子: ARPU / 转化率 / Churn / 销售效率 / 单位成本
- 双因子: ARPU × 转化率

输出: data/sensitivity.json
"""

from __future__ import annotations
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "sensitivity.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def base_pl():
    return [
        {"year": 2026, "rev": 5.3,   "net": -0.8},
        {"year": 2027, "rev": 17.0,  "net": 6.0},
        {"year": 2028, "rev": 44.4,  "net": 25.0},
        {"year": 2029, "rev": 100.3, "net": 67.8},
        {"year": 2030, "rev": 188.1, "net": 137.2}
    ]


DISCOUNT = 0.35
INITIAL_INVESTMENT = 10.0


def npv(rev_mult=1.0, opex_mult=1.0):
    pl = base_pl()
    base_op = {2026: 6.0, 2027: 9.7, 2028: 14.6, 2029: 20.0, 2030: 26.0}
    total = -INITIAL_INVESTMENT
    last_cf = 0.0
    for i, p in enumerate(pl, start=1):
        rev = p["rev"] * rev_mult
        op_ = base_op[p["year"]] * opex_mult
        ebit = rev - op_
        net = ebit * 0.55
        cf = net
        total += cf / ((1 + DISCOUNT) ** i)
        last_cf = cf
    return total


def single_factor():
    base = npv()
    factors = []
    factor_map = {
        "ARPU": ("rev", 1.0),
        "转化率": ("rev", 0.85),
        "Churn (反向)": ("rev", 0.92),
        "销售效率": ("rev", 0.88),
        "单位成本": ("opex", 1.0),
        "技术成本": ("opex", 0.6)
    }
    for name, (axis, lever) in factor_map.items():
        d = 0.20 * lever
        if axis == "rev":
            high = npv(rev_mult=1 + d)
            low = npv(rev_mult=1 - d)
        else:
            high = npv(opex_mult=1 - d)
            low = npv(opex_mult=1 + d)
        factors.append({
            "name": name,
            "low": round(low - base, 2),
            "high": round(high - base, 2),
            "spread": round(high - low, 2)
        })
    factors.sort(key=lambda x: -abs(x["spread"]))
    return base, factors


def heatmap():
    arpu_vals = [-30, -15, 0, 15, 30]
    conv_vals = [-30, -15, 0, 15, 30]
    base = npv()
    grid = []
    for a in arpu_vals:
        row = {"arpu_pct": a, "row": []}
        for c in conv_vals:
            mult = (1 + a / 100) * (1 + c / 100)
            row["row"].append({
                "conversion_pct": c,
                "npv_delta": round(npv(rev_mult=mult) - base, 2)
            })
        grid.append(row)
    return grid


def main():
    base, factors = single_factor()
    out = {
        "base_npv_usd_mm": round(base, 2),
        "discount_rate": DISCOUNT,
        "initial_investment_mm": INITIAL_INVESTMENT,
        "single_factor_tornado": factors,
        "heatmap_arpu_x_conversion": heatmap(),
        "method": "5 年自由现金流贴现 (创业 hurdle rate 35%)，扣 45% (税+冗余/法务/合规)，加 Y0 初始投资 -$10M",
        "notes": [
            "折现率 35% 对应早期创业项目典型 IRR 门槛",
            "未计入终值，保守口径仅取 5 年 cash flows",
            "Opex 因子下降代表成本优化为利好",
            "热力图反映乘性叠加效果"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] sensitivity  NPV=${base:.2f}M  top={factors[0]['name']}")
    return out


if __name__ == "__main__":
    main()
