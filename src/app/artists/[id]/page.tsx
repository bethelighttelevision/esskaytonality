"use client";

import { motion } from "framer-motion";
import { PlayCircle, Share2, Heart, Disc3 } from "lucide-react";
import { use } from "react";

// Mock Data
const artistData: Record<string, any> = {
  "the-weeknd": {
    name: "THE WEEKND",
    genre: "R&B / POP",
    banner: "https://images.unsplash.com/photo-1540039155732-d68b54f593e9?q=80&w=2069&auto=format&fit=crop",
    profile: "https://images.unsplash.com/photo-1571343753761-0d32c96b7978?q=80&w=2070&auto=format&fit=crop",
    bio: "Abel Tesfaye, known as The Weeknd, is an award-winning artist known for his sonic versatility and dark lyricism.",
    listeners: "105M",
    albums: [
      { title: "Dawn FM", year: "2022", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop" },
      { title: "After Hours", year: "2020", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop" }
    ],
    popular: [
      { title: "Blinding Lights", streams: "3.5B", time: "3:20" },
      { title: "Starboy", streams: "2.8B", time: "3:50" },
      { title: "Save Your Tears", streams: "2.1B", time: "3:35" }
    ]
  }
};

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const artist = artistData[resolvedParams.id] || artistData["the-weeknd"];

  return (
    <div className="w-full min-h-screen pb-24">
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
            
            <div className="flex items-center gap-4 mt-8">
              <button className="flex items-center gap-3 bg-brand-primary hover:bg-brand-accent text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105">
                <PlayCircle className="w-6 h-6" />
                Play Mix
              </button>
              <button className="glass p-4 rounded-full hover:bg-white/10 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="glass p-4 rounded-full hover:bg-white/10 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Popular & Albums */}
        <div className="lg:col-span-2 space-y-16">
          {/* Popular Tracks */}
          <section>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">Popular Tracks</h2>
            <div className="flex flex-col gap-2">
              {artist.popular.map((track: any, idx: number) => (
                <div key={idx} className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-brand-muted font-bold w-6 text-right">{idx + 1}</span>
                    <div className="w-12 h-12 bg-white/10 rounded overflow-hidden relative flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                      <div className="absolute inset-0 bg-cover group-hover:opacity-30 transition-opacity" style={{ backgroundImage: `url('${artist.albums[0].cover}')` }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{track.title}</h4>
                      <p className="text-xs text-brand-muted">{track.streams} Streams</p>
                    </div>
                  </div>
                  <span className="text-sm text-brand-muted">{track.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Discography */}
          <section>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">Discography</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {artist.albums.map((album: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${album.cover}')` }} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-brand-primary" />
                    </div>
                  </div>
                  <h4 className="font-bold text-white truncate">{album.title}</h4>
                  <p className="text-sm text-brand-muted">{album.year} • Album</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - About */}
        <div className="space-y-16">
          <section className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">About</h2>
            <p className="text-brand-muted leading-relaxed text-sm mb-6">
              {artist.bio}
            </p>
            <div className="flex flex-col gap-4 text-sm font-semibold text-white">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-brand-muted">Followers</span>
                <span>24,592,104</span>
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
          </section>
        </div>
      </div>
    </div>
  );
}
