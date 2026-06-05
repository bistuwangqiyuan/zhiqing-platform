"use client";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";

interface Datum {
  year: number;
  subscription: number;
  cash_consulting: number;
  equity_exit: number;
  total: number;
}

export function StackedRevChart({
  data,
  height = 360,
  labels = { subscription: "订阅", cash: "现金咨询/B2B", equity: "股权变现 (中位)" }
}: {
  data: Datum[];
  height?: number;
  labels?: { subscription: string; cash: string; equity: string };
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 12, right: 16, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="g-sub" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#0A84FF" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="g-cash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D1D1F" stopOpacity={0.92} />
            <stop offset="100%" stopColor="#1D1D1F" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="g-eq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A85A" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#C8A85A" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "#86868B", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#86868B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}M`}
        />
        <Tooltip
          contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
          formatter={(v: any, name: string) => [`$${Number(v).toFixed(1)}M`, name]}
        />
        <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} iconType="circle" iconSize={8} />
        <Area type="monotone" dataKey="subscription" name={labels.subscription} stackId="1" stroke="#0A84FF" fill="url(#g-sub)" />
        <Area type="monotone" dataKey="cash_consulting" name={labels.cash} stackId="1" stroke="#1D1D1F" fill="url(#g-cash)" />
        <Area type="monotone" dataKey="equity_exit" name={labels.equity} stackId="1" stroke="#C8A85A" fill="url(#g-eq)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
