import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  await new Promise((r) => setTimeout(r, 800));
  return NextResponse.json({
    success: true,
    plan: body.plan,
    email: body.email,
    orderId: `zq_${Date.now()}`,
    note: "Demo environment · no real payment captured."
  });
}
