import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PlayCircle, Heart, ListMusic, User as UserIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard | ESSKAYTONALITY",
  robots: { index: false, follow: false },
};

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin/dashboard");
  if (profile?.role === "artist") redirect("/artist/dashboard");

  // Fetch favorites
  const { data: favoritesData } = await supabase
    .from("favorites")
    .select("track_id, youtube_id")
    .eq("user_id", user.id);

  const totalFavorites = favoritesData?.length || 0;

  return (
    <div className="space-y-8 pt-24 pb-12">
      {/* Header Profile Section */}
      <div className="bg-brand-card p-8 rounded-xl border border-brand-border flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent p-1">
          <div className="w-full h-full bg-brand-bg rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
            Hi, <span className="text-gradient">{profile?.full_name || "Listener"}</span>
          </h1>
          <p className="text-brand-muted-dark text-sm font-bold tracking-widest uppercase">Premium Member</p>
        </div>
      </div>

      {/* Quick Stats / Library Nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <Heart className={`w-8 h-8 mb-4 transition-colors ${totalFavorites > 0 ? "text-red-500 fill-red-500" : "text-white group-hover:text-red-500"}`} />
          <h2 className="text-lg font-bold uppercase tracking-wider">Favorite Songs</h2>
          <p className="text-sm text-brand-muted-dark mt-1">{totalFavorites} Tracks Saved</p>
        </div>
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <ListMusic className="w-8 h-8 text-white mb-4 group-hover:text-brand-accent transition-colors" />
          <h2 className="text-lg font-bold uppercase tracking-wider">My Playlists</h2>
          <p className="text-sm text-brand-muted-dark mt-1">0 Playlists</p>
        </div>
        <div className="bg-brand-card p-6 rounded-xl border border-brand-border card-hover group">
          <PlayCircle className="w-8 h-8 text-white mb-4 group-hover:text-brand-primary transition-colors" />
          <h2 className="text-lg font-bold uppercase tracking-wider">Recently Played</h2>
          <p className="text-sm text-brand-muted-dark mt-1">Listen History</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-l-4 border-red-500 pl-4">My Favorites</h2>
          <div className="bg-brand-card py-12 px-6 rounded-xl border border-brand-border text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {totalFavorites > 0 ? `You have ${totalFavorites} saved tracks` : "No favorites yet"}
            </h3>
            <p className="text-brand-muted-dark text-sm max-w-sm mb-6">Go to the music library and click the heart icon on any track to save it here.</p>
            <a href="/music" className="rounded-lg px-5 py-2.5 font-medium tracking-widest uppercase text-xs bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
              Explore Music
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-l-4 border-brand-primary pl-4">Recently Played</h2>
          <div className="bg-brand-card py-12 px-6 rounded-xl border border-brand-border text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <PlayCircle className="w-8 h-8 text-brand-muted-dark" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nothing here yet</h3>
            <p className="text-brand-muted-dark text-sm max-w-sm">Listen to tracks to build your history.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
