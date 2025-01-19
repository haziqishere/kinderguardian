import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface FirebaseJwtPayload {
  user_id: string;
}

export async function GET() {
  try {
    // Get the session token from cookies
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized - No session cookie" },
        { status: 401 }
      );
    }

    // Decode the JWT to get Firebase UID
    const decoded = jwtDecode(sessionCookie) as FirebaseJwtPayload;
    
    // Get parent using Firebase UID
    const parent = await db.parent.findUnique({
      where: {
        firebaseId: decoded.user_id
      }
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      );
    }

    // Fetch children data with their latest attendance
    const children = await db.student.findMany({
      where: {
        parentId: parent.id,
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({ data: children });
  } catch (error) {
    console.error("[CHILDREN_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
} 