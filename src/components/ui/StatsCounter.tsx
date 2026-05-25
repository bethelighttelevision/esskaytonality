"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Music, Disc3, Headphones, Globe } from "lucide-react";

const stats = [
  { label: "Songs", value: 20, suffix: "+", icon: Music },
  { label: "Featured Artists", value: 50, suffix: "+", icon: Disc3 },
  { label: "Streams", value: 200, suffix: "k+", icon: Headphones },
  { label: "Countries", value: 192, suffix: "+", icon: Globe },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

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
      {count}{suffix}
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
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-brand-muted-dark uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
