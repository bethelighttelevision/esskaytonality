"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, Pencil, Trash2, X, Save, Loader2,
  HelpCircle, MessageSquare, MoveUp, MoveDown
} from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

const emptyForm = { category: "General", question: "", answer: "", display_order: 0, is_published: true };
const categories = ["General", "For Artists", "For Labels", "Distribution", "Technical Support", "Business"];

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from("faq_items").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setError(null); setShowModal(true); };
  const openEdit = (item: FAQItem) => { setEditing(item); setForm({ ...item }); setError(null); setShowModal(true); };

  const handleSave = async () => {
    if (!form.question.trim()) { setError("Question is required."); return; }
    if (!form.answer.trim()) { setError("Answer is required."); return; }
    setSaving(true); setError(null);
    try {
      const payload = { ...form };
      if (editing) {
        await supabase.from("faq_items").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("faq_items").insert(payload);
      }
      setShowModal(false);
      await fetchItems();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("faq_items").delete().eq("id", id);
    setDeleteConfirm(null);
    await fetchItems();
  };

  const groupedItems = items.reduce((acc: Record<string, FAQItem[]>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageMeta title="Manage FAQ" description="Manage frequently asked questions." noIndex />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">FAQ <span className="text-gradient">Manager</span></h1>
          <p className="text-brand-muted-dark text-sm">Manage frequently asked questions for all sections.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent transition-colors">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}<button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No FAQ items yet</p>
          <p className="text-sm mt-1">Add your first frequently asked question.</p>
          <button onClick={openCreate} className="mt-6 px-6 py-3 rounded-lg bg-brand-primary text-black font-medium hover:bg-brand-accent transition-colors">Add FAQ</button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark mb-4 border-b border-brand-border pb-2">{category} ({catItems.length})</h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className="bg-brand-card rounded-xl border border-brand-border overflow-hidden">
                    <div
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MessageSquare className="w-4 h-4 shrink-0 text-brand-muted-dark" />
                        <span className="font-medium text-sm truncate">{item.question}</span>
                        {!item.is_published && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 shrink-0">Hidden</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs text-brand-muted-dark">#{item.display_order}</span>
                        <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-brand-bg rounded-lg"><Pencil className="w-3.5 h-3.5 text-brand-muted" /></button>
                        {deleteConfirm === item.id ? (
                          <>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500/20 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-1.5 hover:bg-brand-bg rounded-lg"><X className="w-3.5 h-3.5 text-brand-muted" /></button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 hover:bg-brand-bg rounded-lg"><Trash2 className="w-3.5 h-3.5 text-brand-muted-dark hover:text-red-500" /></button>
                        )}
                      </div>
                    </div>
                    {expandedId === item.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-brand-border mt-0">
                        <div className="p-3 mt-3 bg-brand-bg/50 rounded-lg text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">{item.answer}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => !saving && setShowModal(false)}>
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-brand-card z-10 flex items-center justify-between p-6 border-b border-brand-border">
              <h2 className="text-xl font-bold">{editing ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => setShowModal(false)} disabled={saving} className="p-2 hover:bg-brand-bg rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Category</label>
                  <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm(p => ({ ...p, display_order: Number(e.target.value) }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Question</label>
                <input type="text" value={form.question} onChange={(e) => setForm(p => ({ ...p, question: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Answer</label>
                <textarea rows={6} value={form.answer} onChange={(e) => setForm(p => ({ ...p, answer: e.target.value }))} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${form.is_published ? "bg-green-500" : "bg-white/20"}`} onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.is_published ? "translate-x-6" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-medium">{form.is_published ? "Published" : "Hidden"}</span>
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
