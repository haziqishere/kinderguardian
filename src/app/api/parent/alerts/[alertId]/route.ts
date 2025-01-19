import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface FirebaseJwtPayload {
  user_id: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: { alertId: string } }
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

    // Get the request body
    const body = await req.json();
    const { status, reason } = body;

    // Verify the alert belongs to one of the parent's children
    const alert = await db.alertLog.findFirst({
      where: {
        id: params.alertId,
        student: {
          parentId: parent.id,
        },
      },
      include: {
        student: true,
      },
    });

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    // Update the alert
    const updatedAlert = await db.alertLog.update({
      where: {
        id: params.alertId,
      },
      data: {
        parentAction: 'RESPONDED',
        reason,
      },
    });

    // Also update the student's attendance for this day
    await db.attendance.updateMany({
      where: {
        studentId: alert.student.id,
        date: alert.alertTime,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedAlert,
    });
  } catch (error) {
    console.error("[ALERT_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
} 