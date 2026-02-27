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

// GET - List content pending review
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingContent = await prisma.content.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        author: {
          select: { id: true, name: true, email: true, slug: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const recentlyReviewed = await prisma.content.findMany({
      where: {
        status: { in: ["APPROVED", "PUBLISHED", "REJECTED"] },
        reviewedAt: { not: null },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, slug: true },
        },
      },
      orderBy: { reviewedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ pendingContent, recentlyReviewed });
  } catch (error) {
    console.error("Admin content list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Approve or reject content
export async function PATCH(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentId, action, feedback } = await request.json();

    if (!contentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        author: {
          select: { id: true, name: true, email: true, slug: true },
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          status: "PUBLISHED",
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          publishedAt: new Date(),
        },
      });

      // Send approval email to author
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        const contentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/author/${content.author.slug}/${content.slug}`;
        
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: content.author.email,
          subject: `✅ Your ${content.type.toLowerCase()} has been approved!`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #10b981;">Content Approved!</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Great news, ${content.author.name}! Your ${content.type.toLowerCase()} "<strong>${content.title}</strong>" has been approved and is now live.
              </p>
              <div style="margin: 30px 0;">
                <a href="${contentUrl}" 
                   style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  View Published Content
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                This email was sent from Reflection.
              </p>
            </div>
          `,
        });

        // If it's a newsletter, send to subscribers
        if (content.type === "NEWSLETTER") {
          const subscribers = await prisma.authorSubscriber.findMany({
            where: {
              authorId: content.author.id,
              status: "ACTIVE",
            },
          });

          for (const subscriber of subscribers) {
            // Skip paid content for non-paying subscribers if needed
            // For now, send to all active subscribers
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL,
              to: subscriber.email,
              subject: `📬 New from ${content.author.name}: ${content.title}`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <p style="color: #6b7280; font-size: 14px;">New ${content.type.toLowerCase()} from ${content.author.name}</p>
                  <h1 style="color: #111827; margin-top: 10px;">${content.title}</h1>
                  ${content.excerpt ? `<p style="color: #374151; font-size: 16px; line-height: 1.6;">${content.excerpt}</p>` : ''}
                  <div style="margin: 30px 0;">
                    <a href="${contentUrl}" 
                       style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                      Read Full Content
                    </a>
                  </div>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #9ca3af; font-size: 12px;">
                    You're receiving this because you subscribed to ${content.author.name}'s newsletter.
                  </p>
                </div>
              `,
            });
          }
        }
      }

      return NextResponse.json({ success: true, status: "PUBLISHED" });

    } else if (action === "reject") {
      if (!feedback) {
        return NextResponse.json({ error: "Rejection feedback required" }, { status: 400 });
      }

      await prisma.content.update({
        where: { id: contentId },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          rejectionFeedback: feedback,
        },
      });

      // Send rejection email to author
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        const editUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/author/dashboard/content/${content.id}`;
        
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: content.author.email,
          subject: `📝 Revision needed: ${content.title}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #374151;">Content Review Feedback</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hello ${content.author.name}, your ${content.type.toLowerCase()} "<strong>${content.title}</strong>" needs some revisions before it can be published.
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #991b1b; font-size: 14px; margin: 0;">
                  <strong>Feedback:</strong> ${feedback}
                </p>
              </div>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Please review the feedback and resubmit your content when ready.
              </p>
              <div style="margin: 30px 0;">
                <a href="${editUrl}" 
                   style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Edit Content
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                This email was sent from Reflection.
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
    console.error("Admin content review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
