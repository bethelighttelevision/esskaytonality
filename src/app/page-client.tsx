"use client";

import { ArrowRight, Play, Mic2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import HeroCarousel from "@/components/ui/HeroCarousel";
import ArtistCard from "@/components/ui/ArtistCard";
import LabelCard from "@/components/ui/LabelCard";
import MarqueeTicker from "@/components/ui/MarqueeTicker";
import SoundWaveDivider from "@/components/ui/SoundWaveDivider";
import StatsCounter from "@/components/ui/StatsCounter";
import JsonLd from "@/components/seo/JsonLd";

interface FeaturedArtist {
  id: string;
  name: string;
  genre: string;
  image: string;
}

const featuredVideos = [
  { title: "Qaid Qalandar", youtubeId: "b-yMQjOqpHQ", image: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg" },
  { title: "Saiyaara (Extended Cover)", youtubeId: "gCsv3X5ofhI", image: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg" },
  { title: "Tere Bina", youtubeId: "QNmwgrqbYGA", image: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg" },
  { title: "Vigad Gayi Ae", youtubeId: "qxPGQLGpCmA", image: "https://img.youtube.com/vi/qxPGQLGpCmA/maxresdefault.jpg" },
];

export default function Home() {
  const [featuredArtists, setFeaturedArtists] = useState<FeaturedArtist[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [signedArtists, setSignedArtists] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "artists_data")
        .single();
      
      const raw = data?.value || [
        { id: "sahir-alam", name: "SAHIR ALAM", genre: "INDIE / POP / CINEMATIC", profile: "/sahir-alam.webp" },
        { id: "the-weeknd", name: "THE WEEKND", genre: "R&B / POP", profile: "https://images.unsplash.com/photo-1571343753761-0d32c96b7978?q=80&w=2070&auto=format&fit=crop" }
      ];

      const list = raw.map((a: any) =>
        a.id === "sahir-alam" ? { ...a, profile: "/sahir-alam.webp" } : a
      );

      const cards = list.map((a: { id?: string; name: string; genre: string; profile: string }) => ({
        id: a.id || "",
        name: a.name,
        genre: a.genre,
        image: a.profile
      })).slice(0, 4);
      setFeaturedArtists(cards);
    };
    loadFeatured();

    const loadLabels = async () => {
      const { data } = await supabase
        .from("labels")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true })
        .limit(6);
      if (data) setLabels(data);
    };
    loadLabels();

    const loadReleases = async () => {
      try {
        const res = await fetch("/api/youtube-releases");
        const data = await res.json();
        setReleases(data.videos || []);
      } catch {
        setReleases([]);
      } finally {
        setReleasesLoading(false);
      }
    };
    loadReleases();

    const loadSignedArtists = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "signed_artists_data")
        .single();

      if (data && data.value && data.value.length > 0) {
        setSignedArtists(data.value.slice(0, 4));
      } else {
        setSignedArtists([{
          id: "sahir-alam",
          name: "SAHIR ALAM",
          genre: "INDIE / POP / CINEMATIC",
          profile: "/sahir-alam.webp",
          listeners: "135"
        }]);
      }
    };
    loadSignedArtists();
  }, []);

  return (
    <div className="w-full">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ESSKAYTONALITY",
        url: "https://esskaytonality.com",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://esskaytonality.com/search?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      }} id="website-sd" />

      <h1 className="sr-only">ESSKAYTONALITY — Global Record Label &amp; Music Entertainment Platform</h1>

      <HeroCarousel />

      <MarqueeTicker />

      {/* New Releases */}
      <section className="py-16 md:py-20 bg-brand-surface border-t border-brand-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">New Releases</h2>
            <p className="text-brand-muted max-w-xl mx-auto">The latest drops from Esskaytonality.</p>
          </div>

          {releasesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-white/5" />
                  <div className="p-5">
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : releases.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {releases.slice(0, 3).map((video: any) => (
                  <button
                    key={video.videoId}
                    onClick={() => setActiveVideo({ title: video.title, youtubeId: video.videoId })}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover text-left"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${video.thumbnail}')` }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-brand-primary/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <p className="text-sm font-medium text-white">{video.title}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/releases"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                >
                  Explore More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Labels / Divisions */}
      <section className="py-16 md:py-20 bg-brand-surface border-t border-brand-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Labels</h2>
            <p className="text-brand-muted max-w-xl mx-auto">Explore our specialized labels catering to unique sounds and cultures.</p>
          </div>

          {labels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {labels.map((label) => (
                <LabelCard key={label.id} label={label} variant="home" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-brand-card border border-brand-border rounded-xl p-8 text-center animate-pulse">
                  <div className="w-20 h-20 rounded-xl bg-white/5 mx-auto mb-5" />
                  <div className="h-5 bg-white/5 rounded w-32 mx-auto mb-3" />
                  <div className="h-3 bg-white/5 rounded w-48 mx-auto mb-6" />
                  <div className="h-3 bg-white/5 rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          )}

          {labels.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/labels" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-white transition-colors font-medium">
                View All Labels <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <SoundWaveDivider />

      {/* Featured Videos */}
      <section className="py-16 md:py-20 container mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Videos</h2>
            <p className="text-brand-muted mt-1">Watch the latest from Esskaytonality.</p>
          </div>
          <Link href="/videos" className="hidden md:flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredVideos.map((video, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideo({ title: video.title, youtubeId: video.youtubeId })}
              className="group relative aspect-video rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover text-left"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${video.image}')` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="text-sm font-medium text-white">{video.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 md:py-20 bg-brand-surface border-t border-brand-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Artists</h2>
              <p className="text-brand-muted mt-1">The faces defining modern sound.</p>
            </div>
            <Link href="/artists" className="hidden md:flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredArtists.map((artist, idx) => (
              <ArtistCard key={idx} artist={artist} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Signed Artists */}
      <section className="py-16 md:py-20 bg-brand-bg border-t border-brand-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <div className="flex items-center gap-3">
              <Mic2 className="w-6 h-6 text-amber-500" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Signed Artists</h2>
                <p className="text-brand-muted mt-1">The official ESSKAYTONALITY roster.</p>
              </div>
            </div>
            <Link href="/signed-artists" className="hidden md:flex items-center gap-1.5 text-sm text-brand-muted hover:text-white transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {signedArtists.map((artist, idx) => (
              <Link key={artist.id || idx} href={`/signed-artists/${artist.id}`}>
                <div className="group relative aspect-square rounded-xl overflow-hidden bg-brand-card border border-brand-border card-hover">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${artist.profile}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-brand-muted-dark mb-1.5 bg-black/40 px-2 py-0.5 rounded">
                      {artist.genre}
                    </span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider leading-tight">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-brand-muted-dark text-xs font-medium">
                        {artist.listeners} monthly listeners
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StatsCounter />



      {/* CTA */}
      <section className="py-16 md:py-20 bg-brand-surface border-t border-brand-border">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Join Esskaytonality</h2>
          <p className="text-brand-muted max-w-lg mx-auto mb-8">
            Sign up to access exclusive content, create playlists, and follow your favorite artists.
          </p>
          <Link
            href="/register"
            className="inline-flex px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
