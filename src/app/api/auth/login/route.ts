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
        kindergarten: true
      }
    });

    if (admin) {
      console.log("Found admin user:", admin);
      const needsSetup = !admin.kindergartenId;
      const redirectTo = needsSetup 
        ? "/setup" 
        : `/kindergarten/${admin.kindergartenId}/dashboard`;

      return NextResponse.json({
        success: true,
        userType: "kindergarten",
        needsSetup: needsSetup,
        userId: admin.id,
        redirectTo: redirectTo,
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          kindergartenId: admin.kindergartenId,
          needsSetup: needsSetup
        }
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