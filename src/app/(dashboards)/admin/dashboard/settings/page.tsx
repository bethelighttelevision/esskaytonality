"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Settings, Save, Image as ImageIcon, Loader2, CheckCircle2, Play,
  Globe, Mail, Upload, FileText, X, Plus, Trash2
} from "lucide-react";
import PageMeta from "@/components/seo/PageMeta";
import { motion } from "framer-motion";

const defaultSlides = [
  { id: 1, image: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg", title: "Qaid Qalandar", youtubeId: "b-yMQjOqpHQ" },
  { id: 2, image: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg", title: "Saiyaara OST", youtubeId: "gCsv3X5ofhI" },
  { id: 3, image: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg", title: "Tere Bina", youtubeId: "QNmwgrqbYGA" },
  { id: 4, image: "https://img.youtube.com/vi/qxPGQLGpCmA/maxresdefault.jpg", title: "Vigad Gayi Ae", youtubeId: "qxPGQLGpCmA" },
  { id: 5, image: "https://img.youtube.com/vi/Vy7wwoI_Ofo/maxresdefault.jpg", title: "Pehchaan", youtubeId: "Vy7wwoI_Ofo" },
  { id: 6, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop", title: "Poem", youtubeId: "Md0x5Yp5QhM" },
  { id: 7, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop", title: "Apni Duniya", youtubeId: "IyUsygCb8sU" },
  { id: 8, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop", title: "Amn (Peace)", youtubeId: "jb3UqLcIDEQ" }
];

type Tab = "general" | "hero" | "social" | "policy";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Hero Carousel
  const [slides, setSlides] = useState<any[]>([]);

  // General Settings
  const [siteName, setSiteName] = useState("ESSKAYTONALITY");
  const [tagline, setTagline] = useState("Global Music Entertainment");
  const [siteDescription, setSiteDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  // Social Links
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [contactEmail, setContactEmail] = useState("contact@esskaytonality.com");

  // Upload Policy
  const [policyContent, setPolicyContent] = useState("");
  const [policyVersion, setPolicyVersion] = useState("v1");
  const [policyId, setPolicyId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    // Fetch hero carousel
    const { data: heroData } = await supabase.from("settings").select("*").eq("key", "hero_carousel").single();
    if (heroData && heroData.value && heroData.value.length > 1) {
      setSlides(heroData.value);
    } else {
      setSlides(defaultSlides);
    }

    // Fetch general settings
    const { data: generalData } = await supabase.from("settings").select("*").eq("key", "site_general").single();
    if (generalData?.value) {
      setSiteName(generalData.value.site_name || "ESSKAYTONALITY");
      setTagline(generalData.value.tagline || "Global Music Entertainment");
      setSiteDescription(generalData.value.description || "");
      setLogoUrl(generalData.value.logo_url || "");
      setFaviconUrl(generalData.value.favicon_url || "");
    }

    // Fetch social links
    const { data: socialData } = await supabase.from("settings").select("*").eq("key", "social_links").single();
    if (socialData?.value) {
      setInstagram(socialData.value.instagram || "");
      setYoutube(socialData.value.youtube || "https://youtube.com/@esskaytonality");
      setFacebook(socialData.value.facebook || "");
      setTwitter(socialData.value.twitter || "");
      setContactEmail(socialData.value.contact_email || "contact@esskaytonality.com");
    }

    // Fetch upload policy
    const { data: policyData } = await supabase
      .from("upload_policies")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (policyData) {
      setPolicyContent(policyData.content);
      setPolicyVersion(policyData.version);
      setPolicyId(policyData.id);
    } else {
      setPolicyContent("By submitting this release, you confirm that you own all necessary rights to the audio and visual content. You grant ESSKAYTONALITY non-exclusive rights to distribute this content across our platforms.");
      setPolicyVersion("v1");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Save hero carousel
      const { error: heroErr } = await supabase
        .from("settings")
        .upsert({ key: "hero_carousel", value: slides });
      if (heroErr) throw new Error("Failed to save carousel: " + heroErr.message);

      // Save general settings
      const { error: generalErr } = await supabase
        .from("settings")
        .upsert({
          key: "site_general",
          value: { site_name: siteName, tagline, description: siteDescription, logo_url: logoUrl, favicon_url: faviconUrl }
        });
      if (generalErr) throw new Error("Failed to save general settings: " + generalErr.message);

      // Save social links
      const { error: socialErr } = await supabase
        .from("settings")
        .upsert({
          key: "social_links",
          value: { instagram, youtube, facebook, twitter, contact_email: contactEmail }
        });
      if (socialErr) throw new Error("Failed to save social links: " + socialErr.message);

      // Save upload policy
      if (policyContent) {
        const newVersion = `v${Date.now()}`;
        const { error: policyErr } = await supabase
          .from("upload_policies")
          .insert({ version: newVersion, content: policyContent, is_active: true });
        if (policyErr) throw new Error("Failed to save policy: " + policyErr.message);
        setPolicyVersion(newVersion);

        // Deactivate old policy
        if (policyId) {
          await supabase.from("upload_policies").update({ is_active: false }).eq("id", policyId);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "general", label: "General", icon: Settings },
    { key: "hero", label: "Hero Carousel", icon: Play },
    { key: "social", label: "Social Links", icon: Globe },
    { key: "policy", label: "Upload Policy", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <PageMeta title="Platform Settings" description="Admin — configure ESSKAYTONALITY platform settings." noIndex />

      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">
          Site <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-brand-muted-dark text-sm">Manage all platform settings from one place.</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm font-bold text-green-500">Settings saved successfully!</p>
        </motion.div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">{error}</div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-8 bg-brand-card border border-brand-border rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                  : "text-brand-muted-dark hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-primary text-black text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
        </div>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="bg-brand-card p-8 rounded-xl border border-brand-border space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">General Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Site Name</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Site Description (SEO)</label>
            <textarea rows={3} value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Logo URL (light mode)</label>
              <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://esskaytonality.com/logo.png"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
              {logoUrl && <div className="mt-2 w-16 h-16 rounded-lg bg-cover bg-center border border-brand-border" style={{ backgroundImage: `url('${logoUrl}')` }} />}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Favicon URL</label>
              <input type="text" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://esskaytonality.com/favicon.ico"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Carousel Tab */}
      {activeTab === "hero" && (
        <div className="bg-brand-card p-8 rounded-xl border border-brand-border">
          <div className="flex items-center justify-between gap-4 mb-8 border-b border-brand-border pb-6">
            <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">Homepage Carousel Slides</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setSlides(defaultSlides)}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                Reset Defaults
              </button>
              <button onClick={() => setSlides([...slides, { id: `s_${Date.now()}`, title: "New Release", image: "", youtubeId: "" }])}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                + Add Slide
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {slides.map((slide, idx) => (
              <div key={slide.id} className="p-6 bg-black/40 border border-brand-border rounded-xl relative group">
                <button onClick={() => setSlides(slides.filter((s: any) => s.id !== slide.id))}
                  className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Slide Title</label>
                    <input type="text" value={slide.title} onChange={(e) => {
                      const updated = [...slides];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setSlides(updated);
                    }} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:border-brand-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2 flex items-center gap-2">
                      <Play className="w-3 h-3 text-red-500" /> YouTube Video ID
                    </label>
                    <input type="text" value={slide.youtubeId} onChange={(e) => {
                      const updated = [...slides];
                      updated[idx] = { ...updated[idx], youtubeId: e.target.value };
                      setSlides(updated);
                    }} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:border-red-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 text-purple-500" /> Background Image URL
                  </label>
                  <input type="text" value={slide.image} onChange={(e) => {
                    const updated = [...slides];
                    updated[idx] = { ...updated[idx], image: e.target.value };
                    setSlides(updated);
                  }} className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:border-purple-500/50 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === "social" && (
        <div className="bg-brand-card p-8 rounded-xl border border-brand-border space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">Social Links & Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Instagram URL</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/esskaytonality"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">YouTube URL</label>
              <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@esskaytonality"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Facebook URL</label>
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/esskaytonality"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Twitter / X URL</label>
              <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/esskaytonality"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Contact Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
          </div>
        </div>
      )}

      {/* Policy Tab */}
      {activeTab === "policy" && (
        <div className="bg-brand-card p-8 rounded-xl border border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-brand-accent pl-4">Upload Policy</h2>
            <span className="text-xs font-bold text-brand-muted-dark uppercase tracking-wider border border-brand-border rounded-full px-3 py-1">
              Current: {policyVersion}
            </span>
          </div>

          <p className="text-sm text-brand-muted-dark">
            This policy is shown to artists when they submit a release. They must accept it before uploading.
            When you save, the current policy is archived and a new version is created.
          </p>

          <div>
            <label className="block text-xs font-bold tracking-widest text-brand-muted-dark uppercase mb-2">Policy Text</label>
            <textarea
              rows={10}
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white text-sm leading-relaxed focus:outline-none focus:border-amber-500/50"
              placeholder="Enter the upload policy text that artists must accept..."
            />
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs text-amber-500 font-medium">
              ⚠️ Aap jo bhi policy text likhenge, wo agli dafa artist ko upload karte waqt dikhe ga.
              Purani policy archive ho jaye gi aur nayi version save ho jaye gi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
