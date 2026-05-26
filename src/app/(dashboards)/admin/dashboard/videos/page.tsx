"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, Pencil, Trash2, X, Save, Loader2,
  Video, Play, MoveUp, MoveDown
} from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtube_id: string;
  duration: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

const emptyForm = {
  title: "",
  category: "EssKay Tonality",
  youtube_id: "",
  duration: "",
  thumbnail_url: "",
  is_featured: false,
  is_published: true,
  display_order: 0,
};

const categories = ["EssKay Tonality", "Originals Songs Videos", "Covers Songs Videos", "Group Songs Videos", "Poetries", "Music", "Live Sessions", "Interviews", "Behind the Scenes"];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setError(null); setShowModal(true); };
  const openEdit = (v: VideoItem) => { setEditing(v); setForm({ title: v.title, category: v.category, youtube_id: v.youtube_id, duration: v.duration || "", thumbnail_url: v.thumbnail_url || "", is_featured: v.is_featured, is_published: v.is_published, display_order: v.display_order }); setError(null); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.youtube_id.trim()) { setError("YouTube ID is required."); return; }
    setSaving(true); setError(null);
    try {
      const payload = { ...form, thumbnail_url: form.thumbnail_url || null, duration: form.duration || null };
      if (editing) {
        await supabase.from("videos").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("videos").insert(payload);
      }
      setShowModal(false);
      await fetchVideos();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("videos").delete().eq("id", id);
    setDeleteConfirm(null);
    await fetchVideos();
  };

  const getThumbnail = (v: VideoItem) => v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`;

  return (
    <div className="space-y-8">
      <PageMeta title="Manage Videos" description="Manage YouTube video showcase." noIndex />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">Video <span className="text-gradient">Showcase</span></h1>
          <p className="text-brand-muted-dark text-sm">Manage the video gallery on your website.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors">
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}<button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" /></div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark">
          <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm mt-1">Add your first video to the showcase.</p>
          <button onClick={openCreate} className="mt-6 px-6 py-3 rounded-lg bg-brand-primary text-black font-medium hover:bg-brand-accent transition-colors">Add Video</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-brand-card rounded-xl border border-brand-border overflow-hidden group">
              <div className="relative aspect-video bg-cover bg-center" style={{ backgroundImage: `url('${getThumbnail(v)}')` }}>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white/80" />
                </div>
                {v.is_featured && <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">Featured</span>}
                {!v.is_published && <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">Hidden</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm truncate mb-1">{v.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-muted-dark">{v.category}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(v)} className="p-1.5 hover:bg-brand-bg rounded-lg"><Pencil className="w-3.5 h-3.5 text-brand-muted" /></button>
                    {deleteConfirm === v.id ? (
                      <>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 bg-red-500/20 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                        <button onClick={() => setDeleteConfirm(null)} className="p-1.5 hover:bg-brand-bg rounded-lg"><X className="w-3.5 h-3.5 text-brand-muted" /></button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirm(v.id)} className="p-1.5 hover:bg-brand-bg rounded-lg"><Trash2 className="w-3.5 h-3.5 text-brand-muted-dark hover:text-red-500" /></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => !saving && setShowModal(false)}>
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-brand-card z-10 flex items-center justify-between p-6 border-b border-brand-border">
              <h2 className="text-xl font-bold">{editing ? "Edit Video" : "Add Video"}</h2>
              <button onClick={() => setShowModal(false)} disabled={saving} className="p-2 hover:bg-brand-bg rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">YouTube Video ID</label>
                  <input type="text" value={form.youtube_id} onChange={(e) => setForm(p => ({ ...p, youtube_id: e.target.value }))} placeholder="dQw4w9WgXcQ" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Duration</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="4:32" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Thumbnail URL (optional)</label>
                <input type="text" value={form.thumbnail_url} onChange={(e) => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${form.is_published ? "bg-green-500" : "bg-white/20"}`} onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_published ? "translate-x-6" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium">{form.is_published ? "Published" : "Hidden"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${form.is_featured ? "bg-amber-500" : "bg-white/20"}`} onClick={() => setForm(p => ({ ...p, is_featured: !p.is_featured }))}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_featured ? "translate-x-6" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium">{form.is_featured ? "Featured" : "Standard"}</span>
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-brand-card border-t border-brand-border p-6 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {editing ? "Update" : "Add"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
