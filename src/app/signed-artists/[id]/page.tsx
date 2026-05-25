import type { Metadata } from "next";
import SignedArtistDetailClient from "./page-client";

export const metadata: Metadata = {
  title: "Signed Artist",
  description: "Meet the official ESSKAYTONALITY signed artist.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <SignedArtistDetailClient params={params} />;
}
