import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { models } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { TrackAnalyzer } from "@/components/track/TrackAnalyzer";

export const metadata = { title: "赛道分析引擎" };

export default function TrackAnalyticsPage() {
  const winFreq = models.track.win_frequency;
  const matrix = models.track.score_matrix;
  const robust = models.track.rank_robustness;

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Track Analytics Engine · 模型 09</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              频率高 ≠ <span className="text-gradient-gold">建议盲目进入</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              赛道分析引擎对 5 大赛道做 8 维评分 + 蒙特卡洛抽样 (N={models.track.n_paths.toLocaleString()})，输出首优频率、排序稳健性与反向情景。我们要让你<u className="decoration-accent-gold underline-offset-4">看清自己为什么"想"进入这条赛道</u>，再决定是否进入。
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 relative aspect-[16/8] w-full rounded-2xl overflow-hidden shadow-premium border border-ink-100">
              <Image src="/images/track-pillars.png" alt="赛道支柱" fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-[12px] tracking-[0.18em] uppercase text-white/65">5 Tracks · 8 Dimensions · {(models.track.n_paths / 1000).toFixed(0)}K Paths</p>
                <p className="mt-1 text-display-md font-semibold">智能首优频率排序</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE ANALYZER */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Interactive · 实时调权重</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              拖动你看重的维度——<span className="text-gradient-blue">看排序如何变化</span>。
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              <TrackAnalyzer matrix={matrix as any} weights={models.track.weights as any} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WIN FREQUENCY */}
      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Win Frequency</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              在默认权重下的<span className="text-gradient-gold">首优频率</span>。
            </h2>
            <p className="mt-3 text-[14px] text-ink-500">
              注意：首优频率高 ≠ 推荐进入。需结合个人禀赋、资金可得、退出路径与尽调结论。
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-3">
              {winFreq.map((w, i) => (
                <div key={w.track} className="rounded-xl border border-ink-100 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-[14px] font-semibold text-ink-700 w-7">#{i + 1}</span>
                      <span className="text-[15px] font-semibold text-ink-900">{w.track}</span>
                    </div>
                    <span className="text-[15px] font-semibold ticker text-ink-700">{(w.win_rate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-gold to-[#E5CB7E] rounded-full"
                      style={{ width: `${w.win_rate * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROBUSTNESS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Rank Robustness</p>
            <h2 className="mt-3 text-display-lg font-semibold text-ink-900 tracking-snug max-w-3xl">
              在 15,000 次抽样中，每条赛道在<span className="text-gradient-blue">不同名次</span>的概率。
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50">
                    <th className="text-left py-3 px-5 font-semibold text-ink-700">赛道</th>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <th key={r} className="py-3 px-3 text-center font-semibold text-ink-700">第{r}名</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {robust.map((r) => (
                    <tr key={r.track}>
                      <td className="py-3 px-5 text-ink-700 font-medium">{r.track}</td>
                      {r.rank_distribution.map((p, i) => {
                        const intensity = Math.min(1, p * 1.5);
                        return (
                          <td key={i} className="py-2 px-2 text-center">
                            <div
                              className="h-9 rounded-md flex items-center justify-center text-[12px] text-white"
                              style={{ background: `rgba(11, 22, 50, ${0.15 + intensity * 0.85})` }}
                            >
                              {(p * 100).toFixed(1)}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16">
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Methodology</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink-900 tracking-snug">方法论</h2>
            <p className="mt-4 text-[15px] text-ink-500 max-w-3xl">{models.track.method}</p>
            <ul className="mt-6 space-y-2 text-[13px] text-ink-500 list-disc list-inside">
              {models.track.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Link href="/contact?type=deep" className="mt-8 btn-primary inline-flex">
              申请使用自定义权重 + 自有产业数据
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
