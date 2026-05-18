"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface ArtistCardProps {
  artist: {
    name: string;
    genre: string;
    image: string;
  };
  index: number;
}

export default function ArtistCard({ artist, index }: ArtistCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
      className="relative aspect-[3/4] w-full"
    >
      <Link href="/artists">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="group relative w-full h-full rounded-xl overflow-hidden cursor-pointer shadow-2xl bg-brand-surface border border-white/5"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url('${artist.image}')` }}
          />

          {/* Glare Effect */}
          <motion.div
            style={{
              x: glareX,
              y: glareY,
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)",
            }}
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10 mix-blend-overlay"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-10" />

          {/* Content */}
          <div 
            style={{ transform: "translateZ(50px)" }}
            className="absolute bottom-0 left-0 p-6 w-full z-20"
          >
            <p className="text-brand-accent text-xs font-bold tracking-widest mb-1 shadow-black drop-shadow-md">
              {artist.genre}
            </p>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg">
              {artist.name}
            </h3>
            
            <div className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold w-full hover:bg-brand-primary hover:text-white transition-colors border border-transparent hover:border-brand-accent shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(138,43,226,0.6)]">
                View Profile
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
