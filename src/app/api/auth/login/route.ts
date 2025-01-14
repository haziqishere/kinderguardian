// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  console.log("Login API route hit");
  
  try {
    const { firebaseId } = await request.json();
    console.log("Received firebaseId:", firebaseId);

    // First verify Firebase user exists
    try {
      const firebaseUser = await adminAuth.getUser(firebaseId);
      console.log("Firebase user verified successfully:", firebaseUser);
    } catch (error:any) {
      console.error("Firebase verification failed:", error);
      return NextResponse.json(
        { error: "Invalid Firebase user" },
        { status: 401 }
      );
    }

    // Check for parent account
    const parent = await db.parent.findUnique({
      where: { firebaseId },
    });

    if (parent) {
      return NextResponse.json({
        userType: "parent",
        userId: parent.id
      });
    }

    // Check for admin account
    const admin = await db.admin.findUnique({
      where: { firebaseId },
      include: {
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

    // If user exists in Firebase but not in database, 
    // we should create them or redirect to complete registration
    const firebaseUser = await adminAuth.getUser(firebaseId);
    return NextResponse.json(
      { 
        error: "User needs to complete registration",
        email: firebaseUser.email
      },
      { status: 403 }
    );

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}