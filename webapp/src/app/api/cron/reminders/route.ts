import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron job for daily reminders
// Runs at 9:00 AM UTC daily (configured in vercel.json)

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users who haven't journaled today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usersWithoutEntry = await prisma.user.findMany({
      where: {
        entries: {
          none: {
            date: {
              gte: today,
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        reminderTime: true,
      },
    });

    // Filter users whose reminder time matches current hour (basic timezone handling)
    const currentHour = new Date().getUTCHours();
    const usersToRemind = usersWithoutEntry.filter((user) => {
      const [hour] = user.reminderTime.split(":").map(Number);
      return hour === currentHour;
    });

    // Send reminders via Resend (if configured)
    const results = [];

    if (process.env.RESEND_API_KEY && usersToRemind.length > 0) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      for (const user of usersToRemind) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Reflection <noreply@reflection.app>",
            to: user.email,
            subject: "🌿 Time for your daily reflection",
            html: `
              <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #207852; margin-bottom: 16px;">Hi ${user.name || "there"}!</h2>
                <p style="color: #44403c; line-height: 1.6;">
                  Take 3 minutes to reflect on your day. How are you feeling?
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/journal/new" 
                   style="display: inline-block; background: #207852; color: white; padding: 12px 24px; 
                          border-radius: 8px; text-decoration: none; margin-top: 16px;">
                  Start Today's Entry
                </a>
                <p style="color: #78716c; font-size: 12px; margin-top: 24px;">
                  You're receiving this because you enabled daily reminders.
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">Manage preferences</a>
                </p>
              </div>
            `,
          });
          results.push({ email: user.email, status: "sent" });
        } catch (err) {
          console.error(`Failed to send reminder to ${user.email}:`, err);
          results.push({ email: user.email, status: "failed" });
        }
      }
    }

    return NextResponse.json({
      success: true,
      usersChecked: usersWithoutEntry.length,
      remindersSent: results.filter((r) => r.status === "sent").length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cron reminder error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
