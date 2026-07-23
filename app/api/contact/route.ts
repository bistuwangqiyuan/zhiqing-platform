import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    success: true,
    ticket: `zq_${Date.now()}`,
    type: body.type,
    note: "Demo: in production this routes to mingxinai@agentmail.to."
  });
}
