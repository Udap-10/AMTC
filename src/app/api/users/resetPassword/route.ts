import { connect } from "@/dbconfig/dbconfig"; // Your DB connection
import employeeAuth from "@/models/employeeAuth"; // The User model for the schema
import bcrypt from "bcryptjs"; // To hash the password
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connect(); // Ensure DB connection

    const { email, newPassword, confirmPassword } = await req.json();

    if (!email || !newPassword || !confirmPassword) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email, new password, and confirm password are required",
        }),
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "New password and confirm password do not match",
        }),
        { status: 400 }
      );
    }

    // Debugging log
    console.log("Password update request for email:", email);

    const user = await employeeAuth.findOne({ email });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Password updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Failed to update password" }),
      { status: 500 }
    );
  }
}
