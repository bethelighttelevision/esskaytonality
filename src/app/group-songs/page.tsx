import type { Metadata } from "next";
import AudioPlayer from "@/components/music/AudioPlayer";

export const metadata: Metadata = {
  title: "Group Songs | ESSKAYTONALITY",
  description: "Listen to group songs and collaborations from ESSKAYTONALITY artists.",
};

export default function GroupSongsPage() {
  return (
    <div className="pt-32 pb-40 min-h-screen bg-brand-bg">
      <AudioPlayer title="Group Songs" subtitle="Collaborative tracks from Esskaytonality." />
    </div>
  );
}
