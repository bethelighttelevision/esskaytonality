import type { Metadata } from "next";
import NewsClient from "./page-client";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news, updates, and announcements from ESSKAYTONALITY and its artists.",
  openGraph: {
    images: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop"],
  },
};

export default function Page() {
  return <NewsClient />;
}
