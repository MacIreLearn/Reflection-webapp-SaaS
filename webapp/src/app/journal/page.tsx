"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MoodBadge } from "@/components/MoodBadge";
import { Plus, Calendar, List } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  gratitude: string;
  mainFocus: string;
  isDraft: boolean;
  tags: string[];
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"timeline" | "calendar">("timeline");

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => { setEntries(data.entries || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-stone-500">Loading your journal...</div>;
  }

  const todayEntry = entries.find((e) => format(parseISO(e.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"));

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Journal</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("timeline")} className={`rounded-lg p-2 ${view === "timeline" ? "bg-calm-100 text-calm-700" : "text-stone-400 hover:bg-stone-100"}`}>
            <List className="h-5 w-5" />
          </button>
          <button onClick={() => setView("calendar")} className={`rounded-lg p-2 ${view === "calendar" ? "bg-calm-100 text-calm-700" : "text-stone-400 hover:bg-stone-100"}`}>
            <Calendar className="h-5 w-5" />
          </button>
          {todayEntry ? (
            <Link href={`/journal/${todayEntry.id}`} className="btn-secondary py-2 px-4 gap-1 text-sm bg-white dark:bg-stone-800">
              Edit Today's Entry
            </Link>
          ) : (
            <Link href="/journal/new" className="btn-primary py-2 px-4 gap-1 text-sm">
              <Plus className="h-4 w-4" /> New Entry
            </Link>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="card py-16 text-center space-y-4">
          <p className="text-lg text-stone-500">No entries yet</p>
          <Link href="/journal/new" className="btn-primary inline-flex gap-2">
            <Plus className="h-4 w-4" /> Start Today&apos;s Entry
          </Link>
        </div>
      ) : view === "timeline" ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/journal/${entry.id}`} className="card block transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{format(parseISO(entry.date), "EEEE, MMM d, yyyy")}</p>
                    {entry.isDraft && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Draft</span>}
                  </div>
                  {entry.mainFocus && <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-1">{entry.mainFocus}</p>}
                  {entry.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-700 dark:text-stone-400">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <MoodBadge mood={entry.mood} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 text-xs font-medium text-stone-500">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const today = new Date();
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              const dayOffset = startOfMonth.getDay();
              const day = i - dayOffset + 1;
              const date = new Date(today.getFullYear(), today.getMonth(), day);
              const dateStr = format(date, "yyyy-MM-dd");
              const hasEntry = entries.some((e) => format(parseISO(e.date), "yyyy-MM-dd") === dateStr);
              const isCurrentMonth = date.getMonth() === today.getMonth();

              return (
                <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-sm ${!isCurrentMonth ? "text-stone-300 dark:text-stone-700" : hasEntry ? "bg-calm-100 text-calm-700 font-semibold cursor-pointer hover:bg-calm-200" : "text-stone-600 dark:text-stone-400"}`}>
                  {isCurrentMonth ? day : ""}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
