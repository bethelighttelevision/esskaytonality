"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Users, ShieldAlert, Music, Mic2, UploadCloud, Settings, Mail, CheckCircle, Tags, Star, Loader2, AlertCircle, Trash2 } from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";
import { useRouter } from "next/navigation";

interface Stat { name: string; value: string; icon: any; color: string; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labelsCount, setLabelsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        router.push(`/${profile?.role || "user"}/dashboard`);
        return;
      }

      const [
        { count: usersCount },
        { count: artistsCount },
        { count: releasesCount },
        { count: pendCount },
        { count: lblCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "artist"),
        supabase.from("releases").select("*", { count: "exact", head: true }),
        supabase.from("releases").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("labels").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const { data: signups } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setPendingCount(pendCount ?? 0);
      setLabelsCount(lblCount ?? 0);
      setRecentSignups(signups || []);
      setStats([
        { name: "Total Users", value: (usersCount || 0).toLocaleString(), icon: Users, color: "text-blue-500" },
        { name: "Total Artists", value: (artistsCount || 0).toLocaleString(), icon: Mic2, color: "text-purple-500" },
        { name: "Total Releases", value: (releasesCount || 0).toLocaleString(), icon: Music, color: "text-brand-primary" },
        { name: "Pending Reviews", value: (pendCount || 0).toLocaleString(), icon: CheckCircle, color: "text-yellow-500" },
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSignup = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}" from the platform?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    setRecentSignups((prev) => prev.filter((s) => s.id !== id));
    refreshStats();
  };

  const refreshStats = async () => {
    const [
      { count: usersCount },
      { count: artistsCount },
      { count: releasesCount },
      { count: pendCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "artist"),
      supabase.from("releases").select("*", { count: "exact", head: true }),
      supabase.from("releases").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    setPendingCount(pendCount ?? 0);
    setStats([
      { name: "Total Users", value: (usersCount || 0).toLocaleString(), icon: Users, color: "text-blue-500" },
      { name: "Total Artists", value: (artistsCount || 0).toLocaleString(), icon: Mic2, color: "text-purple-500" },
      { name: "Total Releases", value: (releasesCount || 0).toLocaleString(), icon: Music, color: "text-brand-primary" },
      { name: "Pending Reviews", value: (pendCount || 0).toLocaleString(), icon: CheckCircle, color: "text-yellow-500" },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 flex-col gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 rounded-lg bg-brand-primary text-black text-sm font-medium hover:bg-brand-accent">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageMeta title="Admin Dashboard" description="Master control panel for ESSKAYTONALITY." noIndex />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
            Master <span className="text-gradient">Control</span>
          </h1>
          <p className="text-brand-muted-dark text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-primary" /> Admin Privileges Active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-brand-card p-6 rounded-xl border border-brand-border flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-muted-dark font-bold tracking-wider uppercase mb-1">{stat.name}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold uppercase tracking-wider mb-6 mt-12 border-l-4 border-brand-primary pl-4">Management Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/dashboard/upload" className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <UploadCloud className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Upload Release</h3>
          <p className="text-xs text-brand-muted-dark">Add new music to global platform</p>
        </Link>
        <Link href="/admin/dashboard/settings" className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <Settings className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Platform Settings</h3>
          <p className="text-xs text-brand-muted-dark">Manage site config & policies</p>
        </Link>
        <Link href="/admin/dashboard/artists" className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <Mic2 className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Manage Artists</h3>
          <p className="text-xs text-brand-muted-dark">Verify and approve new artists</p>
        </Link>
        <Link href="/admin/dashboard/reviews" className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <CheckCircle className="w-8 h-8 text-white mb-4 group-hover:text-yellow-500 transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Release Reviews</h3>
          <p className="text-xs text-brand-muted-dark">Review & approve submissions</p>
          {pendingCount > 0 && (
            <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-500">
              {pendingCount} pending
            </span>
          )}
        </Link>
      </div>

      {/* Sync Content */}
      <div className="bg-brand-card p-6 rounded-xl border border-brand-border mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold uppercase tracking-wider">Sync Content</h3>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/seed-content");
                const data = await res.json();
                alert(JSON.stringify(data, null, 2));
              } catch (err: any) {
                alert("Error: " + err.message);
              }
            }}
            className="px-4 py-2 rounded-lg bg-brand-primary text-black text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            Seed Existing Content to DB
          </button>
        </div>
        <p className="text-xs text-brand-muted-dark">Migrate existing hardcoded public content (Videos, FAQs, Team) to the database so you can edit them from the admin panel.</p>
      </div>

      <div className="bg-brand-card p-6 rounded-xl border border-brand-border mt-8">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Recent Platform Signups</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border text-xs font-medium text-brand-muted-dark uppercase tracking-wider">
                <th className="pb-4 font-medium">User</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Date Joined</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentSignups.length > 0 ? (
                recentSignups.map((signup: any) => (
                  <tr key={signup.id} className="border-b border-white/5">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold uppercase">
                          {signup.full_name ? signup.full_name[0] : "?"}
                        </div>
                        <div>
                          <p className="font-bold">{signup.full_name || "New Listener"}</p>
                          <p className="text-xs text-brand-muted-dark">{signup.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${signup.role === "admin" ? "bg-red-500/20 text-red-500" : signup.role === "artist" ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"}`}>
                        {signup.role}
                      </span>
                    </td>
                    <td className="py-4 text-brand-muted-dark">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/dashboard/${signup.role === "artist" ? "artists" : "users"}`} className="p-2 hover:bg-white/10 rounded-full transition-colors inline-block">
                          <Settings className="w-4 h-4 text-brand-muted-dark" />
                        </Link>
                        <button
                          onClick={() => deleteSignup(signup.id, signup.full_name || "Unknown")}
                          className="p-2 hover:bg-red-500/20 rounded-full transition-colors inline-block text-red-500 opacity-60 hover:opacity-100"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-brand-muted-dark">No signups found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
