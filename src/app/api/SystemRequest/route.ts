import { connect } from "@/dbconfig/dbconfig";
import SystemDetails from "@/models/SystemDetails";
import System from "@/models/systemModels";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const systems = await SystemDetails.find().populate("owner");

    return NextResponse.json({ success: true, data: systems }, { status: 200 });
  } catch (error) {
    console.error("GET SystemDetails Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch system details" },
      { status: 500 }
    );
  }
}

// DELETE API to delete a system by ID
export async function DELETE(req: { url: string | URL }) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const systemId = searchParams.get("id");

    if (!systemId) {
      return NextResponse.json(
        { success: false, message: "System ID is required" },
        { status: 400 }
      );
    }

    // Delete from SystemDetails schema
    const deletedSystemDetails = await SystemDetails.findOneAndDelete({
      systemID: systemId,
    });

    // Delete from System schema (based on same systemID)
    const deletedSystem = await System.findOneAndDelete({ systemID: systemId });

    if (!deletedSystemDetails && !deletedSystem) {
      return NextResponse.json(
        { success: false, message: "System not found in both schemas" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "System deleted successfully from both schemas",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE System Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete system from both schemas" },
      { status: 500 }
    );
  }
}
