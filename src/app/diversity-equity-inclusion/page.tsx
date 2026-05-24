import type { Metadata } from "next";
import DEIClient from "./page-client";

export const metadata: Metadata = {
  title: "Diversity, Equity & Inclusion",
  description: "ESSKAYTONALITY's commitment to diversity, equity, and inclusion in music and entertainment.",
  openGraph: { images: ["/icon-512.png"] },
};

export default function Page() {
  return <DEIClient />;
}
