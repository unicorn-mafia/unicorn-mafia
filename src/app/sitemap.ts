import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://unicrnmafia.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2025-08-24T12:40:22.841Z",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/c`,
      lastModified: "2025-08-24T12:40:22.841Z",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/h`,
      lastModified: "2025-08-24T12:40:22.841Z",
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
  return staticPages
}
