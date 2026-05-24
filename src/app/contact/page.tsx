import type { Metadata } from "next";
import ContactClient from "./page-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ESSKAYTONALITY. Business inquiries, partnerships, and general questions.",
  openGraph: { images: ["/icon-512.png"] },
};

export default function Page() {
  return <ContactClient />;
}
