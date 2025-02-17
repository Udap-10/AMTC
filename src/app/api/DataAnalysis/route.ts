import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/animalModels";
import { NextResponse } from "next/server";

export async function GET() {
  await connect(); // Ensure DB connection

  try {
    // Fetch all animals and populate the owner (to get Dzongkhag from User schema)
    const animals = await Animal.find().populate("owner", "Dzongkhag");

    // Group and count animals per Dzongkhag
    const dzongkhagCountMap: Record<string, number> = {};

    animals.forEach((animal) => {
      const dzongkhag = animal.owner?.Dzongkhag || "Unknown"; // Fallback if missing owner
      dzongkhagCountMap[dzongkhag] = (dzongkhagCountMap[dzongkhag] || 0) + 1;
    });

    // Format data for frontend
    const dzongkhags = Object.keys(dzongkhagCountMap);
    const animalCounts = Object.values(dzongkhagCountMap);

    return NextResponse.json({
      success: true,
      dzongkhags,
      animalCounts,
    });
  } catch (error) {
    console.error("Error fetching animal data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
