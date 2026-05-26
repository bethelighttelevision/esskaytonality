import ProfessionalAudioPlayer from "@/components/music/ProfessionalAudioPlayer";

export const metadata = {
  title: "Player Preview — Esskay Tonality",
  description: "Preview the new professional audio player",
};

export default function PlayerPreviewPage() {
  return (
    <ProfessionalAudioPlayer
      title="Professional Player Preview"
      subtitle="Test the new design — resize your browser to see responsive behaviour"
    />
  );
}
