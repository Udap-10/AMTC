// File: /app/api/AnimalCategory/route.js (or /pages/api/AnimalCategory.js if using pages router)

import { connect } from "@/dbconfig/dbconfig";
import AnimalCategory from "@/models/animalCategory";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const data = await AnimalCategory.find();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories", error },
      { status: 500 }
    );
  }
}

export async function POST(req: { json: () => any }) {
  try {
    await connect();
    const body = await req.json();
    const { slNo, animal, description } = body;
    const newCategory = new AnimalCategory({ slNo, animal, description });
    await newCategory.save();
    return NextResponse.json(
      { success: true, message: "Animal category added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create category", error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: { json: () => any }) {
  try {
    await connect();
    const body = await req.json();
    const { slNo, animal, description } = body;

    const updatedCategory = await AnimalCategory.findOneAndUpdate(
      { slNo: parseInt(slNo) }, // Match by slNo
      { animal, description },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "No category found with this Sl No" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Animal category updated",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: { json: () => any }) {
  try {
    await connect();
    const body = await req.json();
    const { slNo } = body;

    const deletedCategory = await AnimalCategory.findOneAndDelete({ slNo });

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted", data: deletedCategory },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed", error },
      { status: 500 }
    );
  }
}
