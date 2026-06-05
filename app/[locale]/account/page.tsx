import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { TOPUP_PACKAGES } from "@/lib/pricing";
import {
  getWalletBalance,
  listRecentTransactions
} from "@/lib/wallet";
import { isDbConfigured } from "@/lib/db";
import { AccountClient } from "./AccountClient";

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "account" });
  return { title: t("metaTitle") };
}
export const dynamic = "force-dynamic";

export default async function AccountPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  if (!isDbConfigured()) {
    redirect("/login?error=auth_not_configured&redirect=/account");
  }

  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect("/login?redirect=/account");

  let balance = 0;
  let transactions: Awaited<ReturnType<typeof listRecentTransactions>> = [];
  try {
    [balance, transactions] = await Promise.all([
      getWalletBalance(user.id),
      listRecentTransactions(user.id, 20)
    ]);
  } catch (e) {
    console.error("[/account] wallet load failed", e);
  }

  return (
    <AccountClient
      email={user.email ?? ""}
      balanceMicro={balance}
      transactions={transactions}
      topupPackages={TOPUP_PACKAGES.map((p) => ({ id: p.id, label: p.label }))}
    />
  );
}
