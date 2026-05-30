/**
 * GET /api/auth/dev-link?email=...
 *
 * Returns the most recent magic-link generated for an email — only when
 * dev-link surfacing is enabled (no real email provider is configured).
 * In production with a real email provider this endpoint always 404s.
 *
 * Response: { url: "/api/auth/callback/email?token=…&email=…", expires_in_s }
 *           or { error: "not_found" } 404
 */
import { NextRequest, NextResponse } from "next/server";
import {
  consumeDevMagicLink,
  isDevLinkSurfacingEnabled
} from "@/lib/auth/dev-link-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDevLinkSurfacingEnabled()) {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }

  const url = consumeDevMagicLink(email);
  if (!url) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ url });
}
