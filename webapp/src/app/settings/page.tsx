"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setTimezone(data.user.timezone || "UTC");
          setReminderTime(data.user.reminderTime || "09:00");
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, timezone, reminderTime }),
    });
    if (res.ok) setMessage("Settings saved!");
    else setMessage("Failed to save");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("This will permanently delete your account and all data. Are you sure?")) return;
    if (!confirm("This action cannot be undone. Type YES to confirm.")) return;
    await fetch("/api/user", { method: "DELETE" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleExport = async (format: "csv" | "pdf") => {
    const res = await fetch(`/api/export?format=${format}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="py-12 text-center text-stone-500">Loading...</div>;

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-field">
            {Intl.supportedValuesOf("timeZone").map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily Reminder Time</label>
          <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="input-field" />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p className="text-sm text-calm-600">{message}</p>}
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">Export Data</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">Download your journal entries.</p>
        <div className="flex gap-3">
          <button onClick={() => handleExport("csv")} className="btn-secondary flex-1">Export CSV</button>
          <button onClick={() => handleExport("pdf")} className="btn-secondary flex-1">Export PDF</button>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">Subscription & Billing</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Manage your subscription, update payment method, or cancel your plan.
        </p>
        <button
          onClick={async () => {
            const res = await fetch("/api/billing/portal", { method: "POST" });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else alert(data.error || "Failed to open billing portal");
          }}
          className="btn-secondary"
        >
          Manage Subscription
        </button>
      </div>

      <div className="card space-y-4 border-red-200 dark:border-red-800">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">Permanently delete your account and all data.</p>
        <button onClick={handleDeleteAccount} className="rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </div>
  );
}
