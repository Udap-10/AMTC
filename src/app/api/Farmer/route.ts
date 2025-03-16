import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET: Fetch user by CID
export async function GET(req: NextResponse) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const CID = searchParams.get("CID");

    let farmersData = CID ? await User.find({ CID }) : await User.find();

    if (!farmersData || farmersData.length === 0) {
      return NextResponse.json(
        { message: "No farmers found" },
        { status: 404 }
      );
    }
    return NextResponse.json(farmersData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as any).message },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new user (Farmer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, CID, contactNumber, Dzongkhag, Gewog, Village, animals } = body;

    if (!name || !CID || !contactNumber) {
      return NextResponse.json(
        { message: "Name, CID, and Contact Number are required." },
        { status: 400 }
      );
    }

    if (contactNumber.length !== 8) {
      return NextResponse.json(
        { message: "Invalid Contact Number length." },
        { status: 400 }
      );
    }

    await connect();
    const duplicateUser = await User.findOne({
      $or: [{ CID }, { contactNumber }],
    });
    if (duplicateUser) {
      return NextResponse.json(
        { message: "CID or Contact Number already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      CID,
      contactNumber,
      Dzongkhag,
      Gewog,
      Village,
      animals,
    });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as any).message },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update farmer details by CID
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { CID, ...updateData } = body;

    if (!CID) {
      return NextResponse.json(
        { message: "CID is required for updating." },
        { status: 400 }
      );
    }

    await connect();
    const updatedUser = await User.findOneAndUpdate({ CID }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as any).message },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete user by CID
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null); // Handle JSON parsing error
    if (!body || !body.CID) {
      return NextResponse.json({ message: "CID is required" }, { status: 400 });
    }

    const { CID } = body;

    await connect();
    const user = await User.findOneAndDelete({ CID }); // Delete user directly
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as any).message },
      { status: 500 }
    );
  }
}
