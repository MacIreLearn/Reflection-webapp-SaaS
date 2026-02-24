"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PREMIUM">("FREE");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setStatus("success");
      setMessage("You're subscribed! Check your inbox.");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <div className="flex gap-3 justify-center">
        <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${plan === "FREE" ? "border-calm-500 bg-calm-50 text-calm-700 dark:bg-calm-900/20" : "border-stone-300 dark:border-stone-600"}`}>
          <input type="radio" name="plan" value="FREE" checked={plan === "FREE"} onChange={() => setPlan("FREE")} className="sr-only" />
          Free
        </label>
        <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${plan === "PREMIUM" ? "border-calm-500 bg-calm-50 text-calm-700 dark:bg-calm-900/20" : "border-stone-300 dark:border-stone-600"}`}>
          <input type="radio" name="plan" value="PREMIUM" checked={plan === "PREMIUM"} onChange={() => setPlan("PREMIUM")} className="sr-only" />
          Premium — $5/mo
        </label>
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Subscribing..." : plan === "PREMIUM" ? "Subscribe & Pay" : "Subscribe Free"}
      </button>
      {message && (
        <p className={`text-sm ${status === "success" ? "text-calm-600" : "text-red-500"}`}>{message}</p>
      )}
    </form>
  );
}
