import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface FirebaseJwtPayload {
  user_id: string;
}

export async function GET(
  req: Request,
  { params }: { params: { childId: string } }
) {
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

    // Get alerts for the child and verify the child belongs to the parent
    const alerts = await db.alertLog.findMany({
      where: {
        student: {
          id: params.childId,
          parentId: parent.id,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        alertTime: 'desc',
      },
      take: 10, // Last 10 alerts
    });

    return NextResponse.json({ data: alerts });
  } catch (error) {
    console.error("[CHILD_ALERTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
} 