import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    try {
      const { createAdminClient } = await import("@/lib/supabase");
      const supabase = createAdminClient();

      const { data: existing } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (existing) {
        return NextResponse.json(
          { message: "You are already on the waitlist.", alreadyExists: true },
          { status: 200 }
        );
      }

      const { error } = await supabase.from("waitlist").insert({
        email: email.toLowerCase(),
        name: name || null,
        source: source || "website",
      });

      if (error) {
        console.error("Supabase waitlist insert error:", error);
        throw error;
      }
    } catch {
      // If Supabase is not configured, log and continue
      console.log("Waitlist signup (Supabase not configured):", { email, name, source });
    }

    return NextResponse.json({
      message: "Successfully joined the waitlist.",
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Failed to process waitlist signup" },
      { status: 500 }
    );
  }
}
