// src/app/api/auth/role/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Get session cookie
    const session = cookies().get('session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Verify the session
    try {
      const decodedToken = await adminAuth.verifySessionCookie(session, true);
      const firebaseId = decodedToken.uid;

      // Query the admin with their role
      const admin = await db.admin.findUnique({
        where: { firebaseId },
        select: { role: true }
      });

      if (!admin) {
        return NextResponse.json(
          { error: "Admin not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ role: admin.role });

    } catch (error) {
      // Session verification failed
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[GET_ADMIN_ROLE_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to get role" },
      { status: 500 }
    );
  }
}