"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Mic2, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"user" | "artist" | null>(null);
  
  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRoleSelect = (selectedRole: "user" | "artist") => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // In a real app, you might want to show a success message or redirect to a verification page
      window.location.href = "/";
    }
  };

  const handleGoogleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "consent",
        },
      },
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-brand-bg select-none">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-20%] w-[60%] h-[60%] bg-brand-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            Join <span className="text-gradient">Esskaytonality</span>
          </h1>
          <p className="text-brand-muted text-sm md:text-base">
            {step === 1 ? "How would you like to join the platform?" : `Create your ${role === 'artist' ? 'Artist' : 'Listener'} account`}
          </p>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* User/Listener Card */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => handleRoleSelect("user")}
                  className="glass p-8 rounded-3xl border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-colors">
                    <User className="w-8 h-8 text-white group-hover:text-brand-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Listener</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Create playlists, discover premium tracks, and follow your favorite artists.
                  </p>
                  <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-brand-primary">
                    Select <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Artist Card */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => handleRoleSelect("artist")}
                  className="glass p-8 rounded-3xl border border-white/10 hover:border-brand-accent/50 cursor-pointer transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-accent/20 transition-colors">
                    <Mic2 className="w-8 h-8 text-white group-hover:text-brand-accent transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Artist</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    Upload your music, view detailed analytics, and connect with your fanbase.
                  </p>
                  <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-brand-accent">
                    Select <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* STEP 2: REGISTRATION FORM */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative"
              >
                <button 
                  onClick={() => setStep(1)}
                  className="absolute top-6 left-6 text-brand-muted hover:text-white flex items-center text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                <div className="mt-8 mb-8 space-y-3">
                  {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium text-center">
                      {error}
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={handleGoogleRegister}
                    className="w-full relative flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white text-black font-bold text-sm tracking-wide shadow-lg hover:bg-neutral-100 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-xs font-bold tracking-widest text-brand-muted uppercase">Or create via email</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        placeholder={role === 'artist' ? "Stage Name / Band Name" : "Full Name"}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-brand-muted group-focus-within:text-brand-primary transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        placeholder="Create Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-muted hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full relative flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-black font-black uppercase tracking-wider text-sm hover:opacity-90 transition-opacity mt-4 disabled:opacity-50 ${
                      role === 'artist' 
                        ? 'bg-gradient-to-r from-brand-accent to-purple-500 shadow-[0_0_20px_rgba(157,78,221,0.3)]' 
                        : 'bg-gradient-to-r from-brand-primary to-blue-500 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                    }`}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create {role === 'artist' ? 'Artist' : ''} Account <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <p className="text-center text-sm text-brand-muted mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-white hover:text-brand-primary transition-colors">
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
