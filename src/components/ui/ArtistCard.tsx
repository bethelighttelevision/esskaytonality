"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ArtistCardProps {
  artist: {
    id?: string;
    name: string;
    genre: string;
    image: string;
  };
  index: number;
}

export default function ArtistCard({ artist, index }: ArtistCardProps) {
  const artistId = artist.id || artist.name.toLowerCase().replace(/ \/ /g, "-").replace(/ /g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/artists/${artistId}`} className="group block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${artist.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <p className="text-brand-accent text-xs font-medium mb-1">{artist.genre}</p>
            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
