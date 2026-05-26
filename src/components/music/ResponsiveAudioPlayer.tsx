"use client";

import { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import ProfessionalAudioPlayer from "./ProfessionalAudioPlayer";

interface ResponsiveAudioPlayerProps {
  title?: string;
  subtitle?: string;
}

export default function ResponsiveAudioPlayer({ title, subtitle }: ResponsiveAudioPlayerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile) {
    return <ProfessionalAudioPlayer title={title} subtitle={subtitle} />;
  }

  return (
    <div className="pt-32 pb-40 min-h-screen bg-brand-bg">
      <AudioPlayer title={title} subtitle={subtitle} />
    </div>
  );
}
