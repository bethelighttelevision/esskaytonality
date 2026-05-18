import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, ShieldAlert, Music, Mic2, UploadCloud, Settings, Trash2 } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch their profile from the database to ensure they are an ADMIN
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    // If they somehow guessed this URL but aren't an admin, kick them to their own dashboard
    redirect(`/${profile?.role}/dashboard`);
  }

  // Fetch dynamic statistics from Supabase
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user");

  const { count: artistsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "artist");

  const { count: releasesCount } = await supabase
    .from("releases")
    .select("*", { count: "exact", head: true });

  const { data: recentSignups } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { name: "Total Users", value: (usersCount || 0).toLocaleString(), icon: Users, color: "text-blue-500" },
    { name: "Total Artists", value: (artistsCount || 0).toLocaleString(), icon: Mic2, color: "text-purple-500" },
    { name: "Total Releases", value: (releasesCount || 0).toLocaleString(), icon: Music, color: "text-brand-primary" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
            Master <span className="text-gradient">Control</span>
          </h1>
          <p className="text-brand-muted text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-primary" /> Admin Privileges Active
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted font-bold tracking-wider uppercase mb-1">{stat.name}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold uppercase tracking-wider mb-6 mt-12 border-l-4 border-brand-primary pl-4">Management Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/dashboard/upload" className="glass p-6 rounded-2xl border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-colors group">
          <UploadCloud className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Upload Release</h3>
          <p className="text-xs text-brand-muted">Add new music to global platform</p>
        </Link>
        
        <Link href="/admin/dashboard/settings" className="glass p-6 rounded-2xl border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-colors group">
          <Settings className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Platform Settings</h3>
          <p className="text-xs text-brand-muted">Change homepage banners & SEO</p>
        </Link>
        
        <Link href="/admin/dashboard/artists" className="glass p-6 rounded-2xl border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-colors group">
          <Mic2 className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Manage Artists</h3>
          <p className="text-xs text-brand-muted">Verify and approve new artists</p>
        </Link>
        
        <Link href="/admin/dashboard/users" className="glass p-6 rounded-2xl border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-colors group">
          <Users className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Manage Users</h3>
          <p className="text-xs text-brand-muted">View and suspend listeners</p>
        </Link>
      </div>

      {/* Recent Registrations Table */}
      <div className="glass p-6 rounded-3xl border border-white/10 mt-12">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Recent Platform Signups</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-brand-muted text-xs uppercase tracking-widest">
                <th className="pb-4 font-semibold">User</th>
                <th className="pb-4 font-semibold">Role</th>
                <th className="pb-4 font-semibold">Date Joined</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentSignups && recentSignups.length > 0 ? (
                recentSignups.map((signup) => (
                  <tr key={signup.id} className="border-b border-white/5">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold uppercase">
                          {signup.full_name ? signup.full_name[0] : "?"}
                        </div>
                        <div>
                          <p className="font-bold">{signup.full_name || "New Listener"}</p>
                          <p className="text-xs text-brand-muted">{signup.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                        signup.role === "admin" ? "bg-red-500/20 text-red-500" :
                        signup.role === "artist" ? "bg-purple-500/20 text-purple-500" :
                        "bg-blue-500/20 text-blue-500"
                      }`}>
                        {signup.role}
                      </span>
                    </td>
                    <td className="py-4 text-brand-muted">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/dashboard/${signup.role === "artist" ? "artists" : "users"}`} className="p-2 hover:bg-white/10 rounded-full transition-colors inline-block">
                        <Settings className="w-4 h-4 text-brand-muted" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-brand-muted">No signups found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
