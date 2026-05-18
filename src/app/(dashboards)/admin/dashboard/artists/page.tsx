"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mic2, ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ManageArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "artist")
      .order("created_at", { ascending: false });
      
    if (data) setArtists(data);
    setLoading(false);
  };

  const deleteArtist = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this artist? Their uploaded music will remain on the platform but they will lose access.");
    if (!confirmDelete) return;

    // Demote artist to user
    const { error } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", id);
      
    if (!error) {
      setArtists(artists.filter(a => a.id !== id));
      alert("Artist demoted to listener.");
    } else {
      alert("Error removing artist: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-8">
      <Link href="/admin/dashboard" className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-white transition-colors mb-8 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Master Control
      </Link>

      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Mic2 className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
            Manage <span className="text-purple-500">Artists</span>
          </h1>
          <p className="text-brand-muted text-sm">View and manage verified artist accounts on the platform.</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Artist ID</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Stage Name</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Email</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Joined</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted">Loading artists...</td>
                </tr>
              ) : artists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted">No verified artists found.</td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 text-xs text-brand-muted font-mono">{artist.id.substring(0, 8)}...</td>
                    <td className="p-6 text-sm font-bold flex items-center gap-2">
                      {artist.full_name || "Unknown Artist"}
                      <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    </td>
                    <td className="p-6 text-sm text-brand-muted">{artist.email || "No email"}</td>
                    <td className="p-6 text-sm text-brand-muted">
                      {new Date(artist.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => deleteArtist(artist.id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Demote to Listener"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
