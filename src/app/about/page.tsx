import type { Metadata } from "next";
import AboutClient from "./page-client";

export const metadata: Metadata = {
  title: "About",
  description: "Discover the story behind ESSKAYTONALITY — a global music entertainment platform and record label founded by Sahir Alam.",
  openGraph: { images: ["/sahir-alam.webp"] },
};

export default function Page() {
  return <AboutClient />;
}
