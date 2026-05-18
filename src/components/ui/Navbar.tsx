"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Search, User, Disc3, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Artists", href: "/artists" },
    { name: "Music", href: "/music" },
    { name: "Videos", href: "/videos" },
    { name: "News", href: "/news" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Disc3 className="w-8 h-8 text-brand-primary group-hover:text-brand-accent transition-colors duration-300 animate-spin-slow" />
          <span className="text-xl md:text-2xl font-bold tracking-widest uppercase">
            Esskay<span className="text-gradient">tonality</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-wider font-semibold text-brand-text/80 hover:text-white hover:text-brand-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-brand-text/80 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            {user ? (
              <>
                <Link href="/user/dashboard" className="text-sm font-bold tracking-widest uppercase text-brand-text/80 hover:text-white transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Exit
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold tracking-widest uppercase text-brand-text/80 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="px-5 py-2 rounded-full bg-brand-primary text-black text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full glass flex flex-col items-center py-8 gap-6 md:hidden border-t border-white/5"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg uppercase tracking-wider font-semibold text-brand-text/80 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}
