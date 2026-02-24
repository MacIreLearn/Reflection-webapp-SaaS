"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, BarChart3, Search, Settings, LogOut, Menu, X } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md dark:border-stone-700 dark:bg-stone-900/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-calm-700 dark:text-calm-400">
          <BookOpen className="h-5 w-5" />
          Reflection
        </Link>

        {user ? (
          <>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link href="/journal" className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                Journal
              </Link>
              <Link href="/journal/new" className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                New Entry
              </Link>
              <Link href="/insights" className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                <BarChart3 className="inline h-4 w-4 mr-1" />
                Insights
              </Link>
              <Link href="/search" className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </Link>
              <Link href="/settings" className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                <Settings className="inline h-4 w-4" />
              </Link>
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                <LogOut className="inline h-4 w-4" />
              </button>
            </nav>
            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">
            Sign In
          </Link>
        )}
      </div>

      {menuOpen && user && (
        <nav className="border-t border-stone-200 bg-white px-4 py-2 sm:hidden dark:border-stone-700 dark:bg-stone-900">
          <Link href="/journal" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">Journal</Link>
          <Link href="/journal/new" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">New Entry</Link>
          <Link href="/insights" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">Insights</Link>
          <Link href="/search" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">Search</Link>
          <Link href="/settings" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">Settings</Link>
          <button onClick={handleLogout} className="block w-full text-left rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800">Logout</button>
        </nav>
      )}
    </header>
  );
}
