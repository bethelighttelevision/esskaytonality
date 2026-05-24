"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Video, Newspaper, Mic2, Star, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export default function NewsMediaPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const categories = [
    { name: "All", icon: Newspaper },
    { name: "Announcements", icon: Mic2 },
    { name: "Launches", icon: Star },
    { name: "Events", icon: Calendar },
    { name: "Behind the Scenes", icon: Video },
    { name: "Press Releases", icon: ImageIcon },
  ];

  const newsItems = [
    {
      id: 1,
      title: "THE WEEKND ANNOUNCES GLOBAL STADIUM TOUR 2026",
      category: "Artist Announcements",
      date: "May 15, 2026",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
      excerpt: "The multi-platinum artist is set to embark on his biggest global tour yet, hitting 40 cities across 5 continents.",
      featured: true,
    },
    {
      id: 2,
      title: "New Single 'Midnight City' Breaks Streaming Records",
      category: "Music Launches",
      date: "May 12, 2026",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
      excerpt: "The highly anticipated release has surpassed 50 million streams within its first 24 hours.",
      featured: false,
    },
    {
      id: 3,
      title: "Behind the Sound: Making of 'Neon Lights'",
      category: "Behind-the-scenes",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1598387181032-a3103ea8a026?q=80&w=2069&auto=format&fit=crop",
      excerpt: "An exclusive look into the studio sessions that brought the chart-topping album to life.",
      featured: false,
    },
    {
      id: 4,
      title: "Esskaytonality Partners with Global Music Initiative",
      category: "Press Releases",
      date: "May 05, 2026",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
      excerpt: "A new strategic partnership aimed at discovering and nurturing independent talent worldwide.",
      featured: false,
    },
    {
      id: 5,
      title: "Summer Solstice Music Festival Lineup Revealed",
      category: "Events",
      date: "May 01, 2026",
      image: "https://images.unsplash.com/photo-1470229722913-7c090be5c5b4?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Get ready for the biggest summer event featuring headlining performances from our top roster artists.",
      featured: false,
    },
    {
      id: 6,
      title: "Introducing the 'Originals' Division",
      category: "Announcements",
      date: "April 28, 2026",
      image: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Esskaytonality launches a new label division focused exclusively on genre-bending electronic music.",
      featured: false,
    }
  ];

  return (
    <div className="w-full pt-24 pb-12 min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "ESSKAYTONALITY News & Media",
        "description": "Latest news, updates, and announcements from ESSKAYTONALITY and its artists.",
        "url": "https://esskaytonality.com/news"
      }} />
      {/* Header */}
      <section className="container mx-auto px-6 md:px-12 mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4 md:mb-6">
            News & <span className="text-gradient">Media</span>
          </h1>
           <p className="text-base md:text-xl text-brand-muted-dark leading-relaxed">
            The latest updates, artist announcements, event coverage, and exclusive behind-the-scenes content from Esskaytonality.
          </p>
        </motion.div>
      </section>

      {/* Category Filter: Premium swipeable horizontal scroller on mobile! */}
      <section className="container mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-row overflow-x-auto no-scrollbar whitespace-nowrap gap-3 pb-3 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <button
                key={idx}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 shrink-0 ${
                  idx === 0 
                    ? "bg-brand-primary border-brand-primary text-white card-hover" 
                    : "bg-brand-card border border-brand-border text-brand-muted-dark hover:text-white hover:border-brand-accent/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase tracking-wider">{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured News */}
      <section className="container mx-auto px-6 md:px-12 mb-12 md:mb-16">
        {newsItems.filter(item => item.featured).map((news) => (
          <motion.div 
            key={news.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
          >
            <div className="absolute inset-0 bg-brand-surface">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-60 mix-blend-overlay"
                style={{ backgroundImage: `url('${news.image}')` }}
              />
            </div>
            
            <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col justify-end min-h-[50vh] md:min-h-[60vh] bg-gradient-to-t from-brand-bg via-brand-bg/85 to-transparent">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-bg bg-brand-accent rounded-full">
                  {news.category}
                </span>
                    <span className="text-xs sm:text-sm font-medium text-brand-muted-dark flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {news.date}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4 max-w-4xl group-hover:text-brand-accent transition-colors duration-300">
                {news.title}
              </h2>
              
               <p className="text-xs sm:text-sm md:text-lg text-brand-muted-dark max-w-2xl mb-6 md:mb-8 leading-relaxed">
                {news.excerpt}
              </p>
              
              <Link href="#" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-brand-accent transition-colors w-fit">
                Read Full Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      {/* News Grid */}
      <section className="container mx-auto px-6 md:px-12">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {newsItems.filter(item => !item.featured).map((news) => (
            <motion.div 
              key={news.id}
              variants={item}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden group card-hover transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${news.image}')` }}
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/60 text-white border border-white/10 rounded-full">
                    {news.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-xs text-brand-muted-dark mb-3 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {news.date}
                </div>
                
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3 group-hover:text-brand-accent transition-colors">
                  {news.title}
                </h3>
                
                <p className="text-sm text-brand-muted-dark mb-6 flex-grow">
                  {news.excerpt}
                </p>
                
                <Link href="#" className="inline-flex items-center gap-2 text-brand-primary text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors mt-auto">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 flex justify-center">
          <button className="bg-brand-primary rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
            Load More Content
          </button>
        </div>
      </section>
    </div>
  );
}
