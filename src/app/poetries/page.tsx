import type { Metadata } from "next";
import AudioPlayer from "@/components/music/AudioPlayer";

export const metadata: Metadata = {
  title: "Poetries | ESSKAYTONALITY",
  description: "Discover spoken word poetry and lyrical compositions from ESSKAYTONALITY.",
};

export default function PoetriesPage() {
  return (
    <div className="pt-32 pb-40 min-h-screen bg-brand-bg">
      <AudioPlayer title="Poetries" subtitle="Spoken word and poetry from Esskaytonality." />
    </div>
  );
}
