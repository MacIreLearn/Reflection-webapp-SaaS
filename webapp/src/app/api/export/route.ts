import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const fmt = searchParams.get("format") || "csv";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: Record<string, unknown> = { userId: user.id, isDraft: false };
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, Date>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, Date>).lte = new Date(dateTo);
  }

  const entries = await prisma.journalEntry.findMany({
    where,
    orderBy: { date: "desc" },
  });

  if (fmt === "csv") {
    const headers = "Date,Mood,Energy,Stress,Gratitude,Main Focus,Wins,Challenges,Learned,Tags";
    const rows = entries.map((e) =>
      [
        format(e.date, "yyyy-MM-dd"),
        e.mood, e.energy, e.stress,
        `"${(e.gratitude || "").replace(/"/g, '""')}"`,
        `"${(e.mainFocus || "").replace(/"/g, '""')}"`,
        `"${(e.wins || "").replace(/"/g, '""')}"`,
        `"${(e.challenges || "").replace(/"/g, '""')}"`,
        `"${(e.learned || "").replace(/"/g, '""')}"`,
        `"${e.tags.join(", ")}"`,
      ].join(",")
    );

    const csv = [headers, ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=journal-export.csv",
      },
    });
  }

  const text = entries.map((e) =>
    [
      `Date: ${format(e.date, "MMMM d, yyyy")}`,
      `Mood: ${e.mood}/10 | Energy: ${e.energy}/10 | Stress: ${e.stress}/10`,
      e.gratitude ? `Grateful for: ${e.gratitude}` : "",
      e.mainFocus ? `Main Focus: ${e.mainFocus}` : "",
      e.wins ? `Wins: ${e.wins}` : "",
      e.challenges ? `Challenges: ${e.challenges}` : "",
      e.learned ? `Learned: ${e.learned}` : "",
      e.tags.length > 0 ? `Tags: ${e.tags.join(", ")}` : "",
      "---",
    ].filter(Boolean).join("\n")
  ).join("\n\n");

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=journal-export.txt",
    },
  });
}
