import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      id: true, date: true, mood: true, energy: true, stress: true,
      gratitude: true, mainFocus: true, isDraft: true, tags: true,
    },
  });

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      date: new Date(body.date),
      mood: body.mood || 5,
      energy: body.energy || 5,
      stress: body.stress || 5,
      gratitude: body.gratitude || "",
      mainFocus: body.mainFocus || "",
      wins: body.wins || "",
      challenges: body.challenges || "",
      learned: body.learned || "",
      tags: body.tags || [],
      isDraft: body.isDraft ?? false,
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
