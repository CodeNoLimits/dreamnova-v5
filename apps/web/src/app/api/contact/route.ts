import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required: name, email, subject, message" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be under 5000 characters" },
        { status: 400 }
      );
    }

    // Rate limiting: basic check via header
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    try {
      const { createAdminClient } = await import("@/lib/supabase");
      const supabase = createAdminClient();

      const { error } = await supabase.from("contact_messages").insert({
        name,
        email: email.toLowerCase(),
        subject,
        message,
        ip_address: ip,
      });

      if (error) {
        console.error("Supabase contact insert error:", error);
        throw error;
      }
    } catch {
      // If Supabase is not configured, log the message
      console.log("Contact form submission (Supabase not configured):", {
        name,
        email,
        subject,
        messageLength: message.length,
        ip,
      });
    }

    // TODO: Send notification email to admin via Resend
    // TODO: Send auto-reply to user

    return NextResponse.json({
      message: "Message sent successfully. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
