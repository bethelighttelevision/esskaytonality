"use client";

const news = [
  "Qaid Qalandar — Now Streaming Worldwide",
  "Sahir Alam × New Collaborations Coming Soon",
  "Esskaytonality — Redefining Modern Sound",
  "Official Merch Store Opening This Year",
  "New Music Video Dropping Every Month",
];

export default function MarqueeTicker() {
  return (
    <div className="relative h-9 overflow-hidden bg-brand-card border-y border-brand-border">
      <div className="absolute inset-0 w-8 bg-gradient-to-r from-brand-card to-transparent z-10 left-0" />
      <div className="absolute inset-0 w-8 bg-gradient-to-l from-brand-card to-transparent z-10 right-0" />
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {[...news, ...news].map((item, idx) => (
          <span key={idx} className="inline-flex items-center mx-6 text-xs font-medium text-brand-muted-dark uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-3 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
