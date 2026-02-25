"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { subscribeAction, SubscribeState } from "@/lib/actions/newsletter";

const initialState: SubscribeState = { success: false };

function SubmitButton({ plan }: { plan: "FREE" | "PREMIUM" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Subscribing..." : plan === "PREMIUM" ? "Subscribe & Pay" : "Subscribe Free"}
    </button>
  );
}

export function NewsletterForm() {
  const [plan, setPlan] = useState<"FREE" | "PREMIUM">("FREE");
  const [state, formAction] = useFormState(subscribeAction, initialState);

  // Handle redirect to Stripe checkout
  useEffect(() => {
    if (state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  }, [state.checkoutUrl]);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="input-field"
      />
      <input type="hidden" name="plan" value={plan} />
      <div className="flex gap-3 justify-center">
        <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${plan === "FREE" ? "border-calm-500 bg-calm-50 text-calm-700 dark:bg-calm-900/20" : "border-stone-300 dark:border-stone-600"}`}>
          <input 
            type="radio" 
            name="planSelector" 
            value="FREE" 
            checked={plan === "FREE"} 
            onChange={() => setPlan("FREE")} 
            className="sr-only" 
          />
          Free
        </label>
        <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${plan === "PREMIUM" ? "border-calm-500 bg-calm-50 text-calm-700 dark:bg-calm-900/20" : "border-stone-300 dark:border-stone-600"}`}>
          <input 
            type="radio" 
            name="planSelector" 
            value="PREMIUM" 
            checked={plan === "PREMIUM"} 
            onChange={() => setPlan("PREMIUM")} 
            className="sr-only" 
          />
          Premium — $5/mo
        </label>
      </div>
      <SubmitButton plan={plan} />
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state.success && !state.checkoutUrl && (
        <p className="text-sm text-calm-600">You&apos;re subscribed! Check your inbox.</p>
      )}
    </form>
  );
}
