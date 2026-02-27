"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";

export default function AuthorResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    
    const initAuth = async () => {
      // Check for PKCE code in URL params (newer Supabase flow)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      // Check for hash-based tokens (older flow)
      const hash = window.location.hash;
      const hasHashToken = hash.includes('type=recovery') || hash.includes('access_token');
      
      // If we have a code, exchange it for a session
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (mounted) {
            if (error) {
              console.error('Code exchange error:', error);
              setIsValidating(false);
              setSessionError(true);
            } else {
              setIsValidating(false);
              setSessionError(false);
            }
          }
          return;
        } catch (err) {
          console.error('Code exchange exception:', err);
          if (mounted) {
            setIsValidating(false);
            setSessionError(true);
          }
          return;
        }
      }
      
      // If no code and no hash tokens, check for existing session
      if (!hasHashToken) {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setIsValidating(false);
          if (!session) {
            setSessionError(true);
          }
        }
        return;
      }

      // We have hash tokens - listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;
        
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setIsValidating(false);
          setSessionError(false);
        }
      });

      // Give Supabase time to process the hash
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!mounted) {
        subscription.unsubscribe();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setIsValidating(false);
      
      if (!session) {
        setSessionError(true);
      }

      return () => subscription.unsubscribe();
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/author/auth/login");
    }, 3000);
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
          
          {isValidating ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-calm-500/30 border-t-calm-500 animate-spin"></div>
              <p className="text-stone-400">Validating reset link...</p>
            </div>
          ) : sessionError ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#E4E9F2] mb-2">Invalid or Expired Link</h1>
              <p className="text-stone-400 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link 
                href="/author/auth/forgot-password" 
                className="inline-block py-3 px-6 bg-calm-600 hover:bg-calm-500 text-white font-medium rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(47,149,104,0.3)] hover:shadow-[0_0_30px_rgba(47,149,104,0.5)]"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#E4E9F2] mb-2">Password Reset Successful!</h1>
              <p className="text-stone-400 mb-6">
                Your password has been updated. You will be redirected to the login page shortly.
              </p>
              <Link href="/author/auth/login" className="text-calm-400 hover:text-calm-300 font-medium transition-colors">
                Go to login →
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-[#E4E9F2]">Set New Password</h1>
                <p className="text-stone-400">Enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
                    placeholder="••••••••"
                    minLength={6}
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
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
