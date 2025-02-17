import { connect } from "@/dbconfig/dbconfig";
import System from "@/models/systemModels";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all systems or a specific system by systemID
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const systemID = req.nextUrl.searchParams.get("systemID");

    let systems;
    if (systemID) {
      systems = await System.findOne({ systemID: Number(systemID) });
      if (!systems) {
        return NextResponse.json(
          { message: "System not found" },
          { status: 404 }
        );
      }
    } else {
      systems = await System.find();
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
    const { systemID, CID, installationDate, camera, raspberryPi, gsm } = body;

    if (
      !systemID ||
      !CID ||
      !installationDate ||
      !camera ||
      !raspberryPi ||
      !gsm
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connect();

    const userExists = await User.findOne({ CID: String(CID) });
    if (!userExists) {
      return NextResponse.json(
        { message: "CID not found in user database" },
        { status: 400 }
      );
    }

    const systemExists = await System.findOne({ systemID });
    if (systemExists) {
      return NextResponse.json(
        { message: "System ID already exists" },
        { status: 400 }
      );
    }

    const newSystem = new System({
      systemID,
      CID,
      installationDate: installationDate || Date.now(),
      camera,
      raspberryPi,
      gsm,
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
        { message: "Duplicate system ID", error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// PUT: Edit an existing system
export async function PUT(req: NextRequest) {
  try {
    const systemID = req.nextUrl.searchParams.get("systemID"); // Get systemID from query params
    const updateData = await req.json(); // Get only the updated fields

    if (!systemID) {
      return NextResponse.json(
        { message: "System ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const updatedSystem = await System.findOneAndUpdate(
      { systemID }, // Find by systemID
      { $set: updateData }, // Update only provided fields
      { new: true, runValidators: true } // Return updated document and apply validation
    );

    if (!updatedSystem) {
      return NextResponse.json(
        { message: "System not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSystem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a system by systemID
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const systemID = req.nextUrl.searchParams.get("systemID");

    if (!systemID) {
      return NextResponse.json(
        { message: "systemID is required" },
        { status: 400 }
      );
    }

    await connect();

    const system = await System.findOne({ systemID: Number(systemID) });
    if (!system) {
      return NextResponse.json(
        { message: "System not found" },
        { status: 404 }
      );
    }

    // Use deleteOne() instead of remove()
    await System.deleteOne({ systemID: Number(systemID) });

    return NextResponse.json(
      { message: "System deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as any).message },
      { status: 500 }
    );
  }
}
