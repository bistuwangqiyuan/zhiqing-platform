import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getWalletBalance,
  listRecentTransactions
} from "@/lib/wallet";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "service_misconfigured", detail: "NETLIFY_DATABASE_URL not set" },
      { status: 503 }
    );
  }

  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const [balance, transactions] = await Promise.all([
      getWalletBalance(user.id),
      listRecentTransactions(user.id, 50)
    ]);
    return NextResponse.json({
      user: { id: user.id, email: user.email },
      balance_micro: balance,
      transactions
    });
  } catch (e) {
    return NextResponse.json(
      { error: "wallet_read_failed", detail: (e as Error).message },
      { status: 500 }
    );
  }
}
