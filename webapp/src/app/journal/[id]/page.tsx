"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { MoodBadge } from "@/components/MoodBadge";
import { WellnessSlider } from "@/components/WellnessSlider";
import { ArrowLeft, Share2, Trash2, Save, Link as LinkIcon, Check } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  gratitude: string;
  mainFocus: string;
  wins: string;
  challenges: string;
  learned: string;
  tags: string[];
  isDraft: boolean;
  shares?: { shareToken: string; isActive: boolean }[];
}

export default function EntryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Entry>>({});
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/entries/${id}`)
      .then((r) => r.json())
      .then((data) => { setEntry(data.entry); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this entry permanently?")) return;
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    router.push("/journal");
  };

  const handleShare = async () => {
    const res = await fetch(`/api/entries/${id}/share`, { method: "POST" });
    const data = await res.json();
    const link = `${window.location.origin}/shared/${data.shareToken}`;
    setShareLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    const data = await res.json();
    setEntry(data.entry);
    setEditing(false);
  };

  if (loading) return <div className="py-12 text-center text-stone-500">Loading...</div>;
  if (!entry) return <div className="py-12 text-center text-stone-500">Entry not found</div>;

  const isToday = new Date(entry.date).toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className="btn-secondary py-2 px-3 text-sm gap-1">
            <Share2 className="h-4 w-4" /> Share
          </button>
          {isToday && (
            <button onClick={() => { setEditing(true); setEditData(entry); }} className="btn-secondary py-2 px-3 text-sm">
              Edit
            </button>
          )}
          <button onClick={handleDelete} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="card flex items-center gap-3 bg-calm-50 dark:bg-calm-900/20">
          <LinkIcon className="h-4 w-4 text-calm-600 shrink-0" />
          <input value={shareLink} readOnly className="input-field flex-1 text-sm" />
          <button onClick={handleCopy} className="btn-primary py-2 px-3 text-sm gap-1">
            {copied ? <><Check className="h-4 w-4" /> Copied</> : "Copy"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{format(parseISO(entry.date), "EEEE, MMMM d, yyyy")}</h1>
        <div className="flex gap-2 items-center">
          <MoodBadge mood={entry.mood} />
          {entry.isDraft && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Draft</span>}
        </div>
      </div>

      {editing ? (
        <div className="space-y-6 animate-fade-in-up">
          <div className="card space-y-8">
            <h2 className="text-xl font-semibold mb-2 text-center">Wellness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WellnessSlider label="Mood" value={editData.mood || 5} onChange={(v) => setEditData({ ...editData, mood: v })} colorClass="accent-calm-600" />
              <WellnessSlider label="Energy" value={editData.energy || 5} onChange={(v) => setEditData({ ...editData, energy: v })} colorClass="accent-amber-500" />
              <WellnessSlider label="Stress" value={editData.stress || 5} onChange={(v) => setEditData({ ...editData, stress: v })} colorClass="accent-rose-500" />
            </div>
          </div>

          <div className="space-y-6">
            {(["gratitude", "mainFocus", "wins", "challenges", "learned"] as const).map((field) => (
              <div key={field} className="card space-y-4">
                <h2 className="text-xl font-semibold mb-2 capitalize">{field === "mainFocus" ? "Main Focus" : field}</h2>
                <textarea value={(editData as Record<string, string>)[field] || ""} onChange={(e) => setEditData({ ...editData, [field]: e.target.value })} className="input-field min-h-[120px] resize-none text-lg p-4" />
              </div>
            ))}
            <div className="card space-y-4">
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <input type="text" value={editData.tags?.join(", ") || ""} onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="input-field text-lg p-4" placeholder="work, health, gratitude (comma-separated)" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200 dark:border-stone-700">
            <button onClick={handleSaveEdit} className="btn-primary flex-1 py-3 text-lg justify-center shadow-lg shadow-calm-600/20">
              <Save className="h-5 w-5 mr-2" /> Save Changes
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary py-3 text-lg justify-center">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card grid grid-cols-3 gap-4 text-center">
            <div><p className="text-xs text-stone-500 mb-1">Mood</p><p className="text-2xl font-bold text-calm-600">{entry.mood}</p></div>
            <div><p className="text-xs text-stone-500 mb-1">Energy</p><p className="text-2xl font-bold text-blue-600">{entry.energy}</p></div>
            <div><p className="text-xs text-stone-500 mb-1">Stress</p><p className="text-2xl font-bold text-orange-600">{entry.stress}</p></div>
          </div>
          {entry.gratitude && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Grateful for</h3><p>{entry.gratitude}</p></div>}
          {entry.mainFocus && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Main Focus</h3><p>{entry.mainFocus}</p></div>}
          {entry.wins && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Wins</h3><p>{entry.wins}</p></div>}
          {entry.challenges && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Challenges</h3><p>{entry.challenges}</p></div>}
          {entry.learned && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Learned</h3><p>{entry.learned}</p></div>}
          {entry.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600 dark:bg-stone-700 dark:text-stone-400">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
