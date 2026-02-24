import { clsx } from "clsx";

const moodEmojis: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😕", 4: "😐", 5: "🙂",
  6: "😊", 7: "😄", 8: "😁", 9: "🤩", 10: "🥳",
};

export function MoodBadge({ mood, size = "md" }: { mood: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 rounded-full font-medium",
      size === "sm" && "px-2 py-0.5 text-xs",
      size === "md" && "px-3 py-1 text-sm",
      size === "lg" && "px-4 py-1.5 text-base",
      mood >= 7 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
      mood >= 4 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    )}>
      {moodEmojis[mood] || "🙂"} {mood}/10
    </span>
  );
}
