"use client";

interface LabelLogoProps {
  src?: string | null;
  name: string;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function LabelLogo({ src, name, color = "#ffffff", className = "", size = "md" }: LabelLogoProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-4xl",
  };

  const initials = name
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center font-bold shrink-0 ${className}`}
        style={{ backgroundColor: `${color}15`, color }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden shrink-0 ${className}`}>
      <img src={src} alt={`${name} logo`} className="w-full h-full object-contain p-2" />
    </div>
  );
}
