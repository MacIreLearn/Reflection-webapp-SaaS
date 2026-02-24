"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WellnessSlider } from "@/components/WellnessSlider";
import { Save, X } from "lucide-react";

export default function NewEntryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    const draft = localStorage.getItem("journal-draft");
    if (draft) {
      try { setEntry(JSON.parse(draft)); } catch {}
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("journal-draft", JSON.stringify(entry));
    }, 500);
    return () => clearTimeout(timeout);
  }, [entry]);

  const update = (field: string, value: string | number) =>
    setEntry((prev) => ({ ...prev, [field]: value }));

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
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today&apos;s Entry</h1>
        <p className="text-sm text-stone-500">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="card space-y-6">
        <h2 className="text-lg font-semibold">How are you feeling?</h2>
        <WellnessSlider label="Mood" value={entry.mood} onChange={(v) => update("mood", v)} />
        <WellnessSlider label="Energy" value={entry.energy} onChange={(v) => update("energy", v)} />
        <WellnessSlider label="Stress" value={entry.stress} onChange={(v) => update("stress", v)} />
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">Reflect</h2>
        <div>
          <label className="block text-sm font-medium mb-1">One thing I&apos;m grateful for</label>
          <textarea value={entry.gratitude} onChange={(e) => update("gratitude", e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="What made you smile today?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Today&apos;s main focus</label>
          <textarea value={entry.mainFocus} onChange={(e) => update("mainFocus", e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="What was your priority?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wins today</label>
          <textarea value={entry.wins} onChange={(e) => update("wins", e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="What went well?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Challenges today</label>
          <textarea value={entry.challenges} onChange={(e) => update("challenges", e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="What was tough?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">What I learned</label>
          <textarea value={entry.learned} onChange={(e) => update("learned", e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="Any insights or lessons?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input type="text" value={entry.tags} onChange={(e) => update("tags", e.target.value)} className="input-field" placeholder="work, health, gratitude (comma-separated)" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-primary flex-1 gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Entry"}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-secondary gap-2">
          Save Draft
        </button>
        <button onClick={() => router.back()} className="btn-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
