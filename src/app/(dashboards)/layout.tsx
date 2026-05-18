import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If there is no logged-in user, redirect them to the login page immediately.
  if (error || !user) {
    redirect("/login");
  }

  // Fetch their profile from the database to know their role (user, artist, admin)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-brand-bg relative">
      {/* Background Glows specific to dashboards */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
