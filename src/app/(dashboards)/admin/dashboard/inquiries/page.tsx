"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Trash2, Calendar, Reply, ShieldAlert, Disc3, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if Admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        // Fetch inquiries
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setInquiries(data);
        }
      }
      setLoading(false);
    };

    checkRoleAndFetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id);

    if (!error) {
      setInquiries(inquiries.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <Disc3 className="w-16 h-16 text-brand-primary animate-spin mx-auto drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]" />
          <p className="text-brand-muted text-sm font-bold uppercase tracking-widest animate-pulse">
            Fetching Inquiries...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-24 glass rounded-3xl border border-red-500/20 max-w-xl mx-auto p-12">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Access Denied</h2>
        <p className="text-brand-muted text-sm mb-6">You must be logged in as an administrator to access these secure messages.</p>
        <Link href="/login" className="bg-brand-primary text-black font-bold uppercase tracking-wider px-8 py-3 rounded-full text-xs hover:bg-white transition-colors">
          Admin Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-brand-primary flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Master Control
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Studio <span className="text-gradient">Inquiries</span>
          </h1>
          <p className="text-brand-muted text-sm font-bold tracking-wider uppercase mt-1">
            Manage incoming secure messages from clients & producers
          </p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl border border-white/5 shrink-0 flex items-center gap-3">
          <Mail className="w-5 h-5 text-brand-primary" />
          <span className="text-sm font-bold text-white">{inquiries.length} Messages</span>
        </div>
      </div>

      {/* Message List */}
      {inquiries.length === 0 ? (
        <div className="glass p-16 rounded-3xl text-center border border-white/5 max-w-2xl mx-auto">
          <Mail className="w-16 h-16 text-brand-muted mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No messages yet</h3>
          <p className="text-brand-muted text-sm max-w-sm mx-auto">Incoming contact form submissions will dynamically appear here in real time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((inq) => (
            <div 
              key={inq.id} 
              className="glass p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group shadow-xl hover:border-brand-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  {/* Sender details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="bg-brand-primary/10 text-brand-primary font-black px-4 py-1.5 rounded-full text-xs tracking-wider uppercase">
                      {inq.name}
                    </span>
                    <a 
                      href={`mailto:${inq.email}`} 
                      className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> {inq.email}
                    </a>
                    <span className="text-xs text-brand-muted font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(inq.created_at).toLocaleDateString()} at {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-xs text-brand-muted font-black tracking-widest uppercase mb-1">Subject</p>
                    <h3 className="text-xl font-black uppercase text-white tracking-wide">{inq.subject || "No Subject"}</h3>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs text-brand-muted font-black tracking-widest uppercase mb-1.5">Describe your Project</p>
                    <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-start">
                  <a 
                    href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject || "Your Inquiry")}&body=Hi ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for reaching out to Esskaytonality! We received your message:%0D%0A%0D%0A"${encodeURIComponent(inq.message)}"%0D%0A%0D%0A--%0D%0ABest regards,%0D%0ASahir Alam %26 The Esskaytonality Team`}
                    className="p-3 bg-brand-primary text-black rounded-full hover:bg-white hover:scale-105 transition-all flex items-center justify-center shadow-lg"
                    title="Reply to sender"
                  >
                    <Reply className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDelete(inq.id)}
                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition-all flex items-center justify-center shadow-lg"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
