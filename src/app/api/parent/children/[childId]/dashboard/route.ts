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

    // Get child data and verify it belongs to the parent
    const child = await db.student.findFirst({
      where: {
        id: params.childId,
        parentId: parent.id,
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // Last 30 days
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalDays = child.attendance.length;
    const presentDays = child.attendance.filter(
      (a) => a.status === 'ON_TIME' || a.status === 'LATE'
    ).length;
    const lateDays = child.attendance.filter(
      (a) => a.status === 'LATE'
    ).length;
    const absentNoReason = child.attendance.filter(
      (a) => a.status === 'ABSENT'
    ).length;

    const attendanceRate = totalDays > 0
      ? `${((presentDays / totalDays) * 100).toFixed(1)}%`
      : 'N/A';

    const dashboardData = {
      stats: {
        lateCount: lateDays,
        attendanceRate,
        absentNoReason,
      },
      attendance: child.attendance,
      class: child.class,
    };

    return NextResponse.json({ data: dashboardData });
  } catch (error) {
    console.error("[CHILD_DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
} 