import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import Employee from "@/models/employeeModels"; // Profile schema
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const email = session.user.email;
    const { address, dob, phoneNumber, profilePhoto } = await request.json();

    console.log("🔍 Searching for user in employeeAuth:", email);
    const authUser = await employeeAuth.findOne({ email });

    if (!authUser) {
      return NextResponse.json(
        { message: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    const userId = authUser._id;
    console.log("🔍 Found userId in employeeAuth:", userId);

    let existingEmployee = await Employee.findOne({ userId });

    if (!existingEmployee) {
      console.log("🚀 Creating new Employee profile for:", userId);

      const newEmployee = new Employee({
        userId,
        username: authUser.username || `user_${userId.toString().slice(-4)}`, // ✅ Always assign a username
        phoneNumber,
        dob: dob ? new Date(dob) : undefined,
        address,
        profilePhoto,
      });

      await newEmployee.save();

      return NextResponse.json(
        { message: "Profile created successfully", profile: newEmployee },
        { status: 201 }
      );
    }

    console.log("✏️ Updating Employee profile for:", userId);

    const updatedProfile = await Employee.findOneAndUpdate(
      { userId },
      {
        $set: {
          address: address || existingEmployee.address,
          dob: dob ? new Date(dob) : existingEmployee.dob,
          phoneNumber: phoneNumber || existingEmployee.phoneNumber,
          profilePhoto: profilePhoto || existingEmployee.profilePhoto,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully", profile: updatedProfile },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error handling profile:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
