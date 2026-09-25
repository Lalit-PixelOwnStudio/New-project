import { PAPERS, STYLES } from "@truehand/catalog";
import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { USE_CASES } from "@/content/use-cases";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/styles", 0.9, "weekly"),
    page("/papers", 0.7),
    page("/batch", 0.8),
    page("/business", 0.7),
    page("/pricing", 0.8),
    page("/guides", 0.6),
    ...USE_CASES.map((u) => page(`/use/${u.slug}`, 0.8)),
    ...STYLES.map((s) => page(`/styles/${s.id}`, 0.7)),
    ...PAPERS.map((p) => page(`/papers/${p.id}`, 0.5)),
    ...GUIDES.map((g) => ({ ...page(`/guides/${g.slug}`, 0.6), lastModified: new Date(g.updated) })),
    page("/about", 0.3, "yearly"),
    page("/contact", 0.3, "yearly"),
    page("/credits", 0.2, "yearly"),
    page("/legal/privacy", 0.2, "yearly"),
    page("/legal/terms", 0.2, "yearly"),
    page("/legal/refunds", 0.2, "yearly"),
    page("/legal/cookies", 0.2, "yearly"),
  ];
}
