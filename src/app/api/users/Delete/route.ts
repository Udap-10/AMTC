import { connect } from "@/dbconfig/dbconfig";
import employeeAuth from "@/models/employeeAuth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connect(); // ✅ Ensure DB is connected

    // ✅ Authenticate the request using session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      console.error("❌ Unauthorized: No valid session found.");
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log("🔴 Deleting user with ID:", userId); // Debugging

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid User ID format:", userId);
      return NextResponse.json(
        { error: "Invalid User ID format" },
        { status: 400 }
      );
    }

    // ✅ Delete the user from the database
    const deletedUser = await employeeAuth.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.error("❌ User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User deleted successfully:", userId);
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
