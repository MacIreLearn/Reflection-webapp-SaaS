import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  bio: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, slug, bio } = parsed.data;

    // Check if email already exists
    const existingEmail = await prisma.author.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An author with this email already exists" },
        { status: 409 }
      );
    }

    // Check if slug already exists
    const existingSlug = await prisma.author.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "This URL is already taken. Please choose a different one." },
        { status: 409 }
      );
    }

    // Create author
    const author = await prisma.author.create({
      data: {
        email,
        name,
        slug,
        bio: bio || "",
      },
    });

    return NextResponse.json({ author: { id: author.id, slug: author.slug } });
  } catch (error) {
    console.error("Author register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
