import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TOPUP_PACKAGES } from "@/lib/pricing";
import { AccountClient } from "./AccountClient";

export const metadata = { title: "我的账户" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const [walletRes, txRes] = await Promise.all([
    supabase
      .from("wallets")
      .select("balance_micro")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("id, kind, amount_micro, balance_after, ref, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  const balance = Number(walletRes.data?.balance_micro ?? 0);
  const transactions = (txRes.data ?? []).map((t) => ({
    id: t.id as string,
    kind: t.kind as "signup_grant" | "topup" | "debit" | "refund" | "adjust",
    amount_micro: Number(t.amount_micro),
    balance_after: Number(t.balance_after),
    ref: (t.ref as string | null) ?? null,
    created_at: t.created_at as string
  }));

  return (
    <AccountClient
      email={user.email ?? ""}
      balanceMicro={balance}
      transactions={transactions}
      topupPackages={TOPUP_PACKAGES.map((p) => ({ id: p.id, label: p.label }))}
    />
  );
}
