"use client";

import { motion } from "framer-motion";
import { Search, Filter, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const defaultArtists = [
  {
    id: "sahir-alam",
    name: "SAHIR ALAM",
    genre: "INDIE / POP / CINEMATIC",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop",
    profile: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    bio: "Sahir Alam, performing under the stage name Esskay Tonality, is a multi-talented indie pop and cinematic music composer, producer, and singer-songwriter. Known for his deep atmospheric soundscapes, emotionally charged vocals, and cinematic original releases, Sahir shapes new cultural paradigms through sound.",
    listeners: "2.5M",
    streaming: {
      spotify: "https://open.spotify.com/artist/0o0ENICHltyQ2gR1H82TKtye",
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
  {
    id: "the-weeknd",
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
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "artists_data")
        .single();
      
      if (data && data.value) {
        setArtists(data.value);
      } else {
        setArtists(defaultArtists);
        await supabase
          .from("settings")
          .upsert({ key: "artists_data", value: defaultArtists });
      }
      setLoading(false);
    };
    loadArtists();
  }, []);

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4"
          >
            Our <span className="text-gradient">Rockstars</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-muted text-lg max-w-xl"
          >
            Discover the groundbreaking artists shaping the future of global music culture.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 w-full md:w-auto"
        >
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search artists or genres..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          <button className="bg-brand-surface border border-white/10 rounded-full p-3 hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-brand-muted">
          <p className="text-xl">Loading platform rockstars...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredArtists.map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/artists/${artist.id}`}>
                <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-brand-surface border border-white/5">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${artist.profile}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {/* Hover Play Button with Sound Wave Animations */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple pointer-events-none" />
                      <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple-delay-1 pointer-events-none" />
                      
                      <div className="relative z-10 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <PlayCircle className="w-8 h-8 text-brand-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 w-full z-20">
                    <p className="text-brand-accent text-xs font-bold tracking-widest mb-1">{artist.genre}</p>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">{artist.name}</h3>
                    <div className="flex items-center gap-2 text-brand-muted text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {artist.listeners} Monthly Listeners
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && filteredArtists.length === 0 && (
        <div className="text-center py-24 text-brand-muted">
          <p className="text-xl">No artists found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
