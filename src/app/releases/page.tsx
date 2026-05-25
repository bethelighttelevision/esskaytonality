import type { Metadata } from "next";
import ReleasesClient from "./page-client";

export const metadata: Metadata = {
  title: "Releases",
  description: "Latest music releases from ESSKAYTONALITY. Stream the newest tracks and videos.",
  openGraph: {
    images: ["https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg"],
  },
};

export default function Page() {
  return <ReleasesClient />;
}
