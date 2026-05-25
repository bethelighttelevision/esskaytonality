import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://esskaytonality.com";

  const staticRoutes = [
    { url: "", priority: 1.0 },
    { url: "/about", priority: 0.8 },
    { url: "/artists", priority: 0.9 },
    { url: "/music", priority: 0.9 },
    { url: "/videos", priority: 0.8 },
    { url: "/contact", priority: 0.7 },
    { url: "/faq", priority: 0.6 },
    { url: "/labels", priority: 0.8 },
    { url: "/team", priority: 0.6 },
    { url: "/diversity-equity-inclusion", priority: 0.6 },
    { url: "/privacy-policy", priority: 0.5 },
    { url: "/terms-of-service", priority: 0.5 },
    { url: "/login", priority: 0.4 },
    { url: "/register", priority: 0.5 },
    { url: "/releases", priority: 0.9 },
    { url: "/signed-artists", priority: 0.8 },
    { url: "/forgot-password", priority: 0.3 },
  ].map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily" as const,
    priority: route.priority,
  }));

  return [...staticRoutes];
}
