"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

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
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop",
    title: "Poem",
    youtubeId: "Md0x5Yp5QhM"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop",
    title: "Apni Duniya",
    youtubeId: "IyUsygCb8sU"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    title: "Amn (Peace)",
    youtubeId: "jb3UqLcIDEQ"
  }
];

import { createClient } from "@/utils/supabase/client";
import type { Slide } from "@/lib/types";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeVideo, setActiveVideo] = useState<Pick<Slide, "title" | "youtubeId"> | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase.from("settings").select("*").eq("key", "hero_carousel").single();
      if (data && data.value && data.value.length > 1) {
        setSlides(data.value);
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

  const current = slides[currentIndex] || slides[0] || defaultSlides[0];

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden bg-brand-bg">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction > 0 ? 400 : -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction < 0 ? 400 : -400, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${current.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => setActiveVideo({ title: current.title, youtubeId: current.youtubeId })}
          className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-brand-primary/80 hover:border-brand-primary transition-all duration-300 group"
        >
          <Play className="w-7 h-7 md:w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-10">
        <button onClick={prevSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all" aria-label="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all" aria-label="Next">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex 
                  ? "w-8 h-1.5 bg-brand-primary" 
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                onClick={() => setActiveVideo(null)}
              >
                <X className="w-4 h-4" />
              </button>
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
