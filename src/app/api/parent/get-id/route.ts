// app/api/parent/get-id/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firebaseId } = await request.json();

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Firebase ID is required" },
        { status: 400 }
      );
    }

    const parent = await db.parent.findUnique({
      where: { firebaseId },
      select: { id: true }
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ parentId: parent.id });
  } catch (error) {
    console.error("[GET_PARENT_ID]", error);
    return NextResponse.json(
      { error: "Failed to get parent ID" },
      { status: 500 }
    );
  }
}