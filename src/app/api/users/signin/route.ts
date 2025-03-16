import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import authOptions from "@/utils/authOptions";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connect();
    const { username, password } = await request.json();

    // ✅ Find user in DB
    const user = await employeeAuth.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Generate Access & Refresh Tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    ); // 15 min
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    ); // 7 days

    // ✅ Set Cookies
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { username: user.username, email: user.email },
      },
      { status: 200 }
    );

    response.cookies.set("session", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 900, // 15 minutes
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 604800, // 7 days
    });

    return response;
  } catch (error) {
    console.error("❌ Error logging in:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
// PATCH API to update user information
export async function PATCH(request: NextRequest) {
  try {
    await connect();

    // ✅ Extract session token from cookies
    const token = request.cookies.get("session")?.value;
    console.log("🔑 Session Token:", token); // Log the token for debugging

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    console.log("🔍 Extracted User ID from Session:", decoded.userId);

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    // ✅ Fetch the user from the employeeAuth collection by decoded userId
    const existingUser = await employeeAuth.findById(decoded.userId);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Get request body data
    const reqBody = await request.json();
    const { username, email } = reqBody;

    let isUpdated = false;

    // ✅ Check and update username if changed
    if (username && username !== existingUser.username) {
      existingUser.username = username;
      existingUser.markModified("username");
      isUpdated = true;
    }

    // ✅ Check and update email if changed
    if (email && email !== existingUser.email) {
      existingUser.email = email;
      existingUser.markModified("email");
      isUpdated = true;
    }

    // ✅ Save the updated user details
    if (isUpdated) {
      await existingUser.save();
      return NextResponse.json(
        { message: "✅ User information updated successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "No changes were made." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET API to fetch user details
export async function GET(request: NextRequest) {
  try {
    await connect(); // Connect to MongoDB

    const session = (await getServerSession(authOptions)) as {
      user?: { email: string };
    } | null;

    console.log("🟢 Session Data from API:", session); // Debugging

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Query MongoDB for the user based on the email
    const employee = await employeeAuth.findOne(
      { email: session.user.email },
      { username: 1, email: 1, _id: 0 } // Only fetch username and email
    );

    if (!employee) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Authenticated",
      user: { username: employee.username, email: employee.email },
    });
  } catch (error) {
    console.error("❌ Error fetching session:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
