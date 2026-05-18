"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, ArrowLeft, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user")
      .order("created_at", { ascending: false });
      
    if (data) setUsers(data);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!confirmDelete) return;

    // First delete from auth.users (Requires Admin Privileges, usually done via Edge Function or Service Role)
    // Since we are on client side, we can only delete from public.profiles if RLS allows, 
    // but a true delete requires auth.admin API. For this MVP, we'll just soft-delete or delete from profiles.
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
      alert("User removed from platform.");
    } else {
      alert("Error removing user: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-8">
      <Link href="/admin/dashboard" className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-white transition-colors mb-8 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Master Control
      </Link>

      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">
            Manage <span className="text-blue-500">Listeners</span>
          </h1>
          <p className="text-brand-muted text-sm">View and manage all regular user accounts on the platform.</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">User ID</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Name</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Email</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase">Joined</th>
                <th className="p-6 text-xs font-bold tracking-widest text-brand-muted uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted">Loading listeners...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted">No listeners found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 text-xs text-brand-muted font-mono">{user.id.substring(0, 8)}...</td>
                    <td className="p-6 text-sm font-bold">{user.full_name || "Unknown User"}</td>
                    <td className="p-6 text-sm text-brand-muted">{user.email || "No email"}</td>
                    <td className="p-6 text-sm text-brand-muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete User"
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
