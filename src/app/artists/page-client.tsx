"use client";

import { motion } from "framer-motion";
import { Search, Filter, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Artist } from "@/lib/types";

const defaultArtists: Artist[] = [
  {
    id: "sahir-alam",
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
  const [artists, setArtists] = useState<Artist[]>([]);
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
        const fixed = data.value.map((a: Artist) =>
          a.id === "sahir-alam" ? { ...a, profile: "/sahir-alam.webp" } : a
        );
        setArtists(fixed);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-3">
            Our <span className="text-gradient">Rockstars</span>
          </h1>
          <p className="text-brand-muted-dark text-lg max-w-xl">
            Discover the groundbreaking artists shaping the future of global music culture.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted-dark" />
            <label htmlFor="artist-search" className="sr-only">Search artists or genres</label>
            <input
              id="artist-search"
              type="text"
              placeholder="Search artists or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-full py-2.5 pl-11 pr-5 text-sm text-white placeholder:text-brand-muted-dark focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          <button className="bg-brand-surface border border-brand-border rounded-full p-2.5 hover:bg-brand-card transition-colors">
            <Filter className="w-4 h-4 text-brand-muted-dark" />
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
              <p className="text-brand-muted-dark text-sm">Loading artists...</p>
            </div>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-brand-muted-dark text-lg">No artists found matching your search.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredArtists.map((artist) => (
              <motion.div key={artist.id} variants={cardVariants}>
                <Link href={`/artists/${artist.id}`}>
                  <div className="group relative aspect-square rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${artist.profile}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-brand-muted-dark mb-1.5 bg-black/40 px-2 py-0.5 rounded">
                        {artist.genre}
                      </span>
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider leading-tight">
                        {artist.name}
                      </h2>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-brand-muted-dark text-xs font-medium">
                          {artist.listeners} monthly listeners
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
