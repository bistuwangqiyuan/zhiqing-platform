import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    success: true,
    email: body.email,
    note: "Demo subscription created."
  });
}
