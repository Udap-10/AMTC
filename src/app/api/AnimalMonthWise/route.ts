import { connect } from "@/dbconfig/dbconfig";
import Animal from "@/models/animalModels";
import { NextResponse } from "next/server";

export async function GET(req: { url: string | URL }) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam) : NaN;

    if (!year) {
      return NextResponse.json(
        { success: false, message: "Year is required in query" },
        { status: 400 }
      );
    }

    // Filter animals by selected year and group by month
    const monthlyData = await Animal.aggregate([
      {
        $match: {
          Date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$Date" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedData = monthlyData.map((item) => ({
      month: monthNames[item._id - 1],
      count: item.count,
    }));

    return NextResponse.json(
      { success: true, data: formattedData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
