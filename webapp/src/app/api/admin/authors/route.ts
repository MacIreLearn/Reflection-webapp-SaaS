import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyAdmin() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return null;
  
  return await prisma.admin.findUnique({
    where: { id: sessionId },
  });
}

export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { authorId, action, reason } = await request.json();

    if (!authorId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.author.update({
        where: { id: authorId },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      // Send approval email
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: author.email,
          subject: "🎉 Your Author Application Has Been Approved!",
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #10b981;">Congratulations, ${author.name}!</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your application to become an author on Reflection has been <strong style="color: #10b981;">approved</strong>!
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                You can now log in to your author dashboard and start creating content.
              </p>
              <div style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/author/auth/login" 
                   style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Go to Author Dashboard
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Your author page will be available at: <strong>/author/${author.slug}</strong>
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                This email was sent from Reflection. If you didn't apply to become an author, please ignore this email.
              </p>
            </div>
          `,
        });
      }

      return NextResponse.json({ success: true, status: "APPROVED" });

    } else if (action === "reject") {
      if (!reason) {
        return NextResponse.json({ error: "Rejection reason required" }, { status: 400 });
      }

      await prisma.author.update({
        where: { id: authorId },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
          reviewedAt: new Date(),
        },
      });

      // Send rejection email
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: author.email,
          subject: "Update on Your Author Application",
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #374151;">Hello, ${author.name}</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in becoming an author on Reflection.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                After reviewing your application, we have decided not to approve it at this time.
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #991b1b; font-size: 14px; margin: 0;">
                  <strong>Reason:</strong> ${reason}
                </p>
              </div>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                You're welcome to apply again in the future with an updated application.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                This email was sent from Reflection. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        });
      }

      return NextResponse.json({ success: true, status: "REJECTED" });

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    console.error("Admin authors error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authors = await prisma.author.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Admin authors list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
