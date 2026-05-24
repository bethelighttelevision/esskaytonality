import type { Metadata } from "next";
import LabelsClient from "./page-client";

export const metadata: Metadata = {
  title: "Labels",
  description: "Explore ESSKAYTONALITY's specialized music divisions and record labels.",
  openGraph: { images: ["/icon-512.png"] },
};

export default function Page() {
  return <LabelsClient />;
}
