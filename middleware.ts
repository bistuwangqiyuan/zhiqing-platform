/**
 * Refreshes Supabase auth cookies on every request and gates protected routes.
 *   - /account/**       -> requires login (redirect to /login)
 *   - /api/ai           -> requires login (returns 401 JSON)
 *   - /api/account/**   -> requires login (returns 401 JSON)
 *
 * If Supabase env vars are missing (so no auth backend is wired up), the
 * middleware degrades gracefully:
 *   - public pages render normally
 *   - protected pages redirect to /login (which itself surfaces the missing-env error)
 *   - protected API routes return 503 service_misconfigured
 *
 * All other routes pass through unchanged.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PAGE_PREFIXES = ["/account"];
const PROTECTED_API_PREFIXES = ["/api/ai", "/api/account"];

function envConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.startsWith("http"));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Graceful degradation when Supabase isn't configured: don't crash on every
  // public request. Only protected paths get a clear error response.
  if (!envConfigured()) {
    if (PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname + search);
      url.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(url);
    }
    if (PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.json(
        {
          error: "service_misconfigured",
          message:
            "Supabase environment variables are missing on this deployment."
        },
        { status: 503 }
      );
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  // IMPORTANT: must be getUser() not getSession() to revalidate the JWT.
  // We tolerate transient Supabase failures by treating them as "no user".
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  if (!user && PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  if (!user && PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.json(
      { error: "unauthorized", message: "请先登录" },
      { status: 401 }
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon
     * - public assets (images/, *.png, *.svg)
     * - Stripe webhook (must NOT refresh user cookies)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/stripe/webhook).*)"
  ]
};
