import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existingShare = await prisma.sharedEntry.findFirst({
    where: { entryId: params.id, isActive: true },
  });

  if (existingShare) {
    return NextResponse.json({ shareToken: existingShare.shareToken });
  }

  const share = await prisma.sharedEntry.create({
    data: {
      entryId: params.id,
      shareToken: uuidv4(),
      isActive: true,
      showAuthorName: false,
      showMoodSummary: true,
    },
  });

  return NextResponse.json({ shareToken: share.shareToken });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.sharedEntry.updateMany({
    where: { entryId: params.id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
