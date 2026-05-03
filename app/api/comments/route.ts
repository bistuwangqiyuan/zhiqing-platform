import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    success: true,
    id: `c-${Date.now()}`,
    slug: body.slug,
    note: "Demo: client persists to localStorage; production will route to a moderated DB."
  });
}
