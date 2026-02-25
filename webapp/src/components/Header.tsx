"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Search, Settings, LogOut, Menu, Plus, Edit3, Book } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [todayEntryId, setTodayEntryId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/entries")
        .then(r => r.json())
        .then(data => {
          if (data.entries && data.entries.length > 0) {
            const firstEntry = data.entries[0];
            if (new Date(firstEntry.date).toDateString() === new Date().toDateString()) {
              setTodayEntryId(firstEntry.id);
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between p-4 sm:p-6">
        
        {/* Floating Logo Top Left */}
        <Link href="/" className="pointer-events-auto flex items-center gap-3 text-xl font-bold text-stone-800 dark:text-[#E4E9F2] drop-shadow-lg hover:scale-105 transition-transform">
          <Logo className="h-10 w-10 drop-shadow-[0_0_15px_rgba(130,203,168,0.5)]" />
          <span className="hidden sm:block tracking-wide">Reflection</span>
        </Link>

        {/* Floating Hover-Menu Top Right */}
        <div className="pointer-events-auto relative group">
          
          {/* Hamburger Trigger */}
          <button className="flex items-center justify-center p-3 rounded-full bg-white/40 dark:bg-[#0a0f1a]/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg text-stone-800 dark:text-[#E4E9F2] transition-all duration-300 hover:bg-white/60 dark:hover:bg-[#0a0f1a]/80 hover:shadow-[0_0_20px_rgba(47,149,104,0.3)]">
            <Menu className="h-6 w-6" />
          </button>

          {/* Dropdown Menu (Fades in on hover) */}
          <div className="absolute right-0 top-full pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-[-10px] group-hover:translate-y-0">
            <div className="p-2 bg-white/90 dark:bg-[#04070D]/90 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col gap-1">
              
              {user ? (
                <>
                  <Link href="/journal" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <Book className="h-4 w-4 text-calm-500" />
                    Journal Dashboard
                  </Link>
                  
                  {todayEntryId ? (
                    <Link href={`/journal/${todayEntryId}`} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-calm-600 dark:text-calm-400 hover:bg-calm-50 dark:hover:bg-calm-900/30 rounded-xl transition-colors">
                      <Edit3 className="h-4 w-4" />
                      Edit Today's Entry
                    </Link>
                  ) : (
                    <Link href="/journal/new" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                      <Plus className="h-4 w-4 text-calm-500" />
                      New Entry
                    </Link>
                  )}
                  
                  <Link href="/insights" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <BarChart3 className="h-4 w-4 text-amber-500" />
                    Insights
                  </Link>
                  
                  <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <Search className="h-4 w-4 text-blue-500" />
                    Search
                  </Link>
                  
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <Settings className="h-4 w-4 text-stone-500" />
                    Settings
                  </Link>
                  
                  <div className="h-px w-full bg-stone-200 dark:bg-white/10 my-1"></div>
                  
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors w-full text-left">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="flex items-center justify-center m-1 px-4 py-3 text-sm font-bold text-[#E4E9F2] bg-calm-600 hover:bg-calm-500 rounded-xl transition-colors shadow-lg shadow-calm-600/20">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
