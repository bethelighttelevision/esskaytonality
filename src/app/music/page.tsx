"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Shuffle, 
  Disc, 
  Sparkles,
  Music,
  ListMusic,
  Radio,
  Clock,
  Filter,
  ArrowUpDown,
  Share2,
  X,
  FileText,
  Users,
  Grid,
  Heart
} from "lucide-react";

// Premium High-Fidelity Audio Tracks representation - Curated directly from Spotify Artist discography
const tracklist = [
  {
    id: 1,
    title: "Saiyaara (Extended Cover)",
    artist: "Esskay Tonality | Nasir Abbas | Sahir Alam",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f4fc601fc4bb7f0cf93534d5",
    audioUrl: "https://p.scdn.co/mp3-preview/826ac34f27dc55f64ddcf404cfc00cf6aa52c9e0",
    durationText: "6:44",
    youtubeId: "gCsv3X5ofhI"
  },
  {
    id: 2,
    title: "Khairiyat (Dream Version)",
    artist: "Esskay Tonality | Sahir Alam",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2738b3b9d7645de7478a2303f7e",
    audioUrl: "https://p.scdn.co/mp3-preview/486e00ebcef477dcc1ed4fe1cc0abac889ec2ba2",
    durationText: "3:31",
    youtubeId: "AWkbd0_GU9Y"
  },
  {
    id: 3,
    title: "Vigad Gayi Ae",
    artist: "Esskay Tonality | Arsalan Arshad | Sahir Alam | Fahad Babar Ali",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273c3c130c689c6d75dab1bb174",
    audioUrl: "https://p.scdn.co/mp3-preview/aaaa86545de9dbaaf81f7090f1f1fe9365e89331",
    durationText: "4:09",
    youtubeId: "qxPGQLGpCmA"
  },
  {
    id: 4,
    title: "Qaid Qalandar",
    artist: "Esskay Tonality | Sahir Alam | Oma Aslam",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2736cdc3ee2be0632c3017e64a8",
    audioUrl: "https://p.scdn.co/mp3-preview/ce39014ea951cd1583153c308c69260fd8f2bd45",
    durationText: "4:54",
    youtubeId: "b-yMQjOqpHQ"
  },
  {
    id: 5,
    title: "Tere Bina",
    artist: "Esskay Tonality | Numan Khan | Sahir Alam | Sumble Noreen",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b273e669e96351a234a606df7c85",
    audioUrl: "https://p.scdn.co/mp3-preview/69a69e58f2b1101fe74bc77b2bf9d4712ae1bdf9",
    durationText: "5:35",
    youtubeId: "QNmwgrqbYGA"
  },
  {
    id: 6,
    title: "Bas Ek Dhadak (Cover Version)",
    artist: "Esskay Tonality | Sahir Alam | Ehsan Latif",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b27383ee734b9eec5915b0e57e27",
    audioUrl: "https://p.scdn.co/mp3-preview/8f4ce1f20c1779052a2dafe4b8e4e34977850f0a",
    durationText: "4:21",
    youtubeId: "R0EsB2oKB50"
  },
  {
    id: 7,
    title: "Qissa (Mahpara) [Film Version]",
    artist: "Esskay Tonality | Sahir Alam",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b273406d0ba6296383e61f8191f2",
    audioUrl: "https://p.scdn.co/mp3-preview/5479387f91c19d601fc02857d246101c734c83af",
    durationText: "4:00",
    youtubeId: "_spXlYKlCik"
  },
  {
    id: 8,
    title: "Mere Bete",
    artist: "Esskay Tonality | Sahir Alam | Sharoon John",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b273b7a25f769b82b849e5a09389",
    audioUrl: "https://p.scdn.co/mp3-preview/00027a8ef7263c37a373061d33c5230525ab0285",
    durationText: "4:12",
    youtubeId: "t4fakTfEUa4"
  },
  {
    id: 9,
    title: "Pehchaan (Strugglers Anthem)",
    artist: "Esskay Tonality | Sahir Alam | Mandeep Kaur",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f5afdb3cd21b252134133dba",
    audioUrl: "https://p.scdn.co/mp3-preview/6952ca1e348cbd497513d8479683a6fd09734c65",
    durationText: "5:16",
    youtubeId: "Vy7wwoI_Ofo"
  },
  {
    id: 10,
    title: "Amn (Peace Between Lands)",
    artist: "Esskay Tonality | Multiple | Sahir Alam",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273a20ad98b2b1326caf85170b4",
    audioUrl: "https://p.scdn.co/mp3-preview/44ba82d5d6a5b11f92f10dc075c44db861c16da4",
    durationText: "6:08",
    youtubeId: "jb3UqLcIDEQ"
  }
];

