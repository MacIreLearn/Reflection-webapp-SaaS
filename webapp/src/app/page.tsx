import Link from "next/link";
import { ArrowRight, Sparkles, LineChart, Shield, Share2, CheckCircle2, ChevronDown, BookOpen, Clock, Download } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { AffirmationCard } from "@/components/AffirmationCard";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  return (
    <div className="relative flex flex-col gap-32 pb-24 pt-12 overflow-hidden">
      
      <AnimatedBackground />
      
      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 pt-12 md:pt-20">
        
        {/* Central Floating Icon Anchor */}
        <div className="mb-10 relative flex items-center justify-center w-20 h-20 rounded-3xl bg-[#04070D] border border-white/10 shadow-[0_0_50px_rgba(47,149,104,0.15)] animate-fade-in-up hover:shadow-[0_0_60px_rgba(47,149,104,0.3)] transition-shadow duration-500">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <Logo className="h-12 w-12 drop-shadow-[0_0_15px_rgba(130,203,168,0.8)]" />
        </div>

        {/* Glowing Random Affirmation Banner */}
        <div className="mb-8 z-20 flex justify-center max-w-3xl mx-auto">
          <AffirmationCard />
        </div>
        
        {/* H1 - Typography extracted exactly from Landio: weight 500, tracking -1.6px, #E4E9F2 */}
        <h1 className="max-w-[936px] text-5xl md:text-[80px] font-medium tracking-[-0.02em] text-[#E4E9F2] mb-6 leading-[1.1] animate-fade-in-up animation-delay-2000">
          Reflect. Track. <br className="hidden md:block" />
          <span className="italic font-serif text-stone-400 font-light">Grow with purpose.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-stone-400 mb-12 animate-fade-in-up animation-delay-4000 font-light leading-relaxed">
          A calming daily journal to track your wellbeing, capture reflections, and build self-awareness — all in under 3 minutes.
        </p>
        
        {/* CTA Buttons - Glassmorphic depth instead of solid fills */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto z-10 animate-fade-in-up">
          {isLoggedIn ? (
            <Link href="/journal/new" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-[#E4E9F2] bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(47,149,104,0.2)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-calm-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              Today&apos;s Entry <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/auth/signup" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-[#E4E9F2] bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(47,149,104,0.2)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-calm-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                Start Journaling Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-stone-400 hover:text-[#E4E9F2] transition-colors rounded-full hover:bg-white/5">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Floating Note - Dark Mode Glassmorphism Polish */}
        <div className="mt-16 lg:mt-24 text-left w-full max-w-sm mx-auto card border border-white/5 border-l-4 border-l-calm-600 shadow-[0_20px_40px_rgba(0,0,0,0.4)] bg-[#04070D]/80 backdrop-blur-xl animate-fade-in-up hover:-translate-y-2 transition-transform duration-300 z-20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-calm-600/50 to-transparent"></div>
          <p className="text-xs font-bold tracking-[0.15em] text-calm-500 uppercase mb-2">Built for mindfulness</p>
          <p className="text-sm italic text-stone-300 mb-4 font-serif">
            &quot;The experience must be fast, calming, and usable in under 3 minutes. It&apos;s about consistency over perfection.&quot;
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0a0f1a] to-calm-900 border border-white/10 flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 rounded-full bg-calm-400 shadow-[0_0_10px_rgba(80,176,131,1)]"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#E4E9F2]">Core Philosophy</p>
              <p className="text-xs text-stone-500 tracking-wide">Reflection App Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION (From Requirements) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Daily Reflection", desc: "Quick 3-minute entries with mood, energy, and stress tracking plus guided prompts.", icon: BookOpen },
            { title: "Private & Secure", desc: "Your entries are private by default with row-level security. Data encrypted at rest and in transit. GDPR compliant with full data ownership.", icon: Shield },
            { title: "Share Selectively", desc: "Generate secure view-only links for entries you want to share. Revoke anytime.", icon: Share2 },
          ].map((b, i) => (
            <div key={i} className="card hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl bg-white/60 dark:bg-stone-800/60">
              <div className="h-14 w-14 rounded-2xl bg-calm-100 dark:bg-calm-900/40 flex items-center justify-center mb-6 border border-calm-200 dark:border-calm-800">
                <b.icon className="h-7 w-7 text-calm-600" />
              </div>
              <h4 className="text-xl font-bold mb-3">{b.title}</h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SERVICES SECTION (Adapted for Insights/Export) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">Insights & Data</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">Track Your Growth Over Time</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-8 items-center">
          <div className="card border-t-4 border-t-calm-500 shadow-lg bg-white/80 dark:bg-stone-800/80 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-calm-100 dark:bg-calm-900/40 flex items-center justify-center mb-4 border border-calm-200 dark:border-calm-800">
              <LineChart className="h-6 w-6 text-calm-600"/>
            </div>
            <h4 className="text-xl font-bold mb-2">Wellness Insights</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400">Track mood trends, energy patterns, and stress levels with beautiful auto-updating charts and a daily streak counter.</p>
          </div>
          <div className="card border-t-4 border-t-stone-400 shadow-lg bg-white/80 dark:bg-stone-800/80 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-stone-100 dark:bg-stone-900/40 flex items-center justify-center mb-4 border border-stone-200 dark:border-stone-700">
              <Download className="h-6 w-6 text-stone-500"/>
            </div>
            <h4 className="text-xl font-bold mb-2">Export Your Data</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400">Download your journal as PDF or CSV. Your data is yours to keep, always.</p>
          </div>
        </div>
      </section>

      {/* 4. PROCESS SECTION (Daily/Weekly Flow) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">User Flow</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-stone-300 dark:bg-stone-700 z-0"></div>
          
          {[
            { step: "01", title: "Daily Reminder", desc: "Gentle email reminders via Resend API to keep your journaling streak alive." },
            { step: "02", title: "Complete Entry", desc: "Open the app, tap &apos;Today&apos;, complete the 3-minute wellness sliders and reflection prompts, then save." },
            { step: "03", title: "Weekly Review", desc: "Open the insights dashboard to review your mood, energy, and stress trends over time." }
          ].map((p, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-5">
              <div className="h-20 w-20 rounded-full bg-white dark:bg-stone-800 border-4 border-stone-100 dark:border-stone-900 shadow-xl flex items-center justify-center text-2xl font-black text-calm-600">
                {p.step}
              </div>
              <h4 className="text-2xl font-bold">{p.title}</h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER / FUTURE PRICING SECTION */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">Newsletter & Premium</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">Stay in the Loop</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          <div className="card p-8 bg-white/70 dark:bg-stone-800/70 border-2 border-transparent">
            <h4 className="text-xl font-bold mb-2">Free Plan</h4>
            <div className="mb-6"><span className="text-4xl font-extrabold">$0</span><span className="text-stone-500">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Daily Journal Entries", "Wellness Tracking (Mood/Energy)", "Timeline & Calendar View", "Export Data (CSV/PDF)", "Basic Search"].map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                  <CheckCircle2 className="h-5 w-5 text-stone-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card relative p-8 bg-white/70 dark:bg-stone-800/70 border-2 border-calm-500 shadow-2xl scale-105">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-calm-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            <h4 className="text-xl font-bold mb-2">Premium (Phase 2)</h4>
            <div className="mb-6"><span className="text-4xl font-extrabold">$5</span><span className="text-stone-500">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["AI Insights & Summaries", "Voice Journaling (Speech-to-text)", "Multiple Journal Templates", "Share with Friends/Community", "Habit Tracking Integration"].map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                  <CheckCircle2 className="h-5 w-5 text-calm-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-md mx-auto mt-12">
          <div className="card bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
            <h4 className="text-center font-bold mb-4">Subscribe to updates</h4>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Security & Privacy focused) */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">Privacy & Security</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {[
            { q: "Who is Reflection for?", a: "Busy professionals, students, and anyone seeking a lightweight daily reflection habit. If you want <3-minute journaling with mood tracking and visual insights — without the overwhelm of complex journaling apps — Reflection is for you." },
            { q: "Is my journal data private?", a: "Yes. By default, entries are only visible to you. Row-level security ensures your data is isolated from other users. Data is encrypted at rest and in transit." },
            { q: "How does the 'Share' feature work?", a: "You can generate a secure, view-only web link for a specific entry. The link works without a login, and you can revoke access to it at any time." },
            { q: "Can I delete my account and data?", a: "Absolutely. We are fully GDPR compliant. You can use the 'Delete account & erase all data' option in your settings. Data is deleted immediately upon request." }
          ].map((faq, i) => (
            <div key={i} className="card group bg-white/60 dark:bg-stone-800/60 overflow-hidden transition-all duration-300 hover:bg-white/80 dark:hover:bg-stone-800/80 hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between font-bold text-lg">
                {faq.q}
                <ChevronDown className="h-5 w-5 text-calm-600 dark:text-calm-400 transition-transform duration-300 group-hover:rotate-180" />
              </div>
              <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:pt-4">
                <div className="overflow-hidden">
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
