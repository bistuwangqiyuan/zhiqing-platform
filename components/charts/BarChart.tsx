"use client";
import {
  Bar, BarChart as RBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

type Fmt = "usd" | "pct" | "raw" | "k";
function fmt(v: number, f: Fmt = "raw") {
  if (f === "usd") return `$${v}M`;
  if (f === "pct") return `${(v * 100).toFixed(1)}%`;
  if (f === "k") return `$${v}K`;
  return String(v);
}

interface Props<T> {
  data: T[];
  xKey: keyof T & string;
  bars: { key: keyof T & string; color: string; label: string }[];
  height?: number;
  format?: Fmt;
}

export function BarChart<T>({ data, xKey, bars, height = 300, format = "raw" }: Props<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data as any} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#86868B", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#86868B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => fmt(Number(v), format)}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #E8E8ED",
            borderRadius: 12,
            fontSize: 12
          }}
          formatter={(v: any) => fmt(Number(v), format)}
        />
        {bars.map((b) => (
          <Bar key={b.key as string} dataKey={b.key as string} fill={b.color} radius={[8, 8, 0, 0]} maxBarSize={48} />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}
