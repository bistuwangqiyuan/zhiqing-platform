"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { HeaderAuthLink } from "./HeaderAuthLink";

const NAV = [
  { href: "/products", label: "产品" },
  { href: "/technology", label: "技术" },
  { href: "/track-analytics", label: "赛道引擎" },
  { href: "/market", label: "市场与财务" },
  { href: "/cases", label: "案例" },
  { href: "/insights", label: "洞察" },
  { href: "/pricing", label: "定价" },
  { href: "/about", label: "关于" }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-2xl bg-white/75 border-b border-ink-100/70" : "bg-transparent"
      )}
    >
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-ink-900 to-ink-700 text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M12 2L4 7l8 5 8-5-8-5zM4 12l8 5 8-5M4 17l8 5 8-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold tracking-snug text-ink-700 group-hover:text-ink-900 transition-colors">
            智擎 <span className="text-ink-400 font-normal">PreFounder</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-7 text-[13px] text-ink-600">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-ink-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-[13px] text-ink-600 hover:text-ink-900 transition-colors"
          >
            预约咨询
          </Link>
          <HeaderAuthLink variant="desktop" />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 -mr-2 text-ink-700"
          aria-label="菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-ink-100 bg-white/95 backdrop-blur-xl">
          <ul className="container py-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-ink-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 flex gap-3">
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-ghost flex-1">
                预约咨询
              </Link>
              <span onClick={() => setOpen(false)} className="flex-1">
                <HeaderAuthLink variant="mobile" />
              </span>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
