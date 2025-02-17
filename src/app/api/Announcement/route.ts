import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/animalModels"; // Just import Animal model
import { NextResponse } from "next/server";

export async function GET() {
  await connect(); // Ensure DB connection

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch today's detected animals and populate the owner (to get Dzongkhag)
    const animals = await Animal.find({ Date: { $gte: today } }).populate(
      "owner",
      "Dzongkhag"
    ); // This will populate the Dzongkhag field from the User schema

    // Maps to store counts
    const dzongkhagCountMap: Record<string, number> = {};
    const animalCountMap: Record<string, number> = {};

    // Count occurrences per Dzongkhag and Animal
    animals.forEach((animal) => {
      const dzongkhag = animal.owner?.Dzongkhag || "Unknown";
      const animalName = animal.name || "Unknown";

      dzongkhagCountMap[dzongkhag] = (dzongkhagCountMap[dzongkhag] || 0) + 1;
      animalCountMap[animalName] = (animalCountMap[animalName] || 0) + 1;
    });

    // Find the Dzongkhag with the highest detections
    let highestDzongkhag = "Unknown";
    let maxDzongkhagCount = 0;

    Object.entries(dzongkhagCountMap).forEach(([dzongkhag, count]) => {
      if (count > maxDzongkhagCount) {
        maxDzongkhagCount = count;
        highestDzongkhag = dzongkhag;
      }
    });

    // Find the most detected animal
    let highestAnimal = "Unknown";
    let maxAnimalCount = 0;

    Object.entries(animalCountMap).forEach(([animal, count]) => {
      if (count > maxAnimalCount) {
        maxAnimalCount = count;
        highestAnimal = animal;
      }
    });

    // If no detections found
    if (maxDzongkhagCount === 0 && maxAnimalCount === 0) {
      return NextResponse.json({
        success: true,
        message: "No detections recorded today.",
      });
    }

    // Announcement message
    const announcement = {
      message: `Most Detection Today: ${highestAnimal} Detected in ${highestDzongkhag}`,
      dzongkhag: highestDzongkhag,
      mostDetectedAnimal: highestAnimal,
      time: new Date().toLocaleTimeString(),
      date: new Date().toDateString(),
      postedBy: "System",
    };

    return NextResponse.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error fetching daily announcement:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
