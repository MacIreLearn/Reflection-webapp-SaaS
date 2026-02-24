"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MoodBadge } from "@/components/MoodBadge";
import { Search as SearchIcon } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  mood: number;
  mainFocus: string;
  gratitude: string;
  tags: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [moodMin, setMoodMin] = useState("");
  const [moodMax, setMoodMax] = useState("");
  const [tag, setTag] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [results, setResults] = useState<Entry[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (moodMin) params.set("moodMin", moodMin);
    if (moodMax) params.set("moodMax", moodMax);
    if (tag) params.set("tag", tag);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data.entries || []);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Search Entries</h1>

      <form onSubmit={handleSearch} className="card space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search your journal..." />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium mb-1">Mood Min</label>
            <input type="number" min={1} max={10} value={moodMin} onChange={(e) => setMoodMin(e.target.value)} className="input-field" placeholder="1" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Mood Max</label>
            <input type="number" min={1} max={10} value={moodMax} onChange={(e) => setMoodMax(e.target.value)} className="input-field" placeholder="10" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Tag</label>
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className="input-field" placeholder="e.g. work" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && (
        <div className="space-y-3">
          <p className="text-sm text-stone-500">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          {results.map((entry) => (
            <Link key={entry.id} href={`/journal/${entry.id}`} className="card block transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{format(parseISO(entry.date), "MMM d, yyyy")}</p>
                  {entry.mainFocus && <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-1">{entry.mainFocus}</p>}
                </div>
                <MoodBadge mood={entry.mood} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
