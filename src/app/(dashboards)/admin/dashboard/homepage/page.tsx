"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Save, Loader2, CheckCircle2, GripVertical, Eye, EyeOff,
  Layout, MoveUp, MoveDown, RefreshCw
} from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";
import { motion } from "framer-motion";

interface Section {
  id: string;
  section_key: string;
  label: string;
  is_visible: boolean;
  display_order: number;
  settings: Record<string, any>;
}

const sectionIcons: Record<string, string> = {
  hero: "🎠",
  features: "⭐",
  videos: "🎬",
  news: "📰",
  artists: "🎤",
  labels: "🏷️",
  about: "ℹ️",
  contact: "📬",
};

const sectionDescriptions: Record<string, string> = {
  hero: "Hero carousel — the main banner slideshow at the top of the homepage",
  features: "Featured content section — highlights selected releases or announcements",
  videos: "Video showcase — latest YouTube videos grid",
  news: "News & updates — latest articles and press releases",
  artists: "Artist roster — featured artists grid",
  labels: "Labels & divisions — record labels display",
  about: "About section — company info and mission",
  contact: "Contact & CTA — call-to-action and contact form",
};

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSections = async () => {
    setLoading(true);
    const { data } = await supabase.from("homepage_sections").select("*").order("display_order", { ascending: true });
    if (data) setSections(data);
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, []);

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error: err } = await supabase.from("homepage_sections").update({ is_visible: !current }).eq("id", id);
    if (!err) setSections(prev => prev.map(s => s.id === id ? { ...s, is_visible: !current } : s));
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((s, i) => ({ ...s, display_order: i + 1 }));
    setSections(reordered);

    // Persist order
    for (const s of reordered) {
      await supabase.from("homepage_sections").update({ display_order: s.display_order }).eq("id", s.id);
    }
  };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      for (const s of sections) {
        await supabase.from("homepage_sections").update({ display_order: s.display_order, is_visible: s.is_visible }).eq("id", s.id);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMeta title="Homepage Builder" description="Toggle and reorder homepage sections." noIndex />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
            Homepage <span className="text-gradient">Builder</span>
          </h1>
          <p className="text-brand-muted-dark text-sm">Toggle visibility and reorder sections on your homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm font-bold text-green-500">Homepage layout saved!</p>
        </motion.div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" /></div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark bg-brand-card rounded-xl border border-brand-border">
          <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No sections found</p>
          <p className="text-sm mt-1">Run the database migration to seed homepage sections.</p>
          <button onClick={fetchSections} className="mt-4 px-4 py-2 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              layout
              className={`bg-brand-card rounded-xl border overflow-hidden transition-all ${
                section.is_visible ? "border-brand-border" : "border-red-500/20 opacity-60"
              }`}
            >
              <div className="p-5 flex items-center gap-5">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveItem(index, "up")} disabled={index === 0} className="p-1 hover:bg-brand-bg rounded disabled:opacity-20">
                    <MoveUp className="w-3.5 h-3.5 text-brand-muted-dark" />
                  </button>
                  <button onClick={() => moveItem(index, "down")} disabled={index === sections.length - 1} className="p-1 hover:bg-brand-bg rounded disabled:opacity-20">
                    <MoveDown className="w-3.5 h-3.5 text-brand-muted-dark" />
                  </button>
                </div>

                <div className="w-10 h-10 rounded-lg bg-brand-bg border border-brand-border flex items-center justify-center text-xl">
                  {sectionIcons[section.section_key] || "📄"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white">{section.label}</h3>
                    <span className="text-xs font-mono text-brand-muted-dark">#{section.section_key}</span>
                    {!section.is_visible && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted-dark mt-0.5">{sectionDescriptions[section.section_key] || ""}</p>
                </div>

                <button
                  onClick={() => toggleVisibility(section.id, section.is_visible)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    section.is_visible
                      ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                  }`}
                >
                  {section.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {section.is_visible ? "Visible" : "Hidden"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Layout className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white text-sm mb-1">How it works</h3>
            <ul className="text-xs text-brand-muted-dark space-y-1 list-disc list-inside">
              <li>Use the up/down arrows to reorder sections</li>
              <li>Toggle visibility to show or hide sections from the homepage</li>
              <li>Click "Save Changes" to persist your layout</li>
              <li>Hidden sections won't be visible to visitors but their data is preserved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
