import Link from "next/link";
import { Mail } from "lucide-react";
import EsskayLogo from "@/components/ui/EsskayLogo";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-24">
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <EsskayLogo size={32} showText={true} />
            </Link>
            <p className="text-brand-muted-dark text-sm leading-relaxed mb-5 max-w-xs">
              A music entertainment platform and digital record label. Discover the next generation of sound.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/esskaytonalityofficial?igsh=MWZseXVrNTYwZnRlbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted-dark hover:text-brand-primary hover:border-brand-primary/30 transition-colors"><InstagramIcon /></a>
              <a href="https://facebook.com/esskaytonality" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted-dark hover:text-brand-primary hover:border-brand-primary/30 transition-colors"><FacebookIcon /></a>
              <a href="https://www.youtube.com/@esskaytonality" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted-dark hover:text-brand-primary hover:border-brand-primary/30 transition-colors"><YoutubeIcon /></a>
              <a href="mailto:contact@esskaytonality.com" className="w-8 h-8 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted-dark hover:text-brand-primary hover:border-brand-primary/30 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Discover</h4>
            <ul className="space-y-2.5">
              <li><Link href="/artists" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Artists</Link></li>
              <li><Link href="/music" className="text-sm text-brand-muted-dark hover:text-white transition-colors">New Releases</Link></li>
              <li><Link href="/videos" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/news" className="text-sm text-brand-muted-dark hover:text-white transition-colors">News & Media</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Divisions</h4>
            <ul className="space-y-2.5">
              <li><Link href="/labels#esskay-originals" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Esskay Originals</Link></li>
              <li><Link href="/labels#esskay-hip-hop" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Esskay Hip Hop</Link></li>
              <li><Link href="/labels#esskay-indie" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Esskay Indie</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-brand-muted-dark hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-brand-muted-dark hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted-dark text-xs">
            &copy; {new Date().getFullYear()} ESSKAYTONALITY. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-brand-muted-dark">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
