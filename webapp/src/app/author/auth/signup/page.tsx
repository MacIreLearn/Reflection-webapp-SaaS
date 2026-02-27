"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";

export default function AuthorSignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    slug: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    
    // Create Supabase auth account
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/author/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create author profile
    const res = await fetch("/api/author/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        slug: formData.slug,
        bio: formData.bio,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create author profile");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="card bg-[#04070D]/80 backdrop-blur-xl border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#E4E9F2] mb-2">Request Submitted!</h2>
            <p className="text-stone-400 mb-4">
              Your author application has been submitted for review.
            </p>
            <p className="text-stone-400 mb-6">
              We&apos;ll send an email to <strong className="text-[#E4E9F2]">{formData.email}</strong> once your application is approved or if we need more information.
            </p>
            <Link href="/" className="text-calm-400 hover:text-calm-300 transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#04070D] border border-white/10 shadow-[0_0_30px_rgba(47,149,104,0.15)] group-hover:shadow-[0_0_40px_rgba(47,149,104,0.3)] transition-shadow duration-500">
              <Logo className="h-8 w-8 drop-shadow-[0_0_10px_rgba(130,203,168,0.8)]" />
            </div>
            <span className="text-2xl font-bold text-[#E4E9F2]">Reflection</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card bg-[#04070D]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-calm-500/50 to-transparent"></div>
          
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-[#E4E9F2]">Become an Author</h1>
            <p className="text-stone-400">Create and share your content with the world</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                placeholder="Jane Doe" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Author URL</label>
              <div className="flex items-center">
                <span className="px-3 py-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-stone-500 text-sm">
                  /author/
                </span>
                <input 
                  type="text" 
                  required 
                  value={formData.slug} 
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))} 
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-r-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                  placeholder="jane-doe" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                placeholder="author@example.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
              <input 
                type="password" 
                required 
                minLength={8}
                value={formData.password} 
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                placeholder="••••••••" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Bio (optional)</label>
              <textarea 
                value={formData.bio} 
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} 
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all resize-none"
                placeholder="Tell readers about yourself..." 
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 px-4 bg-calm-600 hover:bg-calm-500 disabled:bg-calm-600/50 text-white font-medium rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(47,149,104,0.3)] hover:shadow-[0_0_30px_rgba(47,149,104,0.5)]"
            >
              {loading ? "Submitting request..." : "Request for Approval"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-stone-400">
              Already an author?{" "}
              <Link href="/author/auth/login" className="text-calm-400 hover:text-calm-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
