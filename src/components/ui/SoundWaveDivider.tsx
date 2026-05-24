"use client";

import { motion } from "framer-motion";

function pseudoRandom(i: number, offset = 0): number {
  return (Math.sin(i * 2.5 + offset) * 0.5 + 0.5);
}

export default function SoundWaveDivider() {
  const bars = 24;

  return (
    <div className="relative h-24 overflow-hidden bg-brand-surface">
      <div className="absolute inset-0 flex items-center justify-center gap-[3px] px-4">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-brand-primary/40 via-brand-accent/60 to-brand-primary/40"
            animate={{
              height: [
                pseudoRandom(i, 1) * 40 + 8,
                pseudoRandom(i, 2) * 60 + 16,
                pseudoRandom(i, 3) * 30 + 8,
                pseudoRandom(i, 4) * 50 + 12,
                pseudoRandom(i, 5) * 40 + 8,
              ],
              opacity: [0.3, 0.8, 0.4, 0.7, 0.3],
            }}
            transition={{
              duration: pseudoRandom(i, 6) * 1.5 + 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pseudoRandom(i, 7) * 0.5,
            }}
            style={{ height: pseudoRandom(i, 8) * 30 + 12 }}
          />
        ))}
      </div>
    </div>
  );
}
