"use client";

import { motion } from "framer-motion";
import { Heart, Globe, Users, Star, Handshake, Music, Mic, Building2 } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Representation",
    description: "Ensuring diverse voices are heard in our artist roster, leadership, and creative partnerships. We actively seek and develop talent from underrepresented communities.",
  },
  {
    icon: Globe,
    title: "Access",
    description: "Breaking down barriers to music education and resources. Through workshops and community programs, we provide tools and mentorship to aspiring artists regardless of their background.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building bridges between cultures through music. We support initiatives that celebrate cultural heritage and foster cross-cultural collaboration.",
  },
  {
    icon: Star,
    title: "Empowerment",
    description: "Creating platforms for marginalized voices. We invest in programs that give artists the resources and visibility they need to share their stories.",
  },
];

const partners = [
  {
    icon: Music,
    name: "Music for All",
    description: "Providing instruments and music education to underprivileged youth.",
  },
  {
    icon: Mic,
    name: "Women in Music",
    description: "Supporting female and non-binary artists through mentorship and production grants.",
  },
  {
    icon: Building2,
    name: "South Asian Arts Council",
    description: "Celebrating and preserving South Asian musical heritage.",
  },
  {
    icon: Handshake,
    name: "Local Community Studios",
    description: "Funding community recording studios in underserved neighborhoods.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function DEIPage() {
  return (
    <div className="w-full pt-24 pb-24 min-h-screen bg-brand-bg">
      <section className="container mx-auto px-6 md:px-12 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">
            Diversity, Equity & <span className="text-gradient">Inclusion</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted-dark max-w-3xl mx-auto leading-relaxed">
            At Esskaytonality, we believe music is a universal language that transcends boundaries.
            We are committed to fostering a diverse, equitable, and inclusive environment where
            artists, creators, and fans from all backgrounds can thrive. We embrace our responsibility
            to move music forward by amplifying underrepresented voices and creating opportunities for all.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 md:px-12 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Our <span className="text-gradient">Pillars</span>
          </h2>
          <p className="text-brand-muted-dark max-w-2xl mx-auto">
            Four commitments that guide everything we do.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={item}
              className="bg-brand-card border border-brand-border rounded-xl p-8 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mb-6">
                <pillar.icon className="w-7 h-7 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-4">{pillar.title}</h3>
              <p className="text-brand-muted-dark text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-brand-surface border-y border-brand-border mb-24">
        <div className="container mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8">
              Our <span className="text-gradient">Commitment</span>
            </h2>
            <p className="text-brand-muted-dark text-lg leading-relaxed mb-6">
              We hold ourselves accountable through transparent reporting, diverse hiring practices,
              and ongoing investment in programs that create real change. DEI is not a campaign — it
              is the foundation of how we operate every day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Our <span className="text-gradient">Partners</span>
          </h2>
          <p className="text-brand-muted-dark max-w-2xl mx-auto">
            Collaborating with organizations that share our vision for a more inclusive music industry.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              variants={item}
              className="bg-brand-card border border-brand-border rounded-xl p-8 flex items-start gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center shrink-0 mt-1">
                <partner.icon className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{partner.name}</h3>
                <p className="text-brand-muted-dark text-sm leading-relaxed">{partner.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
