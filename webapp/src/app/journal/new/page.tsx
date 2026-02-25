"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WellnessSlider } from "@/components/WellnessSlider";
import { Save, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AffirmationCard } from "@/components/AffirmationCard";

const STEPS = [
  "Wellness",
  "Gratitude",
  "Main Focus",
  "Wins",
  "Challenges",
  "Learned",
  "Tags",
  "Summary"
];

export default function NewEntryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    gratitude: "",
    mainFocus: "",
    wins: "",
    challenges: "",
    learned: "",
    tags: "",
  });

  useEffect(() => {
    // Check if an entry for today already exists to prevent duplicates
    fetch("/api/entries")
      .then(r => r.json())
      .then(data => {
        if (data.entries && data.entries.length > 0) {
          const firstEntry = data.entries[0];
          if (new Date(firstEntry.date).toDateString() === new Date().toDateString()) {
            router.replace(`/journal/${firstEntry.id}`);
          }
        }
      });

    const draft = localStorage.getItem("journal-draft");
    if (draft) {
      try { setEntry(JSON.parse(draft)); } catch {}
    }
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("journal-draft", JSON.stringify(entry));
    }, 500);
    return () => clearTimeout(timeout);
  }, [entry]);

  const update = (field: string, value: string | number) =>
    setEntry((prev) => ({ ...prev, [field]: value }));

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          tags: entry.tags.split(",").map((t) => t.trim()).filter(Boolean),
          isDraft,
          date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      localStorage.removeItem("journal-draft");
      router.push("/journal");
    } catch {
      alert("Failed to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-3xl mx-auto">
      <div className="w-full mb-6">
        <AffirmationCard className="w-full justify-center" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Today&apos;s Entry</h1>
          <p className="text-sm text-stone-500">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="text-sm font-medium text-calm-600 bg-calm-50 dark:bg-calm-900/30 px-3 py-1 rounded-full border border-calm-200 dark:border-calm-800">
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-calm-500 transition-all duration-500 ease-out" 
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="relative min-h-[350px]">
        {/* Step 0: Sliders */}
        {step === 0 && (
          <div className="card space-y-8 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6 text-center">How are you feeling today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WellnessSlider label="Mood" value={entry.mood} onChange={(v) => update("mood", v)} colorClass="accent-calm-600" />
              <WellnessSlider label="Energy" value={entry.energy} onChange={(v) => update("energy", v)} colorClass="accent-amber-500" />
              <WellnessSlider label="Stress" value={entry.stress} onChange={(v) => update("stress", v)} colorClass="accent-rose-500" />
            </div>
          </div>
        )}

        {/* Step 1: Gratitude */}
        {step === 1 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Gratitude</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">One thing I&apos;m grateful for today...</label>
            <textarea autoFocus value={entry.gratitude} onChange={(e) => update("gratitude", e.target.value)} className="input-field min-h-[150px] resize-none text-lg p-4" placeholder="What made you smile today?" />
          </div>
        )}

        {/* Step 2: Main Focus */}
        {step === 2 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Main Focus</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">What is your main priority?</label>
            <textarea autoFocus value={entry.mainFocus} onChange={(e) => update("mainFocus", e.target.value)} className="input-field min-h-[150px] resize-none text-lg p-4" placeholder="e.g., Finish the project proposal..." />
          </div>
        )}

        {/* Step 3: Wins */}
        {step === 3 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Wins</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">What went well today?</label>
            <textarea autoFocus value={entry.wins} onChange={(e) => update("wins", e.target.value)} className="input-field min-h-[150px] resize-none text-lg p-4" placeholder="Celebrate your small victories..." />
          </div>
        )}

        {/* Step 4: Challenges */}
        {step === 4 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Challenges</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">What was tough today?</label>
            <textarea autoFocus value={entry.challenges} onChange={(e) => update("challenges", e.target.value)} className="input-field min-h-[150px] resize-none text-lg p-4" placeholder="Acknowledge your struggles..." />
          </div>
        )}

        {/* Step 5: Learned */}
        {step === 5 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Learnings</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">What did you learn?</label>
            <textarea autoFocus value={entry.learned} onChange={(e) => update("learned", e.target.value)} className="input-field min-h-[150px] resize-none text-lg p-4" placeholder="Any insights or lessons?" />
          </div>
        )}

        {/* Step 6: Tags */}
        {step === 6 && (
          <div className="card space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <label className="block text-sm font-medium mb-1 text-stone-600 dark:text-stone-400">Categorize your entry</label>
            <input autoFocus type="text" value={entry.tags} onChange={(e) => update("tags", e.target.value)} className="input-field text-lg p-4" placeholder="work, health, gratitude (comma-separated)" />
          </div>
        )}

        {/* Step 7: Summary */}
        {step === 7 && (
          <div className="card space-y-8 animate-fade-in-up">
            <div className="text-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-calm-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Ready to save?</h2>
              <p className="text-stone-500">Review your entry before finalizing.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <div className="text-center"><p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Mood</p><p className="font-bold text-calm-600 text-xl">{entry.mood}/10</p></div>
              <div className="text-center"><p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Energy</p><p className="font-bold text-amber-500 text-xl">{entry.energy}/10</p></div>
              <div className="text-center"><p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Stress</p><p className="font-bold text-rose-500 text-xl">{entry.stress}/10</p></div>
            </div>

            <div className="space-y-4 text-sm">
              {entry.gratitude && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Gratitude:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.gratitude}</p></div>}
              {entry.mainFocus && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Main Focus:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.mainFocus}</p></div>}
              {entry.wins && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Wins:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.wins}</p></div>}
              {entry.challenges && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Challenges:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.challenges}</p></div>}
              {entry.learned && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Learned:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.learned}</p></div>}
              {entry.tags && <div><span className="font-semibold text-calm-600 dark:text-calm-400 block mb-1">Tags:</span> <p className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300">{entry.tags}</p></div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200 dark:border-stone-700">
              <button onClick={() => handleSave(false)} disabled={saving} className="btn-primary flex-1 py-3 text-lg justify-center shadow-lg shadow-calm-600/20">
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Saving..." : "Save Entry"}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-secondary py-3 text-lg justify-center">
                Save Draft
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step < 7 && (
        <div className="flex items-center justify-between pt-4">
          <button 
            onClick={step === 0 ? () => router.back() : prevStep} 
            className="btn-secondary px-6 py-2"
          >
            {step === 0 ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><ArrowLeft className="h-4 w-4 mr-2" /> Back</>}
          </button>
          
          <button 
            onClick={nextStep} 
            className="btn-primary px-8 py-2 shadow-md shadow-calm-600/20"
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
