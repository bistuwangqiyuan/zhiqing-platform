import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, MapPin, Calendar, Users, TrendingUp } from "lucide-react";
import { CASES } from "./cases-data";

export const metadata = { title: "案例" };

export default function CasesPage() {
  return (
    <>
      <section className="pt-28 pb-12">
        <div className="container">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Selected Engagements</p>
            <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest max-w-4xl">
              真实陪跑案例 · <span className="text-gradient-gold">每一项判断都可追溯</span>。
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] text-ink-500 leading-relaxed">
              下列案例为脱敏 / 化名展示，详细数据与法务结构以保密协议为准。深度陪跑客户可获得完整复盘报告。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link
                  href={`/cases/${c.id}`}
                  className="group relative block rounded-2xl overflow-hidden border border-ink-100 bg-white hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-[11px] tracking-[0.15em] uppercase text-white/95 bg-black/35 backdrop-blur px-2.5 py-1 rounded-full">
                      {c.track}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] text-ink-400">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{c.year}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{c.region}</span>
                    </div>
                    <h3 className="mt-3 text-[16px] font-semibold text-ink-900 tracking-snug group-hover:text-ink-700 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-500 leading-relaxed line-clamp-3">{c.summary}</p>
                    <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-ink-100">
                      {c.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="text-[10px] text-ink-400">{m.label}</p>
                          <p className="mt-1 text-[14px] font-semibold ticker text-ink-900">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1 text-[12px] text-ink-700 group-hover:text-accent-gold transition-colors">
                      查看完整案例
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container">
          <Reveal>
            <div className="rounded-3xl border border-ink-100 bg-white p-10 lg:p-16 text-center">
              <h2 className="text-display-md font-semibold tracking-snug text-ink-900">想成为下一个深度陪跑案例？</h2>
              <p className="mt-3 max-w-xl mx-auto text-ink-500">先做一次免费的赛道压力测试，再决定是否签约。</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/track-analytics" className="btn-primary">
                  免费赛道测试 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact?type=deep" className="btn-gold">
                  申请深度陪跑
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
