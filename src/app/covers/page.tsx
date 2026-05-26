import type { Metadata } from "next";
import ResponsiveAudioPlayer from "@/components/music/ResponsiveAudioPlayer";

export const metadata: Metadata = {
  title: "Covers | ESSKAYTONALITY",
  description: "Explore cover songs and reimagined classics by ESSKAYTONALITY artists.",
};

export default function CoversPage() {
  return (
    <ResponsiveAudioPlayer title="Covers" subtitle="Cover songs reimagined by Esskaytonality." />
  );
}
