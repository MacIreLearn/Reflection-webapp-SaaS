"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const entrySchema = z.object({
  mood: z.coerce.number().min(1).max(10).default(5),
  energy: z.coerce.number().min(1).max(10).default(5),
  stress: z.coerce.number().min(1).max(10).default(5),
  gratitude: z.string().default(""),
  mainFocus: z.string().default(""),
  wins: z.string().default(""),
  challenges: z.string().default(""),
  learned: z.string().default(""),
  tags: z.string().default(""),
  isDraft: z.coerce.boolean().default(false),
});

export type EntryState = {
  success: boolean;
  error?: string;
  entryId?: string;
};

export async function createEntryAction(
  _prevState: EntryState,
  formData: FormData
): Promise<EntryState> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = entrySchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const tagsArray = data.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        date: new Date(),
        mood: data.mood,
        energy: data.energy,
        stress: data.stress,
        gratitude: data.gratitude,
        mainFocus: data.mainFocus,
        wins: data.wins,
        challenges: data.challenges,
        learned: data.learned,
        tags: tagsArray,
        isDraft: data.isDraft,
      },
    });

    revalidatePath("/journal");
    revalidatePath("/insights");
    return { success: true, entryId: entry.id };
  } catch (err) {
    console.error("createEntryAction error:", err);
    return { success: false, error: "Failed to create entry" };
  }
}

export async function updateEntryAction(
  entryId: string,
  _prevState: EntryState,
  formData: FormData
): Promise<EntryState> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId: user.id },
  });
  if (!existing) {
    return { success: false, error: "Entry not found" };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = entrySchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const tagsArray = data.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        mood: data.mood,
        energy: data.energy,
        stress: data.stress,
        gratitude: data.gratitude,
        mainFocus: data.mainFocus,
        wins: data.wins,
        challenges: data.challenges,
        learned: data.learned,
        tags: tagsArray,
        isDraft: data.isDraft,
      },
    });

    revalidatePath("/journal");
    revalidatePath(`/journal/${entryId}`);
    revalidatePath("/insights");
    return { success: true, entryId };
  } catch (err) {
    console.error("updateEntryAction error:", err);
    return { success: false, error: "Failed to update entry" };
  }
}

export async function deleteEntryAction(entryId: string): Promise<void> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId: user.id },
  });
  if (!existing) {
    throw new Error("Entry not found");
  }

  await prisma.journalEntry.delete({ where: { id: entryId } });
  revalidatePath("/journal");
  revalidatePath("/insights");
  redirect("/journal");
}
