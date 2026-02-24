import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { MoodBadge } from "@/components/MoodBadge";
import { BookOpen } from "lucide-react";

export default async function SharedEntryPage({ params }: { params: { token: string } }) {
  const share = await prisma.sharedEntry.findUnique({
    where: { shareToken: params.token },
    include: {
      entry: {
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!share || !share.isActive) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Entry Not Found</h1>
        <p className="text-stone-600 dark:text-stone-400">This shared entry is no longer available.</p>
      </div>
    );
  }

  const { entry } = share;

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex items-center gap-2 text-calm-600">
        <BookOpen className="h-5 w-5" />
        <span className="text-sm font-medium">Shared Journal Entry</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{format(entry.date, "EEEE, MMMM d, yyyy")}</h1>
        {share.showAuthorName && entry.user.name && (
          <p className="text-sm text-stone-500">by {entry.user.name}</p>
        )}
        {share.showMoodSummary && <MoodBadge mood={entry.mood} />}
      </div>

      {share.showMoodSummary && (
        <div className="card grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xs text-stone-500 mb-1">Mood</p><p className="text-2xl font-bold text-calm-600">{entry.mood}</p></div>
          <div><p className="text-xs text-stone-500 mb-1">Energy</p><p className="text-2xl font-bold text-blue-600">{entry.energy}</p></div>
          <div><p className="text-xs text-stone-500 mb-1">Stress</p><p className="text-2xl font-bold text-orange-600">{entry.stress}</p></div>
        </div>
      )}

      <div className="space-y-4">
        {entry.gratitude && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Grateful for</h3><p>{entry.gratitude}</p></div>}
        {entry.mainFocus && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Main Focus</h3><p>{entry.mainFocus}</p></div>}
        {entry.wins && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Wins</h3><p>{entry.wins}</p></div>}
        {entry.challenges && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Challenges</h3><p>{entry.challenges}</p></div>}
        {entry.learned && <div className="card"><h3 className="text-sm font-medium text-stone-500 mb-1">Learned</h3><p>{entry.learned}</p></div>}
      </div>

      <p className="text-center text-xs text-stone-400">
        Shared via <span className="font-medium text-calm-600">Reflection</span> — a daily journal app
      </p>
    </div>
  );
}
