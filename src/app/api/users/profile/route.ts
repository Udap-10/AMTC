import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import Employee from "@/models/employeeModels";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req: request, ...authOptions });

    if (!session?.user?.username) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const { username } = session.user; // ✅ Get username from session
    const { address, dob, phoneNumber, profilePhoto } = await request.json();

    // 🔹 Find user in employeeAuth using username
    const authUser = await employeeAuth.findOne({ username });

    if (!authUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("🔎 Debug: Found user in employeeAuth:", authUser);

    // 🔹 Find Employee Profile using `username`
    let employee = await Employee.findOne({ username });

    if (!employee) {
      console.log("🚀 Creating new Employee profile for:", username);

      // Create a new Employee profile with the `userId` (authUser._id)
      employee = new Employee({
        username,
        email: authUser.email, // Use the email from authUser
        phoneNumber,
        dob: dob ? new Date(dob) : undefined,
        address,
        profilePhoto,
        userId: authUser._id, // Add the `userId` field
      });

      await employee.save();

      return NextResponse.json(
        { message: "Profile created successfully", profile: employee },
        { status: 201 }
      );
    }

    console.log("✏️ Updating Employee profile for:", username);

    // 🔹 Update Employee Profile using `username`
    const updatedProfile = await Employee.findOneAndUpdate(
      { username }, // ✅ Use username to find the profile
      {
        $set: {
          address: address || employee.address,
          dob: dob ? new Date(dob) : employee.dob,
          phoneNumber: phoneNumber || employee.phoneNumber,
          profilePhoto: profilePhoto || employee.profilePhoto,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully", profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error handling profile:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connect(); // Connect to MongoDB
    console.log("🟢 MongoDB connected");

    // Get session information using getServerSession
    const session = await getServerSession(authOptions);
    console.log("🟢 Session Data from API:", session); // Debugging session

    if (!session || !session.user?.email) {
      console.warn("🔴 Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Query MongoDB for the employee authentication data based on email
    const employee = await employeeAuth.findOne(
      { email: session.user.email },
      { username: 1, email: 1, _id: 1 } // Fetch only required fields
    );

    if (!employee) {
      console.warn("🔴 User not found:", session.user.email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("🟢 Employee Found:", employee); // Debugging employee data

    // Use the employee's `_id` to query the profile in the Employee collection
    const profile = await Employee.findOne({ userId: employee._id });

    if (!profile) {
      console.warn("🔴 Profile not found for userId:", employee._id);
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    console.log("🟢 Profile Found:", profile); // Debugging profile data

    // Return the employee and profile details
    return NextResponse.json({
      message: "Profile fetched successfully",
      user: {
        username: employee.username,
        email: employee.email,
        phoneNumber: profile.phoneNumber || "",
        dob: profile.dob || "",
        address: profile.address || "",
        profilePhoto: profile.profilePhoto || "",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching session or profile:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}
