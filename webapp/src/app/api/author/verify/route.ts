import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const author = await prisma.author.findUnique({
      where: { email },
      select: { id: true, slug: true, name: true, status: true, rejectionReason: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Check author approval status
    if (author.status === "PENDING") {
      return NextResponse.json({ 
        error: "Your author application is still pending approval. You'll receive an email once it's reviewed.",
        status: "PENDING"
      }, { status: 403 });
    }

    if (author.status === "REJECTED") {
      return NextResponse.json({ 
        error: `Your author application was not approved. Reason: ${author.rejectionReason || "Not specified"}`,
        status: "REJECTED"
      }, { status: 403 });
    }

    return NextResponse.json({ author: { id: author.id, slug: author.slug, name: author.name } });
  } catch (error) {
    console.error("Author verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
