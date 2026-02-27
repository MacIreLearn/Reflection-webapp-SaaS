import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const contentSchema = z.object({
  type: z.enum(["NEWSLETTER", "BLOG", "ARTICLE"]),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  body: z.string(),
  access: z.enum(["FREE", "PAID"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  tags: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const author = await prisma.author.findUnique({
      where: { email: user.email },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = contentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title, slug, excerpt, body: contentBody, access, status, tags, coverImageUrl } = parsed.data;

    // Check if slug already exists for this author
    const existingContent = await prisma.content.findUnique({
      where: {
        authorId_slug: {
          authorId: author.id,
          slug,
        },
      },
    });

    if (existingContent) {
      return NextResponse.json(
        { error: "You already have content with this URL slug" },
        { status: 409 }
      );
    }

    const content = await prisma.content.create({
      data: {
        authorId: author.id,
        type,
        title,
        slug,
        excerpt: excerpt || "",
        body: contentBody,
        access,
        status,
        tags: tags || [],
        coverImageUrl: coverImageUrl || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({ content: { id: content.id, slug: content.slug } });
  } catch (error) {
    console.error("Content create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const author = await prisma.author.findUnique({
      where: { email: user.email },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const contents = await prisma.content.findMany({
      where: { authorId: author.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Content list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
