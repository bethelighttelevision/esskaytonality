"use client";

import { motion } from "framer-motion";
import JsonLd from "@/components/seo/JsonLd";
import { 
  Mail, 
  Phone, 
  Globe, 
  Send, 
  Sparkles, 
  AudioLines, 
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from("contacts")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      ]);

    setIsSubmitting(false);

    if (error) {
    } else {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const services = [
    { title: "Music Production & Arrangement", desc: "Custom compositions & full song arrangements tailored to your style." },
    { title: "Mixing & Mastering", desc: "Industry-standard clarity, punch, and translation across all speaker systems." },
    { title: "Sound Design", desc: "Cinematic, immersive, and custom high-fidelity audio assets for visual media." },
    { title: "Podcast & Voiceover Editing", desc: "Clean, noise-free, and polished professional sound for speakers." }
  ];

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen relative overflow-hidden">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact ESSKAYTONALITY",
        "description": "Get in touch with ESSKAYTONALITY — business inquiries, partnerships, and general questions.",
        "url": "https://esskaytonality.com/contact"
      }} />
      
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/2" />

      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <AudioLines className="w-8 h-8 text-brand-primary" />
          <span className="text-brand-accent font-bold tracking-widest uppercase">Get in Touch</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6"
        >
          Let's Create <span className="text-gradient">Something Amazing</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-brand-muted text-lg leading-relaxed"
        >
          Welcome to EsskayTonality – Your Ultimate Audio Production Studio! 
          We bring your sound to life with expert production, sound design, and world-class mixing.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="bg-brand-card border border-brand-border rounded-xl p-8 relative overflow-hidden group card-hover">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl" />
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-primary" /> Studio Details
            </h2>
            <div className="space-y-6">
              <a 
                href="mailto:contact@esskaytonality.com" 
                className="flex items-center gap-4 group/item hover:text-brand-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center group-hover/item:border-brand-primary transition-colors">
                  <Mail className="w-5 h-5 text-brand-accent group-hover/item:text-brand-primary transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted-dark font-bold uppercase tracking-widest">Business Inquiries</p>
                  <p className="font-semibold text-white">contact@esskaytonality.com</p>
                </div>
              </a>

              <a 
                href="tel:+31624461425" 
                className="flex items-center gap-4 group/item hover:text-brand-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center group-hover/item:border-brand-primary transition-colors">
                  <Phone className="w-5 h-5 text-brand-accent group-hover/item:text-brand-primary transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted-dark font-bold uppercase tracking-widest">Direct Phone / WhatsApp</p>
                  <p className="font-semibold text-white">+31 624 461 425</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted-dark font-bold uppercase tracking-widest">Studio Location</p>
                  <p className="font-semibold text-white">Rotterdam, Netherlands (Worldwide Services)</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-xs text-brand-muted-dark font-bold uppercase tracking-widest mb-4">Follow EssKay Tonality</p>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/esskaytonalityofficial?igsh=MWZseXVrNTYwZnRlbA%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-white/70 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com/esskaytonality" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-white/70 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@esskaytonality" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-white/70 hover:text-white hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-xl p-8 relative overflow-hidden group card-hover">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Subscribe to Session Updates</h3>
            <p className="text-sm text-brand-muted-dark mb-4">Subscribe for production insights, studio sessions, and exclusive discount content!</p>
            <div className="flex gap-2">
              <label htmlFor="subscribe-email" className="sr-only">Email for subscription</label>
              <input 
                id="subscribe-email"
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button className="bg-brand-accent text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-white hover:text-black transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 space-y-12"
        >
          <div className="bg-brand-card border border-brand-border rounded-xl p-8 md:p-10 relative overflow-hidden card-hover">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              Send a Secure Message
            </h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">Message Sent!</h3>
                <p className="text-brand-muted max-w-sm">Thank you for reaching out. We will get back to your inquiry within 24 business hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Mixing & Mastering Service Request"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-muted-dark">Describe your Project</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project, song style, timelines, or reference tracks..."
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all resize-none"
                  />
                </div>

                <div className="relative w-full flex items-center justify-start">
                  
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="relative z-10 bg-brand-primary hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold uppercase tracking-wider">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((svc, idx) => (
                <div key={idx} className="bg-brand-card border border-brand-border rounded-2xl p-6 flex gap-4 relative overflow-hidden group card-hover">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors" />
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">{svc.title}</h4>
                    <p className="text-xs text-brand-muted-dark leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex items-center gap-4 justify-between bg-gradient-to-r from-brand-bg to-brand-surface/40 card-hover">
              <div>
                <h4 className="font-bold text-brand-accent uppercase tracking-wider text-sm mb-1">Why Choose Us?</h4>
                <p className="text-xs text-brand-muted-dark">Expert sound engineers, top-tier audio quality, and a relentless passion for sonic perfection.</p>
              </div>
            </div>
          </div>

        </motion.div>

      </div>

    </div>
  );
}
