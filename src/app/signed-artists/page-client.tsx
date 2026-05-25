"use client";

import { motion } from "framer-motion";
import { Search, Filter, Play, Mic2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const defaultSignedArtists: any[] = [
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
  }
];

export default function SignedArtistsPage() {
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
        .eq("key", "signed_artists_data")
        .single();

      if (data && data.value && data.value.length > 0) {
        setArtists(data.value);
      } else {
        setArtists(defaultSignedArtists);
      }
      setLoading(false);
    };
    loadArtists();
  }, []);

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mic2 className="w-6 h-6 text-brand-primary" />
            <span className="text-brand-accent font-bold tracking-widest uppercase text-xs md:text-sm">Esskaytonality Roster</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-3">
            Signed <span className="text-gradient">Artists</span>
          </h1>
          <p className="text-brand-muted-dark text-lg max-w-xl">
            Meet the official Esskaytonality roster — groundbreaking artists shaping the future of music.
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
            <label htmlFor="signed-artist-search" className="sr-only">Search signed artists</label>
            <input
              id="signed-artist-search"
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
            <div className="w-8 h-8 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-brand-muted-dark text-lg">No signed artists found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((artist, idx) => (
              <motion.div
                key={artist.id || idx}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <Link href={`/signed-artists/${artist.id}`}>
                  <div className="group relative aspect-square rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${artist.profile}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
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
          </div>
        )}
      </div>
    </div>
  );
}
