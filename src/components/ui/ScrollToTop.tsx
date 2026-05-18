"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-5 z-50 w-11 h-11 rounded-full bg-brand-primary hover:bg-brand-accent text-white flex items-center justify-center shadow-[0_0_20px_rgba(185,28,28,0.45)] hover:shadow-[0_0_30px_rgba(185,28,28,0.7)] transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
