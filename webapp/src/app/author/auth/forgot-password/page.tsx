"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";

export default function AuthorForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotRegistered(false);

    // First check if author exists
    try {
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "author" }),
      });

      if (!checkRes.ok) {
        const data = await checkRes.json();
        if (checkRes.status === 404) {
          setNotRegistered(true);
          setError(data.message || "No author account found with this email address.");
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Continue even if check fails - Supabase will handle it
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/author/auth/callback?type=recovery&next=/author/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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
          
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-calm-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-calm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#E4E9F2] mb-2">Check your email</h1>
              <p className="text-stone-400 mb-6">
                We&apos;ve sent a password reset link to <strong className="text-[#E4E9F2]">{email}</strong>. 
                Please check your inbox and click the link to reset your password.
              </p>
              <p className="text-sm text-stone-500 mb-4">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <Link href="/author/auth/login" className="text-calm-400 hover:text-calm-300 font-medium transition-colors">
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-[#E4E9F2]">Forgot Password</h1>
                <p className="text-stone-400">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                    placeholder="author@example.com"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-400">{error}</p>
                    {notRegistered && (
                      <Link 
                        href="/author/auth/signup" 
                        className="block mt-2 text-sm text-calm-400 hover:text-calm-300 font-medium transition-colors"
                      >
                        Apply to become an author →
                      </Link>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-calm-600 hover:bg-calm-500 disabled:bg-calm-600/50 text-white font-medium rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(47,149,104,0.3)] hover:shadow-[0_0_30px_rgba(47,149,104,0.5)]"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-center text-sm text-stone-400">
                  Remember your password?{" "}
                  <Link href="/author/auth/login" className="text-calm-400 hover:text-calm-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