import { createClient } from "@/utils/supabase/client";

const albumsData = [
  {
    id: "a1",
    title: "Saiyaara (The Album)",
    artist: "Esskay Tonality & Friends",
    genre: "Pop",
    releaseDate: "2024-05-10",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b273f4fc601fc4bb7f0cf93534d5",
    description: "The definitive collection of Saiyaara covers and extended versions.",
    tracks: [
      { title: "Saiyaara (Extended Cover)", duration: "6:44", trackIndex: 0 },
      { title: "Vigad Gayi Ae", duration: "4:09", trackIndex: 2 },
      { title: "Tere Bina", duration: "5:35", trackIndex: 4 }
    ],
    credits: "Produced and Mixed by Sahir Alam."
  },
  {
    id: "a2",
    title: "Khairiyat Sessions",
    artist: "Esskay Tonality",
    genre: "Acoustic",
    releaseDate: "2023-11-20",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2738b3b9d7645de7478a2303f7e",
    description: "Intimate acoustic sessions featuring raw vocals and minimalist arrangements.",
    tracks: [
      { title: "Khairiyat (Dream Version)", duration: "3:31", trackIndex: 1 },
      { title: "Bas Ek Dhadak (Cover Version)", duration: "4:21", trackIndex: 5 }
    ],
    credits: "Produced and Mixed by Sahir Alam."
  },
  {
    id: "a3",
    title: "Qaid Qalandar EP",
    artist: "Esskay Tonality",
    genre: "Sufi Rock",
    releaseDate: "2024-01-15",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d0000b2736cdc3ee2be0632c3017e64a8",
    description: "A powerful fusion of traditional Sufi poetry with modern rock elements.",
    tracks: [
      { title: "Qaid Qalandar", duration: "4:54", trackIndex: 3 },
      { title: "Mere Bete", duration: "4:12", trackIndex: 7 },
      { title: "Pehchaan (Strugglers Anthem)", duration: "5:16", trackIndex: 8 }
    ],
    credits: "Produced and Mixed by Sahir Alam."
  },
  {
    id: "a4",
    title: "Cinematic Soundscapes",
    artist: "Esskay Tonality",
    genre: "Cinematic",
    releaseDate: "2022-08-05",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
    description: "Immersive orchestral and synthetic blends designed for visual media.",
    tracks: [
      { title: "Amn (Peace Between Lands)", duration: "6:08", trackIndex: 9 },
      { title: "Qissa (Mahpara) [Film Version]", duration: "4:00", trackIndex: 6 }
    ],
    credits: "Produced and Arranged by Sahir Alam."
  }
];

