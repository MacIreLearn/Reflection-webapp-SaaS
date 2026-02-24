import Link from "next/link";
import { ArrowRight, Sparkles, LineChart, Shield, Share2, CheckCircle2, ChevronDown, BookOpen, Clock, Download } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function HomePage() {
  return (
    <div className="relative flex flex-col gap-32 pb-24 pt-12 overflow-hidden">
      
      <AnimatedBackground />
      
      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-stone-800/80 px-4 py-2 text-sm font-semibold text-stone-800 dark:text-stone-200 backdrop-blur-md border border-stone-200/50 dark:border-stone-700 shadow-sm mb-8 animate-fade-in-up">
          <Sparkles className="h-4 w-4 text-calm-600" />
          YOUR DAILY WELLNESS TRACKER
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mb-6 leading-tight animate-fade-in-up animation-delay-2000">
          Reflect. Track. <br />
          <span className="text-calm-600">Grow.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 animate-fade-in-up animation-delay-4000">
          A calming daily journal to track your wellbeing, capture reflections, and build self-awareness — all in under 3 minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10 animate-fade-in-up">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-4 w-full sm:w-auto text-lg shadow-xl shadow-calm-600/20 hover:scale-105 transition-transform">
            Start Journaling Free <ArrowRight className="ml-2 h-5 w-5 inline" />
          </Link>
          <Link href="/auth/login" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto text-lg hover:scale-105 transition-transform">
            Sign In
          </Link>
        </div>

        {/* Floating Note */}
        <div className="mt-16 text-left max-w-sm self-start md:absolute md:top-64 md:-left-4 lg:-left-12 card border-l-4 border-l-calm-600 shadow-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl animate-fade-in-up hover:-translate-y-2 transition-transform duration-300">
          <p className="text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">Built for mindfulness</p>
          <p className="text-sm italic text-stone-700 dark:text-stone-300 mb-4">
            "The experience must be fast, calming, and usable in under 3 minutes. It's about consistency over perfection."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-calm-300 to-calm-600"></div>
            <div>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100">Core Philosophy</p>
              <p className="text-xs text-stone-500">Reflection App Design</p>
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
            { title: "Private & Secure", desc: "Your entries are encrypted and private by default. GDPR compliant with full data ownership.", icon: Shield },
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-calm-600 uppercase tracking-widest mb-3">Insights & Data</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8">Track Your Growth Over Time</h3>
            <div className="card border-l-4 border-l-calm-500 shadow-md bg-white/80 dark:bg-stone-800/80">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><LineChart className="h-5 w-5 text-calm-600"/> Wellness Insights</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">Track mood trends, energy patterns, and stress levels with beautiful auto-updating charts and a daily streak counter.</p>
            </div>
            <div className="card opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-white/60 dark:bg-stone-800/60">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Download className="h-5 w-5 text-stone-500"/> Export Your Data</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">Download your journal as PDF or CSV. Your data is yours to keep, always.</p>
            </div>
          </div>
          
          <div className="card bg-[#1e1e1e]/90 dark:bg-black/90 backdrop-blur-xl text-stone-300 p-0 overflow-hidden shadow-2xl border-stone-800 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] dark:bg-stone-900 border-b border-stone-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-stone-400 font-mono">schema.prisma</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed">
<span className="text-pink-400">model</span> <span className="text-yellow-300">JournalEntry</span> {"{"}
  id         <span className="text-blue-300">String</span>   <span className="text-stone-500">@id @default(uuid())</span>
  date       <span className="text-blue-300">DateTime</span>
  mood       <span className="text-blue-300">Int</span>      <span className="text-stone-500">@default(5)</span>
  energy     <span className="text-blue-300">Int</span>      <span className="text-stone-500">@default(5)</span>
  stress     <span className="text-blue-300">Int</span>      <span className="text-stone-500">@default(5)</span>
  gratitude  <span className="text-blue-300">String</span>
  mainFocus  <span className="text-blue-300">String</span>
  isDraft    <span className="text-blue-300">Boolean</span>  <span className="text-stone-500">@default(true)</span>
  tags       <span className="text-blue-300">String[]</span>
{"}"}
              </pre>
            </div>
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
            { step: "02", title: "Complete Entry", desc: "Open the app, tap 'Today', complete the 3-minute wellness sliders and reflection prompts, then save." },
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
            { q: "Is my journal data private?", a: "Yes. By default, entries are only visible to you. Multi-tenant security ensures your data is isolated from other users." },
            { q: "How does the 'Share' feature work?", a: "You can generate a secure, view-only web link for a specific entry. The link works without a login, and you can revoke access to it at any time." },
            { q: "Can I delete my account and data?", a: "Absolutely. We are fully GDPR compliant. You can use the 'Delete account & erase all data' option in your settings." }
          ].map((faq, i) => (
            <details key={i} className="card group bg-white/60 dark:bg-stone-800/60 cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-lg list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown className="h-5 w-5 text-stone-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
