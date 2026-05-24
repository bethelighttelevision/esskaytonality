"use client";

import { useState, use, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Share2, Heart, Disc3, X } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import type { Artist } from "@/lib/types";

// Central default seed if DB setting is not initialized
const defaultArtists: Record<string, Artist> = {
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
      { title: "Qaid Qalandar", streams: "4.5M", time: "4:12", youtubeId: "b-yMQjOqpHQ" },
      { title: "Saiyaara OST", streams: "3.2M", time: "3:45", youtubeId: "gCsv3X5ofhI" },
      { title: "Tere Bina", streams: "2.8M", time: "3:20", youtubeId: "QNmwgrqbYGA" },
      { title: "Vigad Gayi Ae", streams: "1.9M", time: "3:58", youtubeId: "qxPGQLGpCmA" },
      { title: "Pehchaan", streams: "1.5M", time: "4:05", youtubeId: "Vy7wwoI_Ofo" }
    ]
  },
  "the-weeknd": {
    name: "THE WEEKND",
    genre: "R&B / POP",
    banner: "https://images.unsplash.com/photo-1540039155732-d68b54f593e9?q=80&w=2069&auto=format&fit=crop",
    profile: "https://images.unsplash.com/photo-1571343753761-0d32c96b7978?q=80&w=2070&auto=format&fit=crop",
    bio: "Abel Tesfaye, known as The Weeknd, is an award-winning artist known for his sonic versatility and dark lyricism.",
    listeners: "105M",
    streaming: {
      spotify: "https://open.spotify.com/artist/1XyoP618w2Lrsc5K1Q261c",
      apple: "https://music.apple.com/us/artist/the-weeknd/479756766",
      deezer: "https://www.deezer.com/en/artist/1157833"
    },
    albums: [
      { title: "Dawn FM", year: "2022", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop", youtubeId: "4NRXx6caT94" },
      { title: "After Hours", year: "2020", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop", youtubeId: "XXYlFuWEuKI" }
    ],
    popular: [
      { title: "Blinding Lights", streams: "3.5B", time: "3:20", youtubeId: "4NRXx6caT94" },
      { title: "Starboy", streams: "2.8B", time: "3:50", youtubeId: "34Na4j8AVgA" },
      { title: "Save Your Tears", streams: "2.1B", time: "3:35", youtubeId: "XXYlFuWEuKI" }
    ]
  }
};

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);
  const [activeAudio, setActiveAudio] = useState<{ title: string; artistName: string; cover: string; youtubeId: string } | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ytPlayerRef = useRef<any>(null);
  const [isYtReady, setIsYtReady] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load dynamic artist settings record
  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "artists_data")
        .single();
      
      const artistsList = data?.value || Object.values(defaultArtists);
      const found = artistsList.find((a: any) => a.id === resolvedParams.id);
      
      if (found) {
        setArtist(found.id === "sahir-alam" ? { ...found, profile: "/sahir-alam.webp" } : found);
      } else {
        const staticFallback = defaultArtists[resolvedParams.id] || Object.values(defaultArtists)[0];
        setArtist(staticFallback);
      }
      setLoading(false);
    };
    fetchArtistDetails();
  }, [resolvedParams.id]);

  // Setup Hidden YouTube Player to play full tracks without limit
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const initPlayer = () => {
        const YT = (window as any).YT;
        if (YT && YT.Player) {
          if (ytPlayerRef.current) {
            try { ytPlayerRef.current.destroy(); } catch (e) {}
          }
          
          ytPlayerRef.current = new YT.Player('hidden-youtube-audio-player', {
            height: '0',
            width: '0',
            videoId: '',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              origin: window.location.origin
            },
            events: {
              onReady: () => {
                setIsYtReady(true);
              },
              onStateChange: (event: any) => {
                const YTState = (window as any).YT.PlayerState;
                if (event.data === YTState.ENDED) {
                  setIsAudioPlaying(false);
                  setAudioProgress(0);
                }
                if (event.data === YTState.PLAYING) {
                  setIsAudioPlaying(true);
                }
                if (event.data === YTState.PAUSED) {
                  setIsAudioPlaying(false);
                }
              }
            }
          });
        }
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      }
    }
  }, []);

  const playAudioTrack = (track: any) => {
    if (!artist) return;
    const newTrack = {
      title: track.title,
      artistName: artist.name,
      cover: artist.albums[0].cover,
      youtubeId: track.youtubeId
    };
    setActiveAudio(newTrack);
    setIsAudioPlaying(true);
    
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.loadVideoById({ videoId: track.youtubeId });
      } catch (e) {}
    }
  };

  const toggleAudioPlayback = () => {
    if (!ytPlayerRef.current || !isYtReady) return;
    if (isAudioPlaying) {
      ytPlayerRef.current.pauseVideo();
      setIsAudioPlaying(false);
    } else {
      ytPlayerRef.current.playVideo();
      setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isAudioPlaying && ytPlayerRef.current && isYtReady) {
      timer = setInterval(() => {
        try {
          if (ytPlayerRef.current.getCurrentTime && ytPlayerRef.current.getDuration) {
            const time = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            const progress = (time / dur) * 100;
            setAudioProgress(progress || 0);
          }
        } catch (e) {}
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAudioPlaying, isYtReady]);

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
      <div id="hidden-youtube-audio-player" className="pointer-events-none absolute w-0 h-0 opacity-0" />

      {/* Banner */}
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
              <Disc3 className="w-4 h-4 animate-spin-slow" /> Verified Artist
            </p>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold uppercase tracking-wider text-brand-muted">
              <span className="text-white">{artist.listeners} Monthly Listeners</span>
              <span>{artist.genre}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <button 
                onClick={() => playAudioTrack(artist.popular[0])}
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

      <div className="container mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">Popular Tracks</h2>
            <div className="flex flex-col gap-2">
              {artist.popular.map((track: any, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => playAudioTrack(track)}
                  className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-brand-muted font-bold w-6 text-right">{idx + 1}</span>
                    <div className="w-12 h-12 bg-white/10 rounded overflow-hidden relative flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute z-20" />
                      <div className="absolute inset-0 bg-cover group-hover:opacity-30 transition-opacity" style={{ backgroundImage: `url('${artist.albums[0].cover}')` }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors">{track.title}</h3>
                      <p className="text-xs text-brand-muted">{track.streams} Streams</p>
                    </div>
                  </div>
                  <span className="text-sm text-brand-muted">{track.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">Discography</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {artist.albums.map((album: any, idx: number) => (
                <div 
                  key={idx} 
                  className="group cursor-pointer"
                  onClick={() => setActiveVideo({ title: album.title, youtubeId: album.youtubeId })}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${album.cover}')` }} />
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-brand-primary/20 border border-brand-primary/30 animate-ripple pointer-events-none scale-90" />
                        <div className="absolute inset-0 rounded-full bg-brand-primary/20 border border-brand-primary/30 animate-ripple-delay-1 pointer-events-none scale-90" />
                        
                        <div className="relative z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                          <PlayCircle className="w-8 h-8 text-brand-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white truncate group-hover:text-brand-primary transition-colors">{album.title}</h3>
                  <p className="text-sm text-brand-muted">{album.year} • Album</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-16">
          <section className="glass p-8 rounded-2xl">
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
      </div>

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

      <AnimatePresence>
        {activeAudio && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-t border-white/10 px-6 py-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-4 max-w-[30%]">
              <div className="w-12 h-12 rounded bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url('${activeAudio.cover}')` }} />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{activeAudio.title}</h4>
                <p className="text-xs text-brand-muted truncate">{activeAudio.artistName}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 max-w-xl px-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleAudioPlayback}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isAudioPlaying ? (
                    <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 fill-black ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
              <div 
                className="w-full h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                onClick={(e) => {
                  if (!ytPlayerRef.current || !isYtReady) return;
                  try {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const percentage = clickX / width;
                    const dur = ytPlayerRef.current.getDuration();
                    ytPlayerRef.current.seekTo(percentage * dur, true);
                  } catch (err) {}
                }}
              >
                <div className="absolute top-0 left-0 h-full bg-brand-primary group-hover:bg-brand-accent transition-colors" style={{ width: `${audioProgress}%` }} />
              </div>
            </div>

            <button 
              onClick={() => {
                if (ytPlayerRef.current && isYtReady) {
                  ytPlayerRef.current.pauseVideo();
                }
                setIsAudioPlaying(false);
                setActiveAudio(null);
              }}
              className="text-brand-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
