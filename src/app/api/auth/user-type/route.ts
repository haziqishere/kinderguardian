// src/app/api/auth/user-type/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { firebaseId } = await request.json();
    console.log("[USER_TYPE] Checking user type for firebaseId:", firebaseId);

    // Check for parent first
    const parent = await db.parent.findUnique({
      where: { firebaseId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (parent) {
      return NextResponse.json({
        userType: "parent",
        userId: parent.id
      });
    }

    // Check for admin
    const admin = await db.admin.findUnique({
      where: { firebaseId },
      select: {
        id: true,
        role: true,
        kindergarten: {
          select: { name: true }
        }
      }
    });

    if (admin) {
      return NextResponse.json({
        userType: "kindergarten",
        userId: admin.id,
        kindergartenName: admin.kindergarten?.name
      });
    }

    console.log("[USER_TYPE] No user found for firebaseId:", firebaseId);
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );

  } catch (error) {
    console.error("[USER_TYPE] Error:", error);
    return NextResponse.json(
      { error: "Failed to check user type" },
      { status: 500 }
    );
  }
}