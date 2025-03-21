import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/animalModels";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    const filter: any = {};
    if (year) {
      filter.Date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    // Fetch animals and populate owner Dzongkhag
    const animals = await Animal.find(filter).populate("owner", "Dzongkhag");

    const dzongkhagCountMap: Record<string, number> = {};
    const animalTypesMap: Record<string, Record<string, number>> = {};

    animals.forEach((animal) => {
      // 🐾 Use fallback and normalize Dzongkhag
      let dzongkhag = "Unknown";
      if (animal.owner && animal.owner.Dzongkhag) {
        dzongkhag = animal.owner.Dzongkhag.trim();
      } else if (animal.ownerDzongkhag) {
        dzongkhag = animal.ownerDzongkhag.trim();
      }

      // Log for debugging
      console.log("Detected Dzongkhag:", dzongkhag);

      const animalName = animal.name?.trim() || "Unknown";

      // Count animals per Dzongkhag
      dzongkhagCountMap[dzongkhag] = (dzongkhagCountMap[dzongkhag] || 0) + 1;

      // Count animal types per Dzongkhag
      if (!animalTypesMap[dzongkhag]) {
        animalTypesMap[dzongkhag] = {};
      }
      animalTypesMap[dzongkhag][animalName] =
        (animalTypesMap[dzongkhag][animalName] || 0) + 1;
    });

    const dzongkhags = Object.keys(dzongkhagCountMap);
    const animalCounts = Object.values(dzongkhagCountMap);

    return NextResponse.json({
      success: true,
      dzongkhags,
      animalCounts,
      animalTypesPerDzongkhag: animalTypesMap,
    });
  } catch (error) {
    console.error("Error in Animal API:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
