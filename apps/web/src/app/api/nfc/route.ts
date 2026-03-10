import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serial, action, latitude, longitude } = body;

    if (!serial || typeof serial !== "string") {
      return NextResponse.json(
        { error: "Valid NFC serial number is required" },
        { status: 400 }
      );
    }

    if (!action || !["unlock", "scan", "verify"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action required: unlock, scan, or verify" },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "unknown";

    try {
      const { createAdminClient } = await import("@/lib/supabase");
      const supabase = createAdminClient();

      // Look up the NFC key
      const { data: nfcKey, error: keyError } = await supabase
        .from("nfc_keys")
        .select("*")
        .eq("serial", serial)
        .single();

      if (keyError || !nfcKey) {
        return NextResponse.json(
          { error: "NFC key not found", valid: false },
          { status: 404 }
        );
      }

      if (!nfcKey.activated) {
        // Activate the key on first scan
        if (action === "unlock") {
          await supabase
            .from("nfc_keys")
            .update({ activated: true, activated_at: new Date().toISOString() })
            .eq("id", nfcKey.id);
        } else {
          return NextResponse.json(
            { error: "NFC key not yet activated. Use the unlock portal first.", valid: false },
            { status: 403 }
          );
        }
      }

      // Record the scan
      await supabase.from("nfc_scans").insert({
        key_id: nfcKey.id,
        user_agent: userAgent,
        latitude: latitude || null,
        longitude: longitude || null,
        action,
      });

      // Award Hafatsa points for scans
      if (action === "scan" && nfcKey.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", nfcKey.user_id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ total_points: profile.total_points + 5 })
            .eq("id", nfcKey.user_id);
        }
      }

      return NextResponse.json({
        valid: true,
        activated: true,
        action,
        keyId: nfcKey.id,
        pointsAwarded: action === "scan" ? 5 : 0,
      });
    } catch {
      // If Supabase is not configured, simulate a valid response
      console.log("NFC scan (Supabase not configured):", { serial, action, userAgent });

      return NextResponse.json({
        valid: true,
        activated: true,
        action,
        keyId: `sim-${serial.slice(0, 8)}`,
        pointsAwarded: action === "scan" ? 5 : 0,
        simulated: true,
      });
    }
  } catch (error) {
    console.error("NFC API error:", error);
    return NextResponse.json(
      { error: "Failed to process NFC request" },
      { status: 500 }
    );
  }
}
