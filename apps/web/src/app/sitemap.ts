import { MetadataRoute } from "next";
import { api } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tanzeeltravels.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/hajj`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/umrah`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tours`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [packagesRes, blogRes] = await Promise.all([
      api.get("/packages", { params: { per_page: 100 } }),
      api.get("/blog", { params: { per_page: 100 } }),
    ]);

    const packageUrls: MetadataRoute.Sitemap = (packagesRes.data.data ?? []).map((pkg: any) => ({
      url: `${BASE_URL}/${pkg.type}/${pkg.slug}`,
      lastModified: new Date(pkg.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const blogUrls: MetadataRoute.Sitemap = (blogRes.data.data ?? []).map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...packageUrls, ...blogUrls];
  } catch {
    return staticRoutes;
  }
}
