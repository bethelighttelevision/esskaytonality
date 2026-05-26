"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full pt-24 pb-12 min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About ESSKAYTONALITY",
        "description": "A global music entertainment platform and digital record label founded by Sahir Alam.",
        "url": "https://esskaytonality.com/about"
      }} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
          style={{ backgroundImage: "url('/sahir-alam.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-6">
              Our <span className="text-gradient">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-muted-dark max-w-3xl mx-auto font-light">
              We are not just a label. We are a cultural movement defining the sound of tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              The Genesis of <br /><span className="text-brand-accent">Esskaytonality</span>
            </h2>
            <div className="space-y-6 text-brand-muted text-lg leading-relaxed">
              <p>
                Founded in 2017, Esskaytonality emerged from a simple yet profound realization: the music industry needed a disruptor. A place where raw talent meets unapologetic creativity without the traditional constraints of corporate labels.
              </p>
              <p>
                What started as a small underground collective in an abandoned warehouse has grown into a global powerhouse. We've built an ecosystem that nurtures artists, providing them with state-of-the-art facilities and unyielding creative control.
              </p>
              <p>
                Today, Esskaytonality represents a diverse roster of genre-defying artists who are pushing the boundaries of what modern music can be. We don't follow trends; we set them.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-white/10 relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop')" }}
              />
              <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-brand-card border border-brand-border p-8 rounded-2xl hidden md:block animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="text-5xl font-bold text-brand-accent mb-2">185K+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-brand-muted">Global Streams</div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Founder Section */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-brand-card border border-brand-border rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[50vh] lg:h-auto order-2 lg:order-1">
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: "url('https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/80 to-transparent lg:hidden" />
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center order-1 lg:order-2">
              <h4 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-4">The Visionary</h4>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">Meet The Founder</h2>
              <blockquote className="text-xl md:text-2xl font-light italic text-white/90 mb-8 border-l-4 border-brand-primary pl-6">
                "We didn't set out to build a record label. We set out to build a sanctuary for sound, a place where artists don't have to compromise who they are to reach the masses."
              </blockquote>
              <div className="mb-8">
                <h3 className="text-2xl font-bold uppercase tracking-wider">Sahir Alam</h3>
                <p className="text-brand-muted-dark uppercase tracking-widest text-sm mt-1">Owner & Visionary</p>
              </div>
              <p className="text-brand-muted-dark leading-relaxed mb-8">
                With a deep passion for sound and a clear vision for the future of music, Sahir founded Esskaytonality to bridge the gap between underground authenticity and mainstream success.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-primary rounded-lg px-5 py-2.5 font-bold uppercase tracking-widest text-sm hover:bg-brand-accent transition-colors w-fit">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Company Information */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Headquarters</h2>
          <p className="text-brand-muted-dark">Where the magic happens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-brand-card border border-brand-border p-8 rounded-2xl flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Location</h3>
            <p className="text-brand-muted-dark">
              Overijssel, Netherlands
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-brand-card border border-brand-border p-8 rounded-2xl flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">General Inquiries</h3>
            <p className="text-brand-muted-dark mb-2">contact@esskaytonality.com</p>
            <p className="text-brand-muted-dark">+31 624 461 425</p>
          </motion.div>


        </div>
      </section>
    </div>
  );
}
