"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Music, Image as ImageIcon, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtistUploadPage() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (data && data.full_name) {
          setArtistName(data.full_name);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !coverFile) {
      setError("Please select both an audio file and a cover image.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Upload Cover Image
      const coverFileName = `${Date.now()}-${coverFile.name.replace(/\s+/g, '-')}`;
      const { error: coverError } = await supabase.storage
        .from("releases")
        .upload(`covers/${coverFileName}`, coverFile);
        
      if (coverError) throw new Error("Failed to upload cover art: " + coverError.message);

      // 2. Upload Audio MP3
      const audioFileName = `${Date.now()}-${audioFile.name.replace(/\s+/g, '-')}`;
      const { error: audioError } = await supabase.storage
        .from("releases")
        .upload(`audio/${audioFileName}`, audioFile);

      if (audioError) throw new Error("Failed to upload audio file: " + audioError.message);

      // 3. Get Public URLs
      const coverUrl = supabase.storage.from("releases").getPublicUrl(`covers/${coverFileName}`).data.publicUrl;
      const audioUrl = supabase.storage.from("releases").getPublicUrl(`audio/${audioFileName}`).data.publicUrl;

      // 4. Save metadata
      const { error: dbError } = await supabase
        .from("releases")
        .insert({
          title,
          artist_name: artistName,
          genre,
          cover_image_url: coverUrl,
          audio_url: audioUrl,
          uploaded_by: user.id
        });

      if (dbError) throw new Error("Database error: " + dbError.message);

      setSuccess(true);
      setTitle("");
      setGenre("");
      setAudioFile(null);
      setCoverFile(null);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Link href="/artist/dashboard" className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-muted hover:text-white transition-colors mb-8 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Artist Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
          Upload <span className="text-gradient">Release</span>
        </h1>
        <p className="text-brand-muted text-sm">Distribute your music to the world securely.</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-green-500/10 border border-green-500/50 rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-bold text-green-500">Track Uploaded Successfully!</h3>
            <p className="text-sm text-green-500/80">Your new release is now live on Esskaytonality.</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Upload */}
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <input 
              type="file" 
              accept="audio/mp3,audio/wav" 
              required
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
              <Music className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Audio File</h3>
            <p className="text-xs text-brand-muted max-w-[200px]">
              {audioFile ? <span className="text-white font-bold">{audioFile.name}</span> : "Upload MP3 or WAV."}
            </p>
          </div>

          {/* Cover Art Upload */}
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              required
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <ImageIcon className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Cover Art</h3>
            <p className="text-xs text-brand-muted max-w-[200px]">
              {coverFile ? <span className="text-white font-bold">{coverFile.name}</span> : "Upload JPG, PNG."}
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4 mb-6">Track Metadata</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2">Track Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2">Artist Name</label>
              <input
                type="text"
                required
                disabled
                value={artistName}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 px-4 text-white/50 cursor-not-allowed"
                title="Your verified stage name cannot be changed here."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-brand-muted uppercase mb-2">Genre</label>
            <input
              type="text"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all"
              placeholder="e.g. Pop, Acoustic, Indie"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !audioFile || !coverFile}
          className="w-full relative flex items-center justify-center gap-3 py-5 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-black font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(0,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Distributing...</>
          ) : (
            <><UploadCloud className="w-5 h-5" /> Publish Release</>
          )}
        </button>

      </form>
    </div>
  );
}
