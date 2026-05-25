"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import EsskayLogo from "@/components/ui/EsskayLogo";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [siteName, setSiteName] = useState("ESSKAYTONALITY");
  const [logoUrl, setLogoUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const supabase = createClient();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/artist/dashboard") || pathname.startsWith("/user/dashboard");

  useEffect(() => {
    if (isDashboard) return;
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("value").eq("key", "site_general").single();
      if (data?.value) {
        if (data.value.site_name) setSiteName(data.value.site_name);
        if (data.value.logo_url) setLogoUrl(data.value.logo_url);
        if (data.value.tagline) setTagline(data.value.tagline);
      }
    };
    fetchSettings();
  }, [isDashboard]);

  useEffect(() => {
    if (isDashboard) return;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [isDashboard]);

  useEffect(() => {
    if (isDashboard) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboard]);

  if (isDashboard) return null;

  const navLinks = [
    {
      name: "Artists",
      hasSubmenu: true,
      submenu: [
        { name: "Featured Artists", href: "/artists" },
        { name: "Signed Artists", href: "/signed-artists" },
      ],
    },
    {
      name: "Music",
      hasSubmenu: true,
      submenu: [
        { name: "Originals", href: "/originals" },
        { name: "Covers", href: "/covers" },
        { name: "Group Songs", href: "/group-songs" },
        { name: "Poetries", href: "/poetries" },
      ],
    },
    { name: "Videos", href: "/videos" },
    { name: "Team", href: "/team" },
    { name: "Releases", href: "/releases" },
    { name: "About", href: "/about" },
  ];

  const moreLinks = [
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
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-9 w-auto" />
          ) : (
            <EsskayLogo size={36} showText={true} />
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link: any) => (
            link.hasSubmenu ? (
              <div key={link.name} className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-white transition-colors duration-200">
                  {link.name} <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-brand-card border border-brand-border rounded-xl py-2 min-w-[180px] shadow-xl">
                    {link.submenu.map((sub: any) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-5 py-2.5 text-sm text-brand-muted hover:text-white hover:bg-brand-surface transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-brand-muted hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            )
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
            {navLinks.map((link: any) => (
              link.hasSubmenu ? (
                <div key={link.name} className="flex flex-col gap-2">
                  <span className="text-base font-bold text-brand-muted-dark uppercase tracking-wider">{link.name}</span>
                  <div className="flex flex-col gap-1 pl-4 border-l border-brand-border">
                    {link.submenu.map((sub: any) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-medium text-brand-muted hover:text-white transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-brand-muted hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
            {moreLinks.map((link) => (
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
