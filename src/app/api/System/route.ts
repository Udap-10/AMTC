import { connect } from "@/dbconfig/dbconfig";
import SystemDetails from "@/models/SystemDetails";
import { SystemAdmin } from "@/models/systemModels";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all systems or a specific system by systemID
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const systemID = req.nextUrl.searchParams.get("systemID");

    let systems;
    if (systemID) {
      systems = await SystemAdmin.findOne({ systemID: systemID });
      if (!systems) {
        return NextResponse.json(
          { message: "System not found" },
          { status: 404 }
        );
      }
    } else {
      systems = await SystemAdmin.find(); // fetch all if no systemID
    }

    return NextResponse.json(systems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// POST: Add a new system
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const {
      systemID,
      systemName,
      password,
      location,
      macAddress,
      installationDate,
    } = body;

    if (!systemID || !systemName || !password || !location || !macAddress) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    await connect();

    const systemExists = await SystemAdmin.findOne({ systemID });
    if (systemExists) {
      return NextResponse.json(
        { message: "System ID already exists" },
        { status: 400 }
      );
    }

    const newSystem = new SystemAdmin({
      systemID,
      systemName,
      password,
      location,
      macAddress,
      installationDate: installationDate || Date.now(),
    });

    await newSystem.save();

    return NextResponse.json(newSystem, { status: 201 });
  } catch (error: any) {
    console.error("Error saving system:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", error: error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate systemID or macAddress", error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// PATCH: Update system data by systemID
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const systemID = req.nextUrl.searchParams.get("systemID");
    const updateData = await req.json();

    if (!systemID) {
      return NextResponse.json(
        { message: "systemID is required" },
        { status: 400 }
      );
    }

    const updatedSystem = await SystemAdmin.findOneAndUpdate(
      { systemID },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSystem) {
      return NextResponse.json(
        { message: "System not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSystem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a system by systemID
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const systemID = req.nextUrl.searchParams.get("systemID");

    if (!systemID) {
      return NextResponse.json(
        { message: "systemID is required" },
        { status: 400 }
      );
    }

    // Delete from System schema
    const deleteResult = await SystemAdmin.deleteOne({ systemID });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "System not found" },
        { status: 404 }
      );
    }

    // Also delete from SystemDetails schema
    await SystemDetails.deleteOne({ systemID });

    return NextResponse.json(
      { message: "System deleted successfully from both schemas" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
