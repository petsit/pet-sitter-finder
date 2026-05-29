import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES } from "@/lib/services";
import { UK_TOWNS } from "@/lib/uk-towns";

const BASE_URL = "https://pet-sitter-finder-petsit-s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static top-level pages
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/find",
    "/pricing",
    "/for-providers",
    "/community-guidelines",
    "/terms",
    "/privacy",
    "/login",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Programmatic SEO pages — every service × every town
  const seoPages: MetadataRoute.Sitemap = [];
  for (const service of SERVICE_CATEGORIES) {
    for (const town of UK_TOWNS) {
      seoPages.push({
        url: `${BASE_URL}/${service.slug}-in-${town.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...seoPages];
}
