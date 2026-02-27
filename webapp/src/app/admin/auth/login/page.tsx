"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/20 mb-4">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-[#E4E9F2]">Admin Login</h1>
            <p className="text-stone-400">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Username</label>
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                placeholder="admin" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                placeholder="••••••••" 
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
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-medium rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          <Link href="/" className="hover:text-stone-300 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
