"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Calendar, Sparkles } from "lucide-react";

export default function ReleasesClient() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch("/api/youtube-releases");
        const data = await res.json();
        setVideos(data.videos || []);
      } catch {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="text-brand-accent font-bold tracking-widest uppercase text-xs md:text-sm">
              Esskaytonality
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4"
          >
            All <span className="text-gradient">Releases</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-brand-muted-dark text-sm md:text-base max-w-lg mx-auto"
          >
            Every official release from Esskaytonality — newest first.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-muted-dark">No releases available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any, idx: number) => (
              <motion.div
                key={video.videoId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <button
                  onClick={() => setActiveVideo({ title: video.title, youtubeId: video.videoId })}
                  className="w-full group text-left"
                >
                  <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden card-hover">
                    <div className="relative aspect-video overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${video.thumbnail}')` }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-brand-primary/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium text-white">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.durationSec)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate group-hover:text-brand-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-brand-muted-dark mt-2 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(video.publishedAt)}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
