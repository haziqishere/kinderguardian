import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuth, isAdminAuthInitialized } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("Register API called");
    
    if (!isAdminAuthInitialized(adminAuth)) {
      console.error("Firebase Admin not initialized");
      return new NextResponse(
        JSON.stringify({ error: "Auth not initialized" }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    const { firebaseId, email, name, userType } = body;
    
    console.log("Register request body:", { firebaseId, email, name, userType });

    if (!firebaseId || !email || !name || !userType) {
      console.error("Missing required fields");
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the Firebase token
    try {
      const user = await adminAuth.getUser(firebaseId);
      if (!user) {
        console.error("Firebase user not found");
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      console.log("Firebase user verified:", user.uid);
    } catch (error) {
      console.error("Error verifying Firebase user:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to verify user" }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user already exists in database
    const existingParent = await db.parent.findUnique({
      where: { email },
    });

    const existingAdmin = await db.admin.findUnique({
      where: { email },
    });

    if (existingParent || existingAdmin) {
      console.error("User already exists in database");
      return new NextResponse(
        JSON.stringify({ error: "User already exists in database" }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (userType === "parent") {
      try {
        // Create parent record
        const parent = await db.parent.create({
          data: {
            firebaseId,
            email,
            name,
          },
        });

        console.log("Parent record created:", parent);
        return new NextResponse(
          JSON.stringify({ success: true, user: parent }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error("Error creating parent record:", error);
        throw error;
      }
    } else {
      try {
        // Create kindergarten and admin record
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
                role: "SUPER_ADMIN",
              },
            },
          },
          include: {
            admins: true,
          },
        });

        console.log("Kindergarten and admin record created:", kindergarten);
        return new NextResponse(
          JSON.stringify({ success: true, kindergarten }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error("Error creating kindergarten record:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}