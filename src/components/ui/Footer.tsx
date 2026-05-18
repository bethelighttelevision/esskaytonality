import Link from "next/link";
import { Mail } from "lucide-react";
import EsskayLogo from "@/components/ui/EsskayLogo";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-white/5 pt-16 pb-8 mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <EsskayLogo size={30} showText={true} />
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              A music entertainment platform and digital record label. Discover the next generation of sound.
            </p>
            <div className="flex items-center gap-4 text-brand-muted">
              <a href="https://www.instagram.com/esskaytonalityofficial?igsh=MWZseXVrNTYwZnRlbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors"><InstagramIcon className="w-5 h-5" /></a>
              <a href="https://facebook.com/esskaytonality" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors"><FacebookIcon className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@esskaytonality" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors"><YoutubeIcon className="w-5 h-5" /></a>
              <a href="mailto:esskaytonality@gmail.com" className="hover:text-brand-primary transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Discover</h4>
            <ul className="space-y-4 text-brand-muted text-sm">
              <li><Link href="/artists" className="hover:text-white transition-colors">Artists</Link></li>
              <li><Link href="/music" className="hover:text-white transition-colors">New Releases</Link></li>
              <li><Link href="/videos" className="hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News & Media</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Divisions</h4>
            <ul className="space-y-4 text-brand-muted text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Originals</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Hip Hop</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Indie</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pop</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Stay Updated</h4>
            <p className="text-brand-muted text-sm mb-4">
              Subscribe to get the latest releases and exclusive artist updates.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-brand-bg border border-white/10 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button 
                type="submit"
                className="bg-brand-primary hover:bg-brand-accent text-white font-semibold text-sm py-3 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-xs">
            &copy; {new Date().getFullYear()} ESSKAYTONALITY. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-brand-muted">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
