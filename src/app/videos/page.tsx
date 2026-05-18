"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, MonitorPlay, Film, X } from "lucide-react";
import { useState } from "react";

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  const categories = ["All", "EssKay Tonality", "Music Videos", "Live Sessions", "Interviews", "Behind the Scenes"];

  const featuredVideo = {
    title: "Qaid Qalandar | Sahir Alam | Oma Aslam | Dixon Wilson",
    category: "Featured Release",
    image: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg",
    duration: "4:32",
    youtubeId: "b-yMQjOqpHQ"
  };

  const videos = [
    { title: "Saiyaara (Extended Cover) Lyrical | Nasir Abbas | Sahir Alam | Faheem Abdullah | Saiyaara OST", category: "EssKay Tonality", image: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg", duration: "5:34", youtubeId: "gCsv3X5ofhI" },
    { title: "Tere Bina | Numan Khan | Sahir Alam | Sumble Noreen | Saher Khan", category: "EssKay Tonality", image: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg", duration: "4:12", youtubeId: "QNmwgrqbYGA" },
    { title: "Vigad Gayi Ae | Reprise Version | Arsalan Arshad | Sahir Alam | Ustad Nusrat Fateh Ali Khan", category: "EssKay Tonality", image: "https://img.youtube.com/vi/qxPGQLGpCmA/maxresdefault.jpg", duration: "3:58", youtubeId: "qxPGQLGpCmA" },
    { title: "Pehchaan | Tribute to #sushantsinghrajput | OfficialVideo | Sahir A | Mandeep K | Minahil D", category: "EssKay Tonality", image: "https://img.youtube.com/vi/Vy7wwoI_Ofo/maxresdefault.jpg", duration: "4:45", youtubeId: "Vy7wwoI_Ofo" },
    { title: "Poem | Mujhe Main Banna Hai | Life of Millions | Sahir Alam", category: "EssKay Tonality", image: "https://img.youtube.com/vi/Md0x5Yp5QhM/hqdefault.jpg", duration: "2:58", youtubeId: "Md0x5Yp5QhM" },
    { title: "Apni Duniya Official Video | Sahir A, Aparajita L, Karthik J, Sushmita D, Mahema J | EsskayTonality", category: "EssKay Tonality", image: "https://img.youtube.com/vi/IyUsygCb8sU/maxresdefault.jpg", duration: "4:20", youtubeId: "IyUsygCb8sU" },
    { title: "Amn (Peace) Song | Tonality | 2018", category: "Live Sessions", image: "https://img.youtube.com/vi/jb3UqLcIDEQ/hqdefault.jpg", duration: "3:15", youtubeId: "jb3UqLcIDEQ" }
  ];

  const filteredVideos = activeCategory === "All" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <div className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Film className="w-8 h-8 text-brand-primary" />
          <span className="text-brand-accent font-bold tracking-widest uppercase">Cinematic Experience</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4"
        >
          Watch & <span className="text-gradient">Immerse</span>
        </motion.h1>
      </div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex overflow-x-auto gap-4 pb-4 mb-12 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
              activeCategory === category 
                ? "bg-brand-primary text-white" 
                : "bg-brand-surface text-brand-muted hover:text-white hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Hero Video (Featured) - Only show on 'All' */}
      {activeCategory === "All" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setActiveVideo({ title: featuredVideo.title, youtubeId: featuredVideo.youtubeId })}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-16 group cursor-pointer border border-white/5 bg-black"
        >
          {/* Background Image / Thumbnail Fallback */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('${featuredVideo.image}')` }}
          />

          {/* Autoplay Muted Background Video */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-80 z-0">
            <iframe
              src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${featuredVideo.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1`}
              className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 aspect-video scale-[1.35] pointer-events-none border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
             <div className="relative w-24 h-24 flex items-center justify-center">
               {/* Pulse Sound Wave Ripples */}
               <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple pointer-events-none" />
               <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple-delay-1 pointer-events-none" />
               
               <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:border-brand-primary transition-colors"
               >
                 <PlayCircle className="w-12 h-12 text-white group-hover:text-brand-accent transition-colors" />
               </motion.div>
             </div>
          </div>

          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex justify-between items-end z-20">
            <div>
              <p className="text-brand-accent font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <MonitorPlay className="w-4 h-4" /> {featuredVideo.category}
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{featuredVideo.title}</h2>
            </div>
            <span className="bg-black/80 backdrop-blur-md px-4 py-2 rounded font-mono text-sm border border-white/10">
              {featuredVideo.duration}
            </span>
          </div>
        </motion.div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => setActiveVideo({ title: video.title, youtubeId: video.youtubeId })}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/5 bg-black">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${video.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="relative w-16 h-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Sound Wave Ripple Effect */}
                  <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-brand-accent/20 border border-brand-accent/30 animate-ripple-delay-1 pointer-events-none" />
                  
                  <div className="relative z-10 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <PlayCircle className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2 py-1 rounded font-mono text-xs border border-white/10">
                {video.duration}
              </span>
            </div>
            <p className="text-brand-accent text-xs font-bold tracking-widest uppercase mb-1">{video.category}</p>
            <h3 className="text-sm md:text-base font-semibold text-white/90 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
              {video.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Professional Overlay Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_0_50px_rgba(138,43,226,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass text-white/70 hover:text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
