// app/api/auth/profile/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { firebaseId } = await req.json();

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Firebase ID is required" },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { firebaseId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kindergartenId: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("[PROFILE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}