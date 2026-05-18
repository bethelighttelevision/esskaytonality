"use client";

import { motion } from "framer-motion";

// Bar heights (0–30 scale) mirroring the official logo waveform
const bars = [3, 6, 9, 14, 18, 23, 30, 28, 22, 16, 10, 6, 3];
const CRIMSON = "#B91C1C";
const GRAY    = "#4A4A4A";

// Each bar has its own random-feeling oscillation timing
const timings = [0.9, 1.3, 0.85, 1.1, 1.45, 0.95, 1.2, 0.8, 1.35, 1.05, 0.9, 1.15, 0.85];

interface EsskayLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function EsskayLogo({ size = 36, showText = true, className = "" }: EsskayLogoProps) {
  const CY = 20; // vertical centre of the 40-unit-tall viewBox

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>

      {/* ── Animated SVG Icon ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {/* Sound-wave bars — Framer Motion animates SVG attr height & y directly */}
        {bars.map((h, i) => {
          const minH = Math.max(h * 0.25, 2);
          const midH = h;
          const x    = i * 2.4 + 0.4;

          return (
            <motion.rect
              key={i}
              x={x}
              width={1.7}
              rx={0.85}
              fill={CRIMSON}
              animate={{
                height: [minH, midH, minH * 1.4, midH * 0.75, minH],
                y:      [
                  CY - minH / 2,
                  CY - midH / 2,
                  CY - (minH * 1.4) / 2,
                  CY - (midH * 0.75) / 2,
                  CY - minH / 2,
                ],
              }}
              transition={{
                duration: timings[i],
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.07,
              }}
            />
          );
        })}

        {/* Speaker / megaphone — static (Facing Left towards waves) */}
        <polygon points="33,7 45,13 45,27 33,33" fill={GRAY} />
        {/* Inner highlight for 3D metallic feel */}
        <polygon points="33,9 43,15 43,25 33,31" fill="#777" opacity="0.35" />
        {/* Speaker tip knob */}
        <ellipse cx="46" cy="20" rx="1.8" ry="2.8" fill={GRAY} />
        <ellipse cx="46.5" cy="20" rx="0.9" ry="1.6" fill="#9A9A9A" />
      </svg>

      {/* Logo wordmark */}
      {showText && (
        <span className="hidden sm:inline-block text-base sm:text-xl md:text-2xl font-black tracking-wider uppercase leading-none whitespace-nowrap">
          <span className="text-white">Esskay</span>
          <span className="text-brand-primary">tonality</span>
        </span>
      )}
    </div>
  );
}
