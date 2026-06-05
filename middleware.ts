/**
 * Edge-safe middleware: next-intl locale routing + an auth-cookie gate.
 *
 * IMPORTANT: this file is bundled into a Netlify Edge Function (Web runtime, no
 * Node.js builtins). We MUST NOT import "@/auth" here — that pulls in the
 * Drizzle adapter / Neon driver / nodemailer, which need Node's
 * stream/tls/crypto and fail to bundle for the edge.
 *
 * Auth is only a *first-gate* UX check on the Auth.js session cookie. The
 * authoritative validation happens server-side (Node runtime) in route
 * handlers + pages via auth().
 *
 *   /account/**      + /en/account/**   -> no cookie => redirect to /login
 *   /api/ai/**       /api/account/**    -> no cookie => 401 JSON (not locale-prefixed)
 *
 * Missing env (DB or AUTH_SECRET) -> protected pages redirect to
 * /login?error=auth_not_configured, protected APIs return 503.
 */
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing, type Locale } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token"
];

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => {
    if (request.cookies.get(name)?.value) return true;
    return Boolean(request.cookies.get(`${name}.0`)?.value);
  });
}

function envConfigured(): boolean {
  const dbOk = Boolean(
    process.env.NETLIFY_DATABASE_URL ||
      process.env.DATABASE_URL ||
      process.env.NETLIFY_DATABASE_URL_UNPOOLED
  );
  const authOk = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  return dbOk && authOk;
}

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && routing.locales.includes(cookie as Locale)) {
    return cookie as Locale;
  }
  const accept = request.headers.get("accept-language") ?? "";
  if (accept.toLowerCase().startsWith("en")) return "en";
  return routing.defaultLocale;
}

/** Remove a non-default locale prefix so we can match canonical app paths. */
function stripLocale(pathname: string): string {
  for (const l of routing.locales) {
    if (l === routing.defaultLocale) continue;
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

function loginRedirect(
  request: NextRequest,
  locale: Locale,
  error?: string
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = locale === routing.defaultLocale ? "/login" : `/${locale}/login`;
  url.search = "";
  url.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search
  );
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Protected APIs are NOT locale-prefixed — handle them directly.
  const isProtectedApi =
    pathname.startsWith("/api/ai") || pathname.startsWith("/api/account");
  if (isProtectedApi) {
    const locale = detectLocale(request);
    if (!envConfigured()) {
      return NextResponse.json(
        {
          error: "service_misconfigured",
          message:
            "Required env missing — provision Netlify DB (NETLIFY_DATABASE_URL) and set AUTH_SECRET, then redeploy."
        },
        { status: 503 }
      );
    }
    if (!hasSessionCookie(request)) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: locale === "en" ? "Please sign in first" : "请先登录"
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2) Protected PAGES (account), accounting for the optional locale prefix.
  const canonical = stripLocale(pathname);
  const isProtectedPage =
    canonical === "/account" || canonical.startsWith("/account/");
  if (isProtectedPage) {
    const locale = detectLocale(request);
    if (!envConfigured()) return loginRedirect(request, locale, "auth_not_configured");
    if (!hasSessionCookie(request)) return loginRedirect(request, locale);
  }

  // 3) Everything else: locale routing.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // All pages except Next internals, API and files with an extension.
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Protected, non-localized API namespaces.
    "/api/ai/:path*",
    "/api/account/:path*"
  ]
};
