"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

interface Bin {
  x: number;
  count: number;
}

export function HistogramChart({
  bins, height = 300, p10, p50, p90, color = "#C8A85A", xUnit = "",
  pathsLabel = "路径", freqLabel = "频次"
}: {
  bins: Bin[];
  height?: number;
  p10?: number;
  p50?: number;
  p90?: number;
  color?: string;
  xUnit?: string;
  pathsLabel?: string;
  freqLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={bins} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis
          dataKey="x"
          tick={{ fill: "#86868B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}${xUnit}`}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
          labelFormatter={(l) => `${l}${xUnit}`}
          formatter={(v: any) => [`${v} ${pathsLabel}`, freqLabel]}
        />
        <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} />
        {p10 != null && <ReferenceLine x={p10} stroke="#86868B" strokeDasharray="3 3" />}
        {p50 != null && <ReferenceLine x={p50} stroke="#1D1D1F" strokeWidth={2} />}
        {p90 != null && <ReferenceLine x={p90} stroke="#86868B" strokeDasharray="3 3" />}
      </BarChart>
    </ResponsiveContainer>
  );
}
