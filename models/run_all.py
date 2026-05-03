"""
运行所有模型 (使用全 Python 标准库，零依赖)
============================================
输出 JSON 至 ../data/ 目录，供 Next.js 站点 server-side 直接 import 渲染图表。

使用:
    python models/run_all.py
"""
from __future__ import annotations
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

MODELS = [
    "01_market_model",
    "02_fund_economics_model",
    "03_ai_tech_cost_model",
    "04_monte_carlo_returns",
    "05_success_probability",
    "06_sensitivity_analysis",
    "07_pl_projection",
    "09_track_analytics_model"
]


def run_module(name: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    if hasattr(mod, "main"):
        mod.main()


if __name__ == "__main__":
    print("=" * 60)
    print(" ZhiQing PreFounder · Model Pipeline (SEED=20260501)")
    print("=" * 60)
    for m in MODELS:
        try:
            run_module(m)
        except Exception as e:
            print(f"[ERR] {m}: {e}")
    print("=" * 60)
    print(" Done. JSON outputs in /data/")
    print("=" * 60)
