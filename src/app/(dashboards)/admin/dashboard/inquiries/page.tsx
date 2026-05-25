"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Trash2, Calendar, Reply, ShieldAlert, Disc3, ArrowLeft, Send, Loader2, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import PageMeta from "@/components/seo/PageMeta";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySent, setReplySent] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
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

  const handleReply = async (inq: any) => {
    if (!replyText.trim()) return;

    setSendingReply(true);
    setReplySent(null);

    try {
      const res = await fetch("/api/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inq.email,
          name: inq.name,
          subject: inq.subject || "Your Inquiry",
          replyMessage: replyText,
          originalMessage: inq.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReplySent(inq.id);
        setReplyText("");
        setReplyingTo(null);
        setTimeout(() => setReplySent(null), 3000);
      } else {
        alert("Failed to send reply: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to send reply. Check your network connection.");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <Disc3 className="w-16 h-16 text-brand-primary animate-spin mx-auto" />
          <p className="text-brand-muted-dark text-sm font-bold uppercase tracking-widest">
            Fetching Inquiries...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-24 bg-brand-card rounded-xl border border-red-500/20 max-w-xl mx-auto p-12">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Access Denied</h1>
        <p className="text-brand-muted-dark text-sm mb-6">You must be logged in as an administrator to access these secure messages.</p>
        <Link href="/login" className="bg-brand-primary text-black font-medium uppercase tracking-wider rounded-lg px-5 py-2.5 text-xs hover:bg-white transition-colors">
          Admin Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageMeta title="Inquiries" description="Admin — view contact form inquiries." noIndex />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">
            Studio <span className="text-gradient">Inquiries</span>
          </h1>
          <p className="text-brand-muted-dark text-sm font-bold tracking-wider uppercase mt-1">
            Manage incoming secure messages from clients & producers
          </p>
        </div>
        <div className="bg-brand-card px-6 py-3 rounded-xl border border-brand-border shrink-0 flex items-center gap-3">
          <Mail className="w-5 h-5 text-brand-primary" />
          <span className="text-sm font-bold text-white">{inquiries.length} Messages</span>
        </div>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => { if (!sendingReply) { setReplyingTo(null); setReplyText(""); } }}>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider">Reply to Inquiry</h2>
              <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-brand-muted-dark hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const inq = inquiries.find(i => i.id === replyingTo);
              if (!inq) return null;
              return (
                <>
                  <div className="bg-brand-bg rounded-xl p-4 mb-6 border border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-brand-muted-dark uppercase tracking-widest">To:</span>
                      <span className="text-sm text-white">{inq.name} &lt;{inq.email}&gt;</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-brand-muted-dark uppercase tracking-widest">Subject:</span>
                      <span className="text-sm text-white">Re: {inq.subject || "Your Inquiry"}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Your Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={6}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                    />
                  </div>

                  {replySent === inq.id && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-500 text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      Reply sent successfully!
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs text-brand-muted-dark font-bold tracking-widest uppercase mb-2">Original Message</p>
                    <div className="bg-brand-bg border border-brand-border rounded-xl p-4 text-sm text-brand-muted leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {inq.message}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      disabled={sendingReply}
                      className="px-5 py-2.5 rounded-lg border border-brand-border text-sm text-brand-muted-dark hover:text-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReply(inq)}
                      disabled={sendingReply || !replyText.trim()}
                      className="px-5 py-2.5 rounded-lg bg-brand-primary text-black font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingReply ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Reply</>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Message List */}
      {inquiries.length === 0 ? (
        <div className="bg-brand-card p-16 rounded-xl text-center border border-brand-border max-w-2xl mx-auto">
          <Mail className="w-16 h-16 text-brand-muted-dark mx-auto mb-6 opacity-30" />
          <h2 className="text-xl font-bold uppercase tracking-wider mb-2">No messages yet</h2>
          <p className="text-brand-muted-dark text-sm max-w-sm mx-auto">Incoming contact form submissions will dynamically appear here in real time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((inq) => (
            <div 
              key={inq.id} 
              className="bg-brand-card p-6 md:p-8 rounded-xl border border-brand-border relative overflow-hidden group card-hover"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  {/* Sender details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="bg-brand-primary/10 text-brand-primary font-bold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase">
                      {inq.name}
                    </span>
                    <a 
                      href={`mailto:${inq.email}`} 
                      className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> {inq.email}
                    </a>
                    <span className="text-xs text-brand-muted-dark font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(inq.created_at).toLocaleDateString()} at {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-xs text-brand-muted-dark font-bold tracking-widest uppercase mb-1">Subject</p>
                    <h3 className="text-xl font-bold uppercase text-white tracking-wide">{inq.subject || "No Subject"}</h3>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs text-brand-muted-dark font-bold tracking-widest uppercase mb-1.5">Describe your Project</p>
                    <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-lg border border-brand-border whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => setReplyingTo(inq.id)}
                    className="p-3 bg-brand-primary text-black rounded-full hover:bg-white hover:scale-105 transition-all flex items-center justify-center"
                    title="Reply to sender via dashboard"
                  >
                    <Reply className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(inq.id)}
                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition-all flex items-center justify-center"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {replySent === inq.id && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-500 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  Reply sent to {inq.email}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
