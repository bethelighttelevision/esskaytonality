"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Settings, Save, ArrowLeft, Image as ImageIcon, Loader2, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function PlatformSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Carousel Slide State
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("settings").select("*").eq("key", "hero_carousel").single();
    if (data && data.value && data.value.length > 1) {
      setSlides(data.value);
    } else {
      setSlides(defaultSlides);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error: dbError } = await supabase
        .from("settings")
        .upsert({ key: "hero_carousel", value: slides });

      if (dbError) throw new Error(dbError.message);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: `s_${Date.now()}`, title: "New Release", image: "", youtubeId: "" }]);
  };

  const updateSlide = (id: string, field: string, value: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Link href="/admin/dashboard" className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-white transition-colors mb-8 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Master Control
      </Link>

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Platform <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-brand-muted text-sm">Manage Homepage Hero Banner Slides.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-green-500/10 border border-green-500/50 rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-bold text-green-500">Settings Saved</h3>
            <p className="text-sm text-green-500/80">The homepage banner has been updated instantly.</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="glass p-8 rounded-3xl border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">Homepage Carousel Slides</h2>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setSlides(defaultSlides)} 
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Reset to 8 Default YouTube Releases
            </button>
            <button 
              type="button"
              onClick={addSlide} 
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              + Add New Slide
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl relative group">
              <button 
                onClick={() => removeSlide(slide.id)}
                className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-brand-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2 flex items-center gap-2">
                    <Play className="w-3 h-3 text-red-500" /> YouTube Video ID
                  </label>
                  <input
                    type="text"
                    value={slide.youtubeId}
                    onChange={(e) => updateSlide(slide.id, "youtubeId", e.target.value)}
                    placeholder="e.g. gCsv3X5ofhI"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-red-500/50 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 text-purple-500" /> Background Image URL
                </label>
                <input
                  type="text"
                  value={slide.image}
                  onChange={(e) => updateSlide(slide.id, "image", e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://img.youtube.com/vi/ID/maxresdefault.jpg"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>
          ))}
          
          {slides.length === 0 && (
            <p className="text-center text-brand-muted text-sm py-12">No custom slides. The platform will use the default hardcoded slides.</p>
          )}
        </div>
      </div>
    </div>
  );
}
