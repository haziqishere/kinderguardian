import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuth, isAdminAuthInitialized } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    if (!isAdminAuthInitialized(adminAuth)) {
      return NextResponse.json(
        { error: "Auth not initialized" }, 
        { status: 500 }
      );
    }

    const body = await req.json();
    const { firebaseId, email, name, userType, kindergartenName, address } = body;

    // Verify the Firebase token
    const user = await adminAuth.getUser(firebaseId);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (userType === "parent") {
      // Create parent record
      const parent = await db.parent.create({
        data: {
          firebaseId,
          email,
          name,
        },
      });

      return NextResponse.json({ 
        success: true, 
        user: parent 
      });

    } else {
      // Create kindergarten and admin record
      const kindergarten = await db.kindergarten.create({
        data: {
          name: kindergartenName!,
          address: address!,
          messageAlertThreshold: new Date("1970-01-01T09:00:00"), // Default 9 AM
          callAlertThreshold: new Date("1970-01-01T10:00:00"), // Default 10 AM
          admins: {
            create: {
              firebaseId,
              email,
              name,
              role: "SUPER_ADMIN",
            },
          },
        },
        include: {
          admins: true,
        },
      });

      return NextResponse.json({ 
        success: true, 
        kindergarten 
      });
    }

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}