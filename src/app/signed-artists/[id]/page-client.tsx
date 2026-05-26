"use client";

import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Share2, Heart, Disc3, X } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import ProfessionalAudioPlayer from "@/components/music/ProfessionalAudioPlayer";
import { allTracks } from "@/data/tracks";

const defaultSignedArtists: Record<string, any> = {
  "sahir-alam": {
    name: "SAHIR ALAM",
    genre: "INDIE / POP / CINEMATIC",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop",
    profile: "/sahir-alam.webp",
    bio: "Sahir Alam, founder and owner of Esskaytonality, performing under the stage name Esskay Tonality. A multi-talented indie pop and cinematic music composer, producer, and singer-songwriter. Known for his deep atmospheric soundscapes, emotionally charged vocals, and cinematic original releases, Sahir shapes new cultural paradigms through sound.",
    listeners: "135",
    streaming: {
      spotify: "https://open.spotify.com/artist/4O0MQNnVa0IKNlSziBnTE8",
      apple: "https://music.apple.com/sa/artist/esskay-tonality/1546440801",
      deezer: "https://www.deezer.com/en/artist/117961812"
    },
    albums: [
      { title: "Qaid Qalandar", year: "2024", cover: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg", youtubeId: "b-yMQjOqpHQ" },
      { title: "Saiyaara OST", year: "2023", cover: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg", youtubeId: "gCsv3X5ofhI" },
      { title: "Tere Bina", year: "2023", cover: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg", youtubeId: "QNmwgrqbYGA" }
    ],
    popular: [
      { title: "Qaid Qalandar", streams: "4.5M", time: "4:54", image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2736cdc3ee2be0632c3017e64a8", audioUrl: "https://p.scdn.co/mp3-preview/ce39014ea951cd1583153c308c69260fd8f2bd45" },
      { title: "Saiyaara (Extended Cover)", streams: "3.2M", time: "6:44", image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f4fc601fc4bb7f0cf93534d5", audioUrl: "https://p.scdn.co/mp3-preview/826ac34f27dc55f64ddcf404cfc00cf6aa52c9e0" },
      { title: "Tere Bina", streams: "2.8M", time: "5:35", image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b273e669e96351a234a606df7c85", audioUrl: "https://p.scdn.co/mp3-preview/69a69e58f2b1101fe74bc77b2bf9d4712ae1bdf9" },
      { title: "Vigad Gayi Ae", streams: "1.9M", time: "4:09", image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273c3c130c689c6d75dab1bb174", audioUrl: "https://p.scdn.co/mp3-preview/aaaa86545de9dbaaf81f7090f1f1fe9365e89331" },
      { title: "Pehchaan (Strugglers Anthem)", streams: "1.5M", time: "5:16", image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f5afdb3cd21b252134133dba", audioUrl: "https://p.scdn.co/mp3-preview/6952ca1e348cbd497513d8479683a6fd09734c65" }
    ]
  }
};

export default function SignedArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(null); }, 3000);
  };

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "signed_artists_data")
        .single();

      const artistsList = data?.value || Object.values(defaultSignedArtists);
      const found = artistsList.find((a: any) => a.id === resolvedParams.id);

      if (found) {
        setArtist(found.id === "sahir-alam" ? { ...found, profile: "/sahir-alam.webp" } : found);
      } else {
        const staticFallback = defaultSignedArtists[resolvedParams.id] || Object.values(defaultSignedArtists)[0];
        setArtist(staticFallback);
      }
      setLoading(false);
    };
    fetchArtistDetails();
  }, [resolvedParams.id]);

  const handleShare = () => {
    if (typeof window === "undefined" || !artist) return;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: artist.name,
        text: `Check out ${artist.name} on Esskaytonality!`,
        url: url
      }).then(() => {
        triggerToast("Shared successfully!");
      }).catch(() => {
        copyFallback(url);
      });
    } else {
      copyFallback(url);
    }
  };

  const copyFallback = (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          triggerToast("Profile link copied to clipboard!");
        }).catch(() => {
          oldSchoolCopy(text);
        });
      } else {
        oldSchoolCopy(text);
      }
    } catch (e) {
      oldSchoolCopy(text);
    }
  };

  const oldSchoolCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      triggerToast("Profile link copied to clipboard!");
    } catch (err) {
      triggerToast("Could not copy link.");
    }
    document.body.removeChild(textarea);
  };

  if (loading || !artist) {
    return (
      <div className="w-full min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <Disc3 className="w-16 h-16 text-brand-primary animate-spin mx-auto drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]" />
          <p className="text-brand-muted text-sm font-bold uppercase tracking-widest animate-pulse">
            Tuning the Stage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24">
      <section className="relative h-[60vh] w-full flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${artist.banner}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-12 flex flex-col md:flex-row items-end gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-brand-bg shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden shrink-0"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${artist.profile}')` }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full"
          >
            <p className="text-brand-accent font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
              <Disc3 className="w-4 h-4 animate-spin-slow" /> Signed Artist
            </p>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold uppercase tracking-wider text-brand-muted">
              <span className="text-white">{artist.listeners} Monthly Listeners</span>
              <span>{artist.genre}</span>
            </div>

            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <button
                onClick={() => document.getElementById('artist-player')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 bg-brand-primary hover:bg-brand-accent text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105"
              >
                <PlayCircle className="w-6 h-6" />
                Play Mix
              </button>

              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  triggerToast(!isFollowing ? `Following ${artist.name}!` : `Unfollowed ${artist.name}`);
                }}
                className={`px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105 border flex items-center gap-2 ${
                  isFollowing
                    ? "bg-white text-black border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    : "bg-transparent text-white border-white/20 hover:border-white/50 hover:bg-white/5"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button
                onClick={() => {
                  setIsFavorited(!isFavorited);
                  triggerToast(!isFavorited ? `Added ${artist.name} to Favorites!` : `Removed ${artist.name} from Favorites`);
                }}
                className={`glass p-4 rounded-full hover:bg-white/10 transition-colors ${isFavorited ? "bg-red-500/20 text-red-500" : "text-white"}`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? "fill-red-500" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="glass p-4 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ProfessionalAudioPlayer
        tracks={allTracks}
        hideHeader
        hideBackground
        id="artist-player"
      />

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                onClick={() => setActiveVideo(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 mt-16">
        <section className="glass p-8 rounded-2xl max-w-lg">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">About</h2>
          <p className="text-brand-muted leading-relaxed text-sm mb-6">
            {artist.bio}
          </p>
          <div className="flex flex-col gap-4 text-sm font-semibold text-white">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-brand-muted">Followers</span>
              <span>{isFollowing ? "23,001" : "23,000"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-brand-muted">Monthly Listeners</span>
              <span>{artist.listeners}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-brand-muted">Label</span>
              <span>ESSKAYTONALITY ORIGINALS</span>
            </div>
          </div>

          {artist.streaming && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-4">Listen on Streaming Platforms</h3>
              <div className="flex flex-col gap-3">
                {artist.streaming.spotify && (
                  <a
                    href={artist.streaming.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 hover:bg-[#1DB954]/20 hover:border-[#1DB954]/50 transition-all group"
                  >
                    <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.782-8.892-.98-.336.075-.668-.135-.744-.47-.077-.336.135-.668.47-.743 3.856-.88 7.15-.508 9.816 1.128.294.18.387.563.207.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.078-1.182-.413.125-.852-.106-.978-.52-.125-.413.106-.853.52-.978 3.67-1.114 8.238-.574 11.35 1.34.367.226.487.707.26 1.08zm.105-2.81c-3.258-1.933-8.644-2.114-11.758-1.168-.5.15-1.026-.135-1.178-.635-.15-.5.135-1.027.635-1.178 3.585-1.09 9.513-.887 13.275 1.343.45.267.6.846.333 1.296-.267.45-.846.6-1.296.333z"/>
                    </svg>
                    <span className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors">Spotify</span>
                  </a>
                )}
                {artist.streaming.apple && (
                  <a
                    href={artist.streaming.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FA243C]/10 border border-[#FA243C]/20 hover:bg-[#FA243C]/20 hover:border-[#FA243C]/50 transition-all group"
                  >
                    <svg className="w-5 h-5 text-[#FA243C]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.308 13.064c-.38.257-.887.228-1.23-.082l-1.953-1.764v-3.71c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.18c0 .248.122.48.33.62l2.36 2.132c.573.518 1.458.468 1.97-.107.513-.575.463-1.46-.107-1.97l-.02-.019z"/>
                    </svg>
                    <span className="text-sm font-bold text-white group-hover:text-[#FA243C] transition-colors">Apple Music</span>
                  </a>
                )}
                {artist.streaming.deezer && (
                  <a
                    href={artist.streaming.deezer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/20 hover:bg-[#FF4500]/20 hover:border-[#FF4500]/50 transition-all group"
                  >
                    <svg className="w-5 h-5 text-[#FF4500]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 14h2.5v3H4zm3.5-3H10v6H7.5zm3.5-4h2.5v10H11zm3.5 3H17v7h-2.5zm3.5 3H20v4h-2.5z"/>
                    </svg>
                    <span className="text-sm font-bold text-white group-hover:text-[#FF4500] transition-colors">Deezer</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 px-6 py-4 bg-brand-surface border border-brand-primary/40 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.15)] flex items-center gap-3 backdrop-blur-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
            <p className="text-sm font-bold text-white uppercase tracking-widest">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
