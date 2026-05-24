import type { Metadata } from "next";
import ArtistsClient from "./page-client";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the ESSKAYTONALITY artist roster — Sahir Alam and more genre-defining talents.",
  openGraph: { images: ["/sahir-alam.webp"] },
};

export default function Page() {
  return <ArtistsClient />;
}
