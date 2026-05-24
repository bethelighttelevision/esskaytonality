"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowLeft, Mic2, CheckCircle2, Edit2 } from "lucide-react";
import Link from "next/link";
import PageMeta from "@/components/seo/PageMeta";

const defaultArtists = [
  {
    id: "sahir-alam",
    name: "SAHIR ALAM",
    genre: "INDIE / POP / CINEMATIC",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop",
    profile: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
    bio: "Sahir Alam, founder and owner of Esskaytonality, performing under the stage name Esskay Tonality. A multi-talented indie pop and cinematic music composer, producer, and singer-songwriter. Known for his deep atmospheric soundscapes, emotionally charged vocals, and cinematic original releases, Sahir shapes new cultural paradigms through sound.",
    listeners: "135",
    streaming: {
      spotify: "https://open.spotify.com/artist/4O0MQNnVa0IKNlSziBnTE8",
      apple: "https://music.apple.com/sa/artist/esskay-tonality/1546440801",
      deezer: "https://www.deezer.com/en/artist/117961812"
    },
    albums: [
      { title: "Qaid Qalandar", year: "2024", cover: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg", youtubeId: "b-yMQjOqpHQ" },
      { title: "Saiyaara OST", year: "2023", cover: "https://img.youtube.com/vi/gCsv3X5ofhI/maxresdefault.jpg", youtubeId: "gCsv3X5ofhI" },
      { title: "Tere Bina", year: "2023", cover: "https://img.youtube.com/vi/QNmwgrqbYGA/maxresdefault.jpg", youtubeId: "QNmwgrqbYGA" }
    ],
    popular: [
      { title: "Qaid Qalandar", streams: "4.5M", time: "4:12", youtubeId: "b-yMQjOqpHQ" },
      { title: "Saiyaara OST", streams: "3.2M", time: "3:45", youtubeId: "gCsv3X5ofhI" },
      { title: "Tere Bina", streams: "2.8M", time: "3:20", youtubeId: "QNmwgrqbYGA" },
      { title: "Vigad Gayi Ae", streams: "1.9M", time: "3:58", youtubeId: "qxPGQLGpCmA" },
      { title: "Pehchaan", streams: "1.5M", time: "4:05", youtubeId: "Vy7wwoI_Ofo" }
    ]
  },
  {
    id: "the-weeknd",
    name: "THE WEEKND",
    genre: "R&B / POP",
    banner: "https://images.unsplash.com/photo-1540039155732-d68b54f593e9?q=80&w=2069&auto=format&fit=crop",
    profile: "https://images.unsplash.com/photo-1571343753761-0d32c96b7978?q=80&w=2070&auto=format&fit=crop",
    bio: "Abel Tesfaye, known as The Weeknd, is an award-winning artist known for his sonic versatility and dark lyricism.",
    listeners: "105M",
    streaming: {
      spotify: "https://open.spotify.com/artist/1XyoP618w2Lrsc5K1Q261c",
      apple: "https://music.apple.com/us/artist/the-weeknd/479756766",
      deezer: "https://www.deezer.com/en/artist/1157833"
    },
    albums: [
      { title: "Dawn FM", year: "2022", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop", youtubeId: "4NRXx6caT94" },
      { title: "After Hours", year: "2020", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop", youtubeId: "XXYlFuWEuKI" }
    ],
    popular: [
      { title: "Blinding Lights", streams: "3.5B", time: "3:20", youtubeId: "4NRXx6caT94" },
      { title: "Starboy", streams: "2.8B", time: "3:50", youtubeId: "34Na4j8AVgA" },
      { title: "Save Your Tears", streams: "2.1B", time: "3:35", youtubeId: "XXYlFuWEuKI" }
    ]
  }
];

export default function ManageArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingArtist, setCurrentEditingArtist] = useState<any>(null);
  const supabase = createClient();

  // Form Field State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    genre: "",
    bio: "",
    listeners: "",
    profile: "",
    banner: "",
    spotify: "",
    apple: "",
    deezer: "",
    albums: [] as any[],
    popular: [] as any[]
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "artists_data")
      .single();

    if (data && data.value) {
      setArtists(data.value);
    } else {
      setArtists(defaultArtists);
      await supabase
        .from("settings")
        .upsert({ key: "artists_data", value: defaultArtists });
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setCurrentEditingArtist(null);
    setFormData({
      id: "",
      name: "",
      genre: "INDIE / POP / CINEMATIC",
      bio: "",
      listeners: "1.0M",
    profile: "/sahir-alam.webp",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop",
      spotify: "",
      apple: "",
      deezer: "",
      albums: [
        { title: "New Album", year: "2024", cover: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg", youtubeId: "b-yMQjOqpHQ" }
      ],
      popular: [
        { title: "Track One", streams: "1.2M", time: "3:45", youtubeId: "b-yMQjOqpHQ" }
      ]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (artist: any) => {
    setCurrentEditingArtist(artist);
    setFormData({
      id: artist.id,
      name: artist.name,
      genre: artist.genre,
      bio: artist.bio || "",
      listeners: artist.listeners || "1.0M",
      profile: artist.profile || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
      banner: artist.banner || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop",
      spotify: artist.streaming?.spotify || "",
      apple: artist.streaming?.apple || "",
      deezer: artist.streaming?.deezer || "",
      albums: artist.albums || [],
      popular: artist.popular || []
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Artist Name is required!");

    let artistId = formData.id;
    if (!artistId) {
      artistId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const updatedArtistObj = {
      id: artistId,
      name: formData.name.toUpperCase(),
      genre: formData.genre.toUpperCase(),
      bio: formData.bio,
      listeners: formData.listeners,
      profile: formData.profile,
      banner: formData.banner,
      streaming: {
        spotify: formData.spotify,
        apple: formData.apple,
        deezer: formData.deezer
      },
      albums: formData.albums,
      popular: formData.popular,
      isStatic: true
    };

    let updatedList = [...artists];
    const existingIndex = updatedList.findIndex(a => a.id === artistId);

    if (existingIndex > -1) {
      updatedList[existingIndex] = updatedArtistObj;
    } else {
      updatedList.push(updatedArtistObj);
    }

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "artists_data", value: updatedList });

    if (!error) {
      setArtists(updatedList);
      setIsModalOpen(false);
      alert("Rockstar saved successfully!");
    } else {
      alert("Error saving Rockstar: " + error.message);
    }
  };

  const handleDelete = async (artistId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently remove this artist from the platform database?");
    if (!confirmDelete) return;

    const filtered = artists.filter(a => a.id !== artistId);

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "artists_data", value: filtered });

    if (!error) {
      setArtists(filtered);
      alert("Artist permanently deleted from platform!");
    } else {
      alert("Error deleting artist: " + error.message);
    }
  };

  // Add Dynamic Field Handlers
  const addFormTrack = () => {
    setFormData({
      ...formData,
      popular: [...formData.popular, { title: "New Song", streams: "100K", time: "3:30", youtubeId: "b-yMQjOqpHQ" }]
    });
  };

  const removeFormTrack = (idx: number) => {
    const filtered = formData.popular.filter((_, i) => i !== idx);
    setFormData({ ...formData, popular: filtered });
  };

  const updateFormTrack = (idx: number, field: string, val: string) => {
    const updated = formData.popular.map((track, i) => {
      if (i === idx) {
        return { ...track, [field]: val };
      }
      return track;
    });
    setFormData({ ...formData, popular: updated });
  };

  const addFormAlbum = () => {
    setFormData({
      ...formData,
      albums: [...formData.albums, { title: "New Album", year: "2024", cover: "https://img.youtube.com/vi/b-yMQjOqpHQ/maxresdefault.jpg", youtubeId: "b-yMQjOqpHQ" }]
    });
  };

  const removeFormAlbum = (idx: number) => {
    const filtered = formData.albums.filter((_, i) => i !== idx);
    setFormData({ ...formData, albums: filtered });
  };

  const updateFormAlbum = (idx: number, field: string, val: string) => {
    const updated = formData.albums.map((album, i) => {
      if (i === idx) {
        return { ...album, [field]: val };
      }
      return album;
    });
    setFormData({ ...formData, albums: updated });
  };

  return (
    <div className="max-w-6xl mx-auto pt-8 px-4 md:px-0">
      <PageMeta title="Manage Artists" description="Admin — manage ESSKAYTONALITY artist roster." noIndex />
      <Link href="/admin/dashboard" className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-muted-dark hover:text-white transition-colors mb-8 w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Master Control
      </Link>

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter mb-1">
              Manage <span className="text-purple-500">Artists</span>
            </h1>
            <p className="text-brand-muted-dark text-sm">Create, edit, and delete dynamic verified artist accounts on the platform.</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white rounded-lg px-5 py-2.5 font-medium uppercase tracking-wider transition-all text-sm w-fit"
        >
          <Plus className="w-4 h-4" /> Add New Rockstar
        </button>
      </div>

      <div className="bg-brand-card rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-brand-border">
              <tr>
                <th className="p-6 text-xs font-medium text-brand-muted-dark uppercase tracking-wider">Artist ID</th>
                <th className="p-6 text-xs font-medium text-brand-muted-dark uppercase tracking-wider">Stage Name</th>
                <th className="p-6 text-xs font-medium text-brand-muted-dark uppercase tracking-wider">Genre</th>
                <th className="p-6 text-xs font-medium text-brand-muted-dark uppercase tracking-wider">Listeners</th>
                <th className="p-6 text-xs font-medium text-brand-muted-dark uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted-dark">Loading artists...</td>
                </tr>
              ) : artists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-brand-muted-dark">No verified artists found.</td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 text-xs text-brand-muted-dark font-mono uppercase tracking-wider">{artist.id}</td>
                    <td className="p-6 text-sm font-bold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cover bg-center border border-white/10 shrink-0" style={{ backgroundImage: `url('${artist.profile}')` }} />
                      {artist.name || "Unknown Artist"}
                      <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    </td>
                    <td className="p-6 text-sm text-brand-muted-dark">{artist.genre || "N/A"}</td>
                    <td className="p-6 text-sm text-brand-muted-dark">{artist.listeners || "0"}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(artist)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(artist.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Permanently Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Sliding Modal Dynamic Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">
              {currentEditingArtist ? "Edit Rockstar Details" : "Add Dynamic Rockstar"}
            </h2>

            <form onSubmit={handleSave} className="space-y-8 text-sm">
              
              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Stage / Rockstar Name *</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. SAHIR ALAM"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Genre / Style Tagline</label>
                  <input 
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="e.g. INDIE / POP / CINEMATIC"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Monthly Listeners Count</label>
                  <input 
                    type="text"
                    value={formData.listeners}
                    onChange={(e) => setFormData({ ...formData, listeners: e.target.value })}
                    placeholder="e.g. 2.5M"
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Profile Avatar Image URL</label>
                  <input 
                    type="text"
                    value={formData.profile}
                    onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Hero Profile Banner Image URL</label>
                  <input 
                    type="text"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted-dark mb-2">Biography (Bio)</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe their story, sound, and platform culture context..."
                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Streaming Platforms Links */}
              <div className="pt-6 border-t border-brand-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Streaming Platforms Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted-dark mb-2">Spotify Link</label>
                    <input 
                      type="text"
                      value={formData.spotify}
                      onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                      placeholder="https://open.spotify.com/artist/..."
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted-dark mb-2">Apple Music Link</label>
                    <input 
                      type="text"
                      value={formData.apple}
                      onChange={(e) => setFormData({ ...formData, apple: e.target.value })}
                      placeholder="https://music.apple.com/..."
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted-dark mb-2">Deezer Link</label>
                    <input 
                      type="text"
                      value={formData.deezer}
                      onChange={(e) => setFormData({ ...formData, deezer: e.target.value })}
                      placeholder="https://www.deezer.com/..."
                      className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Popular Tracks list (Full-length background audio player compatible) */}
              <div className="pt-6 border-t border-brand-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Popular Tracks (Audio MP3 player)</h3>
                  <button 
                    type="button"
                    onClick={addFormTrack}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Track
                  </button>
                </div>
                
                {formData.popular.map((track, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 items-center bg-black/20 p-4 rounded-xl border border-brand-border relative">
                    <button 
                      type="button" 
                      onClick={() => removeFormTrack(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Track Name</label>
                      <input 
                        type="text"
                        value={track.title}
                        onChange={(e) => updateFormTrack(idx, "title", e.target.value)}
                        placeholder="e.g. Qaid Qalandar"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Streams Count</label>
                      <input 
                        type="text"
                        value={track.streams}
                        onChange={(e) => updateFormTrack(idx, "streams", e.target.value)}
                        placeholder="e.g. 4.5M"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full md:w-24">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Duration</label>
                      <input 
                        type="text"
                        value={track.time}
                        onChange={(e) => updateFormTrack(idx, "time", e.target.value)}
                        placeholder="e.g. 4:12"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">YouTube Audio Video ID</label>
                      <input 
                        type="text"
                        value={track.youtubeId}
                        onChange={(e) => updateFormTrack(idx, "youtubeId", e.target.value)}
                        placeholder="e.g. b-yMQjOqpHQ"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Discography list (Cinematic Video overlay player compatible) */}
              <div className="pt-6 border-t border-brand-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Discography Albums (Music Videos)</h3>
                  <button 
                    type="button"
                    onClick={addFormAlbum}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Album
                  </button>
                </div>
                
                {formData.albums.map((album, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 items-center bg-black/20 p-4 rounded-xl border border-brand-border relative">
                    <button 
                      type="button" 
                      onClick={() => removeFormAlbum(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Album Title</label>
                      <input 
                        type="text"
                        value={album.title}
                        onChange={(e) => updateFormAlbum(idx, "title", e.target.value)}
                        placeholder="e.g. Saiyaara OST"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Release Year</label>
                      <input 
                        type="text"
                        value={album.year}
                        onChange={(e) => updateFormAlbum(idx, "year", e.target.value)}
                        placeholder="e.g. 2023"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">Cover Image URL</label>
                      <input 
                        type="text"
                        value={album.cover}
                        onChange={(e) => updateFormAlbum(idx, "cover", e.target.value)}
                        placeholder="https://img.youtube.com/vi/..."
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <label className="block text-[10px] uppercase font-bold text-brand-muted-dark mb-1">YouTube Video ID</label>
                      <input 
                        type="text"
                        value={album.youtubeId}
                        onChange={(e) => updateFormAlbum(idx, "youtubeId", e.target.value)}
                        placeholder="e.g. gCsv3X5ofhI"
                        className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Submission Buttons */}
              <div className="pt-8 border-t border-brand-border flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-5 py-2.5 font-medium uppercase tracking-wider transition-colors text-white border border-white/20 hover:border-white/40"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg px-5 py-2.5 font-medium uppercase tracking-wider transition-all"
                >
                  Save Rockstar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
