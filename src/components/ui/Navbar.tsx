"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import EsskayLogo from "@/components/ui/EsskayLogo";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Artists", href: "/artists" },
    { name: "Labels", href: "/labels" },
    { name: "Music", href: "/music" },
    { name: "Videos", href: "/videos" },
    { name: "News", href: "/news" },
    { name: "About", href: "/about" },
  ];

  const moreLinks = [
    { name: "Executives", href: "/executives" },
    { name: "DEI", href: "/diversity-equity-inclusion" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-surface/95 backdrop-blur-md border-b border-brand-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-16 md:h-20">
        <Link href="/" className="flex items-center gap-0">
          <EsskayLogo size={36} showText={true} />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-brand-muted hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-white transition-colors duration-200">
              More <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-brand-card border border-brand-border rounded-xl py-2 min-w-[180px] shadow-xl">
                {moreLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-5 py-2.5 text-sm text-brand-muted hover:text-white hover:bg-brand-surface transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/user/dashboard"
                className="text-sm font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
                className="flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-brand-muted hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-surface border-t border-brand-border">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {[...navLinks, ...moreLinks].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-brand-muted hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-brand-border pt-4 mt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      supabase.auth.signOut().then(() => window.location.href = "/");
                    }}
                    className="text-base font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-brand-muted hover:text-white transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-lg bg-brand-primary text-white text-center text-sm font-medium hover:bg-brand-accent transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
