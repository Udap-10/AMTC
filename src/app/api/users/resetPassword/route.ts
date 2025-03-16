import { connect } from "@/dbconfig/dbconfig"; // Your DB connection
import employeeAuth from "@/models/employeeAuth"; // The User model for the schema
import bcrypt from "bcryptjs"; // To hash the password
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    console.log("Connecting to DB...");
    await connect();
    console.log("DB connected!");

    const { email, newPassword, confirmPassword } = await req.json();
    console.log("Received request:", { email, newPassword, confirmPassword });

    if (!email || !newPassword || !confirmPassword) {
      console.log("Missing fields in request");
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email, new password, and confirm password are required",
        }),
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "New password and confirm password do not match",
        }),
        { status: 400 }
      );
    }

    console.log("Looking for user with email:", email.toLowerCase());
    const user = await employeeAuth.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found");
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    console.log("User found:", user);
    console.log("Old password:", user.password);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log("New hashed password:", hashedPassword);

    user.password = hashedPassword;
    await user.save();

    console.log("Password updated successfully");

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
