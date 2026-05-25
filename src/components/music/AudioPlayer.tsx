"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  RotateCcw, Shuffle, ListMusic, Clock } from "lucide-react";
import { Track } from "@/types/track";
import { allTracks } from "@/data/tracks";

export default function AudioPlayer({ title = "Tonality Originals", subtitle = "Stream our latest premium releases and audio arrangements." }: { title?: string; subtitle?: string }) {
  const tracks = allTracks;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isYtReady, setIsYtReady] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current;
    a.addEventListener('timeupdate', () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); });
    a.addEventListener('loadedmetadata', () => { if (audioRef.current) setDuration(audioRef.current.duration); });
    a.addEventListener('ended', handleNextTrack);
    return () => { a.pause(); a.src = ''; };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const initPlayer = () => {
      const YT = (window as any).YT;
      if (YT?.Player) {
        if (ytPlayerRef.current) try { ytPlayerRef.current.destroy(); } catch (e) {}
        ytPlayerRef.current = new YT.Player('hidden-youtube-player', {
          height: '0', width: '0',
          videoId: tracks[0]?.youtubeId,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
          events: {
            onReady: (event: any) => { setIsYtReady(true); event.target.setVolume(volume * 100); },
            onStateChange: (event: any) => {
              const YTS = (window as any).YT.PlayerState;
              if (event.data === YTS.ENDED) { if (isLooping) event.target.playVideo(); else handleNextTrack(); }
              if (event.data === YTS.PLAYING) { setIsPlaying(true); const d = event.target.getDuration(); if (d) setDuration(d); }
              if (event.data === YTS.PAUSED) setIsPlaying(false);
            }
          }
        });
      }
    };
    if ((window as any).YT?.Player) initPlayer();
    else (window as any).onYouTubeIframeAPIReady = initPlayer;
  }, []);

  useEffect(() => {
    if (!currentTrack) return;
    if (ytPlayerRef.current && isYtReady) ytPlayerRef.current.pauseVideo();
    if (audioRef.current) audioRef.current.pause();
    if (currentTrack.youtubeId && ytPlayerRef.current && isYtReady) {
      try { ytPlayerRef.current.loadVideoById({ videoId: currentTrack.youtubeId }); } catch (e) {}
    } else if (currentTrack.audioUrl && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex, isYtReady]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && ytPlayerRef.current && isYtReady) {
      timer = setInterval(() => {
        try {
          if (ytPlayerRef.current?.getCurrentTime) setCurrentTime(ytPlayerRef.current.getCurrentTime() || 0);
          if (ytPlayerRef.current?.getDuration) { const d = ytPlayerRef.current.getDuration(); if (d) setDuration(d); }
        } catch (e) {}
      }, 350);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isPlaying, isYtReady]);

  const togglePlay = () => {
    if (!currentTrack) return;
    if (currentTrack.youtubeId && ytPlayerRef.current && isYtReady) {
      try { if (isPlaying) { ytPlayerRef.current.pauseVideo(); setIsPlaying(false); } else { ytPlayerRef.current.playVideo(); setIsPlaying(true); } } catch (e) {}
    } else if (currentTrack.audioUrl && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
    }
  };

  const handleSelectTrack = (index: number) => {
    if (index === currentTrackIndex) togglePlay();
    else { setCurrentTrackIndex(index); setIsPlaying(true); }
  };

  function handleNextTrack() {
    let next = isShuffle ? Math.floor(Math.random() * tracks.length) : (currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1);
    setCurrentTrackIndex(next); setIsPlaying(true);
  }

  const handlePrevTrack = () => {
    setCurrentTrackIndex(currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value); setCurrentTime(time);
    if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReady) try { ytPlayerRef.current.seekTo(time, true); } catch (e) {}
    else if (currentTrack?.audioUrl && audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value); setVolume(val); setIsMuted(val === 0);
    if (ytPlayerRef.current && isYtReady) try { ytPlayerRef.current.setVolume(val * 100); if (val > 0) ytPlayerRef.current.unMute(); else ytPlayerRef.current.mute(); } catch (e) {}
    if (audioRef.current) { audioRef.current.volume = val; audioRef.current.muted = val === 0; }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (ytPlayerRef.current && isYtReady) try { if (isMuted) { ytPlayerRef.current.unMute(); ytPlayerRef.current.setVolume(volume * 100); } else ytPlayerRef.current.mute(); } catch (e) {}
    if (audioRef.current) audioRef.current.muted = !isMuted;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden bg-brand-bg select-none">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">{title}</h1>
          <p className="text-brand-muted-dark text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-brand-primary" /> Tracklist ({tracks.length})
              </h2>
              <span className="text-xs text-brand-muted-dark uppercase font-bold tracking-widest flex items-center gap-1">
                <Clock className="w-4 h-4" /> Duration
              </span>
            </div>
            <div className="space-y-4">
              {tracks.map((track, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <div key={track.id} onClick={() => handleSelectTrack(idx)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer card-hover ${
                      isSelected ? "bg-brand-surface border-brand-primary/30" : "bg-brand-surface/40 hover:bg-brand-surface/75 border-white/5 hover:border-white/10"
                    }`}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-brand-muted-dark group-hover:text-white transition-colors">{idx + 1}</span>
                      </div>
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                        <img loading="lazy" src={track.image} alt={track.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-bold text-sm tracking-wide uppercase transition-colors truncate ${isSelected ? "text-brand-primary" : "text-white group-hover:text-brand-primary"}`}>{track.title}</h3>
                        <p className="text-xs text-brand-muted-dark truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 pl-4">
                      <span className="text-xs text-brand-muted-dark font-bold tracking-widest">{track.durationText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5">
            <NowPlayingShowcase isPlaying={isPlaying} currentTrack={currentTrack} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 border-t border-white/5 flex flex-col">
        <div className="relative w-full h-1 bg-white/5 cursor-pointer group">
          <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek}
            className="absolute -top-1 left-0 w-full h-3 appearance-none bg-transparent outline-none cursor-pointer accent-brand-primary"
            style={{ background: `linear-gradient(to right, #00ffff 0%, #00ffff ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.08) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.03) 100%)` }}
          />
        </div>
        <div className="py-3 px-4 md:py-5 md:px-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial md:w-1/3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img loading="lazy" src={currentTrack?.image} alt={currentTrack?.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs md:text-sm tracking-wide uppercase text-white truncate">{currentTrack?.title}</h4>
              <p className="text-[10px] md:text-xs text-brand-muted-dark truncate mt-0.5">{currentTrack?.artist}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 justify-center">
            <button onClick={() => setIsLooping(!isLooping)} className={`p-2 rounded-full transition-colors ${isLooping ? "text-brand-primary" : "text-brand-muted-dark hover:text-white"}`}><RotateCcw className="w-4 h-4" /></button>
            <button onClick={handlePrevTrack} className="p-2 text-brand-muted-dark hover:text-white"><SkipBack className="w-5 h-5" /></button>
            <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-brand-primary hover:bg-white text-black flex items-center justify-center transition-all duration-300">
              {isPlaying ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-0.5" />}
            </button>
            <button onClick={handleNextTrack} className="p-2 text-brand-muted-dark hover:text-white"><SkipForward className="w-5 h-5" /></button>
            <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 rounded-full transition-colors ${isShuffle ? "text-brand-primary" : "text-brand-muted-dark hover:text-white"}`}><Shuffle className="w-4 h-4" /></button>
          </div>
          <div className="flex md:hidden items-center gap-2.5 shrink-0">
            <button onClick={handlePrevTrack} className="p-2 text-brand-muted-dark hover:text-white"><SkipBack className="w-4 h-4" /></button>
            <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-brand-primary text-black flex items-center justify-center">
              {isPlaying ? <Pause className="w-4 h-4 text-black fill-black" /> : <Play className="w-4 h-4 text-black fill-black ml-0.5" />}
            </button>
            <button onClick={handleNextTrack} className="p-2 text-brand-muted-dark hover:text-white"><SkipForward className="w-4 h-4" /></button>
          </div>
          <div className="hidden md:flex items-center gap-3 w-1/3 justify-end shrink-0">
            <button onClick={toggleMute} className="text-brand-muted-dark hover:text-white p-2">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={handleVolumeChange}
              className="w-20 h-1 appearance-none bg-white/10 outline-none cursor-pointer accent-brand-primary"
              style={{ background: `linear-gradient(to right, #00ffff 0%, #00ffff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)` }}
            />
          </div>
        </div>
      </div>
      <div id="hidden-youtube-player" style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none", overflow: "hidden", left: "-9999px" }} />
    </div>
  );
}

const NowPlayingShowcase = memo(({ isPlaying, currentTrack }: { isPlaying: boolean; currentTrack: Track }) => {
  if (!currentTrack) return null;
  return (
    <div className="bg-brand-card border border-brand-border p-8 rounded-xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="relative w-64 h-64 flex items-center justify-center mb-8 mt-4 group">
        <motion.div
          animate={{ x: isPlaying ? 140 : 0 }}
          transition={{ x: { type: "spring", stiffness: 90, damping: 18 } }}
          className="absolute w-56 h-56 z-0 select-none pointer-events-none"
        >
          <motion.div
            animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isPlaying ? { rotate: { repeat: Infinity, duration: 12, ease: "linear" as const } } : { duration: 0.5 }}
            className="w-full h-full rounded-full bg-neutral-950 border-4 border-black shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-1.5 rounded-full border border-white/5 opacity-40" />
            <div className="absolute inset-4 rounded-full border border-white/5 opacity-40" />
            <div className="absolute inset-8 rounded-full border border-white/5 opacity-30" />
            <div className="absolute inset-12 rounded-full border border-white/5 opacity-30" />
            <div className="absolute inset-16 rounded-full border border-white/5 opacity-20" />
            <div className="absolute inset-20 rounded-full border border-white/5 opacity-20" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.08)_50deg,transparent_100deg,transparent_180deg,rgba(255,255,255,0.08)_230deg,transparent_280deg,transparent_360deg)] mix-blend-overlay opacity-90" />
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-black/80 relative z-10 shadow-lg shrink-0">
              <img loading="lazy" src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#111] border border-neutral-800 -translate-x-1/2 -translate-y-1/2 z-20 shadow-inner" />
            </div>
            <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-white/30 rounded-full blur-[0.5px]" />
          </motion.div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="relative z-10 w-56 h-56 rounded-2xl overflow-hidden border border-white/10 bg-brand-surface shrink-0">
          <img loading="lazy" src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>
      </div>
      <div className="text-center w-full px-4 mb-8">
        <h3 className="text-xl font-bold uppercase tracking-wider text-white truncate max-w-full">{currentTrack.title}</h3>
        <p className="text-sm text-brand-muted-dark truncate mt-1">{currentTrack.artist}</p>
      </div>
      <div className="flex justify-center items-end gap-1.5 h-16 w-full px-8 relative overflow-hidden bg-brand-surface/30 border border-white/5 py-3 rounded-2xl shadow-inner">
        {Array.from({ length: 18 }).map((_, barIdx) => (
          <div key={barIdx}
            className={`wave-bar bg-gradient-to-t from-brand-primary to-brand-accent ${isPlaying ? `anim-wave-${(barIdx % 5) + 1}` : "h-1.5"}`}
            style={{ width: "4px", opacity: isPlaying ? 0.95 : 0.4 }}
          />
        ))}
      </div>
    </div>
  );
});
NowPlayingShowcase.displayName = "NowPlayingShowcase";
