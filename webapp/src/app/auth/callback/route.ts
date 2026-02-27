import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const type = searchParams.get("type"); // For password recovery

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this is a password recovery flow
      if (type === "recovery" || next === "/auth/reset-password") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // For password recovery failures, redirect to forgot-password
  if (type === "recovery" || next === "/auth/reset-password") {
    return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
