import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { POSTS } from "../posts-data";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from "lucide-react";
import { ShareBar } from "@/components/ShareBar";
import { CommentSection } from "@/components/comments/CommentSection";

interface Params { params: { slug: string }; }

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params) {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) return { title: "洞察" };
  return {
    title: p.title,
    description: p.excerpt,
    openGraph: { images: [p.image], title: p.title, description: p.excerpt }
  };
}

export default function PostDetail({ params }: Params) {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) return notFound();
  const idx = POSTS.findIndex((x) => x.slug === p.slug);
  const next = POSTS[(idx + 1) % POSTS.length];
  const readMin = Math.max(2, Math.round(p.body.join("").length / 280));

  return (
    <>
      <section className="pt-28 pb-8">
        <div className="container max-w-3xl">
          <Link href="/insights" className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-700">
            <ArrowLeft className="h-3.5 w-3.5" /> 返回洞察
          </Link>
          <Reveal>
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {p.tags.map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-ink-50 text-ink-500 border border-ink-100">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-display-xl font-semibold text-ink-900 tracking-tightest">{p.title}</h1>
            <div className="mt-5 flex items-center gap-5 text-[13px] text-ink-500">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{p.date}</span>
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" />{p.author}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{readMin} 分钟阅读</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-12">
        <div className="container max-w-5xl">
          <Reveal delay={0.1}>
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-premium">
              <Image src={p.image} alt={p.title} fill priority className="object-cover" sizes="100vw" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-[18px] leading-relaxed text-ink-700 first-letter:text-3xl first-letter:font-semibold first-letter:mr-1">
              {p.excerpt}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-10 prose prose-lg max-w-none">
              {p.body.map((paragraph, i) => (
                <p key={i} className="text-[16px] leading-[1.85] text-ink-600 mb-6">{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ShareBar title={p.title} className="mt-10 pb-10 border-b border-ink-100" />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12">
              <CommentSection slug={p.slug} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-50/40">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Next</p>
            <Link href={`/insights/${next.slug}`} className="mt-3 group flex items-center justify-between gap-6 rounded-2xl border border-ink-100 bg-white p-7 hover:shadow-elevated transition-all duration-500">
              <div>
                <p className="text-[12px] text-ink-400">{next.tags.join(" · ")}</p>
                <h3 className="mt-1 text-headline font-semibold text-ink-900">{next.title}</h3>
              </div>
              <ArrowRight className="h-6 w-6 text-ink-400 group-hover:text-ink-900 group-hover:translate-x-1 transition-all" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
