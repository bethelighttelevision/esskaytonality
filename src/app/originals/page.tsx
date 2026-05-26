import type { Metadata } from "next";
import ResponsiveAudioPlayer from "@/components/music/ResponsiveAudioPlayer";

export const metadata: Metadata = {
  title: "Originals | ESSKAYTONALITY",
  description: "Discover original music tracks and compositions from ESSKAYTONALITY artists.",
};

export default function OriginalsPage() {
  return (
    <ResponsiveAudioPlayer title="Originals" subtitle="Original compositions from Esskaytonality." />
  );
}
