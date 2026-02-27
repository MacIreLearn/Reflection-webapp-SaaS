"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
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

    // First check if user exists
    try {
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "user" }),
      });

      if (!checkRes.ok) {
        const data = await checkRes.json();
        if (checkRes.status === 404) {
          setNotRegistered(true);
          setError(data.message || "No account found with this email address.");
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Continue even if check fails - Supabase will handle it
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery&next=/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-calm-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-calm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and click the link to reset your password.
          </p>
          <p className="text-sm text-stone-500 mb-4">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <Link href="/auth/login" className="text-calm-600 hover:text-calm-500 font-medium">
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot your password?</h1>
        <p className="text-stone-600 dark:text-stone-400 text-center mb-6">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-calm-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              {notRegistered && (
                <Link 
                  href="/auth/signup" 
                  className="block mt-2 text-sm text-calm-600 hover:text-calm-500 font-medium"
                >
                  Create an account →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-calm-600 hover:bg-calm-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-calm-600 hover:text-calm-500 font-medium">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
