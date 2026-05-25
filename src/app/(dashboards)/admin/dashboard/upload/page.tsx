"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UploadCloud, Music, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";
import { motion } from "framer-motion";

export default function UploadReleasePage() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("Sahir Alam");
  const [genre, setGenre] = useState("");
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

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
      // 1. Upload Cover Image to Storage Bucket
      const coverFileName = `${Date.now()}-${coverFile.name.replace(/\s+/g, '-')}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from("releases")
        .upload(`covers/${coverFileName}`, coverFile);
        
      if (coverError) throw new Error("Failed to upload cover art: " + coverError.message);

      // 2. Upload Audio MP3 to Storage Bucket
      const audioFileName = `${Date.now()}-${audioFile.name.replace(/\s+/g, '-')}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from("releases")
        .upload(`audio/${audioFileName}`, audioFile);

      if (audioError) throw new Error("Failed to upload audio file: " + audioError.message);

      // 3. Get Public URLs
      const coverUrl = supabase.storage.from("releases").getPublicUrl(`covers/${coverFileName}`).data.publicUrl;
      const audioUrl = supabase.storage.from("releases").getPublicUrl(`audio/${audioFileName}`).data.publicUrl;

      // 4. Save metadata to database
      const { error: dbError } = await supabase
        .from("releases")
        .insert({
          title,
          artist_name: artistName,
          genre,
          cover_image_url: coverUrl,
          audio_url: audioUrl,
        });

      if (dbError) throw new Error("Database error: " + dbError.message);

      setSuccess(true);
      
      // Reset form
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
      <PageMeta title="Upload Release" description="Admin — upload a new release." noIndex />

      <div className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">
          Upload <span className="text-gradient">Release</span>
        </h1>
        <p className="text-brand-muted-dark text-sm">Add new music to the Esskaytonality platform. Files will be uploaded securely to the cloud.</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-lg font-bold text-green-500">Release Published Successfully!</h2>
            <p className="text-sm text-green-500/80">The track is now live on the platform's database.</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-8">
        
        {/* File Upload Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Upload */}
          <div className="bg-brand-card p-8 rounded-xl border border-brand-border flex flex-col items-center justify-center text-center relative overflow-hidden group">
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
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Audio File</h2>
            <p className="text-xs text-brand-muted-dark max-w-[200px]">
              {audioFile ? <span className="text-white font-bold">{audioFile.name}</span> : "Drag & Drop or click to upload MP3 or WAV."}
            </p>
          </div>

          {/* Cover Art Upload */}
          <div className="bg-brand-card p-8 rounded-xl border border-brand-border flex flex-col items-center justify-center text-center relative overflow-hidden group">
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
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Cover Art</h2>
            <p className="text-xs text-brand-muted-dark max-w-[200px]">
              {coverFile ? <span className="text-white font-bold">{coverFile.name}</span> : "Drag & Drop or click to upload JPG, PNG."}
            </p>
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="bg-brand-card p-8 rounded-xl border border-brand-border space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4 mb-6">Track Metadata</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Track Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all"
                placeholder="e.g. Saiyaara"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Artist Name</label>
              <input
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all"
                placeholder="e.g. Sahir Alam"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Genre</label>
            <input
              type="text"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all"
              placeholder="e.g. Pop, Acoustic, Indie"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !audioFile || !coverFile}
          className="w-full relative flex items-center justify-center gap-3 py-5 px-4 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-black font-medium uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloud...</>
          ) : (
            <><UploadCloud className="w-5 h-5" /> Publish Release</>
          )}
        </button>

      </form>
    </div>
  );
}
