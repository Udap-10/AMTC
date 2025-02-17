import { connect } from "@/dbconfig/dbconfig";
import profiles from "@/models/userProfile";
import { NextResponse } from "next/server";

// ✅ GET: Fetch profile picture by contactNumber
export async function GET(req: { url: string | URL }) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const contactNumber = searchParams.get("contactNumber");

    if (!contactNumber) {
      console.error("❌ Missing contactNumber in request");
      return NextResponse.json(
        { message: "Contact Number is required." },
        { status: 400 }
      );
    }

    const profileData = await profiles.findOne({ contactNumber });

    if (!profileData) {
      console.warn(`⚠️ No profile found for contactNumber: ${contactNumber}`);
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("🔥 Server error:", error); // Log the actual error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
