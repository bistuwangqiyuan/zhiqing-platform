/**
 * Refreshes Supabase auth cookies on every request and gates protected routes.
 *   - /account/**       -> requires login (redirect to /login)
 *   - /api/ai           -> requires login (returns 401 JSON)
 *   - /api/account/**   -> requires login (returns 401 JSON)
 *
 * All other routes pass through unchanged.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PAGE_PREFIXES = ["/account"];
const PROTECTED_API_PREFIXES = ["/api/ai", "/api/account"];

export async function middleware(request: NextRequest) {
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
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Gate protected pages
  if (!user && PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  // Gate protected APIs
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
