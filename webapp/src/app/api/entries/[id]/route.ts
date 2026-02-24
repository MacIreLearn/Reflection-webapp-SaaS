import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: user.id },
    include: { shares: { select: { shareToken: true, isActive: true } } },
  });

  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const entry = await prisma.journalEntry.update({
    where: { id: params.id },
    data: {
      mood: body.mood,
      energy: body.energy,
      stress: body.stress,
      gratitude: body.gratitude,
      mainFocus: body.mainFocus,
      wins: body.wins,
      challenges: body.challenges,
      learned: body.learned,
      tags: body.tags,
      isDraft: body.isDraft,
    },
  });

  return NextResponse.json({ entry });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.journalEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
