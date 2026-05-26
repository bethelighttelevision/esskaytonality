import type { Metadata } from "next";
import ResponsiveAudioPlayer from "@/components/music/ResponsiveAudioPlayer";

export const metadata: Metadata = {
  title: "Group Songs | ESSKAYTONALITY",
  description: "Listen to group songs and collaborations from ESSKAYTONALITY artists.",
};

export default function GroupSongsPage() {
  return (
    <ResponsiveAudioPlayer title="Group Songs" subtitle="Collaborative tracks from Esskaytonality." />
  );
}
