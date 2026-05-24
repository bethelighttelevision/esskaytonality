"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LabelLogo from "./LabelLogo";

interface LabelCardProps {
  label: {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    logo_url: string | null;
    color: string | null;
    genre: string | null;
  };
  variant?: "home" | "grid";
}

export default function LabelCard({ label, variant = "grid" }: LabelCardProps) {
  const color = label.color || "#ffffff";

  if (variant === "home") {
    return (
      <Link
        href={`/labels#${label.slug}`}
        className="bg-brand-card border border-brand-border rounded-xl p-8 text-center card-hover group block"
      >
        <div className="flex justify-center mb-5">
          <LabelLogo src={label.logo_url} name={label.name} color={color} size="md" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{label.name}</h3>
        {label.tagline && (
          <p className="text-brand-muted text-sm mb-6">{label.tagline}</p>
        )}
        {label.genre && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label.genre}
          </span>
        )}
        <div className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors">
          Explore <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/labels#${label.slug}`}
      className="bg-brand-card border border-brand-border rounded-xl overflow-hidden card-hover group block"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <LabelLogo src={label.logo_url} name={label.name} color={color} size="lg" />
        <h3 className="text-xl font-bold text-white mt-5 mb-2 group-hover:text-brand-accent transition-colors">
          {label.name}
        </h3>
        {label.tagline && (
          <p className="text-brand-muted text-sm mb-4">{label.tagline}</p>
        )}
        {label.genre && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label.genre}
          </span>
        )}
      </div>
      {label.description && (
        <div className="px-8 pb-6">
          <p className="text-sm text-brand-muted-dark leading-relaxed line-clamp-2">
            {label.description}
          </p>
        </div>
      )}
      <div className="border-t border-brand-border px-8 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-muted-dark">Explore Label</span>
        <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-accent transition-colors" />
      </div>
    </Link>
  );
}
