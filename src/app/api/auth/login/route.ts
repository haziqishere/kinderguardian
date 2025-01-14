// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  console.log("Login API route hit");
  
  try {
    const { firebaseId } = await request.json();
    console.log("Received firebaseId:", firebaseId);

    // Skip Firebase verification and check database directly
    // First check for parent
    const parent = await db.parent.findUnique({
      where: { firebaseId },
    });

    if (parent) {
      console.log("Found parent user:", parent);
      return NextResponse.json({ 
        success: true,
        userType: "parent",
        userId: parent.id 
      });
    }

    // Then check for admin
    const admin = await db.admin.findUnique({
      where: { firebaseId },
      include: {
        kindergarten: {
          select: { name: true }
        }
      }
    });

    if (admin) {
      console.log("Found admin user:", admin);
      return NextResponse.json({
        success: true,
        userType: "kindergarten",
        userId: admin.id,
        kindergartenName: admin.kindergarten?.name
      });
    }

    console.log("No user found in database for firebaseId:", firebaseId);
    return NextResponse.json(
      { error: "User not found in database" },
      { status: 404 }
    );

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}