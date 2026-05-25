import type { Metadata } from "next";
import AudioPlayer from "@/components/music/AudioPlayer";

export const metadata: Metadata = {
  title: "Originals | ESSKAYTONALITY",
  description: "Discover original music tracks and compositions from ESSKAYTONALITY artists.",
};

export default function OriginalsPage() {
  return (
    <div className="pt-32 pb-40 min-h-screen bg-brand-bg">
      <AudioPlayer title="Originals" subtitle="Original compositions from Esskaytonality." />
    </div>
  );
}
