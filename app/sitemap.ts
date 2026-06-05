import type { MetadataRoute } from "next";
import { CASE_IDS } from "@/lib/content/cases";
import { POST_SLUGS } from "@/lib/content/posts";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhiqing-platform.netlify.app";

/** Canonical (zh, un-prefixed) paths. English variants are prefixed with /en. */
export function sitemapPaths(): string[] {
  const fixed = ["/", "/products", "/technology", "/track-analytics", "/market", "/cases", "/insights", "/pricing", "/contact", "/about"];
  const cases = CASE_IDS.map((id) => `/cases/${id}`);
  const posts = POST_SLUGS.map((slug) => `/insights/${slug}`);
  const canonical = [...fixed, ...cases, ...posts];
  const english = canonical.map((p) => (p === "/" ? "/en" : `/en${p}`));
  return [...canonical, ...english];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths().map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.7
  }));
}
