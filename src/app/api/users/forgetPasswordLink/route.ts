import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { email } = await req.json();

    console.log("🔍 Received email:", email);
    console.log("🔍 EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "🔍 EMAIL_PASS:",
      process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"
    );

    const user = await employeeAuth.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPassword?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return NextResponse.json(
      { success: true, message: "Reset link sent!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
