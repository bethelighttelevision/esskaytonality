"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";

// The 8 actual YouTube releases loaded on the platform
// We use ultra-high-resolution, perfectly upscaled crisp visuals for Poem, Apni Duniya, and Amn to keep the banner 100% neat, clean, and free of blur.
const defaultSlides = [
  {
    id: 1,
    image: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg",
    title: "Qaid Qalandar",
    youtubeId: "b-yMQjOqpHQ"
  },
  {
    id: 2,
    image: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg",
    title: "Saiyaara OST",
    youtubeId: "gCsv3X5ofhI"
  },
  {
    id: 3,
    image: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg",
    title: "Tere Bina",
    youtubeId: "QNmwgrqbYGA"
  },
  {
    id: 4,
    image: "https://img.youtube.com/vi/qxPGQLGpCmA/maxresdefault.jpg",
    title: "Vigad Gayi Ae",
    youtubeId: "qxPGQLGpCmA"
  },
  {
    id: 5,
    image: "https://img.youtube.com/vi/Vy7wwoI_Ofo/maxresdefault.jpg",
    title: "Pehchaan",
    youtubeId: "Vy7wwoI_Ofo"
  },
  {
    id: 6,
    // Poem: ultra-sharp, high-resolution aesthetic piano performance image to replace low-res/blurry default thumbnail
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop",
    title: "Poem",
    youtubeId: "Md0x5Yp5QhM"
  },
  {
    id: 7,
    // Apni Duniya: ultra-sharp, upscaled vibrant concert/crowd stage image to replace low-res/blurry default thumbnail
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop",
    title: "Apni Duniya",
    youtubeId: "IyUsygCb8sU"
  },
  {
    id: 8,
    // Amn: ultra-sharp, high-resolution close-up acoustic strings visual to replace low-res/blurry default thumbnail
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    title: "Amn (Peace)",
    youtubeId: "jb3UqLcIDEQ"
  }
];

import { createClient } from "@/utils/supabase/client";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase.from("settings").select("*").eq("key", "hero_carousel").single();
      // If we have custom slides from the database and there are more than 1 (meaning it's not the single dummy Saiyaara slide), use them.
      // Otherwise, fall back to the 8 premium default slides (which have all of your YouTube releases!).
      if (data && data.value && data.value.length > 1) {
        setSlides(data.value);
      } else {
        setSlides(defaultSlides);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (activeVideo) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => {
        if (slides.length === 0) return 0;
        return prev === slides.length - 1 ? 0 : prev + 1;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, activeVideo, slides.length]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-bg group">
      
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* 1. Full Screen Background Image (Crisp, High-Resolution Banner) */}
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-700"
            style={{ backgroundImage: `url('${(slides[currentIndex] || slides[0] || defaultSlides[0])?.image}')` }}
          />

          {/* 2. Deep Cinematic Overlay Gradients for depth and focus */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-95" />

          {/* 3. Central Play Button with Staggered Sound Wave Ripples (No overlaid HTML text to prevent duplicates!) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setActiveVideo({ title: (slides[currentIndex] || slides[0] || defaultSlides[0])?.title, youtubeId: (slides[currentIndex] || slides[0] || defaultSlides[0])?.youtubeId })}
              className="relative group/play flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              {/* Outer expanding soundwaves ripple animations */}
              <div className="absolute w-24 h-24 rounded-full bg-brand-primary/20 border border-brand-primary/30 animate-ripple pointer-events-none group-hover/play:scale-115 transition-transform duration-300" />
              <div className="absolute w-24 h-24 rounded-full bg-brand-primary/20 border border-brand-primary/30 animate-ripple-delay-1 pointer-events-none group-hover/play:scale-115 transition-transform duration-300" />
              <div className="absolute w-24 h-24 rounded-full bg-brand-primary/20 border border-brand-primary/30 animate-ripple-delay-2 pointer-events-none group-hover/play:scale-115 transition-transform duration-300" />

              {/* Central Glowing play core */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,255,255,0.45)] group-hover/play:shadow-[0_0_50px_rgba(255,255,255,0.8)] group-hover/play:bg-brand-primary/10 transition-all duration-300">
                <PlayCircle className="w-10 h-10 text-white group-hover/play:text-brand-primary transition-colors duration-300" />
              </div>
            </motion.div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-20 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center glass text-white/50 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center glass text-white/50 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Dots / Indicators */}
      <div className="absolute bottom-12 inset-x-0 flex justify-center z-20 px-6">
        <div className="flex flex-wrap justify-center gap-2.5 max-w-full glass px-4 py-2 rounded-full border border-white/5 bg-black/20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex 
                  ? "w-8 h-2 bg-brand-primary" 
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Overlay Iframe player popup */}
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
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close popup button */}
              <button 
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                onClick={() => setActiveVideo(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Responsive Iframe embed */}
              <iframe 
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
