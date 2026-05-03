"use client";
import { useState } from "react";
import { Twitter, Linkedin, Link as LinkIcon, MessageCircle, Check } from "lucide-react";

export function ShareBar({ title, className = "" }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const enc = encodeURIComponent;
  const tw = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const li = `https://www.linkedin.com/shareArticle?url=${enc(url)}&title=${enc(title)}`;
  const wb = `https://service.weibo.com/share/share.php?url=${enc(url)}&title=${enc(title)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-[12px] text-ink-500">分享：</span>
      <a href={tw} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full grid place-items-center bg-ink-50 hover:bg-ink-100 transition-colors text-ink-700">
        <Twitter className="h-4 w-4" />
      </a>
      <a href={li} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full grid place-items-center bg-ink-50 hover:bg-ink-100 transition-colors text-ink-700">
        <Linkedin className="h-4 w-4" />
      </a>
      <a href={wb} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full grid place-items-center bg-ink-50 hover:bg-ink-100 transition-colors text-ink-700" aria-label="微博">
        <MessageCircle className="h-4 w-4" />
      </a>
      <button
        onClick={copy}
        className="h-9 px-4 rounded-full grid place-items-center bg-ink-50 hover:bg-ink-100 transition-colors text-ink-700 text-[12px] inline-flex items-center gap-1.5"
      >
        {copied ? <><Check className="h-3.5 w-3.5 text-emerald-600" /> 已复制</> : <><LinkIcon className="h-3.5 w-3.5" /> 复制链接</>}
      </button>
    </div>
  );
}
