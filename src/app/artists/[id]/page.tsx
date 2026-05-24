import type { Metadata } from "next";
import ArtistDetailClient from "./page-client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const name = id === "sahir-alam" ? "SAHIR ALAM" : "Artist";
  const genre = id === "sahir-alam" ? "INDIE / POP / CINEMATIC" : "";
  return {
    title: name,
    description: `${name} — ${genre}. Listen to the latest tracks and explore the discography on ESSKAYTONALITY.`,
    openGraph: { images: [id === "sahir-alam" ? "/sahir-alam.webp" : ""] },
  };
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ArtistDetailClient params={params} />;
}
