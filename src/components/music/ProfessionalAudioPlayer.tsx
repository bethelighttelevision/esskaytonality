"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  RotateCcw, Shuffle, ListMusic, ChevronDown, Heart
} from "lucide-react";
import type { Track } from "@/types/track";
import { allTracks } from "@/data/tracks";

function formatTime(secs: number): string {
  if (isNaN(secs) || !isFinite(secs)) return "0:00";
  return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
}

// ─── Mini Player (mobile <768px) ───
function MiniPlayer({
  track, isPlaying, currentTime, duration, onTogglePlay, onPrev, onNext, onOpenFullscreen
}: {
  track: Track | null; isPlaying: boolean; currentTime: number; duration: number;
  onTogglePlay: () => void; onPrev: () => void; onNext: () => void; onOpenFullscreen: () => void;
}) {
  if (!track) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div
        onClick={onOpenFullscreen}
        className="bg-black/80 backdrop-blur-2xl border-t border-white/[0.04] active:bg-black/90 transition-colors cursor-pointer"
      >
        <div className="h-[2px] bg-white/[0.04] relative">
          <div className="absolute top-0 left-0 h-full bg-white/30 transition-all duration-200"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/10 shadow-lg">
            <img loading="lazy" src={track.image} alt={track.title} className="w-full h-full object-cover" />
            {isPlaying && <div className="absolute inset-0 rounded-md ring-1 ring-white/20 animate-pulse" />}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate leading-tight">{track.title}</h4>
            <p className="text-[10px] text-white/40 truncate leading-tight mt-[1px]">{track.artist}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button onClick={onPrev} className="p-1.5 text-white/50 hover:text-white/80 transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all duration-150 active:scale-90"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={onNext} className="p-1.5 text-white/50 hover:text-white/80 transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Fullscreen Overlay (mobile) ───
function FullscreenOverlay({
  track, isPlaying, currentTime, duration, volume, isMuted, isShuffle, isLooping,
  onClose, onTogglePlay, onPrev, onNext, onSeek, onVolumeChange, onToggleMute,
  onToggleShuffle, onToggleLoop
}: {
  track: Track | null; isPlaying: boolean; currentTime: number; duration: number;
  volume: number; isMuted: boolean; isShuffle: boolean; isLooping: boolean;
  onClose: () => void; onTogglePlay: () => void; onPrev: () => void; onNext: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void; onToggleShuffle: () => void; onToggleLoop: () => void;
}) {
  if (!track) return null;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col md:hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={onClose} className="p-1 text-white/40 hover:text-white/80 transition-colors">
          <ChevronDown className="w-6 h-6" />
        </button>
        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Now Playing</span>
        <button className="p-1 text-white/40 hover:text-white/80 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Album Art + Vinyl */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-[320px] aspect-square">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"
              strokeDasharray={`${pct * 2.89} 289`} strokeLinecap="round" />
          </svg>
          <motion.div
            animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isPlaying ? { rotate: { repeat: Infinity, duration: 10, ease: "linear" } } : { duration: 0.5 }}
            className="w-full h-full rounded-full bg-neutral-950 border-[3px] border-black/60 shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-[5%] rounded-full border border-white/[0.04]" />
            <div className="absolute inset-[12%] rounded-full border border-white/[0.04]" />
            <div className="absolute inset-[20%] rounded-full border border-white/[0.03]" />
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.04)_50deg,transparent_100deg,transparent_180deg,rgba(255,255,255,0.04)_230deg,transparent_280deg,transparent_360deg)] mix-blend-overlay opacity-80" />
            <div className="w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-black/60 relative z-10 shadow-lg">
              <img loading="lazy" src={track.image} alt={track.title} className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute top-1/2 left-1/2 w-[10%] h-[10%] rounded-full bg-[#111] border border-neutral-800 -translate-x-1/2 -translate-y-1/2 z-20 shadow-inner" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Track Info */}
      <div className="px-6 pb-2">
        <h2 className="text-lg font-bold text-white truncate">{track.title}</h2>
        <p className="text-sm text-white/50 truncate mt-0.5">{track.artist}</p>
      </div>

      {/* Seekbar */}
      <div className="px-6 py-3">
        <div className="relative w-full h-1 bg-white/[0.06] rounded-full cursor-pointer group">
          <div className="absolute top-0 left-0 h-full bg-white/40 group-hover:bg-white/60 rounded-full transition-colors"
            style={{ width: `${pct}%` }} />
          <input type="range" min={0} max={duration || 100} value={currentTime} onChange={onSeek}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-5 appearance-none bg-transparent outline-none cursor-pointer opacity-0"
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-white/30 font-mono">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-white/30 font-mono">-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6 flex items-center justify-center gap-4">
        <button onClick={onToggleShuffle} className={`p-2 rounded-full transition-all ${isShuffle ? "text-white bg-white/10" : "text-white/30 hover:text-white/60"}`}>
          <Shuffle className="w-4 h-4" />
        </button>
        <button onClick={onPrev} className="p-2 text-white/50 hover:text-white/90 transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        <button onClick={onTogglePlay}
          className="w-14 h-14 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all duration-150 active:scale-90 shadow-lg"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button onClick={onNext} className="p-2 text-white/50 hover:text-white/90 transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
        <button onClick={onToggleLoop} className={`p-2 rounded-full transition-all ${isLooping ? "text-white bg-white/10" : "text-white/30 hover:text-white/60"}`}>
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Volume */}
      <div className="px-6 pb-10 flex items-center justify-center gap-3">
        <button onClick={onToggleMute} className="text-white/30 hover:text-white/60 transition-colors">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="relative w-32 h-1 bg-white/[0.06] rounded-full cursor-pointer group">
          <div className="absolute top-0 left-0 h-full bg-white/30 group-hover:bg-white/50 rounded-full transition-colors"
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
          <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={onVolumeChange}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-5 appearance-none bg-transparent outline-none cursor-pointer opacity-0"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Vinyl Art Component (tablet/desktop) ───
