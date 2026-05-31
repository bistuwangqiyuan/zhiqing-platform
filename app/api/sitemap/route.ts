/**
 * GET /api/sitemap  → XML sitemap (23 URLs).
 *
 * Why this exists instead of relying solely on app/sitemap.ts:
 * a Netlify UI build plugin (@netlify/plugin-sitemap) writes an EMPTY static
 * /sitemap.xml into the publish dir that shadows the Next.js dynamic route.
 * netlify.toml force-rewrites /sitemap.xml -> /api/sitemap so this always wins.
 */
import { NextResponse } from "next/server";
import { CASES } from "@/app/cases/cases-data";
import { POSTS } from "@/app/insights/posts-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhiqing-platform.netlify.app";

export async function GET() {
  const fixed = [
    "/",
    "/products",
    "/technology",
    "/track-analytics",
    "/market",
    "/cases",
    "/insights",
    "/pricing",
    "/contact",
    "/about"
  ];
  const paths = [
    ...fixed,
    ...CASES.map((c) => `/cases/${c.id}`),
    ...POSTS.map((p) => `/insights/${p.slug}`)
  ];

  const now = new Date().toISOString();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths
      .map(
        (p) =>
          `  <url><loc>${BASE}${p}</loc><lastmod>${now}</lastmod>` +
          `<changefreq>weekly</changefreq>` +
          `<priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
