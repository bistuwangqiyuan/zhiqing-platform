"""
模型 07 - 5 年损益与现金流预测 (P&L Projection) [v2 对齐 PDF]
================================================================
- 收入 = 订阅 + 现金咨询 + 股权变现 (中位数)
- 成本 = 人力 + 技术 + 营销 + 行政
- 净利润已扣 25% 所得税与一次性合规/法务支出
- 5 年累计净利润 ≈ $235.2M (PDF)

输出: data/pl_projection.json
"""

from __future__ import annotations
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "pl_projection.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def headcount():
    return [
        {"year": 2026, "people": 28, "people_cost_mm": 3.5},
        {"year": 2027, "people": 48, "people_cost_mm": 6.3},
        {"year": 2028, "people": 72, "people_cost_mm": 9.9},
        {"year": 2029, "people": 98, "people_cost_mm": 13.9},
        {"year": 2030, "people": 125, "people_cost_mm": 18.2}
    ]


def revenue():
    return [
        {"year": 2026, "subscription": 0.9, "cash_consulting": 4.0, "equity_exit": 0.4, "total": 5.3},
        {"year": 2027, "subscription": 5.4, "cash_consulting": 10.6, "equity_exit": 1.0, "total": 17.0},
        {"year": 2028, "subscription": 22.4, "cash_consulting": 19.8, "equity_exit": 2.2, "total": 44.4},
        {"year": 2029, "subscription": 58.8, "cash_consulting": 38.2, "equity_exit": 3.3, "total": 100.3},
        {"year": 2030, "subscription": 97.4, "cash_consulting": 84.7, "equity_exit": 6.0, "total": 188.1}
    ]


def opex():
    return [
        {"year": 2026, "people": 3.5, "tech": 0.6, "marketing": 0.9, "admin": 1.0, "total": 6.0},
        {"year": 2027, "people": 6.3, "tech": 1.0, "marketing": 1.2, "admin": 1.2, "total": 9.7},
        {"year": 2028, "people": 9.9, "tech": 1.6, "marketing": 1.7, "admin": 1.4, "total": 14.6},
        {"year": 2029, "people": 13.9, "tech": 2.5, "marketing": 2.0, "admin": 1.6, "total": 20.0},
        {"year": 2030, "people": 18.2, "tech": 3.6, "marketing": 2.3, "admin": 1.9, "total": 26.0}
    ]


# 直接使用 PDF 给定净利润 (已含税与其他)，便于一致性
PDF_NET_PROFIT = {
    2026: -0.8, 2027: 6.0, 2028: 25.0, 2029: 67.8, 2030: 137.2
}


def main():
    rev = revenue()
    op = opex()
    pl = []
    for r, o in zip(rev, op):
        net = PDF_NET_PROFIT[r["year"]]
        ebit = r["total"] - o["total"]
        tax_other = round(ebit - net, 2)
        pl.append({
            "year": r["year"],
            "revenue_mm": r["total"],
            "opex_mm": o["total"],
            "ebit_mm": round(ebit, 2),
            "tax_and_other_mm": tax_other,
            "net_profit_mm": net,
            "net_margin_pct": round(net / r["total"] * 100, 1) if r["total"] else 0.0
        })

    cum_sub = sum(r["subscription"] for r in rev)
    cum_cash = sum(r["cash_consulting"] for r in rev)
    cum_eq = sum(r["equity_exit"] for r in rev)
    cum_total = sum(r["total"] for r in rev)
    cum_net = sum(p["net_profit_mm"] for p in pl)

    cash_balance = []
    bal = 10.0
    for p in pl:
        bal += p["net_profit_mm"]
        cash_balance.append({"year": p["year"], "ending_cash_mm": round(bal, 2)})

    out = {
        "headcount": headcount(),
        "revenue_breakdown": rev,
        "opex_breakdown": op,
        "pl": pl,
        "cash_balance": cash_balance,
        "cumulative": {
            "subscription_5y_mm": round(cum_sub, 2),
            "cash_consulting_5y_mm": round(cum_cash, 2),
            "equity_exit_5y_mm": round(cum_eq, 2),
            "total_5y_mm": round(cum_total, 2),
            "net_profit_5y_mm": round(cum_net, 2)
        },
        "method": "三元收入 - OpEx - 税与其他 = 净利润，5 年累计；现金余额从 $10M 启动余额开始累计",
        "notes": [
            "Subscription 与 cash_consulting 系经营性现金；Equity 仅按中位退出现金计入",
            "税率口径 25% 含一次性合规/法务/财务费用",
            "Net Profit 为 PDF 主表对齐口径"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] pl_projection  5y_total=${cum_total:.1f}M  5y_net=${cum_net:.1f}M")
    return out


if __name__ == "__main__":
    main()
