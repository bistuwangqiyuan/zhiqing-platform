"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession, SessionProvider } from "next-auth/react";

type Variant = "desktop" | "mobile";

function HeaderAuthLinkInner({ variant }: { variant: Variant }) {
  const { status } = useSession();
  const t = useTranslations("auth");

  const desktopCls =
    "rounded-full bg-ink-900 text-white text-[13px] px-4 py-1.5 font-medium hover:bg-ink-700 transition-colors";
  const mobileCls = "btn-primary flex-1 justify-center";
  const cls = variant === "desktop" ? desktopCls : mobileCls;

  if (status === "loading") {
    return <span className={cls + " opacity-50 pointer-events-none"}>…</span>;
  }
  if (status !== "authenticated") {
    return (
      <Link href="/login" className={cls}>
        {t("signIn")}
      </Link>
    );
  }
  return (
    <Link href="/account" className={cls}>
      {t("account")}
    </Link>
  );
}

export function HeaderAuthLink({
  variant = "desktop"
}: {
  variant?: Variant;
}) {
  // SessionProvider lets useSession work without wrapping the whole app.
  // It hits /api/auth/session once on mount; cached client-side after.
  return (
    <SessionProvider>
      <HeaderAuthLinkInner variant={variant} />
    </SessionProvider>
  );
}
