"use client";
import { Cell, Pie, PieChart as RPieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Datum {
  name: string;
  value: number;
}

const COLORS = ["#C8A85A", "#1D1D1F", "#0A84FF", "#A1A1A6", "#5E5CE6"];

export function PieChart({ data, height = 280, tooltipLabel = "概率" }: { data: Datum[]; height?: number; tooltipLabel?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={95}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2}
          paddingAngle={1}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
          formatter={(v: any) => [`${(Number(v) * 100).toFixed(2)}%`, tooltipLabel]}
        />
      </RPieChart>
    </ResponsiveContainer>
  );
}
