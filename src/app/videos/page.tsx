import type { Metadata } from "next";
import VideosClient from "./page-client";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch the latest music videos, visualizers, and exclusive content from ESSKAYTONALITY.",
  openGraph: {
    images: ["https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg"],
  },
};

export default function Page() {
  return <VideosClient />;
}
