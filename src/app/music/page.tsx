import type { Metadata } from "next";
import MusicClient from "./page-client";

export const metadata: Metadata = {
  title: "Music",
  description: "Stream the latest tracks and albums from ESSKAYTONALITY. Discover curated music from Sahir Alam and featured artists.",
  openGraph: {
    images: ["https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f4fc601fc4bb7f0cf93534d5"],
  },
};

export default function Page() {
  return <MusicClient />;
}
