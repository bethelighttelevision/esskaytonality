"use client";

import { motion } from "framer-motion";
import { Target, Eye, Building2, MapPin, Mail, Phone, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="w-full pt-24 pb-12 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop')" }}
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
            <p className="text-xl md:text-2xl text-brand-muted max-w-3xl mx-auto font-light">
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
                Founded in 2024, Esskaytonality emerged from a simple yet profound realization: the music industry needed a disruptor. A place where raw talent meets unapologetic creativity without the traditional constraints of corporate labels.
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
            <div className="aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop')" }}
              />
              <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay" />
            </div>
            {/* Floating element */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-2xl border border-white/20 hidden md:block animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="text-5xl font-black text-brand-accent mb-2">1B+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-brand-muted">Global Streams</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-brand-surface py-24 border-y border-white/5 mb-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-12 rounded-3xl border border-white/5 hover:border-brand-primary/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_15px_rgba(138,43,226,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Target className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-wider mb-6">Our Mission</h3>
              <p className="text-brand-muted text-lg leading-relaxed">
                To discover, cultivate, and amplify authentic voices globally. We are dedicated to providing artists with an innovative platform where their creative vision is protected and their sonic potential is maximized through cutting-edge production and strategic global distribution.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-12 rounded-3xl border border-white/5 hover:border-brand-accent/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Eye className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="text-3xl font-bold uppercase tracking-wider mb-6">Our Vision</h3>
              <p className="text-brand-muted text-lg leading-relaxed">
                To architect the future of the entertainment industry. We envision a borderless musical landscape where independent artistry thrives at the highest commercial levels, reshaping global culture and leaving a legacy of sonic excellence for generations to come.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl overflow-hidden border border-white/10"
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
                <p className="text-brand-muted uppercase tracking-widest text-sm mt-1">Owner & Visionary</p>
              </div>
              <p className="text-brand-muted leading-relaxed mb-8">
                With a deep passion for sound and a clear vision for the future of music, Sahir founded Esskaytonality to bridge the gap between underground authenticity and mainstream success.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm hover:text-brand-primary transition-colors w-fit">
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
          <p className="text-brand-muted">Where the magic happens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-2xl flex flex-col items-center text-center border-t border-brand-primary/20"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Location</h3>
            <p className="text-brand-muted">
              Rotterdam, Netherlands<br />
              (Worldwide Services)
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-2xl flex flex-col items-center text-center border-t border-brand-primary/20"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">General Inquiries</h3>
            <p className="text-brand-muted mb-2">esskaytonality@gmail.com</p>
            <p className="text-brand-muted">+31 624 461 425</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-2xl flex flex-col items-center text-center border-t border-brand-primary/20"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Global Offices</h3>
            <p className="text-brand-muted">
              London, UK<br />
              Tokyo, JP<br />
              Toronto, CA
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
