"use client";

interface Item {
  name: string;
  low: number;
  high: number;
  spread: number;
}

export function Tornado({ items }: { items: Item[] }) {
  const max = Math.max(...items.map((i) => Math.max(Math.abs(i.low), Math.abs(i.high))));
  return (
    <div className="space-y-3">
      {items.map((i) => {
        const lowPct = (Math.abs(i.low) / max) * 50;
        const highPct = (Math.abs(i.high) / max) * 50;
        return (
          <div key={i.name} className="flex items-center gap-3">
            <div className="w-32 text-[12px] text-ink-600 text-right">{i.name}</div>
            <div className="flex-1 relative h-7">
              <div className="absolute inset-y-0 left-1/2 w-px bg-ink-200" />
              <div
                className="absolute inset-y-1 right-1/2 rounded-l-md bg-gradient-to-l from-ink-700 to-ink-900"
                style={{ width: `${lowPct}%` }}
              />
              <div
                className="absolute inset-y-1 left-1/2 rounded-r-md bg-gradient-to-r from-accent-gold to-[#E5CB7E]"
                style={{ width: `${highPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[11px]">
                <span className="text-white/95 z-10">{i.low.toFixed(1)}</span>
                <span className="text-ink-900 z-10">+{i.high.toFixed(1)}</span>
              </div>
            </div>
            <div className="w-16 text-[12px] text-ink-500">±{i.spread.toFixed(1)}M</div>
          </div>
        );
      })}
      <p className="mt-2 text-[11px] text-ink-400">
        各因子 ±20% 对 NPV 的边际影响 (USD M)。条形长度反映影响幅度，正负代表对基准 NPV 的偏移方向。
      </p>
    </div>
  );
}
