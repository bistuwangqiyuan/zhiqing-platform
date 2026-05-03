"""
模型 01 - 市场模型 (Market Model) [v2 对齐 PDF]
====================================================
计算 TAM / SAM / SOM 与五年付费用户/收入路径

数据锚点:
- 国家市场监督管理总局：截至 2024 年底全国登记经营主体 1.89 亿户
- 2024 年全年新设企业 454.6 万户
- 广义"严肃创业意向人群池": 12.3M (含未注册创业者、个体户升级、连续创业、海外华人创业)
- 愿为深度赛道分析付费的转化率 (中情景): 10.0%
- ARPU (深度年费 ·包含 SaaS 订阅 + 报告增值包): $1,920 / 用户·年

输出: data/market_model.json
"""

from __future__ import annotations
import json
from pathlib import Path

SEED = 20260501
OUT = Path(__file__).resolve().parent.parent / "data" / "market_model.json"
OUT.parent.mkdir(parents=True, exist_ok=True)


def market_anchor():
    return {
        "registered_entities_china_2024": 189_000_000,
        "new_companies_china_2024": 4_546_000,
        "founder_intent_pool_total": 12_300_000,
        "depth_payment_conversion_ratio": {
            "low": 0.060,
            "mid": 0.100,
            "high": 0.155,
            "source": "对标 Crunchbase Pro / 艾瑞咨询 SaaS 企服付费转化率"
        },
        "arpu_usd_year": {
            "low": 1_440,
            "mid": 1_920,
            "high": 2_640,
            "source": "深度年费 + 报告增值包；对标 Bloomberg Lite + Crunchbase Pro 区间"
        },
        "deep_consulting_arpu_usd": 38_000,
        "deep_consulting_attach_rate": 0.012
    }


def compute_tam_sam_som():
    a = market_anchor()
    pool = a["founder_intent_pool_total"]
    tam, sam, som = {}, {}, {}
    for sc in ["low", "mid", "high"]:
        ratio = a["depth_payment_conversion_ratio"][sc]
        arpu = a["arpu_usd_year"][sc]
        tam[sc] = round(pool * ratio * arpu / 1e6, 0)
        sam[sc] = round(tam[sc] * 0.42, 0)
        som[sc] = round(sam[sc] * {"low": 0.0035, "mid": 0.0083, "high": 0.0162}[sc], 2)
    return tam, sam, som


def five_year_path():
    a = market_anchor()
    pool = a["founder_intent_pool_total"]
    arpu = a["arpu_usd_year"]["mid"]
    deep_arpu = a["deep_consulting_arpu_usd"]
    paying_share = [0.000040, 0.00015, 0.00045, 0.00104, 0.00204]
    deep_share =   [0.0000010, 0.0000023, 0.0000043, 0.0000079, 0.0000180]
    rows = []
    for i, year in enumerate(range(2026, 2031)):
        users = int(pool * paying_share[i])
        sub_rev = users * arpu / 1e6
        deep_proj = max(1, int(pool * deep_share[i]))
        deep_rev = deep_proj * deep_arpu / 1e6
        rows.append({
            "year": year,
            "paying_users": users,
            "subscription_revenue_mm": round(sub_rev, 2),
            "deep_projects": deep_proj,
            "deep_revenue_mm": round(deep_rev, 2),
            "total_cash_mm": round(sub_rev + deep_rev, 2)
        })
    return rows


def main():
    tam, sam, som = compute_tam_sam_som()
    out = {
        "seed": SEED,
        "anchor": market_anchor(),
        "tam_usd_mm_per_year": tam,
        "sam_usd_mm_per_year": sam,
        "som_year5_usd_mm": som,
        "five_year_path_mid": five_year_path(),
        "method": "TAM = 意向池 × 付费转化率 × ARPU；SAM = TAM × 可服务比例 (0.42)；SOM = SAM × 份额情景",
        "notes": [
            "意向池采用广义口径(含未注册/个体户/连续创业/海外华人创业)",
            "未将股权变现计入 SOM，仅口径为现金类年度收入池",
            "随机种子用于其他模型一致性"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] market_model  TAM(mid)=${tam['mid']}M  SOM(mid)=${som['mid']}M")
    return out


if __name__ == "__main__":
    main()
