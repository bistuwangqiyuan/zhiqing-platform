/**
 * Edge-safe auth gate.
 *
 * IMPORTANT: this file is bundled into a Netlify Edge Function, which runs on
 * the Web/Edge runtime (no Node.js builtins). We therefore MUST NOT import
 * "@/auth" here — that pulls in the Drizzle adapter, the Neon driver and
 * nodemailer, all of which require Node's `stream`/`tls`/`crypto` and fail to
 * bundle for the edge.
 *
 * Strategy: this is only a *first-gate* UX check based on the presence of the
 * Auth.js session cookie. The authoritative validation happens server-side in
 * the Node runtime (route handlers + pages call `auth()` and return 401 /
 * redirect on an invalid/expired session). A forged cookie can at most reach a
 * handler that immediately rejects it.
 *
 *   /account/**     -> no session cookie => 302 /login?redirect=...
 *   /api/ai/**      -> no session cookie => 401 JSON
 *   /api/account/** -> no session cookie => 401 JSON
 *
 * When required env is missing (DB or AUTH_SECRET), protected pages redirect to
 * /login?error=auth_not_configured and protected APIs return 503 — without
 * touching the DB.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth.js v5 session cookie names (chunked variants get a ".0" suffix).
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  // legacy next-auth v4 names, just in case
  "next-auth.session-token",
  "__Secure-next-auth.session-token"
];

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => {
    const c = request.cookies.get(name);
    if (c?.value) return true;
    // chunked cookie: authjs.session-token.0
    const chunk0 = request.cookies.get(`${name}.0`);
    return Boolean(chunk0?.value);
  });
}

function envConfigured(): boolean {
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

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtectedApi =
    pathname.startsWith("/api/ai") || pathname.startsWith("/api/account");

  if (!envConfigured()) {
    if (isProtectedApi) {
      return NextResponse.json(
        {
          error: "service_misconfigured",
          message:
            "Required env missing — provision Netlify DB (NETLIFY_DATABASE_URL) and set AUTH_SECRET, then redeploy."
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

  if (hasSessionCookie(request)) return NextResponse.next();

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
}

export const config = {
  matcher: ["/account/:path*", "/api/ai/:path*", "/api/account/:path*"]
};
