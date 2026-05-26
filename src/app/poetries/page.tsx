import type { Metadata } from "next";
import ResponsiveAudioPlayer from "@/components/music/ResponsiveAudioPlayer";

export const metadata: Metadata = {
  title: "Poetries | ESSKAYTONALITY",
  description: "Discover spoken word poetry and lyrical compositions from ESSKAYTONALITY.",
};

export default function PoetriesPage() {
  return (
    <ResponsiveAudioPlayer title="Poetries" subtitle="Spoken word and poetry from Esskaytonality." />
  );
}
