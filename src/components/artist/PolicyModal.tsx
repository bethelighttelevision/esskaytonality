"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PolicyModalProps {
  open: boolean;
  onAccept: (policyVersion: string) => void;
  onDeny: () => void;
}

export default function PolicyModal({ open, onAccept, onDeny }: PolicyModalProps) {
  const [policyContent, setPolicyContent] = useState("");
  const [policyVersion, setPolicyVersion] = useState("v1");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;
    const fetchPolicy = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("upload_policies")
        .select("content, version")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setPolicyContent(data.content);
        setPolicyVersion(data.version);
      } else {
        setPolicyContent("By submitting this release, you confirm that you own all necessary rights. You grant ESSKAYTONALITY non-exclusive rights to distribute this content across our platforms.");
        setPolicyVersion("v1");
      }
      setLoading(false);
    };
    fetchPolicy();
    setAccepted(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-6 border-b border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-tight">Submission Policy</h2>
                <p className="text-xs text-brand-muted-dark">Version: {policyVersion}</p>
              </div>
              <button onClick={onDeny} className="ml-auto p-2 rounded-lg hover:bg-white/5 text-brand-muted-dark hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-brand-border border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="bg-black/30 border border-brand-border rounded-xl p-5 max-h-60 overflow-y-auto text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">
                  {policyContent}
                </div>
              )}

              <label className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-black/20 border border-brand-border cursor-pointer hover:bg-black/30 transition-colors">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-brand-border bg-brand-bg text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                />
                <div>
                  <p className="text-sm font-medium text-white">I have read and accept the submission policy</p>
                  <p className="text-xs text-brand-muted-dark mt-0.5">You must accept the terms to submit your release</p>
                </div>
              </label>
            </div>

            <div className="p-6 pt-0 flex items-center gap-3">
              <button
                onClick={onDeny}
                className="flex-1 px-5 py-3 rounded-xl border border-brand-border text-sm font-bold uppercase tracking-wider text-brand-muted-dark hover:text-white hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => accepted && onAccept(policyVersion)}
                disabled={!accepted}
                className="flex-1 px-5 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Accept & Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
