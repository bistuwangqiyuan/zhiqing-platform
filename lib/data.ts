// 服务端数据加载: 直接 import 模型生成的 JSON
import marketModel from "@/data/market_model.json";
import fundEconomics from "@/data/fund_economics.json";
import aiTechCost from "@/data/ai_tech_cost.json";
import monteCarloReturns from "@/data/monte_carlo_returns.json";
import successProbability from "@/data/success_probability.json";
import sensitivity from "@/data/sensitivity.json";
import plProjection from "@/data/pl_projection.json";
import trackAnalytics from "@/data/track_analytics.json";

export const models = {
  market: marketModel,
  fund: fundEconomics,
  ai: aiTechCost,
  mc: monteCarloReturns,
  prob: successProbability,
  sens: sensitivity,
  pl: plProjection,
  track: trackAnalytics
};

export type Models = typeof models;
