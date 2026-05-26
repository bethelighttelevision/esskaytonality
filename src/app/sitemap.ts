import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://esskaytonality.com";
  const today = new Date().toISOString().split("T")[0];

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
    { url: "/originals", priority: 0.8 },
    { url: "/covers", priority: 0.8 },
    { url: "/group-songs", priority: 0.8 },
    { url: "/poetries", priority: 0.8 },
  ].map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: route.priority,
  }));

  // Dynamic artist pages
  const supabase = createClient();
  const artistUrls: MetadataRoute.Sitemap = [];

  try {
    const { data: artistsData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "artists_data")
      .single();

    const artists: { id: string }[] = artistsData?.value || [];
    for (const artist of artists) {
      if (artist.id) {
        artistUrls.push({
          url: `${baseUrl}/artists/${artist.id}`,
          lastModified: today,
          changeFrequency: "weekly" as const,
          priority: 0.9,
        });
      }
    }
  } catch {}

  try {
    const { data: signedData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "signed_artists_data")
      .single();

    const signedArtists: { id: string }[] = signedData?.value || [];
    for (const artist of signedArtists) {
      if (artist.id) {
        artistUrls.push({
          url: `${baseUrl}/signed-artists/${artist.id}`,
          lastModified: today,
          changeFrequency: "weekly" as const,
          priority: 0.9,
        });
      }
    }
  } catch {}

  return [...staticRoutes, ...artistUrls];
}
