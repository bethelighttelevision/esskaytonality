import type { Metadata } from "next";
import HomeClient from "./page-client";

export const metadata: Metadata = {
  title: "Home",
  description: "ESSKAYTONALITY — Global music entertainment platform and digital record label. Discover the next generation of sound with Sahir Alam.",
  openGraph: { images: ["https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg"] },
};

export default function Page() {
  return <HomeClient />;
}
