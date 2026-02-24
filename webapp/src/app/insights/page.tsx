"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Flame, TrendingUp, Hash, BookOpen } from "lucide-react";

interface InsightsData {
  moodTrend: { date: string; mood: number; energy: number; stress: number }[];
  topTags: { tag: string; count: number }[];
  streak: number;
  totalEntries: number;
  averages: { mood: number; energy: number; stress: number };
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12 text-center text-stone-500">Loading insights...</div>;
  if (!data) return <div className="py-12 text-center text-stone-500">Failed to load insights</div>;

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Wellness Insights</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card text-center">
          <Flame className="mx-auto h-6 w-6 text-orange-500 mb-1" />
          <p className="text-2xl font-bold">{data.streak}</p>
          <p className="text-xs text-stone-500">Day Streak</p>
        </div>
        <div className="card text-center">
          <BookOpen className="mx-auto h-6 w-6 text-calm-600 mb-1" />
          <p className="text-2xl font-bold">{data.totalEntries}</p>
          <p className="text-xs text-stone-500">Total Entries</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="mx-auto h-6 w-6 text-blue-500 mb-1" />
          <p className="text-2xl font-bold">{data.averages.mood}</p>
          <p className="text-xs text-stone-500">Avg Mood</p>
        </div>
        <div className="card text-center">
          <Hash className="mx-auto h-6 w-6 text-purple-500 mb-1" />
          <p className="text-2xl font-bold">{data.topTags.length}</p>
          <p className="text-xs text-stone-500">Tags Used</p>
        </div>
      </div>

      {data.moodTrend.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Mood, Energy & Stress Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#207852" strokeWidth={2} dot={false} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#2563eb" strokeWidth={2} dot={false} name="Energy" />
              <Line type="monotone" dataKey="stress" stroke="#ea580c" strokeWidth={2} dot={false} name="Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.topTags.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Most Used Tags</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topTags}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="tag" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#207852" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