export default function MusicPage() {
  const [mergedTracklist, setMergedTracklist] = useState<any[]>([...tracklist]);
  const [mergedAlbums, setMergedAlbums] = useState<any[]>([...albumsData]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Albums State
  const [activeGenre, setActiveGenre] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("tracks");

  const genres = ["All", ...Array.from(new Set(albumsData.map(a => a.genre)))];

  const filteredAndSortedAlbums = albumsData
    .filter(album => activeGenre === "All" || album.genre === activeGenre)
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
    });

  // Ref to hold the YT Player instance and Native Audio instance
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasIncrementedRef = useRef<string | null>(null);
  const [isYtReady, setIsYtReady] = useState(false);
  const supabase = createClient();

  // Fetch Supabase Releases and merge them
  useEffect(() => {
    const fetchReleases = async () => {
      const { data } = await supabase.from("releases").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const newTracks = data.map((r) => ({
          id: r.id,
          title: r.title,
          artist: r.artist_name,
          image: r.cover_image_url,
          audioUrl: r.audio_url,
          durationText: "HQ Audio",
          youtubeId: null // No YouTube ID for native uploads
        }));
        setMergedTracklist([...tracklist, ...newTracks]);
      }
    };
    
    const fetchUserAndFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from("favorites").select("*").eq("user_id", user.id);
        if (data) {
          setFavorites(data.map(f => f.track_id || f.youtube_id));
        }
      }
    };
    
    fetchReleases();
    fetchUserAndFavorites();
    
    // Initialize native audio element
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    });
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    });
    audioRef.current.addEventListener('ended', () => {
      if (isLooping && audioRef.current) {
        audioRef.current.play();
      } else {
        handleNextTrack();
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const currentTrack = mergedTracklist[currentTrackIndex];

  // Load YouTube Iframe API once and initialize player
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
          
          ytPlayerRef.current = new YT.Player('hidden-youtube-player', {
            height: '0',
            width: '0',
            videoId: currentTrack.youtubeId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              origin: typeof window !== "undefined" ? window.location.origin : ""
            },
            events: {
              onReady: (event: any) => {
                setIsYtReady(true);
                event.target.setVolume(volume * 100);
                if (isPlaying) {
                  event.target.playVideo();
                }
              },
              onStateChange: (event: any) => {
                const YTState = (window as any).YT.PlayerState;
                if (event.data === YTState.ENDED) {
                  if (isLooping) {
                    event.target.playVideo();
                  } else {
                    handleNextTrack();
                  }
                }
                if (event.data === YTState.PLAYING) {
                  setIsPlaying(true);
                  const dur = event.target.getDuration();
                  if (dur) setDuration(dur);
                }
                if (event.data === YTState.PAUSED) {
                  setIsPlaying(false);
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

  // Cue or Play the video when active track changes
  useEffect(() => {
    if (!currentTrack) return;

    // Reset increment ref for new track
    if (hasIncrementedRef.current !== currentTrack.id) {
      hasIncrementedRef.current = null;
    }

    // Pause both engines first
    if (ytPlayerRef.current && isYtReady) ytPlayerRef.current.pauseVideo();
    if (audioRef.current) audioRef.current.pause();

    if (currentTrack.youtubeId) {
      // It's a YouTube track
      if (ytPlayerRef.current && isYtReady) {
        try {
          if (isPlaying) {
            ytPlayerRef.current.loadVideoById({ videoId: currentTrack.youtubeId });
          } else {
            ytPlayerRef.current.cueVideoById({ videoId: currentTrack.youtubeId });
          }
        } catch (e) {
          console.log("Error loading video", e);
        }
      }
    } else if (currentTrack.audioUrl) {
      // It's a Native MP3 track from Supabase
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Audio play error", e));
          
          // Real-time dynamic play count increment
          if (!currentTrack.youtubeId && hasIncrementedRef.current !== currentTrack.id) {
            hasIncrementedRef.current = currentTrack.id;
            supabase.rpc('increment_play_count', { release_id: currentTrack.id })
              .then(({ error }) => {
                if (error) console.log("RPC play count error", error);
              });
          }
        }
      }
    }
  }, [currentTrackIndex, isYtReady]);

  // Track playback time progress from the YouTube player
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && ytPlayerRef.current && isYtReady) {
      timer = setInterval(() => {
        try {
          if (ytPlayerRef.current.getCurrentTime) {
            const time = ytPlayerRef.current.getCurrentTime();
            setCurrentTime(time || 0);
          }
          if (ytPlayerRef.current.getDuration) {
            const dur = ytPlayerRef.current.getDuration();
            if (dur) setDuration(dur);
          }
        } catch (e) {}
      }, 350);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isYtReady]);

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (!currentTrack) return;

    if (currentTrack.youtubeId) {
      if (ytPlayerRef.current && isYtReady) {
        try {
          if (isPlaying) {
            ytPlayerRef.current.pauseVideo();
            setIsPlaying(false);
          } else {
            ytPlayerRef.current.playVideo();
            setIsPlaying(true);
          }
        } catch (e) {
          console.log("Play failed: ", e);
        }
      } else {
        setIsPlaying(!isPlaying);
      }
    } else if (currentTrack.audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
          
          // Real-time dynamic play count increment on resume
          if (!currentTrack.youtubeId && hasIncrementedRef.current !== currentTrack.id) {
            hasIncrementedRef.current = currentTrack.id;
            supabase.rpc('increment_play_count', { release_id: currentTrack.id })
              .then(({ error }) => {
                if (error) console.log("RPC play count error", error);
              });
          }
        }
      }
    }
  };

  // Toggle Track Play from List
  const handleSelectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay();
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  // Skip Next Track
  const handleNextTrack = () => {
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * mergedTracklist.length);
    } else {
      nextIndex = currentTrackIndex === mergedTracklist.length - 1 ? 0 : currentTrackIndex + 1;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  // Skip Previous Track
  const handlePrevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? mergedTracklist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  // Toggle Favorite
  const toggleFavorite = async (e: React.MouseEvent, track: any) => {
    e.stopPropagation();
    if (!userId) {
      alert("Please log in to save favorites.");
      return;
    }
    
    const trackIdentifier = track.youtubeId || track.id;
    const isFav = favorites.includes(trackIdentifier);
    
    if (isFav) {
      setFavorites(favorites.filter(id => id !== trackIdentifier));
      if (track.youtubeId) {
        await supabase.from("favorites").delete().eq("user_id", userId).eq("youtube_id", trackIdentifier);
      } else {
        await supabase.from("favorites").delete().eq("user_id", userId).eq("track_id", trackIdentifier);
      }
    } else {
      setFavorites([...favorites, trackIdentifier]);
      await supabase.from("favorites").insert({
        user_id: userId,
        [track.youtubeId ? "youtube_id" : "track_id"]: trackIdentifier
      });
    }
  };

  // Seek Progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.seekTo(time, true);
      } catch (e) {}
    } else if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Volume Slider Handle
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    
    // Update YT Engine
    if (ytPlayerRef.current && isYtReady) {
      try {
        ytPlayerRef.current.setVolume(val * 100);
        if (val > 0) ytPlayerRef.current.unMute();
        else ytPlayerRef.current.mute();
      } catch (e) {}
    }
    
    // Update Native Engine
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  // Volume Mute Toggle
  const toggleMute = () => {
    const mutedState = !isMuted;
    setIsMuted(mutedState);
    
    if (ytPlayerRef.current && isYtReady) {
      try {
        if (mutedState) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume * 100);
        }
      } catch (e) {}
    }
    
    if (audioRef.current) {
      audioRef.current.muted = mutedState;
    }
  };

  // Loop Toggle
  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // Time formatter utility (MM:SS)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Helper toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  return (
    <div className="pt-32 pb-40 container mx-auto px-6 md:px-12 min-h-screen relative overflow-hidden bg-brand-bg select-none">
      
      {/* Sound Waves & Visualizations Styles Injection */}
      <style jsx global>{`
        @keyframes soundwave-pulse {
          0%, 100% { height: 4px; }
          50% { height: 26px; }
        }
        .wave-bar {
          width: 3px;
          border-radius: 99px;
          transition: all 0.2s ease-in-out;
        }
        .anim-wave-1 { animation: soundwave-pulse 0.9s infinite ease-in-out alternate; }
        .anim-wave-2 { animation: soundwave-pulse 1.2s infinite ease-in-out alternate; }
        .anim-wave-3 { animation: soundwave-pulse 0.7s infinite ease-in-out alternate; }
        .anim-wave-4 { animation: soundwave-pulse 1.4s infinite ease-in-out alternate; }
        .anim-wave-5 { animation: soundwave-pulse 1.0s infinite ease-in-out alternate; }
      `}</style>

      {/* Ambient background glows tailored to the active playing track */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[130px] pointer-events-none -translate-x-1/2 transition-colors duration-1000" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[130px] pointer-events-none translate-x-1/2 transition-colors duration-1000" />

      {/* Header title segment */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Radio className="w-6 h-6 text-brand-primary animate-pulse" />
          <span className="text-brand-accent font-bold tracking-widest uppercase text-xs md:text-sm">Exclusive Showcase</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4"
        >
          Tonality <span className="text-gradient">Originals</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-brand-muted text-sm md:text-base max-w-xl mx-auto"
        >
          Stream our latest premium releases and audio arrangements on our high-fidelity, customized native audio player.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Side Column: Interactive custom Tracklist layout */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-brand-primary" /> Tracklist ({mergedTracklist.length})
            </h2>
            <div className="text-xs text-brand-muted uppercase font-bold tracking-widest flex items-center gap-1">
              <Clock className="w-4 h-4" /> Duration
            </div>
          </div>

          <div className="space-y-4">
            {mergedTracklist.map((track, idx) => {
              const isSelected = idx === currentTrackIndex;
              return (
                <div 
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? "bg-brand-surface border-brand-primary/30 shadow-[0_0_20px_rgba(0,255,255,0.08)]" 
                      : "bg-brand-surface/40 hover:bg-brand-surface/75 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    
                    {/* Index Number or Active Playing Soundwave animation */}
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      {isSelected && isPlaying ? (
                        <div className="flex items-end gap-1 h-6">
                          <span className="wave-bar bg-brand-primary anim-wave-1 h-3" />
                          <span className="wave-bar bg-brand-primary anim-wave-2 h-4" />
                          <span className="wave-bar bg-brand-primary anim-wave-3 h-5" />
                          <span className="wave-bar bg-brand-primary anim-wave-4 h-2" />
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-brand-muted group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Track Cover Art */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                      <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-xs flex items-center justify-center">
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-white fill-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Track Title and Artist Details */}
                    <div className="min-w-0">
                      <h3 className={`font-bold text-sm tracking-wide uppercase transition-colors truncate ${isSelected ? "text-brand-primary" : "text-white group-hover:text-brand-primary"}`}>
                        {track.title}
                      </h3>
                      <p className="text-xs text-brand-muted truncate mt-0.5">{track.artist}</p>
                    </div>

                  </div>

                  {/* Right side: Duration Text and Heart */}
                  <div className="flex items-center gap-4 shrink-0 pl-4">
                    <button 
                      onClick={(e) => toggleFavorite(e, track)} 
                      className={`hover:scale-110 transition-transform ${favorites.includes(track.youtubeId || track.id) ? "text-red-500" : "text-white/20 hover:text-white"}`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(track.youtubeId || track.id) ? "fill-red-500" : ""}`} />
                    </button>
                    <span className="text-xs text-brand-muted font-bold tracking-widest">{track.durationText}</span>
                  </div>

                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side Column: Now Playing Showcase Card (Dynamic Vinyl Disc + Visualizer spectrogram) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5"
        >
          <NowPlayingShowcase isPlaying={isPlaying} currentTrack={currentTrack} />
        </motion.div>

      </div>

      {/* NEW ALBUMS SECTION */}
      <div className="mt-32 pt-16 border-t border-white/5 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight flex items-center gap-4 mb-2">
              <Grid className="w-8 h-8 text-brand-primary" /> 
              Discography
            </h2>
            <p className="text-brand-muted">Explore our full albums, EPs, and curated collections.</p>
          </div>
          
          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-brand-surface border border-white/10 rounded-full px-4 py-2">
              <Filter className="w-4 h-4 text-brand-muted" />
              <select 
                value={activeGenre}
                onChange={(e) => setActiveGenre(e.target.value)}
                className="bg-transparent text-sm text-white font-bold uppercase tracking-wider outline-none cursor-pointer"
              >
                {genres.map(g => <option key={g} value={g} className="bg-brand-surface">{g}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-brand-surface border border-white/10 rounded-full px-4 py-2">
              <ArrowUpDown className="w-4 h-4 text-brand-muted" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-sm text-white font-bold uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="newest" className="bg-brand-surface">Newest First</option>
                <option value="oldest" className="bg-brand-surface">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAndSortedAlbums.map((album) => (
            <motion.div 
              key={album.id}
              whileHover={{ y: -10 }}
              onClick={() => { setSelectedAlbum(album); setActiveTab("tracks"); }}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-brand-primary/40 transition-all duration-300 cursor-pointer group"
            >
              <div className="relative aspect-square overflow-hidden border-b border-white/5">
                <img src={album.cover} alt={album.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-full bg-brand-primary/80 flex items-center justify-center text-black transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 ml-1 fill-black" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent px-2 py-1 bg-brand-accent/10 rounded-full border border-brand-accent/20">
                    {album.genre}
                  </span>
                  <span className="text-xs font-bold text-brand-muted">{new Date(album.releaseDate).getFullYear()}</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight truncate group-hover:text-brand-primary transition-colors">{album.title}</h3>
                <p className="text-sm text-brand-muted truncate mt-1">{album.artist}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Album Detail Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedAlbum(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-5xl max-h-[90vh] bg-brand-surface rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Cover & Actions */}
              <div className="w-full md:w-2/5 p-8 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 flex flex-col items-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative group">
                  <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSelectTrack(selectedAlbum.tracks[0].trackIndex); }}
                      className="w-20 h-20 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Play className="w-10 h-10 ml-1 fill-black" />
                    </button>
                  </div>
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-2">{selectedAlbum.title}</h2>
                <p className="text-brand-muted text-center mb-6">{selectedAlbum.artist}</p>
                
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => handleSelectTrack(selectedAlbum.tracks[0].trackIndex)}
                    className="flex-1 py-3 rounded-full bg-brand-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" /> Play Album
                  </button>
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-brand-muted hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Details & Tabs */}
              <div className="w-full md:w-3/5 flex flex-col h-[50vh] md:h-auto">
                <div className="flex border-b border-white/5 p-4 gap-2">
                  <button onClick={() => setActiveTab("tracks")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "tracks" ? "bg-white/10 text-white" : "text-brand-muted hover:bg-white/5"}`}><ListMusic className="w-4 h-4"/> Tracklist</button>
                  <button onClick={() => setActiveTab("credits")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "credits" ? "bg-white/10 text-white" : "text-brand-muted hover:bg-white/5"}`}><Users className="w-4 h-4"/> Credits</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {activeTab === "tracks" && (
                    <div className="space-y-2">
                      {selectedAlbum.tracks.map((track: any, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => handleSelectTrack(track.trackIndex)}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-brand-muted font-bold text-sm w-4">{idx + 1}</span>
                            <Play className="w-4 h-4 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                            <span className="font-bold text-sm uppercase tracking-wider group-hover:text-brand-primary transition-colors ml-6 group-hover:ml-8">{track.title}</span>
                          </div>
                          <span className="text-xs font-bold text-brand-muted">{track.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "credits" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">Album Info</h4>
                        <p className="text-sm text-brand-muted leading-relaxed">{selectedAlbum.description}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">Production Credits</h4>
                        <p className="text-sm text-brand-muted leading-relaxed">{selectedAlbum.credits}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">Release Date</h4>
                        <p className="text-sm text-brand-muted leading-relaxed">{new Date(selectedAlbum.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Sticky Premium Audio Player Controller Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-15px_50px_rgba(0,0,0,0.85)] flex flex-col">
        
        {/* Timeline Seek-bar: Full-width compact progress bar on top */}
        <div className="relative w-full h-1 bg-white/5 cursor-pointer group">
          <input 
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute -top-1 left-0 w-full h-3 appearance-none bg-transparent outline-none cursor-pointer accent-brand-primary"
            style={{
              background: `linear-gradient(to right, #00ffff 0%, #00ffff ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.08) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.03) 100%)`
            }}
          />
        </div>

        {/* Responsive Content Container: Single horizontal row on mobile! */}
        <div className="py-3 px-4 md:py-5 md:px-12 flex items-center justify-between gap-4">
          
          {/* Left panel: Selected Track details */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial md:w-1/3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs md:text-sm tracking-wide uppercase text-white truncate">{currentTrack.title}</h4>
              <p className="text-[10px] md:text-xs text-brand-muted truncate mt-0.5">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Center panel: Navigation Controls (Desktop version - Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 justify-center">
            
            {/* Loop Toggle */}
            <button 
              onClick={toggleLoop}
              className={`p-2 rounded-full transition-colors ${
                isLooping 
                  ? "text-brand-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]" 
                  : "text-brand-muted hover:text-white"
              }`}
              title="Loop track"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Back track skip */}
            <button 
              onClick={handlePrevTrack}
              className="p-2 text-brand-muted hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Center Master Play Toggle */}
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-brand-primary hover:bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              )}
            </button>

            {/* Forward track skip */}
            <button 
              onClick={handleNextTrack}
              className="p-2 text-brand-muted hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Shuffle Toggle */}
            <button 
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffle 
                  ? "text-brand-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]" 
                  : "text-brand-muted hover:text-white"
              }`}
              title="Shuffle tracklist"
            >
              <Shuffle className="w-4 h-4" />
            </button>

          </div>

          {/* Mobile Navigation Controls (Compact - Hidden on Desktop) */}
          <div className="flex md:hidden items-center gap-2.5 shrink-0">
            <button 
              onClick={handlePrevTrack} 
              className="p-2 text-brand-muted hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-4.5 h-4.5" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-brand-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4.5 h-4.5 text-black fill-black" />
              ) : (
                <Play className="w-4.5 h-4.5 text-black fill-black ml-0.5" />
              )}
            </button>

            <button 
              onClick={handleNextTrack} 
              className="p-2 text-brand-muted hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Right panel: Audio Output Volume levels controls (Desktop only - Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-3 w-1/3 justify-end shrink-0">
            <button 
              onClick={toggleMute}
              className="text-brand-muted hover:text-white transition-colors p-2"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input 
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 appearance-none bg-white/10 outline-none cursor-pointer accent-brand-primary"
              style={{
                background: `linear-gradient(to right, #00ffff 0%, #00ffff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

        </div>

      </div>

      {/* Hidden YouTube Player Target Div */}
      <div id="hidden-youtube-player" style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none", overflow: "hidden", left: "-9999px" }} />

    </div>
  );
}

// Memoized Showcase panel to prevent re-renders from persistent timeline currentTime updates
const NowPlayingShowcase = memo(({ isPlaying, currentTrack }: { isPlaying: boolean; currentTrack: any }) => {
  return (
    <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
      
      {/* Ambient inner glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl" />

      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-8 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> Now Playing Showcase
      </h2>

      {/* Dynamic Cover Art & Spin Disc Combo Layout */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8 mt-4 group">
        
        {/* Spinning Vinyl Record Disc (slides out and rotates on active playback) */}
        <motion.div
          animate={{ 
            x: isPlaying ? 140 : 0 // Slides out fully to X: 140 to completely reveal the gorgeous custom spinning cover label!
          }}
          transition={{ 
            x: { type: "spring", stiffness: 90, damping: 18 } // Slightly smoother spring response
          }}
          className="absolute w-56 h-56 z-0 select-none pointer-events-none"
        >
          <motion.div 
            animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={
              isPlaying 
                ? { rotate: { repeat: Infinity, duration: 12, ease: "linear" } } 
                : { duration: 0.5 }
            }
            className="w-full h-full rounded-full bg-neutral-950 border-4 border-black shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            {/* Real 3D Vinyl grooved rings detail */}
            <div className="absolute inset-1.5 rounded-full border border-white/5 opacity-40" />
            <div className="absolute inset-4 rounded-full border border-white/5 opacity-40" />
            <div className="absolute inset-8 rounded-full border border-white/5 opacity-30" />
            <div className="absolute inset-12 rounded-full border border-white/5 opacity-30" />
            <div className="absolute inset-16 rounded-full border border-white/5 opacity-20" />
            <div className="absolute inset-20 rounded-full border border-white/5 opacity-20" />

            {/* Hyper-realistic dynamic conic reflection sheen that rotates with the vinyl */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.08)_50deg,transparent_100deg,transparent_180deg,rgba(255,255,255,0.08)_230deg,transparent_280deg,transparent_360deg)] mix-blend-overlay opacity-90" />

            {/* Large central record label cover containing the song's cover image */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-black/80 relative z-10 shadow-lg shrink-0">
              <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover scale-110" />
              {/* Subtle vinyl label ring overlay */}
              <div className="absolute inset-0 bg-black/10" />
              {/* Spindle hole rim detail */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#111] border border-neutral-800 -translate-x-1/2 -translate-y-1/2 z-20 shadow-inner" />
            </div>

            {/* Micro asymmetric white dot reflection to visually track rotation perfectly */}
            <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-white/30 rounded-full blur-[0.5px]" />
          </motion.div>
        </motion.div>

        {/* Cover Art Wrapper card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative z-10 w-56 h-56 rounded-2xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.8)] border border-white/10 bg-brand-surface shrink-0"
        >
          <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

      </div>

      {/* Track Info Display */}
      <div className="text-center w-full px-4 mb-8">
        <h3 className="text-xl font-bold uppercase tracking-wider text-white truncate max-w-full">
          {currentTrack.title}
        </h3>
        <p className="text-sm text-brand-muted truncate mt-1">
          {currentTrack.artist}
        </p>
      </div>

      {/* Spectrogram / Simulated Spectrogram visualizer bars */}
      <div className="flex justify-center items-end gap-1.5 h-16 w-full px-8 relative overflow-hidden bg-brand-surface/30 border border-white/5 py-3 rounded-2xl shadow-inner">
        {Array.from({ length: 18 }).map((_, barIdx) => {
          // Generates random base animations speed
          const randomAnim = `anim-wave-${(barIdx % 5) + 1}`;
          return (
            <div
              key={barIdx}
              className={`wave-bar bg-gradient-to-t from-brand-primary to-brand-accent ${
                isPlaying ? randomAnim : "h-1.5"
              }`}
              style={{ 
                width: "4px",
                opacity: isPlaying ? 0.95 : 0.4
              }}
            />
          );
        })}
      </div>

    </div>
  );
});
NowPlayingShowcase.displayName = "NowPlayingShowcase";
