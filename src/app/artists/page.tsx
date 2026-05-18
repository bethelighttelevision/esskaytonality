"use client";

import { motion } from "framer-motion";
import { Search, Filter, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const artists = [
    { id: "the-weeknd", name: "THE WEEKND", genre: "R&B / POP", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop", listeners: "105M" },
    { id: "travis-scott", name: "TRAVIS SCOTT", genre: "HIP HOP", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop", listeners: "75M" },
    { id: "dua-lipa", name: "DUA LIPA", genre: "POP", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", listeners: "82M" },
    { id: "kendrick-lamar", name: "KENDRICK LAMAR", genre: "HIP HOP", image: "https://images.unsplash.com/photo-1520443240718-fce21901db79?q=80&w=2070&auto=format&fit=crop", listeners: "60M" },
    { id: "billie-eilish", name: "BILLIE EILISH", genre: "ALTERNATIVE", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop", listeners: "70M" },
    { id: "post-malone", name: "POST MALONE", genre: "POP / HIP HOP", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop", listeners: "85M" },
  ];

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
                  style={{ backgroundImage: `url('${artist.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Hover Play Button with Sound Wave Animations */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Sound Wave Ripple Effect */}
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
      
      {filteredArtists.length === 0 && (
        <div className="text-center py-24 text-brand-muted">
          <p className="text-xl">No artists found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
