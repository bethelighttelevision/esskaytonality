"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Music, Disc3, Headphones, Globe } from "lucide-react";

const stats = [
  { label: "Songs Released", value: 100, suffix: "+", icon: Music },
  { label: "Artists Signed", value: 50, suffix: "+", icon: Disc3 },
  { label: "Total Streams", value: 5, suffix: "M+", icon: Headphones, multiplier: 1000000 },
  { label: "Countries", value: 30, suffix: "+", icon: Globe },
];

function Counter({ value, suffix, multiplier }: { value: number; suffix: string; multiplier?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = multiplier ? value * (multiplier / value) : value;
  const actualTarget = multiplier ? value * (multiplier / 1000000) : value;

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const step = Math.max(1, Math.floor(end / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / (end / step));

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {multiplier ? `${count}${suffix}` : `${count}${suffix}`}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-16 md:py-20 bg-brand-bg border-t border-brand-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                <Counter value={stat.value} suffix={stat.suffix} multiplier={stat.multiplier} />
              </div>
              <p className="text-sm text-brand-muted-dark uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
