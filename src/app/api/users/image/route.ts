import { connect } from "@/dbconfig/dbconfig";
import Employee from "@/models/employeeModels";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// 🔹 POST: Upload Profile Picture
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const userId = String(formData.get("userId"));

    if (!file || !userId) {
      return NextResponse.json(
        { message: "Missing file or userId" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "user_profiles" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({
      profilePhoto: (uploadResult as any).secure_url,
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return NextResponse.json(
      { message: "Upload failed", error },
      { status: 500 }
    );
  }
}

// 🔹 PATCH: Update Profile Picture
export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
      return NextResponse.json(
        { message: "File and user ID are required" },
        { status: 400 }
      );
    }

    const user = await Employee.findById(
      new mongoose.Types.ObjectId(userId as string)
    );

    if (!user) {
      console.error("❌ User not found:", userId);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await (file as File).arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "profile_photos" }, (error, result) =>
          error ? reject(error) : resolve(result)
        )
        .end(buffer);
    });

    user.profilePhoto = (uploadResponse as any).secure_url;
    await user.save();

    return NextResponse.json(
      {
        message: "✅ Profile picture updated successfully",
        profilePhoto: user.profilePhoto,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating profile picture:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();

    // ✅ Extract `userId` from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // ✅ Find user by `userId` field (not `_id`)
    const user = await Employee.findOne({ userId });

    if (!user || !user.profilePhoto) {
      return NextResponse.json(
        { message: "Profile picture not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "✅ Profile picture retrieved",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error("❌ Error fetching profile picture:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}
