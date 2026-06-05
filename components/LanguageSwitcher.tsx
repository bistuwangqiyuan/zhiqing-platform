"use client";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  variant = "desktop"
}: {
  variant?: "desktop" | "mobile";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Persist preference for next-intl's middleware detection.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      // usePathname() returns the path without the locale prefix; the router
      // re-adds the correct prefix for the target locale.
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-ink-200 bg-white/70 text-[12px] overflow-hidden",
        variant === "mobile" && "w-full justify-center",
        isPending && "opacity-60 pointer-events-none"
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={cn(
            "px-3 py-1 transition-colors",
            l === locale
              ? "bg-ink-900 text-white"
              : "text-ink-600 hover:text-ink-900"
          )}
        >
          {l === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </div>
  );
}