function VinylArt({ track, isPlaying, currentTime, duration }: { track: Track | null; isPlaying: boolean; currentTime: number; duration: number }) {
  if (!track) return null;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="relative w-full max-w-[280px] mx-auto lg:max-w-[320px] aspect-square">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"
          strokeDasharray={`${pct * 2.89} 289`} strokeLinecap="round" />
      </svg>
      <motion.div
        animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
        transition={isPlaying ? { rotate: { repeat: Infinity, duration: 10, ease: "linear" } } : { duration: 0.5 }}
        className="w-full h-full rounded-full bg-neutral-950 border-[3px] border-black/50 shadow-2xl flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-[5%] rounded-full border border-white/[0.04]" />
        <div className="absolute inset-[12%] rounded-full border border-white/[0.04]" />
        <div className="absolute inset-[20%] rounded-full border border-white/[0.03]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.04)_50deg,transparent_100deg,transparent_180deg,rgba(255,255,255,0.04)_230deg,transparent_280deg,transparent_360deg)] mix-blend-overlay opacity-80" />
        <div className="w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-black/60 relative z-10 shadow-lg">
          <img loading="lazy" src={track.image} alt={track.title} className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-1/2 left-1/2 w-[10%] h-[10%] rounded-full bg-[#111] border border-neutral-800 -translate-x-1/2 -translate-y-1/2 z-20 shadow-inner" />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Desktop/Tablet Player ───
function DesktopPlayer({
  track, isPlaying, currentTime, duration, volume, isMuted, isShuffle, isLooping,
  tracks, currentTrackIndex,
  onTogglePlay, onPrev, onNext, onSeek, onVolumeChange, onToggleMute, onToggleShuffle, onToggleLoop, onSelectTrack
}: {
  track: Track | null; isPlaying: boolean; currentTime: number; duration: number;
  volume: number; isMuted: boolean; isShuffle: boolean; isLooping: boolean;
  tracks: Track[]; currentTrackIndex: number;
  onTogglePlay: () => void; onPrev: () => void; onNext: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void; onToggleShuffle: () => void; onToggleLoop: () => void;
  onSelectTrack: (index: number) => void;
}) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="max-w-7xl mx-auto px-6 xl:px-12 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Album + Controls */}
        <div className="lg:col-span-5 space-y-6">
          <VinylArt track={track} isPlaying={isPlaying} currentTime={currentTime} duration={duration} />

          <div className="text-center">
            <h2 className="text-xl font-bold text-white truncate">{track?.title || "No track"}</h2>
            <p className="text-sm text-white/50 truncate mt-1">{track?.artist || ""}</p>
          </div>

          {/* Seekbar */}
          <div className="space-y-1.5">
            <div className="relative w-full h-1 bg-white/[0.06] rounded-full cursor-pointer group">
              <div className="absolute top-0 left-0 h-full bg-white/40 group-hover:bg-white/60 rounded-full transition-colors"
                style={{ width: `${pct}%` }} />
              <input type="range" min={0} max={duration || 100} value={currentTime} onChange={onSeek}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-5 appearance-none bg-transparent outline-none cursor-pointer opacity-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/30 font-mono">{formatTime(currentTime)}</span>
              <span className="text-[11px] text-white/30 font-mono">-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={onToggleShuffle} className={`p-2 rounded-full transition-all ${isShuffle ? "text-white bg-white/10" : "text-white/30 hover:text-white/60"}`}>
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrev} className="p-2 text-white/50 hover:text-white/90 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={onTogglePlay}
              className="w-12 h-12 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all duration-150 active:scale-90 shadow-lg"
              style={isPlaying ? { boxShadow: "0 0 24px rgba(255,255,255,0.15)" } : {}}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button onClick={onNext} className="p-2 text-white/50 hover:text-white/90 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            <button onClick={onToggleLoop} className={`p-2 rounded-full transition-all ${isLooping ? "text-white bg-white/10" : "text-white/30 hover:text-white/60"}`}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={onToggleMute} className="text-white/30 hover:text-white/60 transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="relative w-24 h-1 bg-white/[0.06] rounded-full cursor-pointer group">
              <div className="absolute top-0 left-0 h-full bg-white/30 group-hover:bg-white/50 rounded-full transition-colors"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
              <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={onVolumeChange}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-5 appearance-none bg-transparent outline-none cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>

        {/* Right: Tracklist */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
              <ListMusic className="w-4 h-4" /> Tracklist <span className="text-white/30 font-normal">({tracks.length})</span>
            </h3>
          </div>
          <div className="space-y-1.5">
            {tracks.map((t, idx) => {
              const selected = idx === currentTrackIndex;
              return (
                <motion.div
                  key={t.id} onClick={() => onSelectTrack(idx)}
                  whileTap={{ scale: 0.99 }}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    selected ? "bg-white/[0.06] border border-white/[0.08]" : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {/* Number / equalizer */}
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    {selected && isPlaying ? (
                      <div className="flex items-end gap-[1.5px] h-4">
                        <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "60%", animationDelay: "0ms" }} />
                        <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "100%", animationDelay: "150ms" }} />
                        <span className="w-[2px] bg-white/60 rounded-full animate-wave-bar" style={{ height: "40%", animationDelay: "300ms" }} />
                        <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "80%", animationDelay: "75ms" }} />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-white/30 group-hover:text-white/50 transition-colors">{idx + 1}</span>
                    )}
                  </div>
                  {/* Album art */}
                  <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-white/[0.06]">
                    <img loading="lazy" src={t.image} alt={t.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h4 className={`text-sm font-semibold truncate transition-colors ${selected ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-white/40 truncate">{t.artist}</p>
                  </div>
                  {/* Duration */}
                  <span className="text-[11px] text-white/30 font-mono shrink-0">{t.durationText}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Player Component ───
export default function ProfessionalAudioPlayer({ title = "Tonality", subtitle = "Premium Audio Experience", tracks: propTracks, hideHeader, hideBackground, id }: { title?: string; subtitle?: string; tracks?: Track[]; hideHeader?: boolean; hideBackground?: boolean; id?: string }) {
  const tracks = propTracks || allTracks;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytTimerRef = useRef<number | null>(null);
  const [isYtReady, setIsYtReady] = useState(false);
  const currentTrack = tracks[currentTrackIndex];

  const handleNextTrack = useCallback(() => {
    let next = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(next);
    setIsPlaying(true);
  }, [currentTrackIndex, tracks.length, isShuffle]);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrackIndex(currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1);
    setIsPlaying(true);
  }, [currentTrackIndex, tracks.length]);

  const isLoopingRef = useRef(isLooping);
  const isShuffleRef = useRef(isShuffle);
  const handleNextTrackRef = useRef(handleNextTrack);
  const handlePrevTrackRef = useRef(handlePrevTrack);
  isLoopingRef.current = isLooping;
  isShuffleRef.current = isShuffle;
  handleNextTrackRef.current = handleNextTrack;
  handlePrevTrackRef.current = handlePrevTrack;

  // YouTube IFrame API setup
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const initPlayer = () => {
      const YT = (window as any).YT;
      if (YT?.Player) {
        try { if (ytPlayerRef.current) ytPlayerRef.current.destroy(); } catch (_) {}
        ytPlayerRef.current = new YT.Player("hidden-youtube-player", {
          height: "0", width: "0",
          videoId: tracks[0]?.youtubeId,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
          events: {
            onReady: (event: any) => { setIsYtReady(true); event.target.setVolume(volume * 100); },
            onStateChange: (event: any) => {
              const YTS = (window as any).YT.PlayerState;
              if (event.data === YTS.ENDED) {
                if (isLoopingRef.current) event.target.playVideo();
                else handleNextTrackRef.current();
                if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null; }
              }
              if (event.data === YTS.PLAYING) { const d = event.target.getDuration(); if (d) setDuration(d); setIsPlaying(true); }
              if (event.data === YTS.PAUSED) setIsPlaying(false);
            }
          }
        });
      }
    };
    if ((window as any).YT?.Player) initPlayer();
    else (window as any).onYouTubeIframeAPIReady = initPlayer;
  }, []);

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current;
    const onEnded = () => {
      if (isLoopingRef.current) { a.play().catch(() => {}); }
      else { handleNextTrackRef.current(); }
    };
    a.addEventListener("timeupdate", () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); });
    a.addEventListener("loadedmetadata", () => { if (audioRef.current) setDuration(audioRef.current.duration); });
    a.addEventListener("ended", onEnded);
    return () => { a.removeEventListener("ended", onEnded); a.pause(); a.src = ""; };
  }, []);

  // YT time polling
  useEffect(() => {
    if (isPlaying && ytPlayerRef.current && isYtReady && currentTrack?.youtubeId) {
      const poll = () => {
        try { if (ytPlayerRef.current) setCurrentTime(ytPlayerRef.current.getCurrentTime()); } catch (_) {}
      };
      ytTimerRef.current = window.setInterval(poll, 350);
    }
    return () => { if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null; } };
  }, [isPlaying, isYtReady, currentTrack?.youtubeId]);

  useEffect(() => {
    if (!currentTrack) return;
    if (ytPlayerRef.current && isYtReady) ytPlayerRef.current.pauseVideo();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (currentTrack.youtubeId && ytPlayerRef.current && isYtReady) {
      try { ytPlayerRef.current.loadVideoById({ videoId: currentTrack.youtubeId }); } catch (_) {}
    } else if (currentTrack.audioUrl) {
      const a = audioRef.current;
      if (a) {
        a.src = currentTrack.audioUrl;
        a.volume = volume;
        a.muted = isMuted;
        if (isPlaying) a.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    if (ytPlayerRef.current && isYtReady) {
      try { ytPlayerRef.current.setVolume(volume * 100); } catch (_) {}
    }
  }, [volume, isMuted, isYtReady]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    if (currentTrack.youtubeId && ytPlayerRef.current && isYtReady) {
      if (isPlaying) { ytPlayerRef.current.pauseVideo(); }
      else { ytPlayerRef.current.playVideo(); }
      return;
    }
    const a = audioRef.current;
    if (!a || !currentTrack.audioUrl) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play().catch(() => {}); setIsPlaying(true); }
  }, [currentTrack, isPlaying, isYtReady]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReady) {
      try { ytPlayerRef.current.seekTo(time, true); } catch (_) {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, [currentTrack, isYtReady]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const handleToggleMute = useCallback(() => setIsMuted(p => !p), []);
  const handleToggleShuffle = useCallback(() => setIsShuffle(p => !p), []);
  const handleToggleLoop = useCallback(() => setIsLooping(p => !p), []);

  const handleSelectTrack = useCallback((index: number) => {
    if (index === currentTrackIndex) togglePlay();
    else { setCurrentTrackIndex(index); setIsPlaying(true); }
  }, [currentTrackIndex, togglePlay]);

  const handleOpenFullscreen = useCallback(() => setIsFullscreen(true), []);
  const handleCloseFullscreen = useCallback(() => setIsFullscreen(false), []);

  return (
    <div id={id} className={`${hideBackground ? '' : 'relative min-h-screen bg-black'} select-none overflow-x-hidden`}>
      {/* Background gradient */}
      {!hideBackground && <div className="fixed inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 pointer-events-none" />}

      {/* Header */}
      {!hideHeader && (
        <div className="relative z-10 pt-8 pb-4 md:pt-12 md:pb-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white/90">{title}</h1>
          <p className="text-sm md:text-base text-white/30 mt-2 max-w-xl mx-auto px-4">{subtitle}</p>
        </div>
      )}

      {/* Desktop / Tablet View */}
      <div className="relative z-10 hidden md:block">
        <DesktopPlayer
          track={currentTrack} isPlaying={isPlaying} currentTime={currentTime} duration={duration}
          volume={volume} isMuted={isMuted} isShuffle={isShuffle} isLooping={isLooping}
          tracks={tracks} currentTrackIndex={currentTrackIndex}
          onTogglePlay={togglePlay} onPrev={handlePrevTrack} onNext={handleNextTrack}
          onSeek={handleSeek} onVolumeChange={handleVolumeChange} onToggleMute={handleToggleMute}
          onToggleShuffle={handleToggleShuffle} onToggleLoop={handleToggleLoop}
          onSelectTrack={handleSelectTrack}
        />
      </div>

      {/* Mobile Mini Player */}
      <div className="relative z-10 md:hidden">
        <div className="px-4 pb-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-28">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Tracklist ({tracks.length})</h3>
            </div>
            <div className="space-y-1">
              {tracks.map((t, idx) => {
                const selected = idx === currentTrackIndex;
                return (
                  <div key={t.id} onClick={() => handleSelectTrack(idx)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      selected ? "bg-white/[0.06]" : "active:bg-white/[0.03]"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {selected && isPlaying ? (
                        <div className="flex items-end gap-[1.5px] h-3.5">
                          <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "60%", animationDelay: "0ms" }} />
                          <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "100%", animationDelay: "150ms" }} />
                          <span className="w-[2px] bg-white/60 rounded-full animate-wave-bar" style={{ height: "40%", animationDelay: "300ms" }} />
                          <span className="w-[2px] bg-white/80 rounded-full animate-wave-bar" style={{ height: "80%", animationDelay: "75ms" }} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-white/30">{idx + 1}</span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-white/[0.06]">
                      <img loading="lazy" src={t.image} alt={t.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h4 className={`text-xs font-semibold truncate ${selected ? "text-white" : "text-white/60"}`}>{t.title}</h4>
                      <p className="text-[10px] text-white/30 truncate">{t.artist}</p>
                    </div>
                    <span className="text-[10px] text-white/25 font-mono shrink-0">{t.durationText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Mini Player (fixed bottom) */}
      <MiniPlayer
        track={currentTrack} isPlaying={isPlaying} currentTime={currentTime} duration={duration}
        onTogglePlay={togglePlay} onPrev={handlePrevTrack} onNext={handleNextTrack}
        onOpenFullscreen={handleOpenFullscreen}
      />

      {/* Mobile Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <FullscreenOverlay
            track={currentTrack} isPlaying={isPlaying} currentTime={currentTime} duration={duration}
            volume={volume} isMuted={isMuted} isShuffle={isShuffle} isLooping={isLooping}
            onClose={handleCloseFullscreen} onTogglePlay={togglePlay}
            onPrev={handlePrevTrack} onNext={handleNextTrack}
            onSeek={handleSeek} onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute} onToggleShuffle={handleToggleShuffle}
            onToggleLoop={handleToggleLoop}
          />
        )}
      </AnimatePresence>

      <div id="hidden-youtube-player" style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none", overflow: "hidden", left: "-9999px" }} />
    </div>
  );
}
