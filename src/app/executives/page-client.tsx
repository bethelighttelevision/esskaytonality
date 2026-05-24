"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const executives = [
  {
    name: "Sahir Alam",
    title: "Founder & CEO",
    bio: "Visionary music entrepreneur, composer, and artist. Under the stage name Esskay Tonality, he has pioneered a unique blend of indie pop and cinematic soundscapes that define the Esskaytonality sound.",
    image: "/sahir-alam.webp",
  },
  {
    name: "Oma Aslam",
    title: "VP, A&R & Creative Development",
    bio: "Accomplished vocalist and creative director who brings artistic vision to life. Known for collaborations on hit releases including Qaid Qalandar.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Duke",
    title: "Head of Marketing & Digital Strategy",
    bio: "Strategic marketing leader driving Esskaytonality's digital presence and brand growth across all platforms.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hashim Ali Khan",
    title: "Head of Visual Production",
    bio: "Creative visual director responsible for the label's distinctive visual identity, music videos, and brand aesthetics.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function ExecutivesPage() {
  return (
    <div className="w-full pt-24 pb-12 min-h-screen bg-brand-bg">
      <section className="container mx-auto px-6 md:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-6">
            <span className="text-gradient">Leadership</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-muted-dark max-w-2xl mx-auto font-light">
            Meet the team driving Esskaytonality forward.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {executives.map((exec) => (
            <motion.div
              key={exec.name}
              variants={cardVariants}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${exec.image}')` }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-1">
                  {exec.name}
                </h2>
                <p className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
                  {exec.title}
                </p>
                <p className="text-brand-muted-dark text-sm leading-relaxed">
                  {exec.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-brand-card border border-brand-border rounded-xl p-12 md:p-20 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            Join Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-brand-muted-dark text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Passionate about music and entertainment? We are always looking for
            talented individuals who share our vision. Reach out and let us
            know how you can contribute to the Esskaytonality story.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-primary rounded-lg px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-brand-accent transition-colors"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
