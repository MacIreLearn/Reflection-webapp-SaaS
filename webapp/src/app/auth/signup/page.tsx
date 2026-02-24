"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-sm py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Check Your Email</h1>
        <p className="text-stone-600 dark:text-stone-400">
          We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
        </p>
        <Link href="/auth/login" className="btn-secondary inline-block">Back to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-8 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Start Journaling</h1>
        <p className="text-stone-600 dark:text-stone-400">Create your free account</p>
      </div>
      <form onSubmit={handleSignup} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-stone-600 dark:text-stone-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-calm-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
