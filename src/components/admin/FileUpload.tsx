"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onClear?: () => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function FileUpload({
  bucket,
  path = "",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxSizeMB = 5,
  label = "Upload File",
  currentUrl,
  onUpload,
  onClear,
  onUploadingChange,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const validateFile = (f: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (f.size > maxSize) return `File too large (max ${maxSizeMB}MB)`;
    const allowed = accept.split(",").map(a => a.trim());
    const ext = f.name.split(".").pop()?.toLowerCase();
    const mimeOk = allowed.some(a => f.type.startsWith(a.replace("/*", "/")) || a === "." + ext);
    if (!mimeOk && allowed.length > 0) return `Invalid file type. Accepted: ${accept}`;
    return null;
  };

  const uploadFile = async (f: File) => {
    setUploading(true);
    onUploadingChange?.(true);
    setProgress(0);
    setError(null);

    try {
      const ext = f.name.split(".").pop() || "png";
      const prefix = path ? `${path}/` : "";
      const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(fileName, f, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress(100);
      onUpload(publicUrl);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError(null);
    setLoadFailed(false);
    uploadFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const showPreview = preview || (currentUrl && !loadFailed ? currentUrl : null);

  return (
    <div className="space-y-3">
      {label && <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase">{label}</label>}

      {showPreview ? (
        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-brand-border bg-brand-bg group">
          <img src={showPreview} alt="" className="w-full h-full object-cover" onError={() => setLoadFailed(true)} />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer p-1.5 bg-white/10 rounded-lg hover:bg-white/20">
              <Upload className="w-4 h-4 text-white" />
              <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
            </label>
            {onClear && (
              <button onClick={() => { onClear(); setPreview(null); setLoadFailed(false); }} className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/40">
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer flex flex-col items-center justify-center w-28 h-28 rounded-xl border-2 border-dashed transition-colors ${
            dragOver ? "border-brand-primary bg-brand-primary/5" : "border-brand-border hover:border-brand-primary/50"
          }`}
        >
          <Upload className="w-6 h-6 text-brand-muted-dark mb-1" />
          <span className="text-[10px] text-brand-muted-dark text-center leading-tight px-1">Click or drag</span>
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        </div>
      )}

      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading...
          </div>
          <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-300"
              style={{ width: `${progress || 45}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
