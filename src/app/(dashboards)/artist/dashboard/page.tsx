import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Mic2, Music, UploadCloud, BarChart3, Play } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artist Dashboard | ESSKAYTONALITY",
  robots: { index: false, follow: false },
};

export default async function ArtistDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin/dashboard");
  if (profile?.role === "user") redirect("/user/dashboard");

  // Fetch Artist's own releases
  const { data: releases } = await supabase
    .from("releases")
    .select("*")
    .eq("uploaded_by", user.id)
    .order("created_at", { ascending: false });

  const totalReleases = releases?.length || 0;
  // Calculate dynamic active stream counts from the database!
  const totalStreams = releases?.reduce((sum, r) => sum + (r.play_count || 0), 0) || 0;

  return (
    <div className="space-y-8 pt-24 pb-12">
      {/* Header Profile Section */}
      <div className="bg-brand-card p-8 rounded-xl border border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-accent to-purple-600 p-1">
            <div className="w-full h-full bg-brand-bg rounded-full flex items-center justify-center">
              <Mic2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
              <span className="text-gradient">{profile?.full_name || "Artist"}</span>
            </h1>
            <p className="text-brand-muted-dark text-sm font-bold tracking-widest uppercase text-brand-accent">Verified Artist</p>
          </div>
        </div>
        <Link href="/artist/dashboard/upload" className="hidden md:flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium tracking-widest uppercase text-sm bg-brand-accent text-white hover:bg-white hover:text-black transition-colors">
          <UploadCloud className="w-4 h-4" /> Upload New Track
        </Link>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border">
          <p className="text-xs text-brand-muted-dark font-bold tracking-wider uppercase mb-1">Total Streams</p>
          <p className="text-2xl font-bold">{totalStreams.toLocaleString()}</p>
        </div>
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border">
          <p className="text-xs text-brand-muted-dark font-bold tracking-wider uppercase mb-1">Monthly Listeners</p>
          <p className="text-2xl font-bold">{Math.ceil(totalStreams / 2.5).toLocaleString()}</p>
        </div>
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border">
          <p className="text-xs text-brand-muted-dark font-bold tracking-wider uppercase mb-1">Followers</p>
          <p className="text-2xl font-bold">{Math.ceil(totalStreams / 4.8).toLocaleString()}</p>
        </div>
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border">
          <p className="text-xs text-brand-muted-dark font-bold tracking-wider uppercase mb-1">Active Releases</p>
          <p className="text-2xl font-bold">{totalReleases}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Discography Management */}
        <div className="lg:col-span-2 bg-brand-card p-6 rounded-xl border border-brand-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">My Discography</h2>
          </div>
          
          {totalReleases === 0 ? (
            <div className="py-12 text-center flex flex-col items-center border border-dashed border-white/10 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-brand-muted-dark" />
              </div>
              <h3 className="text-lg font-bold mb-2">No releases yet</h3>
              <p className="text-brand-muted-dark text-sm max-w-sm mb-6">Upload your first track to Esskaytonality and start reaching millions of listeners globally.</p>
              <Link href="/artist/dashboard/upload" className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium tracking-widest uppercase text-xs bg-white/10 text-white hover:bg-white/20 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload Release
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {releases?.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-brand-border hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                      <img loading="lazy" src={track.cover_image_url} alt={track.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide uppercase">{track.title}</h3>
                      <p className="text-xs text-brand-muted-dark mt-0.5">{new Date(track.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-brand-muted-dark font-bold uppercase tracking-wider">{track.play_count || 0} Streams</span>
                    <div className="text-xs font-bold text-brand-accent uppercase tracking-widest px-3 py-1 bg-brand-accent/10 rounded-full border border-brand-accent/20">
                      Live
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audience Insights */}
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-l-4 border-purple-500 pl-4">Audience</h2>
          <div className="py-12 text-center flex flex-col items-center">
            <BarChart3 className="w-12 h-12 text-brand-muted-dark mb-4" />
            <p className="text-brand-muted-dark text-sm">Analytics will appear here once your tracks receive their first streams.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
