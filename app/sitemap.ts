import type { MetadataRoute } from "next";
import { CASES } from "@/app/cases/page";
import { POSTS } from "@/app/insights/page";

const BASE = "https://zhiqing.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["/", "/products", "/technology", "/track-analytics", "/market", "/cases", "/insights", "/pricing", "/contact", "/about"];
  const cases = CASES.map((c) => `/cases/${c.id}`);
  const posts = POSTS.map((p) => `/insights/${p.slug}`);

  return [...fixed, ...cases, ...posts].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.7
  }));
}
