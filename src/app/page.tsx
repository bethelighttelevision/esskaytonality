"use client";

import { motion } from "framer-motion";
import { PlayCircle, ArrowRight, Music, Video, Disc3 } from "lucide-react";
import Link from "next/link";
import HeroCarousel from "@/components/ui/HeroCarousel";
import ArtistCard from "@/components/ui/ArtistCard";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "artists_data")
        .single();
      
      const list = data?.value || [
        { id: "sahir-alam", name: "SAHIR ALAM", genre: "INDIE / POP / CINEMATIC", profile: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" },
        { id: "the-weeknd", name: "THE WEEKND", genre: "R&B / POP", profile: "https://images.unsplash.com/photo-1571343753761-0d32c96b7978?q=80&w=2070&auto=format&fit=crop" }
      ];

      const cards = list.map((a: any) => ({
        id: a.id,
        name: a.name,
        genre: a.genre,
        image: a.profile
      })).slice(0, 4);
      setFeaturedArtists(cards);
    };
    loadFeatured();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Artists */}
      <section className="py-24 container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Featured Rockstars</h2>
            <p className="text-brand-muted">The faces defining modern sound.</p>
          </div>
          <Link href="/artists" className="hidden md:flex items-center gap-2 text-brand-accent hover:text-white transition-colors uppercase text-sm font-bold tracking-wider">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtists.map((artist, idx) => (
            <ArtistCard key={idx} artist={artist} index={idx} />
          ))}
        </div>
      </section>

      {/* Labels / Divisions */}
      <section className="py-24 bg-brand-surface border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Divisions</h2>
            <p className="text-brand-muted max-w-xl mx-auto">Explore our specialized labels catering to unique sounds and cultures.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Originals", "Hip Hop", "Indie"].map((division, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-2xl flex flex-col items-center text-center border-t border-brand-primary/20"
              >
                <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
                  <Disc3 className="w-8 h-8 text-brand-primary animate-spin-slow" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">{division}</h3>
                <p className="text-brand-muted text-sm mb-6">The finest selection of {division.toLowerCase()} tracks from globally recognized artists.</p>
                <button className="text-sm font-bold text-brand-accent hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Videos */}
      <section className="py-24 container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Cinematic Videos</h2>
            <p className="text-brand-muted">Latest music videos and exclusive performances.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Midnight City (Live Session)", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop" },
            { title: "Neon Lights (Official Video)", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" }
          ].map((video, idx) => (
            <motion.div 
              key={idx}
              whileHover="hover"
              className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${video.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Sound Wave Ripple Effect (Always animating but scales/reveals more on hover) */}
                  <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple-delay-1 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple-delay-2 pointer-events-none" />
                  
                  {/* Core Play Button */}
                  <motion.div 
                    variants={{
                      hover: { scale: 1.1 }
                    }}
                    className="relative z-10 w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:border-brand-accent transition-colors"
                  >
                    <PlayCircle className="w-10 h-10 text-white group-hover:text-brand-accent transition-colors" />
                  </motion.div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black to-transparent">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
