import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/animalModels";
import User from "@/models/userModels";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Handle GET request to fetch all users

// Handle GET request to fetch all animals (only name, owner, and date)
// /api/Animals/route.ts
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    const filter: any = {};
    if (year) {
      filter.Date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    const animals = await Animal.find(filter)
      .select("name owner Date")
      .populate("owner", "name");

    return NextResponse.json({ success: true, animals }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}

// Handle POST request to add a new animal
export async function POST(req: NextRequest) {
  try {
    console.log("Connecting to database...");
    await connect();

    const requestBody = await req.json();
    console.log("Received request body:", requestBody);

    const { name, owner, Latitude, Longitude } = requestBody;

    if (!name || !owner) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name or owner)" },
        { status: 400 }
      );
    }

    // Validate if owner is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return NextResponse.json(
        { success: false, message: "Invalid owner ID format" },
        { status: 400 }
      );
    }

    // Check if owner exists in the User model
    const ownerExists = await User.findById(owner); // Use the correct User model
    if (!ownerExists) {
      return NextResponse.json(
        { success: false, message: "Owner not found" },
        { status: 400 }
      );
    }

    // Create and save new animal entry
    const newAnimal = new Animal({
      name,
      owner: new mongoose.Types.ObjectId(owner),
      Date: new Date(),
      Latitude: Latitude || null,
      Longitude: Longitude || null,
    });

    console.log("Attempting to save new animal:", newAnimal);

    const savedAnimal = await newAnimal.save();
    console.log("Saved animal:", savedAnimal);

    return NextResponse.json(
      { success: true, animal: savedAnimal },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: (error as Error).message || error,
      },
      { status: 500 }
    );
  }
}
