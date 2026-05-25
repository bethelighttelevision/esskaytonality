"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";

export default function FAQPage({ initialFaq }: { initialFaq: { category: string; items: { q: string; a: string }[] }[] | null }) {
  const faqData = initialFaq || [
    {
      category: "General",
      items: [
        { q: "What is Esskaytonality?", a: "Esskaytonality is an independent record label and music entertainment platform founded by Sahir Alam. We specialize in indie pop, cinematic music, and promoting both established and emerging artists across multiple genres." },
        { q: "Who owns Esskaytonality?", a: "Esskaytonality is owned and operated by founder Sahir Alam, who also performs under the stage name Esskay Tonality." },
        { q: "Where is Esskaytonality based?", a: "Our headquarters is located in Overijssel, Netherlands." },
        { q: "How can I contact Esskaytonality?", a: "Visit our Contact page or email us through the form on the site. For business inquiries, please use the contact form with appropriate subject." },
      ],
    },
    {
      category: "For Artists",
      items: [
        { q: "How do I submit my demo?", a: "Esskaytonality currently accepts demo submissions through our contact form. Please include links to your music (SoundCloud, YouTube, Spotify) and a brief bio." },
        { q: "Does Esskaytonality offer contracts to new artists?", a: "We evaluate each submission on its artistic merit. We never ask for payment to review demos or offer contracts. Beware of scams." },
        { q: "Can I collaborate with Esskaytonality artists?", a: "Collaboration opportunities are evaluated on a case-by-case basis. Reach out through our contact form with your proposal." },
        { q: "How are royalties handled?", a: "Royalty distribution follows standard industry practices. Specific terms are outlined in individual artist agreements." },
      ],
    },
    {
      category: "Audience & Fans",
      items: [
        { q: "How can I listen to Esskaytonality music?", a: "All our releases are available on major streaming platforms including Spotify, Apple Music, YouTube, and Deezer. Visit our Music page for direct links." },
        { q: "Can I use Esskaytonality music in my content?", a: "For licensing inquiries, please contact us through the form on our Contact page with details about your project." },
        { q: "How can I stay updated on new releases?", a: "Follow us on social media and check our News page for the latest updates, releases, and announcements." },
        { q: "Is there a fan club or newsletter?", a: "Sign up on our website to receive updates about new music, exclusive content, and upcoming events." },
      ],
    },
    {
      category: "Technical",
      items: [
        { q: "Why can't I play a song on the website?", a: "Make sure your browser supports audio playback. Try refreshing the page or clearing your cache. If issues persist, contact us through the Contact page." },
        { q: "How do I create an account?", a: 'Click "Sign Up" on the top right of the page. You can register with email or use Google OAuth for quick access.' },
        { q: "I forgot my password, what do I do?", a: "Go to the Login page and click 'Forgot Password.' Enter your email address and follow the reset link sent to your inbox." },
      ],
    },
  ];
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = faqData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is ESSKAYTONALITY?", acceptedAnswer: { "@type": "Answer", text: "ESSKAYTONALITY is a global music entertainment platform and digital record label founded by Sahir Alam, based in Overijssel, Netherlands." } },
          { "@type": "Question", name: "How do I submit my music?", acceptedAnswer: { "@type": "Answer", text: "Sign up as an artist and use the Artist Dashboard to upload your tracks for review by our team." } },
          { "@type": "Question", name: "Is ESSKAYTONALITY free to join?", acceptedAnswer: { "@type": "Answer", text: "Yes, signing up and streaming music on ESSKAYTONALITY is completely free." } },
        ],
      }} />
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <MessageCircle className="w-8 h-8 text-brand-primary" />
          <span className="text-brand-accent font-bold tracking-widest uppercase">Help Center</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6"
        >
          <span className="text-gradient">FAQ</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-brand-muted text-lg leading-relaxed"
        >
          Find answers to common questions about Esskaytonality.
        </motion.p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-xl mx-auto mb-16"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted-dark" />
          <label htmlFor="faq-search" className="sr-only">Search questions</label>
          <input
            id="faq-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-brand-muted-dark focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </motion.div>

      {/* FAQ Categories */}
      <div className="max-w-3xl mx-auto space-y-12">
        {filteredData.map((category, ci) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * ci }}
          >
            <h2 className="text-xl font-bold uppercase tracking-wider text-brand-accent mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-brand-accent/50" />
              {category.category}
            </h2>

            <div className="space-y-3">
              {category.items.map((item, ii) => {
                const key = `${ci}-${ii}`;
                const isOpen = openItems[key];

                return (
                  <div
                    key={key}
                    className="bg-brand-card border border-brand-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white font-semibold text-sm uppercase tracking-wider hover:text-brand-accent transition-colors"
                    >
                      <span>{item.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-brand-muted-dark" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" as const }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0 border-t border-brand-border/50">
                            <p className="text-brand-muted text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-muted-dark text-lg">
              No results found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Still have questions CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto mt-20 text-center bg-brand-card border border-brand-border rounded-xl p-10"
      >
        <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-3">
          Still have questions?
        </h3>
        <p className="text-brand-muted-dark text-sm mb-8 max-w-md mx-auto">
          We are here to help. Reach out to us and we will get back to you as soon as possible.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Contact Us <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
