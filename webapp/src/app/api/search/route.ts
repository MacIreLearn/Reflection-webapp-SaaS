import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const moodMin = searchParams.get("moodMin");
  const moodMax = searchParams.get("moodMax");
  const tag = searchParams.get("tag");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: Record<string, unknown> = { userId: user.id };

  if (q) {
    where.OR = [
      { gratitude: { contains: q, mode: "insensitive" } },
      { mainFocus: { contains: q, mode: "insensitive" } },
      { wins: { contains: q, mode: "insensitive" } },
      { challenges: { contains: q, mode: "insensitive" } },
      { learned: { contains: q, mode: "insensitive" } },
    ];
  }

  if (moodMin || moodMax) {
    where.mood = {};
    if (moodMin) (where.mood as Record<string, number>).gte = parseInt(moodMin);
    if (moodMax) (where.mood as Record<string, number>).lte = parseInt(moodMax);
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, Date>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, Date>).lte = new Date(dateTo);
  }

  const entries = await prisma.journalEntry.findMany({
    where,
    orderBy: { date: "desc" },
    take: 50,
  });

  return NextResponse.json({ entries });
}
