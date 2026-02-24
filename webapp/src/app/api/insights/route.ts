import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id, isDraft: false },
    orderBy: { date: "asc" },
    select: { date: true, mood: true, energy: true, stress: true, tags: true },
  });

  const moodTrend = entries.map((e) => ({ date: e.date.toISOString().split("T")[0], mood: e.mood, energy: e.energy, stress: e.stress }));

  const tagCounts: Record<string, number> = {};
  entries.forEach((e) => e.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = entries.length - 1; i >= 0; i--) {
    const entryDate = new Date(entries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  const avgMood = entries.length > 0 ? Math.round((entries.reduce((s, e) => s + e.mood, 0) / entries.length) * 10) / 10 : 0;
  const avgEnergy = entries.length > 0 ? Math.round((entries.reduce((s, e) => s + e.energy, 0) / entries.length) * 10) / 10 : 0;
  const avgStress = entries.length > 0 ? Math.round((entries.reduce((s, e) => s + e.stress, 0) / entries.length) * 10) / 10 : 0;

  return NextResponse.json({
    moodTrend,
    topTags,
    streak,
    totalEntries: entries.length,
    averages: { mood: avgMood, energy: avgEnergy, stress: avgStress },
  });
}
