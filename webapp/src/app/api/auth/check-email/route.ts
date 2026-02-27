import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (type === "author") {
      // Check if author exists in our database
      const author = await prisma.author.findUnique({
        where: { email },
        select: { id: true, status: true },
      });

      if (!author) {
        return NextResponse.json({ 
          exists: false, 
          message: "No author account found with this email address.",
          redirectTo: "/author/auth/signup"
        }, { status: 404 });
      }

      return NextResponse.json({ exists: true });
    } else {
      // For regular users, check Supabase auth
      // We use admin API to check if user exists (requires service role key)
      // If not available, we check the User table in our database
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json({ 
          exists: false, 
          message: "No account found with this email address.",
          redirectTo: "/auth/signup"
        }, { status: 404 });
      }

      return NextResponse.json({ exists: true });
    }
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
