import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-brand-bg select-none">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="text-8xl md:text-9xl font-bold text-white/5 tracking-tighter mb-6">404</div>
        <div className="w-16 h-1 bg-brand-primary rounded-full mx-auto mb-8" />

        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">
          Page Not <span className="text-gradient">Found</span>
        </h1>

        <p className="text-brand-muted-dark text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved. Let us take you back to where the music plays.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
          >
            <Home className="w-4 h-4" /> Back Home
          </Link>
          <Link
            href="/music"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4" /> Explore Music
          </Link>
        </div>
      </div>
    </div>
  );
}
