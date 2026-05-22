import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [walletRes, txRes] = await Promise.all([
    supabase
      .from("wallets")
      .select("balance_micro, updated_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("id, kind, amount_micro, balance_after, ref, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
  ]);

  if (walletRes.error) {
    return NextResponse.json(
      { error: walletRes.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    balance_micro: walletRes.data?.balance_micro ?? 0,
    transactions: txRes.data ?? []
  });
}
