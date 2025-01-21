// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { firebaseId, email, name, userType } = await request.json();
    console.log("Registration request received:", { firebaseId, email, name, userType });

    try {
      if (userType === "parent") {
        // Parent creation remains the same
        const parent = await db.parent.create({
          data: {
            firebaseId,
            email,
            name,
          }
        });
        
        return NextResponse.json({
          success: true,
          userType: "parent",
          user: parent
        });
      } else {
        // Create admin without kindergarten
        const admin = await db.admin.create({
          data: {
            firebaseId,
            email,
            name,
            role: "ADMIN"
          }
        });

        return NextResponse.json({
          success: true,
          userType: "kindergarten",
          user: admin
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to create user in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
}