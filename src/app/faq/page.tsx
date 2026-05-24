import type { Metadata } from "next";
import FAQClient from "./page-client";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about ESSKAYTONALITY — the global record label and music entertainment platform.",
  openGraph: { images: ["/icon-512.png"] },
};

export default function Page() {
  return <FAQClient />;
}
