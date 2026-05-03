"use client";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

type Fmt = "usd" | "raw";
function fmt(v: number, f: Fmt = "raw") {
  if (f === "usd") return `$${v}M`;
  return String(v);
}

interface Datum {
  year: number | string;
  p10: number;
  p50: number;
  p90: number;
}

export function AreaBandChart({ data, height = 320, format = "usd" as Fmt }: { data: Datum[]; height?: number; format?: Fmt }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 16, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="bandGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A85A" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#C8A85A" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "#86868B", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#86868B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => fmt(Number(v), format)}
        />
        <Tooltip
          contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
          formatter={(v: any) => fmt(Number(v), format)}
        />
        <Area type="monotone" dataKey="p90" stroke="none" fill="url(#bandGold)" />
        <Area type="monotone" dataKey="p10" stroke="none" fill="#FFFFFF" />
        <Area type="monotone" dataKey="p50" stroke="#0B0B0E" strokeWidth={2.4} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
