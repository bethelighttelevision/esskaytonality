"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, ExternalLink, Music, Film, Globe, Play, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";
import PageMeta from "@/components/seo/PageMeta";

interface Release {
  id: string;
  title: string;
  artist_name: string;
  genre: string;
  cover_image_url: string;
  audio_url: string;
  uploaded_by: string;
  status: string;
  youtube_url: string | null;
  spotify_url: string | null;
  applemusic_url: string | null;
  deezer_url: string | null;
  soundcloud_url: string | null;
  youtube_upload_status: string;
  created_at: string;
}

const platforms = [
  { key: "youtube_url", label: "YouTube", icon: Film, color: "text-red-500" },
  { key: "spotify_url", label: "Spotify", icon: Globe, color: "text-green-500" },
  { key: "applemusic_url", label: "Apple Music", icon: Music, color: "text-pink-500" },
  { key: "deezer_url", label: "Deezer", icon: Music, color: "text-blue-500" },
  { key: "soundcloud_url", label: "SoundCloud", icon: Globe, color: "text-orange-500" },
];

export default function ReviewsPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Release | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  const fetchReleases = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("releases")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReleases(data);
    setLoading(false);
  };

  useEffect(() => { fetchReleases(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await supabase.from("releases").update({ status }).eq("id", id);
    setReleases(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setActionLoading(null);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const updatePlatformUrl = async (id: string, field: string, value: string) => {
    await supabase.from("releases").update({ [field]: value || null }).eq("id", id);
    setReleases(prev => prev.map(r => r.id === id ? { ...r, [field]: value || null } : r));
    setSelected(prev => prev ? { ...prev, [field]: value || null } : null);
  };

  const tab = "all";
  const filtered = releases.filter(r => tab === "all" ? true : r.status === tab);

  return (
    <div className="space-y-8">
      <PageMeta title="Release Reviews" description="Review and approve artist submissions." noIndex />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
            Release <span className="text-gradient">Reviews</span>
          </h1>
          <p className="text-brand-muted-dark text-sm">Review, approve, and distribute artist submissions.</p>
        </div>
        <Link href="/admin/dashboard" className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-brand-card p-4 rounded-xl border border-brand-border">
          <p className="text-brand-muted-dark font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{releases.filter(r => r.status === "pending").length}</p>
        </div>
        <div className="bg-brand-card p-4 rounded-xl border border-brand-border">
          <p className="text-brand-muted-dark font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-500">{releases.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="bg-brand-card p-4 rounded-xl border border-brand-border">
          <p className="text-brand-muted-dark font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{releases.filter(r => r.status === "rejected").length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No releases found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((release) => (
            <motion.div
              key={release.id}
              layout
              className="bg-brand-card rounded-xl border border-brand-border overflow-hidden"
            >
              <div className="p-5 flex items-start gap-5">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-brand-bg">
                  {release.cover_image_url ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${release.cover_image_url}')` }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music className="w-6 h-6 text-brand-muted-dark" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-white truncate">{release.title}</h2>
                  <p className="text-sm text-brand-muted-dark">{release.artist_name} • {release.genre || "No genre"}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      release.status === "approved" ? "bg-green-500/20 text-green-500" :
                      release.status === "rejected" ? "bg-red-500/20 text-red-500" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {release.status}
                    </span>
                    <span className="text-xs text-brand-muted-dark">{new Date(release.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {release.audio_url && (
                    <button onClick={() => { const a = new Audio(release.audio_url); a.play(); }} className="p-2 hover:bg-brand-bg rounded-lg transition-colors" title="Preview">
                      <Play className="w-4 h-4 text-brand-muted" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(selected?.id === release.id ? null : release)}
                    className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
                    title="Details"
                  >
                    <Eye className="w-4 h-4 text-brand-muted" />
                  </button>
                </div>
              </div>

              {selected?.id === release.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-brand-border p-5 space-y-6">
                  {/* Review Actions */}
                  {release.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateStatus(release.id, "approved")} disabled={actionLoading === release.id} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                        {actionLoading === release.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                      </button>
                      <button onClick={() => updateStatus(release.id, "rejected")} disabled={actionLoading === release.id} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}

                  {/* Already approved badge */}
                  {release.status === "approved" && (
                    <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Approved — ready for distribution
                    </div>
                  )}
                  {release.status === "rejected" && (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> Rejected
                    </div>
                  )}

                  {/* Distribution Panel — only for approved releases */}
                  {release.status === "approved" && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-muted-dark mb-4">Distribution</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {platforms.map((p) => (
                          <div key={p.key} className="flex items-center gap-3 bg-brand-bg rounded-lg p-3 border border-brand-border">
                            <p.icon className={`w-5 h-5 shrink-0 ${p.color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-brand-muted-dark mb-1">{p.label} URL</p>
                              <input
                                type="url"
                                placeholder={`Paste ${p.label} link...`}
                                value={(release as any)[p.key] || ""}
                                onChange={(e) => updatePlatformUrl(release.id, p.key, e.target.value)}
                                className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                              />
                            </div>
                            {(release as any)[p.key] && (
                              <a href={(release as any)[p.key]} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-brand-card rounded-lg transition-colors shrink-0">
                                <ExternalLink className="w-4 h-4 text-brand-muted" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
