import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, recordFailure, resetLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed, remaining, blockedUntil } = checkRateLimit(ip);

    if (!allowed) {
      const waitTime = Math.ceil((blockedUntil! - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${waitTime} minutes.` },
        { status: 429 }
      );
    }

    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "vanguard123";

    if (password === adminPassword) {
      resetLimit(ip);
      const response = NextResponse.json({ success: true });
      (await cookies()).set("vanguard_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    recordFailure(ip);
    return NextResponse.json(
      { error: "Invalid credentials", remainingAttempts: remaining - 1 },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
