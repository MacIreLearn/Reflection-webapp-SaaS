"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
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

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  };

  if (isValidating) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-calm-500/30 border-t-calm-500 animate-spin"></div>
          <p className="text-stone-600 dark:text-stone-400">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Invalid or Expired Link</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            href="/auth/forgot-password" 
            className="inline-block py-2 px-4 bg-calm-600 hover:bg-calm-500 text-white font-medium rounded-lg transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <Link href="/auth/login" className="text-calm-600 hover:text-calm-500 font-medium">
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-calm-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-calm-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-calm-600 hover:bg-calm-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
