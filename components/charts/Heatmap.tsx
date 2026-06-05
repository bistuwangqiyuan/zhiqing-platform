"use client";
interface Cell {
  conversion_pct: number;
  npv_delta: number;
}
interface Row {
  arpu_pct: number;
  row: Cell[];
}

export function Heatmap({
  grid,
  header = "ARPU \\ 转化",
  note = "数值为 NPV 偏离基准 (USD M)。绿/金色表示正向，深蓝表示负向；中心 (ARPU=0, 转化=0) 即基础情景。"
}: {
  grid: Row[];
  header?: string;
  note?: string;
}) {
  const flat = grid.flatMap((r) => r.row.map((c) => c.npv_delta));
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const range = max - min || 1;

  function color(v: number) {
    const t = (v - min) / range;
    // gold (positive) ↔ navy (negative), midpoint near 0
    if (v >= 0) {
      const g = Math.round(168 + (255 - 168) * t);
      return `rgb(${Math.round(220 * (0.5 + 0.5 * t))}, ${g}, 90)`;
    }
    const a = Math.round(8 + 80 * (1 + t));
    return `rgb(11, 22, ${50 + a})`;
  }

  const conv_vals = grid[0].row.map((c) => c.conversion_pct);

  return (
    <div className="overflow-x-auto">
      <table className="text-[11px] w-full">
        <thead>
          <tr>
            <th className="p-2 text-ink-400 font-normal">{header}</th>
            {conv_vals.map((c) => (
              <th key={c} className="p-2 text-ink-500 font-normal">
                {c > 0 ? `+${c}%` : `${c}%`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((r) => (
            <tr key={r.arpu_pct}>
              <td className="p-2 text-ink-500">
                {r.arpu_pct > 0 ? `+${r.arpu_pct}%` : `${r.arpu_pct}%`}
              </td>
              {r.row.map((c, i) => (
                <td key={i} className="p-1">
                  <div
                    className="h-12 rounded-md grid place-items-center text-[11px] font-medium text-white"
                    style={{ background: color(c.npv_delta) }}
                  >
                    {c.npv_delta >= 0 ? "+" : ""}
                    {c.npv_delta.toFixed(0)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink-400">
        {note}
      </p>
    </div>
  );
}
