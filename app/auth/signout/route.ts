import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // If env not configured, just redirect to home anyway.
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
