import { NextResponse } from "next/server";

export const revalidate = 3600;

const CHANNEL_ID = "UCYu0RVZziXJg-hrPiY5FyMA";
const MAX_RESULTS = 20;

function parseDurationIso(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ videos: [] });
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&maxResults=${MAX_RESULTS}&type=video&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      return NextResponse.json({ videos: [] });
    }
    const searchData = await searchRes.json();
    const items = searchData.items || [];
    if (items.length === 0) {
      return NextResponse.json({ videos: [] });
    }

    const videoIds = items.map((item: any) => item.id.videoId).join(",");
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) {
      return NextResponse.json({ videos: [] });
    }
    const videosData = await videosRes.json();

    const videos = (videosData.items || [])
      .map((item: any) => {
        const durationSec = parseDurationIso(item.contentDetails.duration);
        return {
          videoId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || "",
          publishedAt: item.snippet.publishedAt,
          duration: item.contentDetails.duration,
          durationSec,
        };
      })
      .filter((v: { durationSec: number }) => v.durationSec >= 90)
      .sort(
        (a: { publishedAt: string }, b: { publishedAt: string }) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
