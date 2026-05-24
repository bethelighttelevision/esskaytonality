import type { Metadata } from "next";
import ExecutivesClient from "./page-client";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the executive leadership team driving ESSKAYTONALITY's vision in global music entertainment.",
  openGraph: { images: ["/sahir-alam.webp"] },
};

export default function Page() {
  return <ExecutivesClient />;
}
