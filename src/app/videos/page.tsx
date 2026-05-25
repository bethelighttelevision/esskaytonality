import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import VideosClient from "./page-client";

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: dbVideos } = await supabase.from("videos").select("*").eq("is_published", true).order("display_order", { ascending: true });

  const videos = dbVideos && dbVideos.length > 0 ? dbVideos.map(v => ({
    title: v.title,
    category: v.category,
    image: v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`,
    duration: v.duration || "",
    youtubeId: v.youtube_id,
  })) : null;

  const featuredVideo = videos?.find(v => dbVideos?.find(d => d.is_featured && d.youtube_id === v.youtubeId));
  const otherVideos = videos?.filter(v => v !== featuredVideo) || [];

  return <VideosClient initialVideos={videos ? { featured: featuredVideo || null, list: otherVideos } : null} />;
}
