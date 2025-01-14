// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { firebaseId, email, name, userType } = await request.json();
    console.log("Registration request received:", { firebaseId, email, name, userType });

    // Skip Firebase verification for now since we know the user exists in Firebase Auth
    try {
      if (userType === "parent") {
        // Create parent record
        const parent = await db.parent.create({
          data: {
            firebaseId,
            email,
            name,
          }
        });
        console.log("Created parent:", parent);

        return NextResponse.json({
          success: true,
          userType: "parent",
          user: parent
        });
      } else {
        // Create kindergarten and admin
        const kindergarten = await db.kindergarten.create({
          data: {
            name: "Untitled Kindergarten",
            address: "To be updated",
            messageAlertThreshold: new Date("1970-01-01T09:00:00"),
            callAlertThreshold: new Date("1970-01-01T10:00:00"),
            admins: {
              create: {
                firebaseId,
                email,
                name,
                role: "SUPER_ADMIN"
              }
            }
          },
          include: {
            admins: true
          }
        });
        console.log("Created kindergarten with admin:", kindergarten);

        return NextResponse.json({
          success: true,
          userType: "kindergarten",
          user: kindergarten
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