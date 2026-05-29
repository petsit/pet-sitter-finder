import type { MetadataRoute } from "next";

const BASE_URL = "https://pet-sitter-finder-petsit-s-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/", "/reviews/verify"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
