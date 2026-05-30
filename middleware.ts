/**
 * Auth + service-misconfiguration gate.
 *
 * Source of truth: Auth.js v5 `auth()` (database session strategy via Drizzle
 * + Neon). Because that triggers a DB roundtrip per middleware invocation,
 * the matcher is intentionally narrow: middleware only runs on protected
 * paths. Public pages, static assets, the Stripe webhook and Auth.js'
 * internal routes all bypass middleware entirely.
 *
 *   /account/**     -> requires session, else 302 /login?redirect=...
 *   /api/ai/**      -> requires session, else 401 JSON
 *   /api/account/** -> requires session, else 401 JSON
 *
 * If the database isn't configured (so Auth.js can't store sessions),
 * protected pages redirect to /login?error=auth_not_configured and
 * protected API routes return 503 service_misconfigured — without ever
 * trying to talk to the DB.
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";

function envConfigured() {
  const dbOk = Boolean(
    process.env.NETLIFY_DATABASE_URL ||
      process.env.DATABASE_URL ||
      process.env.NETLIFY_DATABASE_URL_UNPOOLED
  );
  const authOk = Boolean(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  );
  return dbOk && authOk;
}

export default auth((request) => {
  const { pathname, search } = request.nextUrl;
  const isProtectedApi =
    pathname.startsWith("/api/ai") || pathname.startsWith("/api/account");

  if (!envConfigured()) {
    if (isProtectedApi) {
      return NextResponse.json(
        {
          error: "service_misconfigured",
          message:
            "Required env missing — install the Netlify Neon extension (NETLIFY_DATABASE_URL) and set AUTH_SECRET, then redeploy."
        },
        { status: 503 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + search);
    url.searchParams.set("error", "auth_not_configured");
    return NextResponse.redirect(url);
  }

  if (request.auth?.user) return NextResponse.next();

  if (isProtectedApi) {
    return NextResponse.json(
      { error: "unauthorized", message: "请先登录" },
      { status: 401 }
    );
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/account/:path*", "/api/ai/:path*", "/api/account/:path*"]
};
