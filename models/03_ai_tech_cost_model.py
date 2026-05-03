"""
模型 03 - AI 与技术成本模型 (AI Tech Cost)
============================================
基于报告 / 项目复杂度，估算 LLM 推理 + 检索 + 评测 + 内容安全的单位成本与年度总成本。

关键假设:
- 每个深度报告平均 token 消耗:
    * 多智能体 prompt + system: ~ 35K tokens
    * 检索数据回填: ~ 220K tokens (chunk re-rank + re-injection)
    * 草稿与 Critic 反复迭代: ~ 380K tokens
  合计 ~ 635K tokens / 项目 (输入 / 输出 比 ≈ 70:30)
- API 单价 (USD / 1M tokens, 加权混合 Sonnet / GPT-4 / 国产大模型):
    * 输入: $3.0
    * 输出: $9.0
- 嵌入与向量库: $0.05 / 项目
- 评测集 + 安全过滤: $0.18 / 项目
- 文档生成 (PDF / 图表 / Excel): $0.4 / 项目
- 工程师时间 (内部分摊): $32 / 项目

输出: data/ai_tech_cost.json
"""

from __future__ import annotations
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "ai_tech_cost.json"
OUT.parent.mkdir(parents=True, exist_ok=True)

DEEP_TOKENS = 635_000
INPUT_RATIO = 0.70
INPUT_PRICE = 3.0  # $/1M
OUTPUT_PRICE = 9.0  # $/1M


def per_report_cost():
    in_tok = DEEP_TOKENS * INPUT_RATIO
    out_tok = DEEP_TOKENS * (1 - INPUT_RATIO)
    api = (in_tok / 1e6) * INPUT_PRICE + (out_tok / 1e6) * OUTPUT_PRICE
    embed = 0.05
    safety = 0.18
    docgen = 0.40
    eng = 32.0
    total = api + embed + safety + docgen + eng
    return {
        "tokens": DEEP_TOKENS,
        "api_cost": round(api, 2),
        "embedding_cost": embed,
        "safety_eval_cost": safety,
        "docgen_cost": docgen,
        "engineer_alloc": eng,
        "total_per_report": round(total, 2)
    }


def standard_subscription_cost():
    # 标准版 SaaS 单用户·月成本
    api = 0.85
    storage = 0.06
    cdn = 0.04
    auth = 0.02
    return {
        "monthly_api_cost": api,
        "monthly_storage": storage,
        "monthly_cdn": cdn,
        "monthly_auth": auth,
        "monthly_total": round(api + storage + cdn + auth, 2)
    }


def annual_volume_costs():
    # 与其他模型保持一致: 深度项目数, 月活订阅
    deep_projects = [12, 28, 56, 96, 150]
    sub_users = [1_800, 5_600, 15_400, 36_500, 78_200]
    pr = per_report_cost()["total_per_report"]
    sub = standard_subscription_cost()["monthly_total"]
    annual = []
    for i, year in enumerate(range(2026, 2031)):
        deep_cost = deep_projects[i] * pr
        sub_cost = sub_users[i] * sub * 12
        gross = deep_cost + sub_cost
        annual.append({
            "year": year,
            "deep_project_cost": round(deep_cost, 2),
            "subscription_serving_cost": round(sub_cost, 2),
            "total_tech_cost": round(gross, 2),
            "deep_projects": deep_projects[i],
            "sub_users": sub_users[i]
        })
    return annual


def main():
    out = {
        "per_report": per_report_cost(),
        "monthly_per_user_subscription": standard_subscription_cost(),
        "annual_volume_costs": annual_volume_costs(),
        "method": "Token×单价 + 检索/评测/文档生成/分摊 → 单单位成本×规模 → 年度成本",
        "notes": [
            "单价采用混合大模型加权 (高质量推理路径)",
            "工程师分摊从研发预算扣除项目数得出",
            "随着规模化，单位成本预计下降 35% (规模化与缓存)；本模型保守保留"
        ]
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] ai_tech_cost  per_report=${per_report_cost()['total_per_report']:.2f}")
    return out


if __name__ == "__main__":
    main()
