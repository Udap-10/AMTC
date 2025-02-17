import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await employeeAuth.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists, please choose another" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new employeeAuth({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: newUser._id, // ✅ User ID
        username: newUser.username, // ✅ Now included in response
        email: newUser.email, // ✅ Include email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}
