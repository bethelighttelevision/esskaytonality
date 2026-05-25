import type { Metadata } from "next";
import AudioPlayer from "@/components/music/AudioPlayer";

export const metadata: Metadata = {
  title: "Covers | ESSKAYTONALITY",
  description: "Explore cover songs and reimagined classics by ESSKAYTONALITY artists.",
};

export default function CoversPage() {
  return (
    <div className="pt-32 pb-40 min-h-screen bg-brand-bg">
      <AudioPlayer title="Covers" subtitle="Cover songs reimagined by Esskaytonality." />
    </div>
  );
}
