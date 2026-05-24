"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, Pencil, Trash2, X, Save, Loader2, ArrowLeft,
  Tags, Upload, Image as ImageIcon, Palette, Globe, Hash
} from "lucide-react";
import Link from "next/link";
import PageMeta from "@/components/seo/PageMeta";
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
  website_url: string | null;
  genre: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  genre: "",
  color: "#ffffff",
  founded_year: "" as string | number,
  website_url: "",
  cover_image_url: "",
  display_order: 0,
  is_active: true,
};

const defaultColors = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#845ef7",
  "#ff922b", "#20c997", "#e64980", "#7950f2", "#228be6",
];

export default function AdminLabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Label | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLabels = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("labels")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });
    if (data) setLabels(data);
    setLoading(false);
  };

  useEffect(() => { fetchLabels(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setLogoFile(null);
    setLogoPreview(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (label: Label) => {
    setEditing(label);
    setForm({
      name: label.name,
      slug: label.slug,
      tagline: label.tagline || "",
      description: label.description || "",
      genre: label.genre || "",
      color: label.color || "#ffffff",
      founded_year: label.founded_year || "",
      website_url: label.website_url || "",
      cover_image_url: label.cover_image_url || "",
      display_order: label.display_order,
      is_active: label.is_active,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setError(null);
    setShowModal(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      name: val,
      slug: editing ? prev.slug : generateSlug(val),
    }));
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return editing?.logo_url || null;
    const ext = logoFile.name.split(".").pop() || "png";
    const fileName = `logo-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("label-logos")
      .upload(fileName, logoFile);
    if (uploadErr) throw new Error("Failed to upload logo: " + uploadErr.message);
    const { data: { publicUrl } } = supabase.storage
      .from("label-logos")
      .getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Label name is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }
    setSaving(true);
    setError(null);
    try {
      let logoUrl = editing?.logo_url || null;
      if (logoFile) logoUrl = await uploadLogo();

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        tagline: form.tagline.trim() || null,
        description: form.description.trim() || null,
        genre: form.genre.trim() || null,
        color: form.color || null,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
        website_url: form.website_url.trim() || null,
        cover_image_url: form.cover_image_url.trim() || null,
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
        ...(logoUrl ? { logo_url: logoUrl } : {}),
      };

      if (editing) {
        const { error: updateErr } = await supabase
          .from("labels")
          .update(payload)
          .eq("id", editing.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("labels")
          .insert(payload);
        if (insertErr) throw insertErr;
      }

      setShowModal(false);
      await fetchLabels();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("labels").delete().eq("id", id);
    if (error) {
      setError("Failed to delete: " + error.message);
      return;
    }
    setDeleteConfirm(null);
    await fetchLabels();
  };

  return (
    <div className="space-y-8">
      <PageMeta title="Manage Labels" description="Create and manage record labels and divisions." noIndex />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
            Labels & <span className="text-gradient">Divisions</span>
          </h1>
          <p className="text-brand-muted-dark text-sm">Create and manage your record labels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors">
            <Plus className="w-4 h-4" /> Add Label
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}
          <button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" />
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark">
          <Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No labels yet</p>
          <p className="text-sm mt-1">Create your first label to get started.</p>
          <button onClick={openCreate} className="mt-6 px-6 py-3 rounded-lg bg-brand-primary text-black font-medium hover:bg-brand-accent transition-colors">
            Create Label
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {labels.map((label) => (
            <div key={label.id} className="bg-brand-card rounded-xl border border-brand-border overflow-hidden">
              <div className="p-5 flex items-center gap-5">
                <LabelLogo src={label.logo_url} name={label.name} color={label.color || "#fff"} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-bold text-white truncate">{label.name}</h2>
                    {!label.is_active && (
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">Inactive</span>
                    )}
                    <span className="text-xs text-brand-muted-dark font-mono">/labels#{label.slug}</span>
                  </div>
                  {label.tagline && <p className="text-sm text-brand-muted-dark truncate">{label.tagline}</p>}
                  {label.genre && (
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5"
                      style={{ backgroundColor: `${label.color || "#fff"}15`, color: label.color || "#fff" }}
                    >
                      {label.genre}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(label)} className="p-2 hover:bg-brand-bg rounded-lg transition-colors" title="Edit">
                    <Pencil className="w-4 h-4 text-brand-muted" />
                  </button>
                  {deleteConfirm === label.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(label.id)} className="p-2 bg-red-500/20 rounded-lg transition-colors" title="Confirm delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="p-2 hover:bg-brand-bg rounded-lg transition-colors" title="Cancel">
                        <X className="w-4 h-4 text-brand-muted" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(label.id)} className="p-2 hover:bg-brand-bg rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-brand-muted-dark hover:text-red-500 transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => !saving && setShowModal(false)}>
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-brand-card z-10 flex items-center justify-between p-6 border-b border-brand-border">
              <h2 className="text-xl font-bold">{editing ? "Edit Label" : "Create Label"}</h2>
              <button onClick={() => setShowModal(false)} disabled={saving} className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-3">Label Logo</label>
                <div className="flex items-center gap-6">
                  <LabelLogo
                    src={logoPreview || editing?.logo_url}
                    name={form.name || "Preview"}
                    color={form.color || "#fff"}
                    size="lg"
                  />
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-bg border border-brand-border hover:border-brand-primary/50 transition-colors text-sm text-brand-muted hover:text-white">
                    <Upload className="w-4 h-4" />
                    {logoFile ? logoFile.name : "Upload Logo"}
                    <input type="file" accept="image/png,image/webp,image/svg+xml" onChange={handleLogoChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name + Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Label Name</label>
                  <input type="text" required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Esskay Originals" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Slug</label>
                  <input type="text" required value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="e.g. esskay-originals" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-sm" />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Tagline</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))} placeholder="e.g. Cinematic & Original Compositions" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Describe this label's sound and identity..." className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all resize-none" />
              </div>

              {/* Genre + Founded Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Genre</label>
                  <input type="text" value={form.genre} onChange={(e) => setForm(prev => ({ ...prev, genre: e.target.value }))} placeholder="e.g. Cinematic / Indie Pop" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Founded Year</label>
                  <input type="number" value={form.founded_year} onChange={(e) => setForm(prev => ({ ...prev, founded_year: e.target.value }))} placeholder="e.g. 2024" className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all" />
                </div>
              </div>

              {/* Brand Color */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-3">Brand Color</label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg border border-brand-border" style={{ backgroundColor: form.color || "#ffffff" }} />
                  <input type="text" value={form.color} onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))} placeholder="#ffffff" className="w-32 bg-brand-bg border border-brand-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all font-mono text-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map(c => (
                    <button key={c} onClick={() => setForm(prev => ({ ...prev, color: c }))} className="w-8 h-8 rounded-lg border border-brand-border hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Website URL</label>
                <input type="url" value={form.website_url} onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))} placeholder="https://..." className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all" />
              </div>

              {/* Display Order + Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => { const v = Number(e.target.value); setForm(prev => ({ ...prev, display_order: v })); }} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all" />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-green-500" : "bg-white/20"}`} onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_active ? "translate-x-6" : "translate-x-0.5"}`} />
                    </div>
                    <span className="text-sm font-medium">{form.is_active ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-brand-card border-t border-brand-border p-6 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {editing ? "Update" : "Create"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
