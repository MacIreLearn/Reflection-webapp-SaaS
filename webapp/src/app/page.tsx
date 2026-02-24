import Link from "next/link";
import { BookOpen, Shield, Share2, BarChart3, Clock, Download } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

const features = [
  { icon: BookOpen, title: "Daily Reflection", description: "Quick 3-minute entries with mood, energy, and stress tracking plus guided prompts." },
  { icon: Shield, title: "Private & Secure", description: "Your entries are encrypted and private by default. GDPR compliant with full data ownership." },
  { icon: Share2, title: "Share Selectively", description: "Generate secure view-only links for entries you want to share. Revoke anytime." },
  { icon: BarChart3, title: "Wellness Insights", description: "Track mood trends, energy patterns, and stress levels with beautiful charts." },
  { icon: Clock, title: "Daily Reminders", description: "Gentle email reminders to keep your journaling streak alive." },
  { icon: Download, title: "Export Your Data", description: "Download your journal as PDF or CSV. Your data, your ownership." },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Reflect. Track. <span className="text-calm-600">Grow.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
          A calming daily journal to track your wellbeing, capture reflections, and build self-awareness — all in under 3 minutes.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-3.5">
            Start Journaling Free
          </Link>
          <Link href="/auth/login" className="btn-secondary text-base px-8 py-3.5">
            Sign In
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card space-y-3">
            <f.icon className="h-8 w-8 text-calm-600" />
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">{f.description}</p>
          </div>
        ))}
      </section>

      <section className="card mx-auto max-w-lg text-center space-y-4">
        <h2 className="text-2xl font-bold">Stay in the Loop</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Get journaling tips and app updates. Choose Free or Premium ($5/mo) for AI insights.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
