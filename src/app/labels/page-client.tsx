"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music, Users, Calendar, Mic, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LabelLogo from "@/components/ui/LabelLogo";

interface Label {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  color: string | null;
  founded_year: number | null;
  genre: string | null;
  display_order: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const coverFallbacks = [
  "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
];

const gradientFallbacks = [
  "from-red-900/60 via-black/50 to-transparent",
  "from-amber-900/60 via-black/50 to-transparent",
  "from-violet-900/60 via-black/50 to-transparent",
];

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLabels = async () => {
      const { data } = await supabase
        .from("labels")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (data) setLabels(data);
      setLoading(false);
    };
    fetchLabels();
  }, []);

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-16 text-center md:text-left"
      >
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
          Labels & <span className="text-gradient">Content Divisions</span>
        </h1>
        <p className="text-brand-muted-dark text-lg max-w-2xl mx-auto md:mx-0">
          Explore the Esskaytonality family of labels.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" />
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-32 text-brand-muted-dark">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No labels yet</p>
          <p className="text-sm mt-1">Labels and divisions will appear here once created.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {labels.map((label, idx) => {
            const coverUrl = label.cover_image_url || coverFallbacks[idx % coverFallbacks.length];
            const gradient = gradientFallbacks[idx % gradientFallbacks.length];
            const genreLabel = label.genre ? label.genre.split("/")[0].trim() : "Music";

            return (
              <motion.div key={label.id} variants={item} id={label.slug}>
                <div className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden card-hover h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${coverUrl}')` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                        {label.name}
                      </h2>
                      {label.tagline && (
                        <p className="text-sm text-white/70 font-medium mt-1">{label.tagline}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-center mb-4">
                      <LabelLogo src={label.logo_url} name={label.name} color={label.color || "#fff"} size="md" />
                    </div>
                    <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-1">
                      {label.description || "No description yet."}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col items-center text-center bg-brand-bg border border-brand-border rounded-lg py-3 px-2">
                        <Users className="w-4 h-4" style={{ color: label.color || "#ff6b6b" }} />
                        <span className="text-white font-bold text-sm">0</span>
                        <span className="text-brand-muted-dark text-[10px] uppercase tracking-wider">Artists</span>
                      </div>
                      <div className="flex flex-col items-center text-center bg-brand-bg border border-brand-border rounded-lg py-3 px-2">
                        <Music className="w-4 h-4 text-brand-accent mb-1" />
                        <span className="text-white font-bold text-xs truncate w-full text-center">{genreLabel}</span>
                        <span className="text-brand-muted-dark text-[10px] uppercase tracking-wider">Genre</span>
                      </div>
                      <div className="flex flex-col items-center text-center bg-brand-bg border border-brand-border rounded-lg py-3 px-2">
                        <Calendar className="w-4 h-4 text-brand-muted mb-1" />
                        <span className="text-white font-bold text-sm">{label.founded_year || "—"}</span>
                        <span className="text-brand-muted-dark text-[10px] uppercase tracking-wider">Est.</span>
                      </div>
                    </div>

                    <Link
                      href={`/artists?label=${label.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-accent transition-colors rounded-lg py-2.5 px-5 text-sm font-bold uppercase tracking-widest w-full"
                    >
                      Explore Label <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-brand-card border border-brand-border rounded-xl p-12 md:p-20 text-center"
      >
        <Mic className="w-12 h-12 text-brand-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          Want to join our <span className="text-gradient">label family</span>?
        </h2>
        <p className="text-brand-muted-dark text-lg max-w-2xl mx-auto mb-8">
          We are always looking for visionary artists and creators. If you have the sound and the drive, we want to hear from you.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-accent transition-colors rounded-lg py-3 px-8 text-sm font-bold uppercase tracking-widest"
        >
          Contact Us <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.section>
    </div>
  );
}
