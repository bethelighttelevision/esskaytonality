"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImageIcon, Film, FileText, Trash2, Copy, ExternalLink, Loader2, Upload, FolderOpen, X } from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";
import FileUpload from "@/components/admin/FileUpload";

interface BucketTab {
  id: string;
  name: string;
  icon: any;
  color: string;
  subfolders?: { id: string; name: string }[];
}

const buckets: BucketTab[] = [
  { id: "label-logos", name: "Label Logos", icon: ImageIcon, color: "text-purple-500" },
  { id: "artist-images", name: "Artist Images", icon: ImageIcon, color: "text-blue-500" },
  {
    id: "releases",
    name: "Releases",
    icon: Film,
    color: "text-green-500",
    subfolders: [
      { id: "", name: "All" },
      { id: "covers", name: "Covers" },
      { id: "audio", name: "Audio" },
      { id: "videos", name: "Videos" },
    ],
  },
];

export default function MediaLibraryPage() {
  const [activeBucket, setActiveBucket] = useState("label-logos");
  const [activeSubfolder, setActiveSubfolder] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const supabase = createClient();

  const curBucket = buckets.find(b => b.id === activeBucket);

  const fetchItems = async (bucket: string, subfolder: string) => {
    setLoading(true);
    setError(null);
    try {
      const path = subfolder || undefined;
      const { data, error: listError } = await supabase.storage.from(bucket).list(path);
      if (listError) throw listError;
      setItems(data || []);
    } catch (err: any) {
      if (err.message?.includes("bucket") || err.message?.includes("not found")) {
        setItems([]);
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setActiveSubfolder("");
    setShowUpload(false);
    fetchItems(activeBucket, "");
  }, [activeBucket]);

  useEffect(() => {
    setShowUpload(false);
    fetchItems(activeBucket, activeSubfolder);
  }, [activeSubfolder]);

  const getPublicUrl = (bucket: string, path: string) => {
    const fullPath = activeSubfolder ? `${activeSubfolder}/${path}` : path;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fullPath);
    return publicUrl;
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(url);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleDelete = async (bucket: string, path: string) => {
    if (!confirm("Delete this file?")) return;
    const fullPath = activeSubfolder ? `${activeSubfolder}/${path}` : path;
    const { error: delErr } = await supabase.storage.from(bucket).remove([fullPath]);
    if (delErr) { setError(delErr.message); return; }
    await fetchItems(activeBucket, activeSubfolder);
  };

  const handleUploadComplete = (url: string) => {
    setShowUpload(false);
    fetchItems(activeBucket, activeSubfolder);
  };

  return (
    <div className="space-y-8">
      <PageMeta title="Media Library" description="Browse and manage uploaded media files." noIndex />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">Media <span className="text-gradient">Library</span></h1>
          <p className="text-brand-muted-dark text-sm">Browse and manage uploaded media files across all buckets.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}<button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {buckets.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.id}
                onClick={() => setActiveBucket(b.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeBucket === b.id
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                    : "text-brand-muted-dark border border-transparent hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${b.color}`} />
                {b.name}
              </button>
            );
          })}
          <div className="flex-1" />
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>

        {curBucket?.subfolders && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <FolderOpen className="w-3.5 h-3.5 text-brand-muted-dark shrink-0" />
            {curBucket.subfolders.map((sf) => (
              <button
                key={sf.id}
                onClick={() => setActiveSubfolder(sf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeSubfolder === sf.id
                    ? "bg-white/10 text-white"
                    : "text-brand-muted-dark hover:text-white"
                }`}
              >
                {sf.name}
              </button>
            ))}
          </div>
        )}

        {showUpload && (
          <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Upload to {buckets.find(b => b.id === activeBucket)?.name || activeBucket}{activeSubfolder ? ` / ${activeSubfolder}` : ""}</h3>
              <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-brand-bg rounded-lg">
                <X className="w-4 h-4 text-brand-muted" />
              </button>
            </div>
            <FileUpload
              bucket={activeBucket}
              path={activeSubfolder}
              accept="image/*,video/*,audio/*,.pdf"
              maxSizeMB={50}
              label=""
              onUpload={handleUploadComplete}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-muted-dark" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-brand-muted-dark bg-brand-card rounded-xl border border-brand-border">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No files in this bucket</p>
          <p className="text-sm mt-1">Click the Upload button above to add files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.filter((f: any) => f.id && !f.id.endsWith("/")).map((file: any) => {
            const url = getPublicUrl(activeBucket, file.name);
            const isImage = file.metadata?.mimetype?.startsWith("image/");
            return (
              <div key={file.id} className="bg-brand-card rounded-xl border border-brand-border overflow-hidden group">
                <div className="aspect-square bg-cover bg-center bg-brand-bg relative" style={isImage ? { backgroundImage: `url('${url}')` } : {}}>
                  {!isImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-brand-muted-dark" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => copyUrl(url)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="Copy URL">
                      {copiedId === url ? <span className="text-xs text-green-500 font-bold">Copied!</span> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="Open">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                    <button onClick={() => handleDelete(activeBucket, file.name)} className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs truncate text-brand-muted" title={file.name}>{file.name}</p>
                  <p className="text-[10px] text-brand-muted-dark mt-0.5">
                    {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
